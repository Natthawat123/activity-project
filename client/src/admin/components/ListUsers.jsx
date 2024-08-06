import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";

const ListUsers = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [section, setSection] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedRole, setSelectedRole] = useState('all');
  const [test, setTest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/users");
        if (res.status === 200) {
          setUsers(res.data);
          setTest(res.data);
        } else {
          console.error(`Error: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
      } finally {
        setIsLoaded(true);
      }
    };

    const fetchSection = async () => {
      try {
        const response = await axios.get("/api/sections");
        setSection(response.data);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    };

    fetchData();
    fetchSection();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedRole, selectedSection, sortOrder, searchTerm]);

  const applyFiltersAndSort = () => {
    let filteredUsers = users;

    if (selectedRole !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === selectedRole);
    }

    if (selectedSection !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.sec_ID == selectedSection);
    }

    if (sortOrder === 'asc') {
      filteredUsers = filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sortOrder === 'desc') {
      filteredUsers = filteredUsers.sort((a, b) => b.username.localeCompare(a.username));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => {
        return (
          (user.fname && user.fname.toLowerCase().includes(term)) ||
          (user.lname && user.lname.toLowerCase().includes(term)) ||
          (user.sec_name && user.sec_name.toLowerCase().includes(term)) ||
          (user.role === 'student' && user.username && String(user.username).toLowerCase().includes(term)) ||
          (user.role !== 'student' && user.login_ID && String(user.login_ID).toLowerCase().includes(term))
        );
      });
    }

    setTest(filteredUsers);
  };

  const handleFilterChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedSection("all");
    setSortOrder("asc");
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSectionFilterChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

   // Pagination calculations
   const totalPages = Math.ceil(test.length / itemsPerPage);
   const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);
   const lastPage = totalPages - 1;
 

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="text-lg font-bold mb-2 gap-2 flex ">
            <h1>รายชื่อผู้ใช้งานระบบ</h1>
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
                  placeholder="ค้นหาผู้ใช้งาน"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="flex pb-4 items-center gap-2 ">
         

              {(selectedRole === "student" || selectedRole === "teacher") && (
                <>
               

                  <div className="items-center justify-center text-center">
                    <label htmlFor="filter-section" className="text-xs">
                      แยกตามหมู่เรียน
                    </label>
                    <div className="relative justify-center flex">
                      <select
                        id="filter-section"
                        value={selectedSection}
                        onChange={handleSectionFilterChange}
                        className="text-xs cursor-pointer block p-1 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="all">ทั้งหมด</option>
                        {section.map((sec) => (
                          <option key={sec.sec_ID} value={sec.sec_ID}>
                            {sec.sec_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedRole === "student" && (
                    <>
                    <div className="items-center justify-center">
                      <label htmlFor="sort-order" className="text-xs">
                        เรียงตามรหัสนศ.
                      </label>
                      <div className="relative justify-center flex">
                        <select
                          value={sortOrder}
                          onChange={handleSortChange}
                          className="text-xs block p-1 cursor-pointer border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="asc">น้อยไปมาก</option>
                          <option value="desc">มากไปน้อย</option>
                        </select>
                      </div>
                    </div>
                    </>
                  )}
                </>
              )}

              <div className="items-center justify-center text-center">
              <label htmlFor="filter-activity-type" className="text-xs">
                เรียงตามบทบาท
              </label>
              <div className="relative  justify-center flex">
                <select
                  value={selectedRole}
                  onChange={handleFilterChange}
                  className="cursor-pointer text-xs block p-1 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="all" className="text-center">
                    ทั้งหมด
                  </option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="teacher">อาจารย์</option>
                  <option value="student">นักศึกษา</option>
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
      {selectedRole === "student" && (
        <th scope="col" className="px-6 py-3 w-3/12 text-center">
          รหัสนักศึกษา
        </th>
      )}
  
      <th scope="col" className="px-6 py-3 w-4/12 text-center">
        ชื่อ-นามสกุล
      </th>
      <th scope="col" className="px-6 py-3 w-2/12 text-center">
        บทบาท
      </th>
      {selectedRole === "student" && (
        <th scope="col" className="px-6 py-3 w-4/12 text-center">
          หมู่เรียน
        </th>
      )}
      {selectedRole === "teacher" && (
        <th scope="col" className="px-6 py-3 w-4/12 text-center">
          อาจารย์ที่ปรึกษาหมู่เรียน
        </th>
      )}
      <th scope="col" className="px-6 py-3 w-2/12 text-center">
        รายละเอียด
      </th>
    </tr>
  </thead>
  <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
  {test.map((item, index) => (
    <tr
      key={item.login_ID}
      className="border-b-2 flex w-full items-center"
    >
      <td className="px-6 py-3 w-1/12 text-center">{index + 1}</td>
      {selectedRole === "student" && (
        <td className="px-6 py-3 w-3/12 text-center">
          {item.username}
        </td>
      )}

      <td className="px-6 py-3 w-4/12">
        {item.fname} {item.lname}
      </td>
      <td className="px-6 py-3 w-2/12 text-center">
        {item.role === 'student' ? 'นักศึกษา' : item.role === 'teacher' ? 'อาจารย์' : 'ผู้ดูแลระบบ'}
      </td>
      {(selectedRole === "student" || selectedRole === "teacher") && (
        <td className="px-6 py-3 w-4/12 text-center">
          {item.sec_name || 'N/A'}
        </td>
      )}
      <td className="px-6 py-3 w-2/12 text-center">
        <Link to={`user/${item.ID}`}>
          <button className="bg-cyan-400 hover:bg-cyan-500 px-2 py-1 text-white rounded">
            เรียกดู
          </button>
        </Link>
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
                className="px-3 cursor-pointer p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

export default ListUsers;
