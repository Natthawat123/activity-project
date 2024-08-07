import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi2.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";

function DetailStudent() {
  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [join, setJoin] = useState([]);
  const [activity, setActivity] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
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
        const api =
          student.role === "student"
            ? `/api/students/${student.username}`
            : `/api/teachers/${student.login_ID}`;

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Filter and paginate activities
  const filteredActivities = activity
    .filter((act) =>
      act.act_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
                  {student.role === "student" && (
                    <>
                      <td className="px-6 py-3 font-medium text-gray-900">
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
                  )}
                  <td className="px-6 py-3 font-medium text-gray-900">
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
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
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
                )}
                {student.role === "teacher" && (
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
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
                  <td className="px-6 py-3 font-medium text-gray-900">อีเมล</td>
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
                  <td className="px-6 py-3 font-medium text-gray-900">
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
                      <td className="px-6 py-3 font-medium text-gray-900">
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
                      <td className="px-6 py-3 font-medium text-gray-900">
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
                      <td className="px-6 py-3 font-medium text-gray-900">
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
                      <td className="px-6 py-3 font-medium text-gray-900">
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
                      <td className="px-6 py-3 font-medium text-gray-900">
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
            <button
              className="btn btn-primary px-6 py-4 mx-3 text-white"
              onClick={() =>
                navigate(
                  `/admin/dashboard/user/update/${
                    student.role !== "student"
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

      <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="text-lg font-bold mb-2">ประวัติการทำกิจกรรม</div>
          <div className="flex justify-between">
            <div className="pb-4 items-center">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="table-search"
                  className="block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSortChange}
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                Sort
              </button>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-300"
              >
                <option value="default">ทั้งหมด</option>
                <option value="joinEntry">เข้าร่วม</option>
                <option value="reserveEntry">ลงทะเบียนแล้ว</option>
                <option value="notjoin">Not Joined</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ลำดับ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    กิจกรรม
                  </th>
                  <th scope="col" className="px-6 py-3">
                    ระยะเวลา
                  </th>
                  <th scope="col" className="px-6 py-3">
                    สถานะการเข้าร่วม
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity.map((i, index) => {
                  // Check if the student has joined or reserved the activity
                  const isRegistered = join.includes(i.act_ID); // This checks if the activity ID is in the join array

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {i.act_title} {`(${i.act_ID})`}
                      </td>
                      <td>
                        {i.act_dateStart.slice(0, 10)} -{" "}
                        {i.act_dateEnd.slice(0, 10)}
                      </td>
                      <td>
                        {isRegistered
                          ? "You have registered for this activity"
                          : "Not registered"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
              }
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailStudent;
