import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import contractAbi from "../contract/abi.json";
import Web3 from "web3";
import Swal from "sweetalert2";

const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

const useFetchData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/upload");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return data;
};

const Upload = () => {
  const data = useFetchData();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedActID, setSelectedActID] = useState(null);
  const [selectedStdIDs, setSelectedStdIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [checkAllStates, setCheckAllStates] = useState({});

  const formatDateThai = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  const getDateRangeInThai = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const options = { day: "2-digit" };
      const formattedDate = d.toLocaleDateString("th-TH", options);
      dateArray.push(formattedDate);
    }

    return dateArray;
  }, []);

  const groupedData = useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.act_title]) {
        acc[item.act_title] = [];
      }
      acc[item.act_title].push(item);
      return acc;
    }, {});
  }, [data]);

  const sortedActivities = useMemo(() => {
    return Object.keys(groupedData)
      .map((actTitle) => ({
        actTitle,
        activities: groupedData[actTitle],
      }))
      .sort((a, b) => a.activities[0].act_ID - b.activities[0].act_ID);
  }, [groupedData]);

  const filteredActivities = useMemo(() => {
    return sortedActivities
      .map((group) => ({
        ...group,
        activities: group.activities.filter(
          (item) =>
            item.std_ID.includes(searchTerm) ||
            item.std_fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.std_lname.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.activities.length > 0);
  }, [sortedActivities, searchTerm]);

  const handleCheckboxChange = useCallback((stdID, actID, date) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.stdID === stdID && item.actID === actID && item.date === date
      );
      const newItems = existingItem
        ? prev.filter((item) => item !== existingItem)
        : [...prev, { stdID, actID, date }];

      // Update the grouped selection
      setSelectedGroups((prevGroups) => {
        const key = `${stdID}_${actID}`;
        const currentGroup = prevGroups[key] || [];
        const newGroup = existingItem
          ? currentGroup.filter((d) => d !== date)
          : Array.from(new Set([...currentGroup, date])); // Ensure unique dates

        const updatedGroups = {
          ...prevGroups,
          [key]: newGroup,
        };

        // Log the grouped result
        Object.entries(updatedGroups).forEach(([groupKey, dates]) => {
          if (dates.length > 0) {
            const [groupStdID, groupActID] = groupKey.split("_");
            console.log(`${groupStdID} ${groupActID} [${dates.join(",")}]`);
          }
        });

        return updatedGroups;
      });

      return newItems;
    });
  }, []);

  const handleCheckAll = useCallback(
    (actID) => {
      setCheckAllStates((prev) => {
        const newState = { ...prev, [actID]: !prev[actID] };
        const activities = data.filter((item) => item.act_ID === actID);
        const dates = getDateRangeInThai(
          activities[0].act_dateStart,
          activities[0].act_dateEnd
        );

        setSelectedItems((prevItems) => {
          if (newState[actID]) {
            const newItems = activities.flatMap((activity) =>
              dates.map((date) => ({
                stdID: activity.std_ID,
                actID: activity.act_ID,
                date,
              }))
            );
            return [...prevItems, ...newItems];
          } else {
            return prevItems.filter((item) => item.actID !== actID);
          }
        });

        return newState;
      });
    },
    [data, getDateRangeInThai]
  );

  const handleUpload = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3Instance = new Web3(window.ethereum);
      const contractInstance = new web3Instance.eth.Contract(
        contractAbi,
        contractAddress
      );

      setWeb3(web3Instance);
      setContract(contractInstance);

      if (!selectedActID || selectedStdIDs.length === 0) {
        console.error("No activity or students selected.");
        return;
      }

      const tx = await contractInstance.methods
        .Upload(selectedActID, selectedStdIDs)
        .send({ from: accounts[0] });

      console.log("Transaction successful:", tx.transactionHash);
      await Promise.all([
        axios.put(`/api/transection/${selectedActID}`, {
          act_transaction: tx.transactionHash,
        }),
        axios.delete(`/api/reserve/${selectedActID}`),
        axios.put(`/api/updateStatus/${selectedActID}`),
      ]);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Transaction: ${tx.transactionHash}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error handling upload:", err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error handling upload",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [selectedActID, selectedStdIDs]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="mb-10 container mx-auto md:px-20">
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
        <div className="flex justify-between items-center pb-4">
          <div className="items-center">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ค้นหา"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="relative justify-center flex">
            <select
              id="filter-section"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="text-xs cursor-pointer block p-1 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              {Object.keys(groupedData).map((actTitle) => (
                <option key={actTitle} value={actTitle}>
                  {actTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredActivities
          .filter(
            ({ actTitle }) =>
              selectedActivity === "all" || actTitle === selectedActivity
          )
          .map(({ actTitle, activities }) => (
            <div key={actTitle} className="mb-8">
              <div className="text-lg font-bold mb-2 flex items-center justify-between">
                <span className="mr-2">ชื่อกิจกรรม: {actTitle}</span>
                <span className="mr-2">
                  ระยะเวลา: {formatDateThai(activities[0].act_dateStart)} -{" "}
                  {formatDateThai(activities[0].act_dateEnd)}
                </span>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
                  <tr className="flex w-full">
                    <th className="px-6 py-3 w-1/6 text-center">ลำดับ</th>
                    <th className="px-6 py-3 w-1/6">รหัสนักศึกษา</th>
                    <th className="px-6 py-3 w-1/6">ชื่อ</th>
                    <th className="px-6 py-3 w-1/6">นามสกุล</th>
                    {getDateRangeInThai(
                      activities[0].act_dateStart,
                      activities[0].act_dateEnd
                    ).map((date, index) => {
                      return (
                        <th key={index} className="px-6 py-3 w-1/6 text-center">
                          {date}
                        </th>
                      );
                    })}
                    <th className="px-6 py-3 w-1/6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            checkAllStates[activities[0].act_ID] || false
                          }
                          onChange={() => handleCheckAll(activities[0].act_ID)}
                          className="mr-2"
                        />
                        <label>เลือกทั้งหมด</label>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
                  {activities.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b-2 flex w-full items-center"
                    >
                      <td className="px-6 py-3 w-1/6 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 w-1/6">{item.std_ID}</td>
                      <td className="px-6 py-3 w-1/6">{item.std_fname}</td>
                      <td className="px-6 py-3 w-1/6">{item.std_lname}</td>
                      {getDateRangeInThai(
                        activities[0].act_dateStart,
                        activities[0].act_dateEnd
                      ).map((date, dateIndex) => (
                        <td
                          key={dateIndex}
                          className="px-6 py-3 w-1/6 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.some(
                              (si) =>
                                si.stdID === item.std_ID &&
                                si.actID === item.act_ID &&
                                si.date === date
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                item.std_ID,
                                item.act_ID,
                                date
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Upload;
