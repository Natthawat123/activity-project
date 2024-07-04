import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from "react-router-dom";

const StudentForm = () => {

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
<<<<<<< HEAD
  const [zipcodeS, setZipcode] = useState();
=======
<<<<<<< HEAD
  const [zipcode, setZipcode] = useState();
=======
  const [zipcodeS, setZipcode] = useState();
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
    zip_code: undefined
  });

<<<<<<< HEAD
=======
<<<<<<< HEAD

>>>>>>> karan
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
<<<<<<< HEAD
=======
      setSubdistrictValue(selectedValue);
=======
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
>>>>>>> karan
      setValue((prev) => ({
        ...prev,
        subdistrict: selectedValue
      }));
<<<<<<< HEAD
=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
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

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
  const [username, setUsername] = useState('');
  const [fnameValue, setFnameValue] = useState();
  const [lnameValue, setLnameValue] = useState('');
  const [staffIDValue, setstaffID] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [provinceValue, setProvinceValue] = useState('');
  const [districtsValue, setDistrictValue] = useState('');
  const [subdistrictsValue, setSubdistrictValue] = useState('');
  const [zipcodeValue, setZipcodeValue] = useState('');
>>>>>>> karan

  const staff_ID = localStorage.getItem('staff_ID');

  useEffect(() => {
    fetch('/api/resume/staff?id=' + staff_ID)
      .then(response => {
        if (!response.ok) {
<<<<<<< HEAD
          throw new Error('Error fetching data');
=======
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
=======
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
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        }
        return response.json();
      })
      .then(data => {
<<<<<<< HEAD
        setValue((prev) => ({
          ...prev,
          ...data,
        }));
=======
<<<<<<< HEAD
        console.log(data)
        setUsername(data.login_ID)
        setstaffID(data.staff_ID)
        setFnameValue(data.staff_fname);
        setLnameValue(data.staff_lname);
        setMobileValue(data.staff_mobile);
        setEmailValue(data.staff_email);
        setAddressValue(data.staff_address);
        setSubdistrictValue(data.subdistrict);
        setDistrictValue(data.district);
        setProvinceValue(data.province);
        setZipcodeValue(data.zipcode);
>>>>>>> karan
      })
      .catch(error => {
        console.error('Error:', error);
      });

<<<<<<< HEAD
=======

=======
        setValue((prev) => ({
          ...prev,
          ...data,
        }));
      })
      .catch(error => {
        console.error('Error:', error);
      });

>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    )
      .then((response) => response.json())
      .then((result) => {
        // Sort the provinces alphabetically by name_th
        const sortedProvinces = result.sort((a, b) =>
          a.name_th.localeCompare(b.name_th)
<<<<<<< HEAD
=======
<<<<<<< HEAD

>>>>>>> karan
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

<<<<<<< HEAD
    fetch('/api/update/staff/' + staff_ID, {
=======
    fetch('/api/update/staff/' + staffIDValue, {
=======
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
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
<<<<<<< HEAD
      body: JSON.stringify(updatedValue),
=======
<<<<<<< HEAD
      body: JSON.stringify(dataJson),
>>>>>>> karan
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating data');
        }
        return response.json();
      })
<<<<<<< HEAD
      .then(data => {
=======
      .then(result => {
        console.log(result);
=======
      body: JSON.stringify(updatedValue),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating data');
        }
        return response.json();
      })
      .then(data => {
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        Swal.fire({
          title: 'แก้ไขประวัติส่วนตัวเสร็จสิ้น',
          icon: 'success',
        });
        setTimeout(() => {
<<<<<<< HEAD
          window.location = '/teacher/profile';
=======
<<<<<<< HEAD
          window.location = '/teacher/calendar';
=======
          window.location = '/teacher/profile';
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
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
<<<<<<< HEAD
=======
<<<<<<< HEAD

>>>>>>> karan
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
<<<<<<< HEAD
            รหัสนักศึกษา
=======
            รหัสประจำตัวอาจารย์
=======
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
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
          </label>
          <input
            type="text"
            id="username"
<<<<<<< HEAD
            name="staff_ID"
            value={value.staff_ID}
=======
<<<<<<< HEAD
            name="username"
            value={staffIDValue}
=======
            name="staff_ID"
            value={value.staff_ID}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            readOnly
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
            ชื่อ
          </label>
          <input
            type="text"
            id="fname"
<<<<<<< HEAD
            name="staff_fname"
            onChange={handlechange}
            value={value.staff_fname}
=======
<<<<<<< HEAD
            name="fname"
            onChange={updateFname}
            value={fnameValue}
=======
            name="staff_fname"
            onChange={handlechange}
            value={value.staff_fname}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
            นามสกุล
          </label>
          <input
            type="text"
            id="lname"
<<<<<<< HEAD
            name="staff_lname"
            onChange={handlechange}
            value={value.staff_lname}
=======
<<<<<<< HEAD
            name="lname"
            onChange={updateLname}
            value={lnameValue}
=======
            name="staff_lname"
            onChange={handlechange}
            value={value.staff_lname}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
            เบอร์โทร
          </label>
          <input
            type="tel"
            id="tel"
<<<<<<< HEAD
            name="staff_mobile"
            onChange={handlechange}
            value={value.staff_mobile}
=======
<<<<<<< HEAD
            name="tel"
            onChange={updateMobile}
            value={mobileValue}
=======
            name="staff_mobile"
            onChange={handlechange}
            value={value.staff_mobile}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            อีเมลล์
          </label>
          <input
            type="email"
            id="email"
<<<<<<< HEAD
            name="staff_email"
            onChange={handlechange}
            value={value.staff_email}
=======
<<<<<<< HEAD
            name="email"
            onChange={updateEmail}
            value={emailValue}
=======
            name="staff_email"
            onChange={handlechange}
            value={value.staff_email}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            ที่อยู่
          </label>
          <input
            id="address"
<<<<<<< HEAD
            name="staff_address"
            onChange={handlechange}
            value={value.staff_address}
=======
<<<<<<< HEAD
            name="address"
            onChange={updateAddress}
            value={addressValue}
=======
            name="staff_address"
            onChange={handlechange}
            value={value.staff_address}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
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
<<<<<<< HEAD
            addressValue_PDS={value.province}
=======
<<<<<<< HEAD
            addressValue_PDS={provinceValue}
=======
            addressValue_PDS={value.province}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
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
<<<<<<< HEAD
            addressValue_PDS={value.district}
=======
<<<<<<< HEAD
            addressValue_PDS={districtsValue}
=======
            addressValue_PDS={value.district}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
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
<<<<<<< HEAD
            addressValue_PDS={value.subdistrict}
          />
        </div>

=======
<<<<<<< HEAD
            addressValue_PDS={subdistrictsValue}
          />
        </div>


=======
            addressValue_PDS={value.subdistrict}
          />
        </div>

>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        <div className="mb-4">
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-600">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
<<<<<<< HEAD
            onChange={handlechange}
            value={zipcodeS ?? value.zipcode}
=======
<<<<<<< HEAD
            onChange={updateZipcode}
            value={zipcode ?? zipcodeValue}
>>>>>>> karan
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="flex justify-end items-center">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-1/8 h-1/2" onClick={updateClick}>
            แก้ไข
          </button>
        </div>
      </form>
    </div>
<<<<<<< HEAD
=======

=======
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
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
  );
};

export default StudentForm;
