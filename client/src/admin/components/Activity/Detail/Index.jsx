import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Swal from "sweetalert2";

// mui components
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";

import EditNoteIcon from "@mui/icons-material/EditNote";

import Abi from "../../../../components/contract/abi2.json";

import ActivityDetail from "./ActivityDetail.jsx";
import {
  range,
  editCancelReserve,
  selectCancelReserveStudent,
  cancelReserveButton,
} from "./Fx.jsx";

function Index() {
  const [data, setData] = useState([]);
  const [join, setJoin] = useState([]);
  const [checkDay, setCheckDay] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState([]);
  const [teacher, setTeacher] = useState([]);

  const [activity, setActivity] = useState([]);

  const navigate = useNavigate();
  const { act_ID } = useParams();
  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        setData(res.data);
        setActivity(res.data[0]);
        setCheckDay(range(res.data[0].act_dateStart, res.data[0].act_dateEnd));
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
  const stdIDs =
    joinData && joinData.students.map((student) => student.studentId);

  const updatedData = data.map((item) => ({
    ...item,
    join:
      stdIDs && item.login_ID !== null && stdIDs.includes(BigInt(item.login_ID))
        ? "เข้าร่วมแล้ว"
        : "ละทะเบียนแล้ว",
  }));
  console.log(activity);

  if (data.length === 0) {
    return <p>Loading...</p>;
  }
  if (data.length > 0 && data[0].act_ID !== parseInt(act_ID)) {
    return <p>No activity found.</p>;
  }

  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <ActivityDetail activity={activity} teacher={teacher} act_ID={act_ID} />

        <div className="container m-10 mx-auto md:px-20">
          <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
            <div className="flex gap-2">
              <h1 className="text-lg font-bold mb-2">รายชื่อนักศึกษา</h1>
              <Button
                onClick={editCancelReserve}
                variant="outlined"
                startIcon={<EditNoteIcon />}
                color="warning"
              >
                ยกเลิกการจอง
              </Button>
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
                  {showCheckBox && <th className="px-6 py-3 w-1/6">เลือก</th>}
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
                      {showCheckBox && (
                        <td className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={selectCheckBox.some(
                              (item) => item.std_ID === i.login_ID
                            )}
                            onChange={(e) =>
                              selectCancelReserveStudent(
                                e.target.checked,
                                i.login_ID
                              )
                            }
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

              {showCheckBox && (
                <div className="flex justify-center items-center gap-3 mt-4">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    onClick={cancelReserveButton}
                  >
                    ลบ
                  </Button>
                </div>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
