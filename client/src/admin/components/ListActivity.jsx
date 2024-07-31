import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import ListAltIcon from "@mui/icons-material/ListAlt";
import moment from "moment";

const ListActivity = () => {
  const now = new Date();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activity, setActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filter, setFilter] = useState("default");

  const [join, setJoin] = useState([]);
  const [reserve, setReserve] = useState([]);
  const [stdID, setStdID] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/list/activity")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setActivity(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    fetch("/api/join")
      .then((res) => res.json())
      .then((result) => setJoin(result));

    fetch("/api/reserve")
      .then((res) => res.json())
      .then((result) => setReserve(result));

    setStdID(localStorage.getItem("stdID"));

  }, []);

  const getStatus = (activityID) => {
    // ตรวจสอบข้อมูลการเข้าร่วม
    const joinEntry = join.find(
      (j) => j.actID === activityID && j.stdIDs.includes(BigInt(stdID))
    );
    if (joinEntry) {
      return { message: "เข้าร่วมกิจกรรมแล้ว", color: "blue" };
    }
  
    // ตรวจสอบข้อมูลการลงทะเบียน
    const reserveEntry = reserve.find(
      (r) => r.act_ID === activityID && r.std_ID === stdID
    );
    if (reserveEntry) {
      return { message: "ลงทะเบียนสำเร็จ", color: "green" };
    }
  
    // ตรวจสอบข้อมูลกิจกรรม
    const activityEntry = activity.find((a) => a.act_ID === activityID);
    if (!activityEntry) {
      return { message: "ไม่พบข้อมูล", color: "gray" };
    }
  
    const now = new Date();
    const activityStartDate = new Date(activityEntry.act_dateStart);
    const activityEndDate = new Date(activityEntry.act_dateEnd);
    
    // ตรวจสอบช่วงเวลาการลงทะเบียน
    if (now < moment(activityStartDate).subtract(2, "weeks").toDate() || now > moment(activityStartDate).subtract(1, "day").toDate()) {
      return { message: "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน", color: "gray" };
    }
  
    // หากไม่พบข้อมูลการเข้าร่วม หรือ การลงทะเบียน
    return { message: "ยังไม่ได้ลงทะเบียน", color: "gray" };
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset current page to 0 on search
  };

  const filteredItems = activity.filter((item) => {
    return (
      item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.act_location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  const formatDateThai = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', options);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  const filteredAndFilteredItems = filteredItems.filter((item) => {
    const status = getStatus(item.act_ID);
    return (
      (filter === "default" ||
        (filter === "joinEntry" && status.message === "เข้าร่วมกิจกรรมแล้ว") ||
        (filter === "reserveEntry" && status.message === "ลงทะเบียนสำเร็จ") ||
        (filter === "notjoin" && status.message === "ยังไม่ได้ลงทะเบียน")||
        (filter === "notrange" && status.message === "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน"))
    );
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const sortedItems = sortItems(filteredAndFilteredItems);
    const lastPage = Math.ceil(sortedItems.length / itemsPerPage) - 1;
    const visibleItems = sortedItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    const pageNumbers = Array.from({ length: lastPage + 1 }, (_, index) => index);

    return (
      <div className="mb-10 container mx-auto">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-2">รายชื่อกิจกรรม</div>
          </div>
          <div className="flex justify-between">
            <div className="pb-4 items-center">
              <label htmlFor="table-search" className="sr-only">Search</label>
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
                  className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex pb-4 items-center">
                <label htmlFor="filter-activity-type" className="sr-only">Filter</label>
                <div className="relative">
                  <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="text-xs block p-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="default" className="text-center">ทั้งหมด</option>
                    <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                    <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                    <option value="notjoin">ยังไม่ได้ลงทะเบียน</option>
                    <option value="notrange">ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน</option>
                  </select>
                </div>
              </div>
              <div className="flex pb-4 items-center">
                <button
                  onClick={handleSortChange}
                  className="block p-1.5 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  วันที่ ({sortOrder === "latest" ? "ใหม่สุด" : "เก่าสุด"})
                </button>
              </div>
            </div>
          </div>
          
          <table className="text-center w-full text-sm rtl:text-center text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
              <tr className="flex w-full">
                <th scope="col" className="px-6 py-3 w-1/12 text-center">ลำดับ</th>
                <th scope="col" className="px-6 py-3 w-4/12 text-center">ชื่อกิจกรรม</th>
                <th scope="col" className="px-6 py-3 w-3/12 text-center">วัน</th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">สถานะ</th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
              {visibleItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-3 text-center text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                visibleItems.map((item, index) => (
                  <tr key={item.act_ID} className="border-b-2 flex w-full">
                    <td scope="col" className="px-6 py-3 w-1/12 text-center">
                      {currentPage * itemsPerPage + index + 1}
                    </td>
                    <td scope="col" className="px-6 py-3 w-4/12 text-center">
                      {item.act_title}
                    </td>
                    <td scope="col" className="px-6 py-3 w-3/12 text-center">
                      {formatDateThai(item.act_dateStart)} - {formatDateThai(item.act_dateEnd)}
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 w-2/12 text-center"
                      style={{
                        color:
                          item.act_status === 2
                            ? "blue"
                            : item.act_numStd === item.act_numStdReserve
                              ? "red"
                              : now >= moment(item.act_dateStart)
                                .subtract(2, "weeks")
                                .toDate() && now <= moment(item.act_dateStart)
                                  .subtract(1, "day")
                                  .toDate()
                                ? item.act_status === 1
                                  ? "green"
                                  : "red"
                                : "gray",
                      }}
                    >
                      {item.act_status === 2
                        ? "กิจกรรมสิ้นสุดแล้ว"
                        : item.act_numStd === item.act_numStdReserve
                          ? "ลงทะเบียนเต็มแล้ว"
                          : now >= moment(item.act_dateStart)
                            .subtract(2, "weeks")
                            .toDate() && now <= moment(item.act_dateStart)
                              .subtract(1, "day")
                              .toDate()
                            ? item.act_status === 1
                              ? "เปิดลงทะเบียน"
                              : "ปิดลงทะเบียน"
                            : "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน"}
                    </td>
                    <td
                      scope="col"
                      className="px-6 cursor-pointer py-3 w-1/12 text-end hover:text-red-500 text-indigo-800"
                    >
                      <BuildIcon
                        onClick={() => navigate(`manage/${item.act_ID}`)}
                      />
                    </td>
                    <td
                      scope="col"
                      className="px-6 cursor-pointer py-3 w-1/12 text-start hover:text-green-500 text-teal-700"
                    >
                      <ListAltIcon
                        onClick={() => navigate(`detail/${item.act_ID}`)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between mt-2">
            <div className="flex gap-2 w-24"></div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
                disabled={currentPage === 0}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${currentPage === 0 ? "cursor-not-allowed" : "hover:bg-blue-200"
                  }`}
              >
                ก่อนหน้า
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={` px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${pageNumber === currentPage ? "bg-blue-200" : ""
                    }`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, lastPage))}
                disabled={currentPage === lastPage}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${currentPage === lastPage ? "cursor-not-allowed" : "hover:bg-blue-200"
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
                className="px-3 p-1.5 cursor-pointer text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
};

export default ListActivity;
