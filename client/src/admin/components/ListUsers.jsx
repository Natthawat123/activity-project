import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductTable = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleStartPage, setVisibleStartPage] = useState(0);

  const [login, setLogin] = useState([]);
  const [student, setStudent] = useState([]);
  const [staff, setStaff] = useState([]);
  const [section, setSection] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loginRes, studentRes, staffRes, sectionRes] = await Promise.all([
          axios.get("/api/list/login"),
          axios.get("/api/list/student"),
          axios.get("/api/list/staff"),
          axios.get("/api/list/section"),
        ]);
        setLogin(loginRes.data);
        setStudent(studentRes.data);
        setStaff(staffRes.data);
        setSection(sectionRes.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoaded(false);
        setError(error);
      }
    };

    fetchData();
  }, []);
  console.log(staff);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const filteredItems = login.filter((item) => {
    const studentData = student.find((std) => std.std_ID == item.username);
    const staffData = staff.find((stf) => stf.login_ID == item.login_ID);
    return (
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (studentData &&
        (studentData.std_fname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          studentData.std_lname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          studentData.sec_ID
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) ||
      (staffData &&
        (staffData.staff_fname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          staffData.staff_lname
            .toLowerCase()
            .includes(searchTerm.toLowerCase())))
    );
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const mappedUsers = filteredItems.map((item) => {
      const studentData = student.find((std) => std.std_ID == item.username);
      const staffData = staff.find((stf) => stf.login_ID == item.login_ID);

      if (studentData) {
        return {
          ...item,
          std_ID: studentData.std_ID,
          std_fname: studentData.std_fname,
          std_lname: studentData.std_lname,
          sec_ID: studentData.sec_ID,
          sec_name: "",
          role: "นักศึกษา",
        };
      } else if (staffData) {
        return {
          ...item,
          std_ID: staffData.staff_ID,
          std_fname: staffData.staff_fname,
          std_lname: staffData.staff_lname,
          sec_ID: "",
          sec_name: "",
          role: "อาจารย์",
        };
      } else {
        return {
          ...item,
          std_ID: "",
          std_fname: "",
          std_lname: "",
          sec_ID: "",
          sec_name: "",
          role: "unknown",
        };
      }
    });

    const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
    const visibleItems = mappedUsers.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );

    return (
      <div className="mb-10 container mx-auto md:px-20">
        <div className=" overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <div className="text-lg font-bold mb-2">รายชื่อผู้ใช้งานระบบ</div>
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

            <div className=" mt-1 pb-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(+e.target.value);
                  setCurrentPage(0);
                }}
                className="block ps-6 pt-1 pb-1 text-sm text-gray-900 border  rounded-md w-20 bg-orange-500-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-black-400 dark:text-gray-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {/* ... ส่วนหัวตาราง ... */}
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
                  บทบาท
                </th>
                <th scope="col" className="px-6 py-3 w-2/12 text-center">
                  รายละเอียด
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
              {visibleItems.map((item, index) => (
                <tr
                  key={item.std_ID}
                  className="border-b-2 flex w-full items-center"
                >
                  <td scope="col" className="px-6 py-3 w-1/12 text-center">
                    {index + 1}
                  </td>
                  <td scope="col" className="px-6 py-3 w-3/12 text-center">
                    {item.std_ID}
                  </td>
                  <td scope="col" className="px-6 py-3 w-4/12">
                    {item.std_fname} {item.std_lname}
                  </td>
                  <td scope="col" className="px-6 py-3 w-2/12 text-center">
                    {item.role}
                  </td>
                  <td scope="col" className="px-6 py-3 w-2/12 text-center">
                    <button className="bg-cyan-400 hover:bg-cyan-500 px-2 py-1 text-white rounded">
                      {item.role == ""}
                      <a
                        onClick={() =>
                          navigate(`detail/student/${item.std_ID}`)
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

          <div className="flex items-center justify-between mt-4">
            <div>
              <button
                onClick={() => {
                  if (currentPage > 0) {
                    setCurrentPage((prev) => prev - 1);
                    setVisibleStartPage((prev) => prev - 1);
                  }
                }}
                disabled={currentPage === 0}
                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                {"<"}
              </button>
              <button
                onClick={() => {
                  if (currentPage < lastPage) {
                    setCurrentPage((prev) => prev + 1);
                    if (currentPage >= visibleStartPage + 2) {
                      setVisibleStartPage((prev) => prev + 1);
                    }
                  }
                }}
                disabled={currentPage === lastPage}
                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                {">"}
              </button>
            </div>
            <div className="text-sm text-gray-500">
              หน้า {currentPage + 1} / {lastPage + 1}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductTable;
