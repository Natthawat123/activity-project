import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ListActivity from "./List.Activit";

function DetailStudent() {
  const [student, setStudent] = useState("");
  const navigate = useNavigate();
  const { std_ID } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${std_ID}`);
        setStudent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
  }, [std_ID]);

  return (
    <div className="container mx-auto md:px-20 pt-20 my-10">
      {/* resume */}
      <div className="container mb-10  mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold mb-2">ประวัติส่วนตัว</h1>
            <div className="items-center mb-5" onClick={() => navigate(-1)}>
              <ArrowBackIosNewIcon />
              ย้อนกลับ
            </div>
          </div>
          <hr className="mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <h1>รหัสนักศึกษา: {student.std_ID}</h1>
            <p>
              ชื่อ-นามสกุล: {student.std_fname} {student.std_lname}
            </p>
            <p>หมู่เรียน: {student.sec_name}</p>
            <p>Email: {student.std_email}</p>
            <p>เบอร์โทรศัพท์: {student.std_mobile}</p>
            <p>ที่อยู่: {student.std_address}</p>
            <p>จังหวัด: {student.province}</p>
            <p>อำเภอ: {student.district}</p>
            <p>ตำบล: {student.subdistrict}</p>
            <p>รหัสไปรษณีย์: {student.zipcode}</p>
          </div>
        </div>
      </div>

      {/* activity */}
      <ListActivity />
    </div>
  );
}

export default DetailStudent;
