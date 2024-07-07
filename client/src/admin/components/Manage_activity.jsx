// UpdateActivity.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'

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
  const navigate = useNavigate()

  useEffect(() => {
    const getActivity = async () => {
      try {
        await axios
          .get(`/api/activity/${act_ID}`)
          .then((res) => {
            setActivity(res.data[0]);
            setLoading(false);
          })
          .catch((err) => console.log(err));
      } catch (e) {
        console.log(e);
      }
    };

  
    getActivity();
  }, [act_ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/activity/${act_ID}`, activity)
      .then((res) => {
        console.log("Activity updated successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "แก้ไขสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        });
      setTimeout(() => {
          window.location.reload();
      }, 1500);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios
     .delete(`/api/activity/${act_ID}`)
     .then((res) => {
        console.log("Activity deleted successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "ลบสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        });
      setTimeout(() => {
          navigate('/admin/activity/')
      }, 1500);
      })
     .catch((err) => console.log(err));
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Update Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="act_title"
            value={activity.act_title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="act_desc"
            value={activity.act_desc}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="act_location"
            value={activity.act_location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            name="act_dateStart"
            value={activity.act_dateStart.replace("Z", "")}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="datetime-local"
            name="act_dateEnd"
            value={activity.act_dateEnd.replace("Z", "")}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Students:</label>
          <input
            type="number"
            name="act_numStd"
            value={activity.act_numStd}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="number"
            name="act_status"
            value={activity.act_status}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Staff ID:</label>
          <input
            type="text"
            name="staff_ID"
            value={activity.staff_ID}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Activity</button>
        <button onClick={handleDelete} type="button">Delete Activity</button>
        <h1 className='text-9xl mt-12'>ต้องการปลุ่มย้อนกลับ</h1>
      </form>
    </div>
  );
};

export default UpdateActivity;
