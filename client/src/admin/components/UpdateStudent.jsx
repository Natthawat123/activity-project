import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

const StudentForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcodeS, setZipcode] = useState();
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
    zip_code: undefined,
  });
  const [section, setSection] = useState([]);

  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const { std_ID } = useParams();

  const onChangeHandle = (id, selectedValue) => {
    if (id === "province_id") {
      setValue((prev) => ({
        ...prev,
        province: selectedValue,
      }));
    } else if (id === "amphure_id") {
      setValue((prev) => ({
        ...prev,
        district: selectedValue,
      }));
    } else if (id === "tambon_id") {
      setValue((prev) => ({
        ...prev,
        subdistrict: selectedValue,
      }));
    }
  };

  const DropdownList = ({
    id,
    list,
    child,
    childsId = [],
    setChilds = [],
    addressValue_PDS,
  }) => {
    const onChangeHandleLocal = (event) => {
      setChilds.forEach((setChild) => setChild([]));
      const entries = childsId.map((child) => [child, undefined]);
      const unSelectChilds = Object.fromEntries(entries);

      const input = event.target.value;
      const dependId = input ? Number(input) : undefined;
      setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId }));

      if (!input) return;

      if (child) {
        const parent = list.find((item) => item.id === dependId);
        if (parent) {
          const { [child]: childs } = parent;
          const [setChild] = setChilds;
          setChild(childs);
        }
      }

      const selectedValue =
        list.find((item) => item.id === dependId)?.name_th || "";
      onChangeHandle(id, selectedValue);
    };

    return (
      <>
        <select
          value={selected[id]}
          onChange={onChangeHandleLocal}
          className="mt-1 p-2 border w-full rounded-md"
        >
          <option
            key={selected[id]}
            value={selected[id]}
            label={addressValue_PDS}
          />

          {list &&
            list.map((item) => (
              <option key={item.id} value={item.id} label={item.name_th}>
                {item.name_th}
              </option>
            ))}
        </select>
      </>
    );
  };

  const [value, setValue] = useState({
    username: "",
    std_fname: "",
    std_lname: "",
    sec_ID: "",
    std_mobile: "",
    std_email: "",
    std_address: "",
    province: "",
    district: "",
    subdistrict: "",
    zipcode: "",
  });

  useEffect(() => {
    fetch("/api/students/" + std_ID)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setValue((prev) => ({
          ...prev,
          ...data,
        }));

        const titles = ["นาย", "นาง", "น.ส."];
        const title = titles.find((t) => data.std_fname.match(t));
        if (title) {
          setTitle(title);
          setValue((prev) => ({
            ...prev,
            std_fname: data.std_fname.replace(title, "").trim(),
          }));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    fetch("/api/sections/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setSection(data);

        const titles = ["นาย", "นาง", "น.ส."];
        const title = titles.find((t) => data.std_fname.match(t));
        if (title) {
          setTitle(title);
          setValue((prev) => ({
            ...prev,
            std_fname: data.std_fname.replace(title, "").trim(),
          }));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    )
      .then((response) => response.json())
      .then((result) => {
        const sortedProvinces = result.sort((a, b) =>
          a.name_th.localeCompare(b.name_th)
        );
        setProvinces(sortedProvinces);
      });
  }, [std_ID]);

  const handlechange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSectionChange = (e) => {
    const selectedSecID = e.target.value;
    setValue((prev) => ({
      ...prev,
      sec_ID: selectedSecID,
    }));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const updateClick = (event) => {
    event.preventDefault();

    const updatedValue = {
      ...value,
      zipcode: zipcodeS || value.zipcode,
      std_fname: `${title}${value.std_fname}`.trim(),
    };

    fetch("/api/students/" + std_ID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedValue),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating data");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "แก้ไขประวัติส่วนตัวเสร็จสิ้น",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Oops...something went wrong!",
          icon: "error",
          text: `Error occurred! ${error.message}`,
          confirmButtonText: "OK",
        });
      });
  };

  if (!value.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mb-10 md:px-20 pt-24">
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 pb-10">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <h1 className="text-lg font-bold mb-2">แก้ไขข้อมูลส่วนตัว</h1>
            <DriveFileRenameOutlineIcon />
          </div>
          <div
            className="items-center mb-5 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon />
            ย้อนกลับ
          </div>
        </div>
        <hr className="mb-3" />
        <form>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-600"
              >
                รหัสนักศึกษา
              </label>
              <input
                type="text"
                id="username"
                name="std_ID"
                value={value.username}
                readOnly
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="classGroup"
                className="block text-sm font-medium text-gray-600"
              >
                หมู่เรียน
              </label>
              <select
                value={value.sec_ID}
                onChange={handleSectionChange}
                name="sec_ID"
                className="mt-1 p-2 border w-full rounded-md"
              >
                <option value="">{value.sec_Name || "Select a section"}</option>
                {section.map((sec) => (
                  <option key={sec.sec_ID} value={sec.sec_ID}>
                    {sec.sec_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="w-1/6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-600"
                >
                  คำนำหน้า
                </label>
                <select
                  value={title}
                  onChange={handleTitleChange}
                  name="title"
                  id="title"
                  className="mt-1 p-2 border w-full rounded-md"
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="น.ส.">น.ส.</option>
                </select>
              </div>
              <div className="w-5/6">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-600"
                >
                  ชื่อ
                </label>
                <input
                  type="text"
                  id="fname"
                  name="std_fname"
                  onChange={handlechange}
                  value={value.std_fname}
                  className="mt-1 p-2 border w-full rounded-md"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-600"
              >
                นามสกุล
              </label>
              <input
                type="text"
                id="lname"
                name="std_lname"
                onChange={handlechange}
                value={value.std_lname}
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-600"
              >
                เบอร์โทร
              </label>
              <input
                type="tel"
                id="tel"
                name="std_mobile"
                onChange={handlechange}
                value={value.std_mobile}
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                อีเมลล์
              </label>
              <input
                type="email"
                id="email"
                name="std_email"
                onChange={handlechange}
                value={value.std_email}
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600"
              >
                ที่อยู่
              </label>
              <input
                id="address"
                name="std_address"
                onChange={handlechange}
                value={value.std_address}
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-600"
              >
                จังหวัด
              </label>
              <DropdownList
                id="province_id"
                list={provinces}
                child="amphure"
                childsId={["amphure_id", "tambon_id"]}
                addressValue_PDS={value.province}
                setChilds={[setAmphures, setTambons]}
              />
            </div>

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-600"
              >
                อำเภอ
              </label>
              <DropdownList
                id="amphure_id"
                list={amphures}
                child="tambon"
                childsId={["tambon_id"]}
                setChilds={[setTambons]}
                addressValue_PDS={value.district}
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-600"
              >
                ตำบล
              </label>
              <DropdownList
                id="tambon_id"
                list={tambons}
                child="zip_code"
                childsId={["zip_code"]}
                setChilds={[setZipcode]}
                addressValue_PDS={value.subdistrict}
              />
            </div>

            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-gray-600"
              >
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                onChange={handlechange}
                value={zipcodeS ?? value.zipcode}
                className="mt-1 p-2 border w-full rounded-md"
              />
            </div>

            <div className="flex justify-end items-center">
              <button
                type="submit"
                className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={updateClick}
              >
                แก้ไข
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
