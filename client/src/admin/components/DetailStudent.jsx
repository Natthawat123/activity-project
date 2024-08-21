import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi2.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function DetailStudent() {
  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [join, setJoin] = useState([]);
  const [activity, setActivity] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(40);
  const [currentPage, setCurrentPage] = useState(0);
  const [openRows, setOpenRows] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const role = localStorage.getItem("role");
  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setStudent(response.data[0]);
        setUpdatedStudent(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activitys`);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();
        setJoin(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
    fetchSmartContract();
    fetchActivity();
  }, [id]);
  console.log(student);

  const toggleRow = (actId) => {
    setOpenRows((prev) => ({ ...prev, [actId]: !prev[actId] }));
  };

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) =>
        Number(j.activityId) === activityID &&
        j.studentIds.some((studentId) => Number(studentId) === Number(id))
    );
    if (joinEntry) {
      return { message: "เข้าร่วมกิจกรรมแล้ว", color: "blue" };
    }
    const reserveEntry = activity.find(
      (r) => r.act_ID === activityID && r.login_ID === id
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

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: `คุณแน่ใจที่จะลบ ${student.fname} ${student.lname} ไหม?`,
        text: "คุณจะไม่สามารถกลับไปแก้ไขได้หากยืนยันที่จะลบ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ลบ",
      });

      if (result.isConfirmed) {
        let api;
        let user;

        if (student.role == "student") {
          api = `/api/students/${student.username}`;
          user = student.username;
        } else if (student.role == "teacher") {
          api = `/api/teachers/${student.login_ID}`;
          user = student.login_ID;
        }
        const news = {
          news_topic: `ลบผู้ใช้งาน `,
          news_desc: `ลบผู้ใช้งานโดย ${role}`,
          news_date: new Date(),
          user_ID: id,
        };
        await axios.post(`/api/new`, news);

        const response = await axios.delete(api);

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: `The ${student.role} has been deleted.`,
            icon: "success",
          });
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        } else {
          throw new Error("Delete operation failed");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the student.",
        icon: "error",
      });
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/api/students/${student.login_ID}`,
        updatedStudent
      );
      const news = {
        news_topic: `ประวัติส่วนตัวถูกแก้ไข `,
        news_desc: `ถูกแก้ไขโดย ${role}`,
        news_date: new Date(),
        user_ID: student.login_ID,
      };
      await axios.post(`/api/new`, news);
      if (response.status === 200) {
        Swal.fire({
          title: "Updated5555!",
          text: "The student's information has been updated.",
          icon: "success",
        });

        setStudent(updatedStudent);
        setEditMode(false);
      } else {
        throw new Error("Update operation failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the student.",
        icon: "error",
      });
    }
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

  const pageNumbers = [];
  for (let i = 0; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  const uniqueVisibleItems = Array.from(
    new Map(visibleItems.map((item) => [item.act_ID, item])).values()
  );

  const formatDateThai = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  return (
    <div>
      <div className="container mb-10 mx-auto md:px-20 pt-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold mb-2">ประวัติส่วนตัว</h1>
            <div
              className="items-center mb-5 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewIcon />
              ย้อนกลับ
            </div>
          </div>
          <hr className="mb-3" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200 text-md">
                <tr>
                  {student.role == "student" ? (
                    <>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        รหัสนักศึกษา
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="ID"
                            value={updatedStudent.ID}
                            onChange={handleInputChange}
                            readOnly
                          />
                        ) : (
                          student.ID
                        )}
                      </td>
                    </>
                  ) : null}

                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    ชื่อ-นามสกุล
                  </td>
                  <td className="px-6 py-3">
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          name="fname"
                          value={updatedStudent.fname}
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="lname"
                          value={updatedStudent.lname}
                          onChange={handleInputChange}
                        />
                      </>
                    ) : (
                      `${student.fname} ${student.lname}`
                    )}
                  </td>
                </tr>
                {student.role === "student" && (
                  <>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        หมู่เรียน
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="sec_name"
                            value={updatedStudent.sec_name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.sec_name
                        )}
                      </td>
                    </tr>
                  </>
                )}
                {student.role === "teacher" && (
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                      อาจารย์ประจำหมู่เรียน
                    </td>
                    <td className="px-6 py-3">
                      {editMode ? (
                        <input
                          type="text"
                          name="sec_name"
                          value={updatedStudent.sec_name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        student.sec_name
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    อีเมล
                  </td>
                  <td className="px-6 py-3">
                    {editMode ? (
                      <input
                        type="text"
                        name="email"
                        value={updatedStudent.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      student.email
                    )}
                  </td>

                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    เบอร์โทรศัพท์
                  </td>
                  <td className="px-6 py-3">
                    {editMode ? (
                      <input
                        type="text"
                        name="mobile"
                        value={updatedStudent.mobile}
                        onChange={handleInputChange}
                      />
                    ) : (
                      student.mobile
                    )}
                  </td>
                </tr>
                {student.role !== "admin" && (
                  <>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        ที่อยู่
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="address"
                            value={updatedStudent.address}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.address
                        )}
                      </td>

                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        จังหวัด
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="province"
                            value={updatedStudent.province}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.province
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        อำเภอ
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="district"
                            value={updatedStudent.district}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.district
                        )}
                      </td>

                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        ตำบล
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="subdistrict"
                            value={updatedStudent.subdistrict}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.subdistrict
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                        รหัสไปรษณีย์
                      </td>
                      <td className="px-6 py-3">
                        {editMode ? (
                          <input
                            type="text"
                            name="zipcode"
                            value={updatedStudent.zipcode}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.zipcode
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <button
              className="btn bg-red-600 px-6 py-4 text-white"
              onClick={handleDelete}
            >
              ลบผู้ใช้คนนี้
            </button>
            {/* {editMode ? (
              <button
                className="btn btn-primary px-6 py-4 mx-3 text-white"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="btn btn-primary px-6 py-4 mx-3 text-white"
                onClick={handleEditToggle}
              >
                Edit
              </button>
            )} */}
            <button
              className="btn btn-primary px-6 py-4 mx-3 text-white"
              onClick={() =>
                navigate(
                  `/admin/dashboard/user/update/${
                    student.role != "student"
                      ? student.login_ID
                      : student.username
                  }`
                )
              }
            >
              แก้ไขประวัติ
            </button>
          </div>
        </div>
      </div>

      {student.role == "student" ? (
        <>
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
                    <th className="px-4 py-3">อาจารย์ผู้จัดกิจกรรม</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3 w-2/12">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  {uniqueVisibleItems.map((item) => {
                    const status = getStatus(item.act_ID);
                    return (
                      <>
                        <tr
                          key={item.act_ID}
                          className="text-gray-700 dark:text-gray-400"
                        >
                          <td className="px-4 py-3">
                            {item.act_title} ({item.act_ID})
                          </td>
                          <td className="px-4 py-3">{item.act_location}</td>
                          <td className="px-4 py-3">
                            {item.staff_fname} {item.staff_lname}
                          </td>
                          <td
                            className="px-4 py-3"
                            style={{ color: status.color }}
                          >
                            {status.message}
                          </td>
                          {/* <td className="px-6 py-3">
                        <button
                          className="text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() =>
                            navigate(`/activity/detail2/${item.act_ID}`)
                          }
                        >
                          รายละเอียด
                        </button>
                      </td> */}
                          <td>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleRow(item.act_ID)}
                            >
                              {openRows[item.act_ID] ? (
                                <>
                                  <KeyboardArrowUpIcon />
                                </>
                              ) : (
                                <>
                                  <KeyboardArrowDownIcon />
                                </>
                              )}
                            </IconButton>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={openRows[item.act_ID]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  รายละเอียดเพิ่มเติม
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>รายละเอียด</TableCell>
                                      <TableCell>จำนวน</TableCell>
                                      <TableCell>วันที่เริ่ม</TableCell>
                                      <TableCell>วันที่สิ้นสุด</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        {item.act_desc}
                                      </TableCell>
                                      <TableCell>
                                        {item.act_numStdReserve}/
                                        {item.act_numStd} คน
                                      </TableCell>
                                      <TableCell>
                                        {formatDateThai(item.act_dateStart)}
                                      </TableCell>
                                      <TableCell>
                                        {formatDateThai(item.act_dateEnd)}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </td>
                        </tr>
                      </>
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
                      currentPage === 0
                        ? "cursor-not-allowed"
                        : "hover:bg-blue-200"
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
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, lastPage)
                      )
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
                    <option value={20}>10</option>
                    <option value={40}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DetailStudent;
