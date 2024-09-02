import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function Add_Activity({ closeModal }) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputNumStd, setInputNumStd] = useState(1);
  const [inputLocation, setInputLocation] = useState("");
  const [inputStartDate, setStartDate] = useState("");
  const [inputEndDate, setEndDate] = useState("");
  const [inputStaffID, setstaffID] = useState("");
  const [staffName, setStaffName] = useState([]);
  useEffect(() => {
    axios
      .get("/api/teachers")
      .then((response) => {
        setStaffName(response.data);
      })
      .catch((error) => {
        console.error("Error fetching staff list:", error);
      });
  }, []);

  const handleTitle = (event) => {
    setInputTitle(event.target.value);
  };
  const handleDesc = (event) => {
    setInputDesc(event.target.value);
  };
  const handleNumStd = (event) => {
    setInputNumStd(event.target.value);
  };
  const handleLocation = (event) => {
    setInputLocation(event.target.value);
  };
  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  };
  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  };

  const handleStaffID = (event) => {
    setstaffID(event.target.value);
  };

  const handleSubmit = async () => {
    const activity = {
      act_title: inputTitle,
      act_desc: inputDesc,
      act_dateStart: inputStartDate,
      act_dateEnd: inputEndDate,
      act_numStd: inputNumStd,
      act_location: inputLocation,
      t_ID: inputStaffID,
    };
    const news = {
      topic: `กิจกรรมใหม่ ${inputTitle}`,
      description: `${inputDesc} ระยะเวลา ${inputStartDate} - ${inputEndDate} สถานที่ ณ ${inputLocation} จำนวนที่เปิดรับ ${inputNumStd} คน`,
    };

    try {
      await axios.post("/api/notification", news);
      await axios.post("/api/activity", activity).then(() => {
        Swal.fire({
          title: "เพิ่มกิจกรรมใหม่สำเร็จ",
          icon: "success",
        });
        closeModal();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "เพิ่มกิจกรรมใหม่ไม่สำเร็จ",
        icon: "error",
      });
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-3 rounded-md">
      <div className="cursor-pointer justify-between flex" onClick={closeModal}>
        <div></div>
        <CloseIcon />
      </div>
      <h1 className="text-xl font-bold text-center mb-5">เพิ่มข้อมูลกิจกรรม</h1>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          ชื่อกิจกรรม:
        </label>
        <input
          type="text"
          value={inputTitle}
          onChange={handleTitle}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          รายละเอียดกิจกรรม:
        </label>
        <input
          type="text"
          value={inputDesc}
          onChange={handleDesc}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          จำนวน:
        </label>
        <input
          type="number"
          value={inputNumStd}
          onChange={handleNumStd}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          สถานที่:
        </label>
        <input
          type="text"
          value={inputLocation}
          onChange={handleLocation}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          เริ่มวันที่:
        </label>
        <input
          type="datetime-local"
          value={inputStartDate}
          onChange={handleStartDate}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          สิ้นสุดวันที่:
        </label>
        <input
          type="datetime-local"
          value={inputEndDate}
          onChange={handleEndDate}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        />
      </div>
      <div className="flex items-center">
        <label className="block mb-2 text-lg text-gray-600 w-1/4 text-left pb-2">
          ผู้จัดกิจกรรม:
        </label>
        <select
          value={inputStaffID}
          onChange={handleStaffID}
          className="border border-gray-300 rounded-md p-1 mb-4 w-3/4"
        >
          {staffName &&
            staffName.length > 0 &&
            staffName.map((item) => (
              <option key={item.t_ID} value={item.t_ID}>
                {item.t_fname} {item.t_lname}
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 ml-32 my-2 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      >
        เพิ่มข้อมูลกิจกรรม
      </button>
    </div>
  );
}

export default Add_Activity;
