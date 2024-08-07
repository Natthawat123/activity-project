import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";

import Abi from "../../components/contract/abi2.json";

// Helper function to format dates in Thai
const formatDateThai = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", options);
};

function DetailActivity() {
  const [data, setData] = useState(null);
  const [join, setJoin] = useState([]);
  const [checkDay, setCheckDay] = useState([]);
  const navigate = useNavigate();
  const { act_ID } = useParams();
  const [activity, setActivity] = useState(null);
  const [status, setStatus] = useState("");
  const [teacher, setTeacher] = useState([]);

  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  const range = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split("T")[0]);
    }

    return days;
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        const activityData = res.data[0];
        setData(res.data);
        setActivity(activityData);
        setStatus(activityData?.act_status || "");
        setCheckDay(range(activityData.act_dateStart, activityData.act_dateEnd));
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();

        const format = res.map((item) => ({
          actID: item.activityId,
          students: item.studentIds.map((id, index) => ({
            studentId: id,
            dayJoin: item.dayJoin[index].map((date) => date.toString()),
          })),
        }));

        setJoin(format);
      } catch (err) {
        console.error("Error fetching smart contract:", err);
      }
    };

    fetchTeacher();
    fetchActivity();
    fetchSmartContract();
  }, [act_ID]);

  const joinData = join.find((joinEntry) => joinEntry.actID == act_ID);
  const stdIDs = joinData?.students.map((student) => student.studentId) || [];

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setActivity((prev) => ({ ...prev, act_status: event.target.value }));
  };

  const updatedData = data?.map((item) => ({
    ...item,
    join:
      stdIDs.length && item.login_ID !== null && stdIDs.includes(BigInt(item.login_ID))
        ? "เข้าร่วมแล้ว"
        : "ละทะเบียนแล้ว",
  })) || [];

  if (!data) {
    return <p>Loading...</p>;
  }

  const url = `https://sepolia.etherscan.io/tx/${data[0].act_transaction}#eventlog`;

  // Find the teacher responsible for the activity
  const responsibleTeacher = teacher.find((t) => t.login_ID == activity?.staff_ID);
  const staffName = responsibleTeacher ? `${responsibleTeacher.staff_fname} ${responsibleTeacher.staff_lname}` : '';

  return (
    <div className="container m-10 mx-auto md:px-20 pt-20">
      {/* Activity Detail */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
          <div
            className="items-center mb-5 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon /> ย้อนกลับ
          </div>
        </div>
        <hr className="mb-3" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200 text-md">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ชื่อกิจกรรม
                </td>
                <td className="px-6 py-4 text-gray-500">{activity?.act_title}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  รายละเอียด
                </td>
                <td className="px-6 py-4 text-gray-500">{activity?.act_desc}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">สถานที่</td>
                <td className="px-6 py-4 text-gray-500">{activity?.act_location}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  จำนวนที่เปิดรับ
                </td>
                <td className="px-6 py-4 text-gray-500">{activity?.act_numStd}/{activity?.act_numStdReserve}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  เริ่มวันที่
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDateThai(activity?.act_dateStart)}</td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  สิ้นสุดวันที่
                </td>
                <td className="px-6 py-4 text-gray-500">{formatDateThai(activity?.act_dateEnd)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">สถานะ</td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_status == 2 ? 'กิจกรรมจบลงแล้ว' 
                  :activity?.act_status == 1 ? 'เปิดให้ลงทะเบียน'
                  : 'ปิดลงทะเบียน'}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ผู้จัดกิจกรรม
                </td>
                <td className="px-6 py-4 text-gray-500">{staffName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail */}
      <div className="container m-10 mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex gap-2">
            <h1 className="text-lg font-bold mb-2">รายชื่อนักศึกษา</h1>
          </div>
          <hr className="mb-3" />
          <table className="text-center w-3/4 m-auto text-sm rtl:text-center text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 w-1/6">ลำดับ</th>
                <th className="px-6 py-3 w-2/6">รหัสนักศึกษา</th>
                <th className="px-6 py-3 w-2/6">ชื่อ-นามสกุล</th>
                {checkDay.map((day, index) => (
                  <th className="px-6 py-3 w-2/6" key={index}>
                    {day}
                  </th>
                ))}
                <th className="px-6 py-3 w-2/6">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {updatedData.map((i, index) => {
                const studentData = joinData?.students.find(
                  (student) => student.studentId === BigInt(i.login_ID)
                );
                return (
                  <tr key={i.act_ID}>
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{i.login_ID}</td>
                    <td className="px-6 py-3">
                      {i.std_fname} {i.std_lname}
                    </td>
                    {checkDay.map((day, dayIndex) => (
                      <td className="px-6 py-3" key={dayIndex}>
                        {studentData && studentData.dayJoin.includes(day)
                          ? "✓"
                          : "✗"}
                      </td>
                    ))}
                    <td className="px-6 py-3">{i.join}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DetailActivity;
