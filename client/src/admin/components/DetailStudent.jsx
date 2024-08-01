import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";

function DetailStudent() {
  const [student, setStudent] = useState([]); // Initialize as an empty array
  const [join, setJoin] = useState([]);
  const [activity, setActivity] = useState([]);

  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams();
  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
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
        const res = await contract.methods.getAll().call();

        const format = res[0].map((actID, index) => ({
          actID: Number(actID),
          stdIDs: res[1][index],
        }));

        setJoin(format);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
    fetchSmartContract();
    fetchActivity();
  }, [id]);

  const isStudentJoined = (actID) => {
    return join.some((j) => j.actID == actID && j.stdIDs.includes(BigInt(id)));
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/api/student/${student.login_ID}`);

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "The student has been deleted.",
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

  return (
    <div>
      {/* resume */}
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
          <div className="grid grid-cols-2 gap-4">
            <h1>รหัสนักศึกษา: {student.username}</h1>
            <p>
              ชื่อ-นามสกุล: {student.std_fname} {student.std_lname}
            </p>
            <p>
              หมู่เรียน:
              {student.sec_name}
            </p>
            <p>Email: {student.std_email}</p>
            <p>เบอร์โทรศัพท์: {student.std_mobile}</p>
            <p>ที่อยู่: {student.std_address}</p>
            <p>จังหวัด: {student.province}</p>
            <p>อำเภอ: {student.district}</p>
            <p>ตำบล: {student.subdistrict}</p>
            <p>รหัสไปรษณีย์: {student.zipcode}</p>
          </div>
          <div className="mt-5">
            <button
              className="btn btn-warning px-6 py-4 text-white"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="btn btn-primary px-6 py-4 mx-3 text-white"
              onClick={() =>
                navigate(
                  `/admin/dashboard/detail/student/update/${student.std_ID}`
                )
              }
            >
              แก้ไขประวัติ
            </button>
          </div>
        </div>
      </div>

      {/* activity */}
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
                  className="block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSortChange}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {sortOrder === "latest" ? "Sort by Oldest" : "Sort by Latest"}
              </button>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="default">All</option>
                <option value="joinEntry">Joined</option>
                <option value="reserveEntry">Reserved</option>
                <option value="notjoin">Not Joined</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Activity ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activity.map((i, index) => {
                  const isJoined = isStudentJoined(i.act_ID);
                  return (
                    <tr key={index}>
                      <td>{i.act_ID}</td>
                      <td>{i.act_title}</td>
                      <td>{isJoined ? "เข้าร่วม" : "ไม่เข้าร่วม"}</td>
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
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Page
            </span>
            <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailStudent;
