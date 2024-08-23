import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Papa from "papaparse";

const Add_Users = ({ closeModal }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [activeTab, setActiveTab] = useState("single");
  const [title, setTitle] = useState("");
  const [section, setSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSection, setNewSection] = useState("");

  useEffect(() => {
    axios
      .get("/api/sections")
      .then((response) => {
        setSection(response.data);
        if (response.data.length > 0) {
          setSelectedSection(response.data[0].sec_ID);
        }
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSectionChange = (event) => {
    const value = event.target.value;
    if (value === "add-new") {
      setIsAddingNew(true);
    } else {
      setIsAddingNew(false);
      setSelectedSection(value);
    }
  };

  const handleNewSectionChange = (event) => {
    setNewSection(event.target.value);
  };

  // const handleAddNewSection = () => {
  //   if (newSection.trim() === '') {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Invalid Input",
  //       text: "Section name cannot be empty",
  //     });
  //     return;
  //   }

  //   const newSectionObj = { sec_ID: Date.now().toString(), sec_name: newSection };
  //   setSection([...section, newSectionObj]);
  //   setSelectedSection(newSectionObj.sec_ID);
  //   setIsAddingNew(false);
  //   setNewSection('');
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const jsonData = {
      username: username,
      password: data.get("password"),
      role: data.get("role"),
      fname: title + data.get("firstName") || "กรุณเปลี่ยนชื่อของท่าน",
      lname: data.get("lastName") || "กรุณาเปลี่ยนนามสกุลของท่าน",
      email: data.get("email") || `${username}@webmail.npru.ac.th`,
      mobile: data.get("phoneNumber"),
      sec_ID: data.get("newSection") ? null : selectedSection,
      sec_name: data.get("newSection")
    };

    console.log("jsonData:", jsonData);

    try {
      const loginResponse = await axios.post("/api/auth/register", jsonData);
      const loginData = loginResponse.data;
      console.log("Login response:", loginData);

      if (loginData.status !== "ok") {
        throw new Error("Failed to register user");
      }

      Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้สำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });

      closeModal();
      setTimeout(() => {
        window.location.reload(); // Refresh the screen
      }, 2000); // Delay the refresh by 2 seconds
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

  const renderTitleOptions = () => {
    if (selectedRole === "student") {
      return (
        <select
          id="title"
          name="title"
          className="mt-1 p-1 w-full border-b-2 rounded-md"
          onChange={handleTitleChange}
        >
          <option value="">เลือกคำนำหน้า</option>
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="น.ส.">น.ส.</option>
        </select>
      );
    } else if (selectedRole === "teacher") {
      return (
        <select
          id="title"
          name="title"
          className="mt-1 p-1 w-full border-b-2 rounded-md"
          onChange={handleTitleChange}
        >
          <option value="">เลือกคำนำหน้า</option>
          <option value="อ.">อ.</option>
          <option value="ดร.">ดร.</option>
          <option value="รศ. ดร.">รศ.ดร.</option>
          <option value="ผศ. ดร.">ผศ.ดร.</option>
        </select>
      );
    }
    return (
      <select
        id="title"
        name="title"
        className="mt-1 p-1 w-full border-b-2 rounded-md"
        disabled
      >
        <option value="" disabled>
          เลือกคำนำหน้า
        </option>
      </select>
    );
  };

  const UploadFile = ({ onFileLoad }) => {
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
      <input
        type="file"
        onChange={handleFileChange}
        className="mt-1 p-1 w-full border-b-2 rounded-md"
        accept=".csv"
      />
    );
  };

  const handleFileLoad = async (csvData) => {
    try {
      const jsonData = csvData.map((item) => ({
        username: item.username,
        password: `${item.password}`,
        role: item.role,
        fname: item.fname,
        lname: item.lname,
        email: item.email || `${item.username}@webmail.npru.ac.th`,
        mobile: item.mobile,
        sec_ID: item.section,
      }));

      const registerResponse = await axios.post(
        "/api/auth/arrayregister",
        jsonData
      );
      const registerData = registerResponse.data;

      if (registerData.some((response) => response.status !== "ok")) {
        throw new Error("Failed to register some users");
      }

      Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ใช้สำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });

      closeModal();
      setTimeout(() => {
        window.location.reload(); // Refresh the screen
      }, 2000);
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: error.message || "Something went wrong",
      });
      closeModal();
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg">
      <div className="p-8 rounded w-full shadow-md h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">เพิ่มผู้ใช้</h2>
          <CloseIcon className="cursor-pointer" onClick={closeModal} />
        </div>
        <div className="flex mb-6">
          <button
            className={`p-2 w-1/2 ${
              activeTab === "single"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabChange("single")}
          >
            เพิ่มผู้ใช้งานคนเดียว
          </button>
          <button
            className={`p-2 w-1/2 ${
              activeTab === "bulk" ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleTabChange("bulk")}
          >
            เพิ่มผู้ใช้งานหลายคน โดยอัปโหลด CSV
          </button>
        </div>
        {activeTab === "single" ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-2">
            <div className="mb-4 col-span-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 p-1 w-full border-b-2 rounded-md"
              />
            </div>
            <div className="mb-4 col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 p-1 w-full border-b-2 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-600"
              >
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
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-600"
                  >
                    คำนำหน้า
                  </label>
                  {renderTitleOptions()}
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
                <div className="mb-4 col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="mt-1 p-1 w-full border-b-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="section"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Section
                  </label>
                  {isAddingNew ? (
                    <div>
                      <input
                        id="newSection"
                        name="newSection"
                        type="text"
                        value={newSection}
                        onChange={handleNewSectionChange}
                        placeholder="New Section Name"
                        className="mt-1 p-1 w-full border-b-2 rounded-md"
                      />
                    </div>
                  ) : (
                    <select
                      className="mt-1 p-1 w-full border-b-2 rounded-md"
                      onChange={handleSectionChange}
                      value={selectedSection}
                    >
                      {section.map((s) => (
                        <option key={s.sec_ID} value={s.sec_ID}>
                          {s.sec_name}
                        </option>
                      ))}
                      <option value="add-new">Add New Section</option>
                    </select>
                  )}
                </div>
              </>
            ) : null}
            <div className="col-span-5 text-right">
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
            <label
              htmlFor="csvFile"
              className="block text-sm font-medium text-gray-600 mb-4"
            >
              อัปโหลดไฟล์ CSV เพื่อเพิ่มผู้ใช้งานจำนวนมาก
            </label>
            <UploadFile onFileLoad={handleFileLoad} />
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
