import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from "react-router-dom";

const StudentForm = () => {

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcodeS, setZipcode] = useState();
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
    zip_code: undefined
  });

  const onChangeHandle = (id, selectedValue) => {
    if (id === "province_id") {
      setValue((prev) => ({
        ...prev,
        province: selectedValue
      }));
    } else if (id === "amphure_id") {
      setValue((prev) => ({
        ...prev,
        district: selectedValue
      }));
    } else if (id === "tambon_id") {
      setValue((prev) => ({
        ...prev,
        subdistrict: selectedValue
      }));
    }
  };

  const DropdownList = ({
    id,
    list,
    child,
    childsId = [],
    setChilds = [],
    addressValue_PDS
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

      const selectedValue = list.find((item) => item.id === dependId)?.name_th || '';
      onChangeHandle(id, selectedValue);
    };

    return (
      <>
        <select value={selected[id]} onChange={onChangeHandleLocal} className="mt-1 p-2 border w-full rounded-md">
          <option key={selected[id]} value={selected[id]} label={addressValue_PDS} />

          {list && list.map((item) => (
            <option
              key={item.id}
              value={item.id}
              label={item.name_th}
            >
              {item.name_th}
            </option>
          ))}
        </select>
      </>
    );
  };

  const [value, setValue] = useState({
    staff_ID: '',
    staff_fname: '',
    std_lname: '',
    staff_mobile: '',
    staff_email: '',
    staff_address: '',
    province: '',
    district: '',
    subdistrict: '',
    zipcode: ''
  });

  const staff_ID = localStorage.getItem('staff_ID');

  useEffect(() => {
    fetch('/api/resume/staff?id=' + staff_ID)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        return response.json();
      })
      .then(data => {
        setValue((prev) => ({
          ...prev,
          ...data,
        }));
      })
      .catch(error => {
        console.error('Error:', error);
      });

    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    )
      .then((response) => response.json())
      .then((result) => {
        // Sort the provinces alphabetically by name_th
        const sortedProvinces = result.sort((a, b) =>
          a.name_th.localeCompare(b.name_th)
        );
        setProvinces(sortedProvinces);
      });

  }, [staff_ID]);

  const handlechange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const updateClick = (event) => {
    event.preventDefault();

    const updatedValue = {
      ...value,
      zipcode: zipcodeS || value.zipcode
    };

    fetch('/api/update/staff/' + staff_ID, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedValue),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating data');
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          title: 'แก้ไขประวัติส่วนตัวเสร็จสิ้น',
          icon: 'success',
        });
        setTimeout(() => {
          window.location = '/teacher/profile';
        }, 1500);
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire({
          title: 'Oops...something went wrong!',
          icon: 'error',
          text: `Error occurred! ${error.message}`,
          confirmButtonText: 'OK',
        });
      });
  };

  if (!value.staff_ID) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:w-2/3 mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <Link to='/teacher/calendar'>
        <div className="items-center mb-5"><ArrowBackIosNewIcon />ย้อนกลับ</div>
      </Link>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:px-10">
        <div className="mb-4">
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-600">
            รหัสนักศึกษา
          </label>
          <input
            type="text"
            id="username"
            name="staff_ID"
            value={value.staff_ID}
            readOnly
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
            ชื่อ
          </label>
          <input
            type="text"
            id="fname"
            name="staff_fname"
            onChange={handlechange}
            value={value.staff_fname}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
            นามสกุล
          </label>
          <input
            type="text"
            id="lname"
            name="staff_lname"
            onChange={handlechange}
            value={value.staff_lname}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
            เบอร์โทร
          </label>
          <input
            type="tel"
            id="tel"
            name="staff_mobile"
            onChange={handlechange}
            value={value.staff_mobile}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            อีเมลล์
          </label>
          <input
            type="email"
            id="email"
            name="staff_email"
            onChange={handlechange}
            value={value.staff_email}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            ที่อยู่
          </label>
          <input
            id="address"
            name="staff_address"
            onChange={handlechange}
            value={value.staff_address}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-600">
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

        <div className="mb-4">
          <label htmlFor="district" className="block text-sm font-medium text-gray-600">
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

        <div className="mb-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-600">
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

        <div className="mb-4">
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-600">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            onChange={handlechange}
            value={zipcodeS ?? value.zipcode}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="flex justify-end items-center">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-1/8 h-1/2" onClick={updateClick}>
            แก้ไข
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
