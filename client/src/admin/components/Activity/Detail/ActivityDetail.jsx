import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { formatDate } from "./Fx.jsx";
import { formatISO, parseISO } from "date-fns";

function ActivityDetail({ activity, teacher, act_ID, id }) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [editData, setEditData] = useState(activity);
  const [showButtons, setShowButtons] = useState(false);
  const [status, setStatus] = useState(activity.act_status);
  const navigate = useNavigate();

  const editButton = () => {
    setIsReadOnly(!isReadOnly);
    setShowButtons(!showButtons);
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
        const deleteNews = {
          news_topic: `แจ้งข่าวการลบกิจกรรม ${activity.act_title} `,
          news_desc: `จึงเรียนมาเพื่อทราบ`,
          news_date: new Date(),
          news_create: id,
          act_title: activity.act_title,
          news_type: "all",
        };
        await axios.delete(`/api/activitys/${act_ID}`);
        await axios.post("/api/news", deleteNews);
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

  const handleDateChange = (field, event) => {
    const newDate = event.target.value;
    handleInputChange(field, newDate);
  };

  const editActivity = async () => {
    try {
      await axios.put(`/api/activitys/${act_ID}`, editData);
      const newsData = {
        news_topic: `แจ้งข่าวการเปลี่ยนแปลงจาก ${activity.act_title} แก้ไขเป็น ${editData.act_title}`,
        news_desc: `แจ้งข่าวการเปลี่ยนแปลงจาก ${activity.act_desc} แก้ไขเป็น ${editData.act_desc}`,
        news_date: new Date(),
        news_create: id,
        act_title: editData.act_title,
        news_type: "all",
      };

      await axios.post("/api/news", newsData);
      Swal.fire("แกไขสำเร็จ", "แก้ไขข้อมูลกิจกรรมเรียบร้อย.", "success").then(
        async () => {
          setIsReadOnly(true);
          setShowButtons(false);
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating activity:", error);
      Swal.fire("Error!", "Failed to update activity.", "error");
    }
  };

  const startDateInput = editData.act_dateStart
    ? formatISO(parseISO(editData.act_dateStart), { representation: "date" })
    : "";

  const endDateInput = editData.act_dateEnd
    ? formatISO(parseISO(editData.act_dateEnd), { representation: "date" })
    : "";

  const url = `https://sepolia.etherscan.io/tx/${activity.act_transaction}`;

  return (
    <div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
            <Button
              onClick={editButton}
              variant="outlined"
              startIcon={<EditNoteIcon />}
              color="warning"
            >
              แก้ไข
            </Button>
          </div>

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
                <td className="px-6 py-4 font-medium text-gray-900">สถานที่</td>
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
                  {activity.act_numStdReserve} {" / "}
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
                    value={startDateInput}
                    readOnly={isReadOnly}
                    onChange={(e) => handleDateChange("act_dateStart", e)}
                  />
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  สิ้นสุดวันที่
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <input
                    type="date"
                    value={endDateInput}
                    readOnly={isReadOnly}
                    onChange={(e) => handleDateChange("act_dateEnd", e)}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">สถานะ</td>
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
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ตรวจสถานะการขึ้นบล้อกเชนจสอบ
                </td>
                <td className="px-6 py-4 text-gray-500 ">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    link
                  </a>
                </td>
              </tr>
              {showButtons && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-start items-center gap-3 mt-4">
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={deleteActivity}
                      >
                        ลบ
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={editActivity}
                      >
                        บันทึก
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetail;
