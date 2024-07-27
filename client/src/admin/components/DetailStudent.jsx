import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";

function DetailStudent() {
  const [activity, setActivity] = useState([]);
  const [student, setStudent] = useState("");
  const [join, setJoin] = useState([]);
  const [reserve, setReserve] = useState([]);
  const [section, setSection] = useState([]);
  const [staff, setStaff] = useState([]);
  // const [login, setLogin] = useState([]);

  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const { std_ID } = useParams();
  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/resume/student?id=${std_ID}`);
        setStudent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activity`); // Assuming this API endpoint is correct
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchManage = async () => {
      try {
        const res = await axios.get("/api/manage");
        setReserve(res.data);
      } catch (err) {
        console.error(err);
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

    const fetchSection = async () => {
      try {
        const response = await axios.get(`/api/list/section`);
        setSection(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await axios.get(`/api/list/staff`);
        setStaff(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivity();
    fetchStudent();
    fetchSmartContract();
    fetchManage();
    fetchSection();
    fetchStaff();
  }, [std_ID]);
  const sectionName = section.find((s) => s.sec_ID == student.sec_ID);

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) => j.actID == activityID && j.stdIDs.includes(BigInt(std_ID))
    );
    if (joinEntry) {
      return "เข้าร่วมกิจกรรมแล้ว";
    }
    const reserveEntry = reserve.find(
      (r) => r.act_ID == activityID && r.std_ID == std_ID
    );
    if (reserveEntry) {
      return "ลงทะเบียนสำเร็จ";
    }
    return "ยังไม่ได้เข้าร่วมกิจกรรม";
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  const filteredItems = activity.filter((item) => {
    const status = getStatus(item.act_ID);
    return (
      item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "default" ||
        (filter === "joinEntry" && status === "เข้าร่วมกิจกรรมแล้ว") ||
        (filter === "reserveEntry" && status === "ลงทะเบียนสำเร็จ") ||
        (filter === "notjoin" && status === "ยังไม่ได้เข้าร่วมกิจกรรม"))
    );
  });

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
  };


  const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
  const visibleItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageNumbers = [];
  for (let i = 0; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

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
      <div className="container mb-10  mx-auto md:px-20 pt-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold mb-2">ประวัติส่วนตัว</h1>
            <div className="items-center mb-5" onClick={() => navigate(-1)}>
              <ArrowBackIosNewIcon />
              ย้อนกลับ
            </div>
          </div>
          <hr className="mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <h1>รหัสนักศึกษา: {student.std_ID}</h1>
            <p>
              ชื่อ-นามสกุล: {student.std_fname} {student.std_lname}
            </p>
            <p>
              หมู่เรียน:
              {sectionName ? `${sectionName.sec_name}` : "Not found"}
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
          </div>
        </div>
      </div>

      {/* activity */}
      <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="text-lg font-bold mb-2">ประวัติการทำกิจกรรม</div>
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
                  className="block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    className="text-xs block p-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="default" className="text-center">กิจกรรมทั้งหมด</option>
                    <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                    <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                    <option value="notjoin">ยังไม่ได้ลงทะเบียน</option>
                  </select>
                </div>
              </div>
              <div className="flex pb-4 items-center">
                <button
                  onClick={handleSortChange}
                  className="block p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  วันที่ ({sortOrder === "latest" ? "ใหม่สุด" : "เก่าสุด"})
                </button>
              </div>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
              <tr className="flex w-full">
                <th scope="col" className="text-center px-6 py-3 w-1/12">
                  ลำดับ
                </th>
                <th scope="col" className="text-center px-6 py-3 w-3/12">
                  ชื่อกิจกรรม
                </th>

                <th scope="col" className="text-center px-6 py-3 w-3/12">
                  วันที่จัดกิจกรรม
                </th>
                <th scope="col" className="text-center px-6 py-3 w-3/12">
                  สถานะการเข้าร่วม
                </th>
                <th scope="col" className="text-center px-6 py-3 w-2/12">
                  รายละเอียด
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
              {visibleItems.map((item, index) => (
                <tr key={item.act_ID} className="border-b-2 flex w-full">
                  <td className="text-center px-6 py-3 w-1/12">{index + 1}</td>
                  <td className="text-start px-6 py-3 w-3/12">
                    {item.act_title}
                  </td>

                  <td className="text-center px-6 py-3 w-3/12">
                    {item.act_dateStart.slice(0, 10)} -{" "}
                    {item.act_dateEnd.slice(0, 10)}
                  </td>
                  <td
                    className={`text-center px-6 py-3 w-3/12 ${
                      getStatus(item.act_ID) === "เข้าร่วมกิจกรรมแล้ว"
                        ? "text-green-500"
                        : getStatus(item.act_ID) === "ยังไม่ได้เข้าร่วมกิจกรรม"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {getStatus(item.act_ID)}
                  </td>
                  <td className="text-center px-6 py-3 w-2/12">
                    <button
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() =>
                        navigate(`/activity/detail/${item.act_ID}`)
                      }
                    >
                      รายละเอียด
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
    </div>
  );
}

export default DetailStudent;
