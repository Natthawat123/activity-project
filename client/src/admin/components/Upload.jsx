import { useState, useEffect } from "react";
import axios from "axios";
import contractAbi from "../contract/abi.json";
import Web3 from "web3";
import Swal from "sweetalert2";

function Upload() {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedActID, setSelectedActID] = useState(null);
  const [selectedStdIDs, setSelectedStdIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [checkAllStates, setCheckAllStates] = useState({});
  const [deleteSelectedItems, setDeleteSelectedItems] = useState([]);
  const [deleteCheckAllStates, setDeleteCheckAllStates] = useState({});

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/list/upload");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.act_title]) {
      acc[item.act_title] = [];
    }
    acc[item.act_title].push(item);
    return acc;
  }, {});

  const sortedActivities = Object.keys(groupedData)
    .map((actTitle) => ({
      actTitle,
      activities: groupedData[actTitle],
    }))
    .sort((a, b) => a.activities[0].act_ID - b.activities[0].act_ID);

  const filteredActivities = sortedActivities
    .map((group) => ({
      ...group,
      activities: group.activities.filter(
        (item) =>
          item.std_ID.includes(searchTerm) ||
          item.std_fname.includes(searchTerm) ||
          item.std_lname.includes(searchTerm)||
          item.act_title.includes(searchTerm)
      ),
    }))
    .filter((group) => group.activities.length > 0);

  const handleCheckboxChange = (stdID, actID) => {
    const isSelected = selectedItems.some(
      (item) => item.stdID === stdID && item.actID === actID
    );

    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter((item) => !(item.stdID === stdID && item.actID === actID))
      );
      setSelectedStdIDs((prev) => prev.filter((id) => id !== stdID));
    } else {
      setSelectedItems((prev) => [...prev, { stdID, actID }]);
      setSelectedStdIDs((prev) => [...prev, stdID]);
    }

    setSelectedActID(actID);
  };

  const handleCheckAll = (actID) => {
    const isChecked = checkAllStates[actID] || false;
    const activities = data.filter((item) => item.act_ID === actID);

    if (isChecked) {
      setSelectedItems((prev) =>
        prev.filter(
          (item) => !activities.some((act) => act.std_ID === item.stdID)
        )
      );
      setSelectedStdIDs((prev) =>
        prev.filter((id) => !activities.some((act) => act.std_ID === id))
      );
    } else {
      const newItems = activities.map((item) => ({
        stdID: item.std_ID,
        actID: item.act_ID,
      }));
      setSelectedItems((prev) => [...prev, ...newItems]);
      setSelectedStdIDs((prev) => [
        ...prev,
        ...newItems.map((item) => item.stdID),
      ]);
    }
    setSelectedActID(actID);
    setCheckAllStates((prev) => ({ ...prev, [actID]: !isChecked }));
  };

  const handleDeleteCheckAll = (actID) => {
    const isChecked = deleteCheckAllStates[actID] || false;
    const activities = data.filter((item) => item.act_ID === actID);

    if (isChecked) {
      setDeleteSelectedItems((prev) =>
        prev.filter(
          (item) => !activities.some((act) => act.std_ID === item.stdID)
        )
      );
    } else {
      const newItems = activities.map((item) => ({
        stdID: item.std_ID,
        actID: item.act_ID,
      }));
      setDeleteSelectedItems((prev) => [...prev, ...newItems]);
    }
    setDeleteCheckAllStates((prev) => ({ ...prev, [actID]: !isChecked }));
  };

  const handleUpload = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);

      setWeb3(web3);
      setContract(contract);

      if (!contract || !web3) {
        console.error("Contract or web3 not initialized.");
        return;
      }

      if (!selectedActID || selectedStdIDs.length === 0) {
        console.error("No activity or students selected.");
        return;
      }

      try {
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods
          .Upload(selectedActID, selectedStdIDs)
          .send({ from: accounts[0] });

        console.log("Transaction successful:", tx.transactionHash);
        await axios.put(`/api/transection/${selectedActID}`, {
          act_transaction: tx.transactionHash,
        });

        await axios.delete(`/api/reserve/${selectedActID}`);
        await axios.put(`/api/updateStatus/${selectedActID}`);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Transaction: ${tx.transactionHash}`,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        console.error("Error performing transaction:", err);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error performing transaction",
          showConfirmButton: false,
          timer: 1500,
        });
      }
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
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteCheckboxChange = (std_ID, act_ID) => (event) => {
    const isChecked = event.target.checked;
    setDeleteSelectedItems((prev) => {
      if (isChecked) {
        return [...prev, { stdID: std_ID, actID: act_ID }];
      } else {
        return prev.filter(
          (item) => !(item.stdID === std_ID && item.actID === act_ID)
        );
      }
    });
  };

  const deleteReserve = async (stdID, actID) => {
    console.log(stdID);
    await axios.delete(`/api/reserve/reserve/${stdID}/${actID}`).then((res) => {
      console.log(res);
    });
  };

  const deleteSelectedReserves = () => {
    for (const item of deleteSelectedItems) {
      deleteReserve(item.stdID, item.actID);
    }
  };

  return (
    <div className="mb-10 container mx-auto md:px-20">
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
        <div className="flex justify-between items-center pb-4">
          <div className=" items-center">
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

          <div className="relative justify-center flex ">
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
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
                  <tr className="flex w-full">
                    <th className="px-6 py-3 w-1/6 text-center">ลำดับ</th>
                    <th className="px-6 py-3 w-1/6">รหัสนักศึกษา</th>
                    <th className="px-6 py-3 w-1/6">ชื่อ</th>
                    <th className="px-6 py-3 w-1/6">นามสกุล</th>
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
                    <th className="px-6 py-3 w-1/7">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            deleteCheckAllStates[activities[0].act_ID] || false
                          }
                          onChange={() =>
                            handleDeleteCheckAll(activities[0].act_ID)
                          }
                          className="mr-2"
                        />
                        <label>ลบ</label>
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
                      <td className="px-6 py-3 w-1/6 ml-7">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (si) =>
                              si.stdID === item.std_ID &&
                              si.actID === item.act_ID
                          )}
                          onChange={() =>
                            handleCheckboxChange(item.std_ID, item.act_ID)
                          }
                        />
                      </td>
                      <td className="px-6 py-3 w-1/7 ml-7">
                        <input
                          type="checkbox"
                          checked={deleteSelectedItems.some(
                            (si) =>
                              si.stdID === item.std_ID &&
                              si.actID === item.act_ID
                          )}
                          onChange={handleDeleteCheckboxChange(
                            item.std_ID,
                            item.act_ID
                          )}
                        />
                      </td>
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
        <button
          onClick={deleteSelectedReserves}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}

export default Upload;
