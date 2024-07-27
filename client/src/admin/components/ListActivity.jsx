import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup_addAc";
import BuildIcon from "@mui/icons-material/Build";
import ListAltIcon from "@mui/icons-material/ListAlt";
import moment from "moment";

const ProductTable = () => {
  const now = new Date();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activity, setActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  // const [visibleStartPage, setVisibleStartPage] = useState(0);

  const navigate = useNavigate();

  // const updateVisibleStartPage = (newCurrentPage) => {
  //   const newVisibleStartPage = Math.floor(newCurrentPage / 4) * 4;
  //   setVisibleStartPage(newVisibleStartPage);
  // };

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
  }, []);

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
  const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
  // const visibleItems = filteredItems.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );
  const pageNumbers = [];
  for (let i = 0; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
    const visibleItems = filteredItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    return (
      <div className="mb-10 container mx-auto">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-2">รายชื่อกิจกรรม</div>
            
          </div>
      {/*<hr className="m-3" /> */}
          <div className="flex justify-between">
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
                  className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="mt-1 pb-4">
              
            </div>
          </div>

          <table className="text-center w-full text-sm rtl:text-center text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
              <tr className="flex w-full">
                <th scope="col" className="px-6 py-3 w-1/12 text-center">
                  ลำดับ
                </th>
                <th scope="col" className="px-6 py-3 w-4/12 text-center">
                  ชื่อกิจกรรม
                </th>
                <th scope="col" className="px-6 py-3 w-3/12 text-center">
                  วัน
                </th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">
                  สถานะ
                </th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">
                  เพิ่มเติม
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
              {visibleItems.map((item, index) => {
                return (
                  <tr key={item.act_ID} className="border-b-2 flex w-full">
                    <td scope="col" className="px-6 py-3 w-1/12 text-center">
                      {currentPage * itemsPerPage + index + 1}
                    </td>
                    <td scope="col" className="px-6 py-3 w-4/12 text-start">
                      {item.act_title}
                    </td>
                    <td scope="col" className="px-6 py-3 w-3/12 text-center">
                      {item.act_dateStart.slice(0, 10)} -{" "}
                      {item.act_dateEnd.slice(0, 10)}
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 w-2/12 text-center"
                      style={{
                        color:
                        item.act_status == 2
                        ? "blue"
                        : item.act_numStd == item.act_numStdReserve
                          ? "red"
                          : now >= moment(item.act_dateStart)
                          .subtract(2, "weeks")
                          .toDate() && now <= moment(item.act_dateStart)
                          .subtract(1, "day")
                          .toDate()
                            ? item.act_status == 1
                              ? "green"
                              : "red"
                            : "grey",
                      }}
                    >
                      {item.act_status == 2
                        ? "กิจกรรมสิ้นสุดแล้ว"
                        : item.act_numStd == item.act_numStdReserve
                          ? "ลงทะเบียนเต็มแล้ว"
                          : now >= moment(item.act_dateStart)
                          .subtract(2, "weeks")
                          .toDate() && now <= moment(item.act_dateStart)
                          .subtract(1, "day")
                          .toDate()
                            ? item.act_status == 1
                              ? "เปิดลงทะเบียน"
                              : "ปิดลงทะเบียน"
                            : "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน"}
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 w-1/12 text-end hover:text-red-500 text-indigo-800"
                    >
                      <BuildIcon
                        onClick={() => navigate(`manage/${item.act_ID}`)}
                      />
                    </td>
                    <td
                      scope="col"
                      className="px-6 py-3 w-1/12 text-start hover:text-green-500 text-teal-700"
                    >
                      <ListAltIcon
                        onClick={() => navigate(`detail/${item.act_ID}`)}
                      />
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
              </button></div>
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
};

export default ProductTable;
