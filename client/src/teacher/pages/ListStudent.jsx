import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";

const ListStudents = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/students");
        setStudents(res.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoaded(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const fname = student.std_fname ? student.std_fname.toLowerCase() : "";
    const lname = student.std_lname ? student.std_lname.toLowerCase() : "";
    const secID = student.sec_ID ? student.sec_ID.toString().toLowerCase() : "";

    const matchesSearchTerm =
      fname.includes(searchTerm.toLowerCase()) ||
      lname.includes(searchTerm.toLowerCase()) ||
      secID.includes(searchTerm.toLowerCase());

    return matchesSearchTerm;
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    const idA = String(a.std_ID || "");
    const idB = String(b.std_ID || "");

    return sortOrder === "asc"
      ? idA.localeCompare(idB)
      : idB.localeCompare(idA);
  });

  const lastPage = Math.ceil(filteredStudents.length / itemsPerPage) - 1;
  const visibleStudents = sortedStudents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const pageNumbers = Array.from({ length: lastPage + 1 }, (_, i) => i);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container mx-auto md:px-20 pt-36 md:pt-20 my-10">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="text-lg font-bold mb-2 gap-2 flex">
            <h1>รายชื่อนักศึกษา</h1>
            <GroupIcon />
          </div>
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
                  placeholder="ค้นหานักศึกษา"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="flex pb-4 items-center gap-2">
              <div className="items-center justify-center">
                <label htmlFor="sort-order" className="text-xs">
                  เรียงตามรหัสนศ.
                </label>
                <div className="relative justify-center flex">
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="text-xs block p-1 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="asc">น้อยไปมาก</option>
                    <option value="desc">มากไปน้อย</option>
                  </select>
                </div>
              </div>

              <div className="items-center justify-center text-center">
                <label htmlFor="filter-section" className="text-xs">
                  หมู่เรียน
                </label>
                <div className="relative justify-center flex">
                  <select
                    id="filter-section"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="text-xs block p-1 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="all">ทั้งหมด</option>
                    {sections.map((sec) => (
                      <option key={sec.sec_ID} value={sec.sec_ID}>
                        {sec.sec_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
              <tr className="flex w-full">
                <th scope="col" className="px-6 py-3 w-1/12 text-center">
                  ลำดับ
                </th>
                <th scope="col" className="px-6 py-3 w-3/12 text-center">
                  รหัสนักศึกษา
                </th>
                <th scope="col" className="px-6 py-3 w-4/12 text-center">
                  ชื่อ-นามสกุล
                </th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">
                  หมู่เรียน
                </th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">
                  รายละเอียด
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
              {visibleStudents.map((student, index) => (
                <tr
                  key={student.login_ID}
                  className="border-b-2 flex w-full items-center"
                >
                  <td className="px-6 py-3 w-1/12 text-center">{index + 1}</td>
                  <td className="px-6 py-3 w-3/12 text-center">
                    {student.login_ID}
                  </td>
                  <td className="px-6 py-3 w-4/12">
                    {student.std_fname} {student.std_lname}
                  </td>
                  <td className="px-6 py-3 w-2/12 text-center">
                    {student.sec_name}
                  </td>
                  <td className="px-6 py-3 w-2/12 text-center">
                    <button className="bg-cyan-400 hover:bg-cyan-500 px-2 py-1 text-white rounded">
                      <a
                        onClick={() =>
                          navigate(`detail/student/${student.login_ID}`)
                        }
                      >
                        เรียกดู
                      </a>
                    </button>
                  </td>
                </tr>
              ))}
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
                  className={` px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
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
                <option value={1000}>ทั้งหมด</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ListStudents;
