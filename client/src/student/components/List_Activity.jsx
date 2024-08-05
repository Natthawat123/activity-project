import { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import { useNavigate } from "react-router-dom";

function Test() {
  const [reserve, setReserve] = useState([]);
  const [join, setJoin] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");

  const navigate = useNavigate();

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";
  const stdID = localStorage.getItem("std_ID");

  useEffect(() => {
    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.getAll().call();

        const format = res[0].map((actID, index) => ({
          actID: Number(actID),
          stdIDs: res[1][index],
        }));

        setJoin(format);
      } catch (err) {
        setError;
        console.error(err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get("/api/activitys");

        
        setActivity(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSmartContract();
    fetchActivity();
    setIsLoaded(true);
  }, []);

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) => j.actID == activityID && j.stdIDs.includes(BigInt(stdID))
    );
    if (joinEntry) {
      return { message: "เข้าร่วมกิจกรรมแล้ว", color: "blue" };
    }
    const reserveEntry = activity.find(
      (r) => r.act_ID === activityID && r.login_ID === stdID
    );
    if (reserveEntry) {
      return { message: "ลงทะเบียนสำเร็จ", color: "green" };
    }
    return { message: "ยังไม่ได้ลงทะเบียน", color: "gray" };
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
  };

  const sortItems = (items) => {
    return items.sort((a, b) => {
      const dateA = new Date(a.act_dateStart);
      const dateB = new Date(b.act_dateStart);
      if (sortOrder === "latest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredItems = activity.filter((item) => {
    const status = getStatus(item.act_ID);
    return (
      item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "default" ||
        (filter === "joinEntry" && status.message === "เข้าร่วมกิจกรรมแล้ว") ||
        (filter === "reserveEntry" && status.message === "ลงทะเบียนสำเร็จ") ||
        (filter === "notjoin" && status.message === "ยังไม่ได้ลงทะเบียน"))
    );
  });

  const sortedItems = sortItems(filteredItems);
  const lastPage = Math.ceil(sortedItems.length / itemsPerPage) - 1;
  const visibleItems = sortedItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const uniqueVisibleItems = Array.from(
    new Map(visibleItems.map(item => [item.act_ID, item])).values()
  );

  const pageNumbers = [];
  for (let i = 0; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="text-lg font-bold mb-2">ประวัติการทำกิจกรรม</div>
          <div className="flex justify-between">
            <div className="pb-4 items-center">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                  className="block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex pb-4 items-center">
                <label htmlFor="filter-activity-type" className="sr-only">
                  Filter
                </label>
                <div className="relative">
                  <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="text-xs block p-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="default" className="text-center">
                      ทั้งหมด
                    </option>
                    <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                    <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                    <option value="notjoin">ยังไม่ได้ลงทะเบียน</option>
                  </select>
                </div>
              </div>
              <div className="flex pb-4 items-center">
                <button
                  onClick={handleSortChange}
                  className="block p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  วันที่ ({sortOrder === "latest" ? "ใหม่สุด" : "เก่าสุด"})
                </button>
              </div>
            </div>
          </div>
          <table
            className="min-w-full bg-white dark:bg-gray-800"
            style={{ maxHeight: "50vh" }}
          >
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="w-96 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 uppercase text-left">
                <th className="px-4 py-3">ชื่อกิจกรรม</th>
                <th className="px-4 py-3">สถานที่</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 w-2/12">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {uniqueVisibleItems.map((item) => {
                const status = getStatus(item.act_ID);
                return (
                  <tr
                    key={item.act_ID}
                    className="text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">{item.act_title}</td>
                    <td className="px-4 py-3">{item.act_location}</td>
                    <td className="px-4 py-3">
                      {item.act_dateStart.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3" style={{ color: status.color }}>
                      {status.message}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() =>
                          navigate(`/activity/detail2/${item.act_ID}`)
                        }
                      >
                        รายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2 w-24"></div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                }
                disabled={currentPage === 0}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  currentPage === 0 ? "cursor-not-allowed" : "hover:bg-blue-200"
                }`}
              >
                ก่อนหน้า
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                    pageNumber === currentPage ? "bg-blue-200" : ""
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.min(prevPage + 1, lastPage))
                }
                disabled={currentPage === lastPage}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  currentPage === lastPage
                    ? "cursor-not-allowed"
                    : "hover:bg-blue-200"
                }`}
              >
                ถัดไป
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(+e.target.value);
                  setCurrentPage(0);
                }}
                className="px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Test;
