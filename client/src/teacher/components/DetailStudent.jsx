import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function DetailStudent() {
  const [activity, setActivity] = useState([]);
  const [student, setStudent] = useState("");
  const [join, setJoin] = useState([]);
  const [reserve, setReserve] = useState([]);
  const [section, setSection] = useState([]);
  const [staff, setStaff] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(15);
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

  const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
  const visibleItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div>
      {/* resume */}
      <div className="container mb-10  mx-auto md:px-20 ">
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
                  className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for activity"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="pb-4 items-center">
              <label htmlFor="filter-activity-type" className="sr-only">
                Filter
              </label>
              <div className="relative mt-1">
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="block p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="default">ทั้งหมด</option>
                  <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                  <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                  <option value="notjoin">ยังไม่ได้เข้าร่วมกิจกรรม</option>
                </select>
              </div>
            </div>

            <div className="mt-1 pb-4">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(+e.target.value);
                  setCurrentPage(0);
                }}
                className="block ps-6 pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
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

          <div className="flex justify-between mt-4">
            <div>
              <button
                onClick={() => {
                  if (currentPage > 0) {
                    setCurrentPage((prev) => prev - 1);
                  }
                }}
                disabled={currentPage === 0}
                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                Previous
              </button>
            </div>

            <div className="flex space-x-2">
              {Array.from({
                length: Math.ceil(filteredItems.length / itemsPerPage),
              })
                .slice(currentPage, currentPage + 4)
                .map((_, i) => (
                  <button
                    key={i + currentPage}
                    onClick={() => setCurrentPage(currentPage + i)}
                    className={`px-4 py-2 font-medium ${
                      currentPage + i === currentPage
                        ? "text-blue-600 bg-blue-100"
                        : "text-gray-600 bg-gray-100"
                    } border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                  >
                    {currentPage + i + 1}
                  </button>
                ))}

              {currentPage + 4 < lastPage && (
                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 4);
                  }}
                  className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                  ...
                </button>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  if (currentPage < lastPage) {
                    setCurrentPage((prev) => prev + 1);
                  }
                }}
                disabled={currentPage >= lastPage}
                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailStudent;
