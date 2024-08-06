import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Swal from "sweetalert2";

// mui components
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import Abi from "../../components/contract/abi2.json";

const formatDate = (dateString) => {
  const thaiMonthNames = [
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

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear() + 543; // Buddhist year
  return `${day} ${thaiMonthNames[date.getMonth()]} ${year}`;
};

const range = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
};

function DetailActivity() {
  const [data, setData] = useState([]);
  const [join, setJoin] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [editData, setEditData] = useState({});
  const [status, setStatus] = useState("");
  const [checkDay, setCheckDay] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState([]);

  const navigate = useNavigate();
  const { act_ID } = useParams();
  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        setData(res.data);
        setEditData({
          act_title: res.data[0].act_title,
          act_desc: res.data[0].act_desc,
          act_dateStart: res.data[0].act_dateStart.slice(0, 10),
          act_dateEnd: res.data[0].act_dateEnd.slice(0, 10),
          act_location: res.data[0].act_location,
          act_status: res.data[0].act_status,
          act_numStd: res.data[0].act_numStd,
          staff_ID: res.data[0].staff_ID,
        });
        setStatus(res.data[0].act_status);
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

  if (data.length === 0) {
    return <p>Loading...</p>;
  }
  if (data.length > 0 && data[0].act_ID !== parseInt(act_ID)) {
    return <p>No activity found.</p>;
  }

  const editButton = () => {
    setShowButtons(!showButtons);
    setIsReadOnly(!isReadOnly);
  };

  const deleteActivity = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/activitys/${act_ID}`);
        navigate(-1);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting activity:", error);
        Swal.fire("Error!", "Failed to delete activity.", "error");
      }
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setEditData((prev) => ({ ...prev, act_status: event.target.value }));
  };

  const handleTeacherChange = (event) => {
    setEditData((prev) => ({ ...prev, staff_ID: event.target.value }));
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const editActivity = async () => {
    try {
      await axios.put(`/api/activitys/${act_ID}`, editData);
      Swal.fire("Success!", "Activity updated successfully.", "success").then(
        () => {
          window.location.reload();
        }
      );
    } catch (error) {
      console.error("Error updating activity:", error);
      Swal.fire("Error!", "Failed to update activity.", "error");
    }
  };

  const editCancelReserve = () => {
    setShowCheckBox(!showCheckBox);
  };

  const selectCancelReserveStudent = (checked, studentID) => {
    setSelectCheckBox((prev) =>
      checked
        ? [...prev, { std_ID: studentID, act_ID }]
        : prev.filter((item) => item.std_ID !== studentID)
    );
  };

  const cancelReserveButton = async () => {
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
      try {
        for (const student of selectCheckBox) {
          await axios.delete(`/api/reserve`, { data: student });
        }

        await axios.put(`/api/cancelReserve`, {
          act_ID,
          cancelReserveNumStd: selectCheckBox.length,
        });

        Swal.fire(
          "Deleted!",
          "Reservations have been canceled.",
          "success"
        ).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error canceling reservations:", error);
        Swal.fire("Error!", "Failed to cancel reservations.", "error");
      }
    }
  };

  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
            <Button
              onClick={editButton}
              variant="outlined"
              startIcon={<EditNoteIcon />}
              color="warning"
            >
              แก้ไข
            </Button>
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
                {data.length > 0 ? (
                  <>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ชื่อกิจกรรม
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <input
                          type="text"
                          value={editData.act_title || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_title", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        รายละเอียด
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <input
                          type="text"
                          value={editData.act_desc || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_desc", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        สถานที่
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <input
                          type="text"
                          value={editData.act_location || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_location", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        จำนวนที่เปิดรับ
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {data[0].act_numStdReserve} {" / "}
                        <input
                          type="number"
                          value={editData.act_numStd || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_numStd", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        เริ่มวันที่
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <input
                          type="date"
                          value={editData.act_dateStart || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_dateStart", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        สิ้นสุดวันที่
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <input
                          type="date"
                          value={editData.act_dateEnd || ""}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            handleInputChange("act_dateEnd", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        สถานะ
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <select
                          value={status}
                          onChange={handleStatusChange}
                          disabled={isReadOnly}
                        >
                          <option value={1}>เปิดลงทะเบียน</option>
                          <option value={2}>กิจกรรมจบลงแล้ว</option>
                          <option value={0}>ปิดลงทะเบียน</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ผู้จัดกิจกรรม
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <select
                          value={editData.staff_ID}
                          onChange={handleTeacherChange}
                          disabled={isReadOnly}
                        >
                          {teacher.map((i) => (
                            <option key={i.login_ID} value={i.login_ID}>
                              {i.staff_fname + " " + i.staff_lname}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center px-6 py-4 text-gray-500"
                    >
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
                {showButtons && (
                  <div className="flex justify-center items-center gap-3 mt-4">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                      onClick={deleteActivity}
                    >
                      ลบ
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={editActivity}
                    >
                      บันทึก
                    </Button>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                      {formatDate(day)}
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

export default DetailActivity;
