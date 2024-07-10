import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

import Papa from 'papaparse';

const Add_Users = ({ closeModal }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [activeTab, setActiveTab] = useState("single");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
      role: data.get("role"),
    };

    try {
      // Insert into login table
      const loginResponse = await axios.post("/api/auth/register", jsonData);
      const loginData = loginResponse.data;
      console.log("Login response:", loginData);

      if (loginData.status !== "ok" || !loginData.login_ID) {
        throw new Error("Failed to register user");
      }

      const loginID = loginData.login_ID;

      if (jsonData.role === "student") {
        const additionalData = {
          std_ID: data.get("username"),
          login_ID: loginID,
          std_fname: data.get("firstName") || "กรุณาเปลี่ยนชื่อของคุณ",
          std_lname: data.get("lastName") || "กรุณาเปลี่ยนนามสกุลของคุณ",
          sec_ID: 1,
          std_email: `${data.get("username")}@webmail.npru.ac.th`,
          std_mobile: null,
          std_address: null,
          province: null,
          district: null,
          subdistrict: null,
          zipcode: null,
        };

        // Insert into student or teacher table
        const additionalResponse = await axios.post("/api/create/student", additionalData);
        const additionalDataResponse = additionalResponse.data;
        console.log("Additional response:", additionalDataResponse);

        if (additionalDataResponse.status !== "ok") {
          throw new Error(`Failed to create ${jsonData.role}`);
        }
      } else if (jsonData.role === 'teacher') {
        const additionalData = {
          staff_ID: data.get("username"),
          login_ID: loginID,
          staff_fname: data.get("firstName") || "กรุณาเปลี่ยนชื่อของคุณ",
          staff_lname: data.get("lastName") || "กรุณาเปลี่ยนนามสกุลของคุณ",
          staff_email: `${data.get("username")}@webmail.npru.ac.th`,
          staff_mobile: null,
          staff_address: null,
          province: null,
          district: null,
          subdistrict: null,
          zipcode: null,
        };

        const additionalResponse = await axios.post("/api/create/staff", additionalData);
        const additionalDataResponse = additionalResponse.data;
        console.log("Additional response:", additionalDataResponse);

        if (additionalDataResponse.status !== "ok") {
          throw new Error(`Failed to create ${jsonData.role}`);
        }
      }

      Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้สำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });

      closeModal();
      setTimeout(() => {
        window.location.reload(); // รีเฟรชหน้าจอ
      }, 2000); // ล่าช้าการรีเฟรชให้เกิดชั่วโมง 2 วินาที
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.response.data.message || "Something went wrong",
        });
        closeModal();
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error request:", error.request);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "No response from server",
        });
        closeModal();
      } else {
        console.error("Error message:", error.message);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.message,
        });
        closeModal();
      }
    }
  };

  const UploadFile = ({onFileLoad}) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
  
      if (file) {
        Papa.parse(file, {
          complete: (result) => {
            onFileLoad(result.data);
          },
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
      }
    };

    return (
      <>
        <input type="file" onChange={handleFileChange} />
      </>
    );
  };


  const handleFileLoad = async (csvData) => {
    try {
        console.log('CSV Data:', csvData);

        // Transform CSV data into desired JSON format
        const jsonData = csvData.map(item => ({
            username: item.username,
            password: `${item.password}`,
            role: item.role,
        }));

        console.log('JSON Data:', jsonData);

        // Send JSON data to backend for registration
        const registerResponse = await axios.post('/api/auth/arrayregister', jsonData);
        const registerData = registerResponse.data;
        console.log('Register response:', registerData);

        if (registerData.some(response => response.status !== 'ok')) {
            throw new Error('Failed to register some users');
        }

        // Success message using SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'เพิ่มผู้ใช้สำเร็จ!',
            showConfirmButton: false,
            timer: 1500,
        });

        closeModal();
        setTimeout(() => {
            window.location.reload(); // Refresh the screen
        }, 2000);
    } catch (error) {
        console.error('Error:', error);

        // Error handling using SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: error.message || 'Something went wrong',
        });
        closeModal();
    }
};
  



  // console.log(csvTojsondata);



  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg">
      <div className="p-8 rounded shadow-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">เพิ่มผู้ใช้</h2>
          <CloseIcon className="cursor-pointer" onClick={closeModal} />
        </div>
        <div className="flex mb-6">
          <button
            className={`p-2 w-1/2 ${activeTab === "single" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => handleTabChange("single")}
          >
            เพิ่มผู้ใช้เดียว
          </button>
          <button
            className={`p-2 w-1/2 ${activeTab === "bulk" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            onClick={() => handleTabChange("bulk")}
          >
            อัปโหลด CSV
          </button>
        </div>
        {activeTab === "single" ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 p-1 w-full border-b-2 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 p-1 w-full border-b-2 rounded-md"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 p-1 w-full border-b-2 rounded-md"
                onChange={handleRoleChange}
              >
                <option value="">Select a Role</option>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>
            </div>
            {selectedRole === "student" || selectedRole === "teacher" ? (
              <>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
              </>
            ) : null}
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="w-fit p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-300"
              >
                เพิ่มข้อมูล
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center">
            <label htmlFor="csvFile" className="block text-sm font-medium text-gray-600 mb-4">
              อัปโหลดไฟล์ CSV
            </label>
            < UploadFile onFileLoad={handleFileLoad}/>
          </div>
        )}
      </div>
    </div>
  );
};

Add_Users.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default Add_Users;
