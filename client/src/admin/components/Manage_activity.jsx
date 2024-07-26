import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const UpdateActivity = () => {
  const { act_ID } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getActivity = async () => {
      try {
        const res = await axios.get(`/api/activity/${act_ID}`);
        setActivity(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchStaff = async () => {
      try {
        const res = await axios.get("/api/list/staff");
        setStaff(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStaff();
    getActivity();
  }, [act_ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/activity/${act_ID}`, activity);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "แก้ไขสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/activity/${act_ID}`);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "ลบสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        navigate("/admin/activity/");
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto mb-10 md:px-20">
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold mb-2">แก้ไขกิจกรรม</h1>
          <div className="items-center mb-5" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon />
            ย้อนกลับ
          </div>
        </div>
        <hr className="mb-3" />
        <form onSubmit={handleSubmit}>
          <div className="w-1/2 ">
            <label>ชื่อกิจกรรม:</label>
            <input
              type="text"
              name="act_title"
              value={activity.act_title}
              className="mt-1 p-2 border w-full rounded-md "
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label>รายละเอียดกิจกรรม:</label>
              <input
                type="text"
                name="act_desc"
                value={activity.act_desc}
                className="mt-1 p-2 border w-full rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>สถานที่:</label>
              <input
                type="text"
                name="act_location"
                value={activity.act_location}
                className="mt-1 p-2 border w-full rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>เริ่มวันที่:</label>
              <input
                type="datetime-local"
                name="act_dateStart"
                value={activity.act_dateStart.replace("Z", "")}
                className="mt-1 p-2 border w-full rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>สิ้นสุดวันที่:</label>
              <input
                type="datetime-local"
                name="act_dateEnd"
                value={activity.act_dateEnd.replace("Z", "")}
                className="mt-1 p-2 border w-full rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>จำนวนที่เปิดรับ:</label>
              <input
                type="number"
                name="act_numStd"
                value={activity.act_numStd}
                className="mt-1 p-2 border w-full rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>สถานะ:</label>
              <select
                name="act_status"
                value={activity.act_status}
                onChange={handleChange}
                className="mt-1 p-2 border w-full rounded-md"
              >
                <option value="1">เปิดลงทะเบียน</option>
                <option value="2">กิจกรรมจบลงแล้ว</option>
                <option value="0">ปิดลงทะเบียน</option>
              </select>
            </div>
            <div>
              <label>ผู้จัด:</label>
              <select
                name="staff_ID"
                value={activity.staff_ID}
                onChange={handleChange}
                className="mt-1 p-2 border w-full rounded-md"
              >
                <option value="">Select Staff</option>
                {staff.length > 0 &&
                  staff.map((item) => (
                    <option key={item.staff_ID} value={item.staff_ID}>
                      {item.staff_fname} {item.staff_lname}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Update Activity
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Delete Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateActivity;
