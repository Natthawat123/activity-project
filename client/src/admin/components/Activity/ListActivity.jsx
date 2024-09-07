import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ContextActivity } from "./ActivityContext.jsx";

// MUI
import ArticleIcon from "@mui/icons-material/Article";
import Button from "@mui/material/Button";

const ListActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filter, setFilter] = useState("default");
  const { activities, error, isLoaded } = useContext(ContextActivity);

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
  };

  const sortItems = (items) => {
    return items.sort((a, b) => {
      const dateA = new Date(a.act_dateStart);
      const dateB = new Date(b.act_dateStart);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  const formatDateThai = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const sortedItems = sortItems(activities);
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
        <div className="flex justify-between items-center">
          <div className="pb-4 items-center">
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
                className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-52 md:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ค้นหาผู้ใช้งาน"
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
              <select
                value={filter}
                onChange={handleFilterChange}
                className="text-xs block p-1 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="default">ทั้งหมด</option>
                <option value="open">เปิดลงทะเบียน</option>
                <option value="closed">ปิดลงทะเบียน</option>
                <option value="not-open">
                  ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน
                </option>
                <option value="full">ลงทะเบียนเต็มแล้ว</option>
                <option value="ended">กิจกรรมสิ้นสุดแล้ว</option>
              </select>
            </div>
            <div className="flex pb-4 items-center">
              <button
                onClick={handleSortChange}
                className="block p-1.5 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                วันที่ ({sortOrder === "latest" ? "ใหม่สุด" : "เก่าสุด"})
              </button>
            </div>
          </div>
        </div>

        <table className="text-center w-full text-sm text-gray-500">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ลำดับ
              </th>
              <th scope="col" className="px-6 py-3">
                ชื่อกิจกรรม
              </th>
              <th scope="col" className="px-6 py-3">
                ระยะเวลา
              </th>
              <th scope="col" className="px-6 py-3">
                สถานะกิจกรรม
              </th>
              <th scope="col" className="px-6 py-3">
                รายละเอียด
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-3 text-center text-gray-500">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              visibleItems.map((item, index) => (
                <tr key={item.act_ID} className="border-b-2">
                  <td className="px-6 py-3">
                    {currentPage * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-3">{item.act_title}</td>
                  <td className="px-6 py-3">
                    {formatDateThai(item.act_dateStart)} -{" "}
                    {formatDateThai(item.act_dateEnd)}
                  </td>
                  <td className="px-6 py-3">{item.act_status}</td>
                  <td className="px-6 py-3">
                    <Button
                      onClick={() => navigate(`detail/${item.act_ID}`)}
                      variant="outlined"
                      startIcon={<ArticleIcon />}
                    >
                      เพิ่มเติม
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between mt-2">
        <div></div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
              }
              disabled={currentPage === 0}
              className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 ${
                currentPage === 0 ? "cursor-not-allowed" : "hover:bg-blue-200"
              }`}
            >
              ก่อนหน้า
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 ${
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
              className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500 ${
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
              className="px-3 p-1.5 cursor-pointer text-sm font-medium rounded-lg bg-gray-100 text-gray-500"
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
};

export default ListActivity;
