import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { formatISO, parseISO } from "date-fns";
import { ContextActivity } from "./ActivityContext.jsx";

function DetailActivity({ act_ID }) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [editData, setEditData] = useState({});
  const { getActivityByID, teacher } = useContext(ContextActivity);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = () => {
      try {
        const activity = getActivityByID(act_ID);
        if (activity) {
          setEditData(activity);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [act_ID, getActivityByID]);

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
          news_topic: `กิจกรรม ${activity.act_title} `,
          news_desc: `ลบกิจกรรม ${activity.act_title} `,
          news_date: new Date(),
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
    setEditData((prev) => ({ ...prev, act_status: event.target.value }));
  };

  const handleTeacherChange = (event) => {
    setEditData((prev) => ({ ...prev, t_ID: event.target.value }));
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, event) => {
    const newDate = event.target.value;
    setEditData((prev) => ({
      ...prev,
      [field]: formatISO(parseISO(newDate), { representation: "date" }),
    }));
  };

  const editActivity = async () => {
    try {
      const updatedData = {
        ...editData,
        act_dateStart: formatISO(parseISO(editData.act_dateStart), {
          representation: "date",
        }),
        act_dateEnd: formatISO(parseISO(editData.act_dateEnd), {
          representation: "date",
        }),
      };

      await axios.put(`/api/activity/${act_ID}`, updatedData);

      Swal.fire("แก้ไขสำเร็จ", "แก้ไขข้อมูลกิจกรรมเรียบร้อย.", "success").then(
        () => {
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
    ? new Date(editData.act_dateStart).toISOString().split("T")[0] // YYYY-MM-DD
    : "";

  const endDateInput = editData.act_dateEnd
    ? new Date(editData.act_dateEnd).toISOString().split("T")[0] // YYYY-MM-DD
    : "";

  const url = editData?.act_transaction
    ? `https://sepolia.etherscan.io/tx/${activity.act_transaction}`
    : "#";

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
                <td className="px-6 py-4 text-gray-500">000</td>
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
                    <option value={"เปิดลงทะเบียน"}>เปิดลงทะเบียน</option>
                    <option value={"กิจกรรมจบลงแล้ว"}>กิจกรรมจบลงแล้ว</option>
                    <option value={"ปิดลงทะเบียน"}>ปิดลงทะเบียน</option>
                  </select>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ผู้จัดกิจกรรม
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <select
                    value={editData.t_ID}
                    onChange={handleTeacherChange}
                    disabled={isReadOnly}
                  >
                    {teacher.map((i) => (
                      <option key={i.t_ID} value={i.t_ID}>
                        {i.t_fname + " " + i.t_lname}
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
                    {editData?.act_transaction ? "ขึ้นแล้ว" : "ยังไม่ขึ้น"}
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

export default DetailActivity;
