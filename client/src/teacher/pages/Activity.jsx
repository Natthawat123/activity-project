import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BuildIcon from "@mui/icons-material/Build";
import ListAltIcon from "@mui/icons-material/ListAlt";
import moment from "moment";
import Button from "@mui/material/Button";
const ListActivity = () => {
  const now = new Date();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activity, setActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    fetch("/api/activitys")
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
    setCurrentPage(0);
  };

  const filteredItems = activity.filter((item) => {
    return (
      item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.act_location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const removeDuplicates = (items) => {
    const seenTitles = new Set();
    return items.filter((item) => {
      const isDuplicate = seenTitles.has(item.act_title);
      seenTitles.add(item.act_title);
      return !isDuplicate;
    });
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

  // Helper function to format dates in Thai
  const formatDateThai = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const uniqueItems = removeDuplicates(filteredItems);
    const sortedItems = sortItems(uniqueItems);
    const lastPage = Math.ceil(sortedItems.length / itemsPerPage) - 1;
    const visibleItems = sortedItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    const pageNumbers = Array.from(
      { length: lastPage + 1 },
      (_, index) => index
    );

    return (
      <div className="mb-10 container mx-auto">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-2">รายชื่อกิจกรรม</div>
          </div>
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
                  className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
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
                    <td scope="col" className="px-6 py-3 w-4/12 text-center">
                      {item.act_title}
                    </td>
                    <td scope="col" className="px-6 py-3 w-3/12 text-center">
                      {formatDateThai(item.act_dateStart)} -{" "}
                      {formatDateThai(item.act_dateEnd)}
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
                            : now >=
                                moment(item.act_dateStart)
                                  .subtract(2, "weeks")
                                  .toDate() &&
                              now <=
                                moment(item.act_dateStart)
                                  .subtract(1, "day")
                                  .toDate()
                            ? item.act_status === 1
                              ? "green"
                              : "red"
                            : "grey",
                      }}
                    >
                      {item.act_status === 2
                        ? "กิจกรรมสิ้นสุดแล้ว"
                        : item.act_numStd === item.act_numStdReserve
                        ? "ลงทะเบียนเต็มแล้ว"
                        : now >=
                            moment(item.act_dateStart)
                              .subtract(2, "weeks")
                              .toDate() &&
                          now <=
                            moment(item.act_dateStart)
                              .subtract(1, "day")
                              .toDate()
                        ? item.act_status === 1
                          ? "ลงทะเบียนได้"
                          : "กิจกรรมจะเริ่มในอีก 1 วัน"
                        : "กิจกรรมยังไม่เริ่ม"}
                    </td>
                    <td scope="col" className="px-6 py-3 w-2/12 text-center">
                      <Link to={`detail/${item.act_ID}`}>
                        <Button variant="outlined" startIcon={<ListAltIcon />}>
                          รายละเอียด
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav className="flex justify-center mt-4">
            <ul className="inline-flex -space-x-px">
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100"
                >
                  Prev
                </button>
              </li>
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-2 text-sm font-medium ${
                      number === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-500"
                    } border border-gray-300 hover:bg-gray-100`}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, lastPage))
                  }
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
};

export default ListActivity;
