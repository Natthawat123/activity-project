import React, { useEffect, useState, useContext } from "react";
import { ContextActivity } from "./ActivityContext";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Swal from "sweetalert2";
import axios from "axios";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { range } from "./Detail/Fx.jsx";

function ListReserveStudent({ act_ID }) {
  const [join, setJoin] = useState([]);
  const [data, setData] = useState({});
  const [day, setDay] = useState({});
  const { contract, activities, getActivityByID } = useContext(ContextActivity);
  const activity = activities;
  console.log(contract);

  useEffect(() => {
    const fetchSmartcontract = () => {
      try {
        const format = contract.map((item) => ({
          actID: item.activityId,
          students: item.studentIds.map((id, index) => ({
            studentId: id,
            dayJoin: item.dayJoin[index].map((date) => date.toString()),
          })),
        }));
        const joinData = format.find((joinEntry) => joinEntry.actID == act_ID);
        setJoin(joinData);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchActivity = () => {
      try {
        const activity = getActivityByID(act_ID);
        if (activity) {
          setData(activity);
          setDay(range(activity.act_dateStart, activity.act_dateEnd));
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();

    fetchSmartcontract();
  }, [contract, act_ID, getActivityByID]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState([]);

  const editCancelReserve = () => {
    setShowCheckBox(!showCheckBox);
  };

  const selectCancelReserveStudent = (checked, studentID, ids) => {
    setSelectCheckBox((prev) =>
      checked
        ? [...prev, { std_ID: studentID, act_ID, ids }]
        : prev.filter((item) => item.std_ID !== studentID)
    );
  };

  const dateS = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  const th = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    // สร้างวันที่ในรูปแบบไทย
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    return `${day} ${thaiMonths[parseInt(month, 10) - 1]} ${
      parseInt(year, 10) + 543
    }`;
  };

  const cancelReserveButton = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการยกเลิกการลงทะเบียนศึกษารายชื่อนี้หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
    });

    if (result.isConfirmed) {
      try {
        const studentIDs = selectCheckBox.map((student) => student.std_ID);
        await axios.post(`/api/new`, {
          news_topic: "ยกการลงทะเบียน",
          news_desc: `ยกการลงทะเบียนกิจกรรม ${activity.act_title}`,
          news_date: new Date(),
          user_ID: studentIDs,
        });

        for (const student of selectCheckBox) {
          await axios.delete(`/api/reserve`, { data: student });
        }

        await axios.put(`/api/cancelReserve`, {
          act_ID,
          cancelReserveNumStd: selectCheckBox.length,
        });

        Swal.fire("สำเร็จ!", "ยกเลิกการลงทะเบียนสำเร็จ", "success"),
          setTimeout(() => {
            window.location.reload();
          }, 1000);
      } catch (error) {
        console.error("Error canceling reservations:", error);
        Swal.fire("Error!", "Failed to cancel reservations.", "error");
      }
    }
  };

  const joinStudents = join.actID == BigInt(act_ID) ? join.students || [] : [];

  if (!activity[0]?.login_ID) {
    return (
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 mt-8">
        <h1 className="text-lg font-bold">ยังไม่มีนักศึกษาลงทะเบียนเข้าร่วม</h1>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 mt-8">
      <div className="flex gap-2 mb-4">
        <h1 className="text-lg font-bold">รายชื่อนักศึกษา</h1>
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
      <table className="text-center w-full m-auto text-sm rtl:text-center text-gray-500 dark:text-gray-400">
        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3 w-1/12">ลำดับ</th>
            <th className="px-6 py-3 w-2/12">รหัสนักศึกษา</th>
            <th className="px-6 py-3 w-2/12">ชื่อ-นามสกุล</th>
            {day.map((d, index) => (
              <th key={index} className="px-6 py-3 w-2/12">
                {th(dateS(d))}
              </th>
            ))}
            <th className="px-6 py-3 w-2/12">สถานะ</th>
            {showCheckBox && <th className="px-6 py-3 w-1/6">เลือก</th>}
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {activity.map((i, index) => {
            const daysJoined = joinStudents
              .filter((student) => student.studentId === BigInt(i.login_ID))
              .reduce((count, student) => {
                return count + student.dayJoin.filter((day) => day).length;
              }, 0);

            return (
              <tr key={i.login_ID}>
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{i.login_ID}</td>
                <td className="px-6 py-3">
                  {i.std_fname} {i.std_lname}
                </td>
                {day.map((d, dayIndex) => (
                  <td key={dayIndex} className="px-6 py-3">
                    {joinStudents.find(
                      (student) =>
                        student.studentId === BigInt(i.login_ID) &&
                        student.dayJoin.includes(dateS(d))
                    )
                      ? "✔"
                      : "✘"}
                  </td>
                ))}
                <td className="px-6 py-3">
                  {daysJoined > 0
                    ? `เข้าร่วม ${daysJoined} วัน`
                    : "ลงทะเบียนแล้ว"}
                </td>
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
                          i.login_ID,
                          i.ids
                        )
                      }
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
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
    </div>
  );
}

export default ListReserveStudent;
