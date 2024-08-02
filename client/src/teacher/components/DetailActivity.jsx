import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Web3 from "web3";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Abi from "../../components/contract/abi.json";

function DetailActivity() {
  const [reserve, setReserve] = useState([]);
  const [join, setJoin] = useState([]);
  const [student, setStudent] = useState([]);
  const navigate = useNavigate();
  const [activity, setActivity] = useState({
    act_title: "",
    act_desc: "",
    act_location: "",
    act_dateStart: "",
    act_dateEnd: "",
    act_numStd: "",
    act_status: "",
    staff_ID: "",
  });
  const { act_ID } = useParams();

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activity/${act_ID}`);
        setActivity(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchReserve = async () => {
      try {
        const res = await axios.get(`/api/manage`);
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

    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/list/student`);
        setStudent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
    fetchSmartContract();
    fetchActivity();
    fetchReserve();
  }, [act_ID]);

  const joinedStudents =
    join.find((j) => j.actID == Number(act_ID))?.stdIDs || [];
  const reservedStudents = reserve
    .filter((r) => r.act_ID == act_ID)
    .map((r) => r.std_ID);

  const allStudents = [
    ...joinedStudents.map((stdID) => {
      const studentInfo = student.find((s) => s.std_ID === stdID.toString());
      return {
        stdID: stdID.toString(),
        status: "เข้าร่วม",
        name: studentInfo
          ? `${studentInfo.std_fname} ${studentInfo.std_lname}`
          : "",
      };
    }),
    ...reservedStudents.map((stdID) => ({ stdID, status: "ลงทะเบียนแล้ว" })),
  ];

  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
            <div className="items-center mb-5" onClick={() => navigate(-1)}>
              <ArrowBackIosNewIcon />
              ย้อนกลับ
            </div>
          </div>
          <hr className="mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <h1>title : {activity.act_title}</h1>
            <p>desc : {activity.act_desc}</p>
            <p>Location: {activity.act_location}</p>
            <p>Start Date: {activity.act_dateStart}</p>
            <p>End Date: {activity.act_dateEnd}</p>
            <p>Number of Students: {activity.act_numStd}</p>
            <p>Status: {activity.act_status}</p>
            <p>Staff ID: {activity.staff_ID}</p>
          </div>
        </div>
      </div>

      <div className="container m-10 mx-auto md:px-20 ">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <h1 className="text-lg font-bold mb-2">รายชื่อนักศึกษา</h1>
          <hr className="mb-3" />
          <table className="text-center w-3/4 m-auto text-sm rtl:text-center text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 w-1/6">ลำดับ</th>
                <th className="px-6 py-3 w-2/6">รหัสนักศึกษา</th>
                <th className="px-6 py-3 w-2/6">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3 w-2/6">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {allStudents.map((student, index) => (
                <tr key={index}>
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{student.stdID}</td>
                  <td className="px-6 py-3">{student.name}</td>
                  <td className="px-6 py-3">
                    <span
                      style={{
                        color:
                          student.status === "เข้าร่วม" ? "#4CAF50" : "#FFC107",
                      }}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DetailActivity;
