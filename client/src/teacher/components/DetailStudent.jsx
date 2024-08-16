import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Swal from "sweetalert2";
import ListActivity from "./List.Activit";

function DetailStudent() {
  const [activity, setActivity] = useState([]);
  const [student, setStudent] = useState("");
  const [join, setJoin] = useState([]);
  const [reserve, setReserve] = useState([]);

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
        const response = await axios.get(`/api/students/${std_ID}`);
        setStudent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activitys`); // Assuming this API endpoint is correct
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

    fetchActivity();
    fetchStudent();
    fetchSmartContract();
  }, [std_ID]);

  const stdID = student.username;

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) => j.actID == activityID && j.stdIDs.includes(BigInt(stdID))
    );
    if (joinEntry) {
      return { message: "เข้าร่วมกิจกรรมแล้ว", color: "blue" };
    }
    const reserveEntry = activity.find(
      (r) => r.act_ID === activityID && r.login_ID === stdID
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

  const uniqueVisibleItems = Array.from(
    new Map(visibleItems.map((item) => [item.act_ID, item])).values()
  );

  return (
    <div className="container mx-auto md:px-20 pt-20 my-10">
      {/* resume */}
      <div className="container mb-10  mx-auto md:px-20">
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
            <h1>รหัสนักศึกษา: {student.username}</h1>
            <p>
              ชื่อ-นามสกุล: {student.std_fname} {student.std_lname}
            </p>
            <p>หมู่เรียน: {student.sec_name}</p>
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
      <ListActivity />
    </div>
  );
}

export default DetailStudent;
