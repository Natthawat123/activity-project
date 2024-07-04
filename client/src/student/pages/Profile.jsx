import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from "react-router-dom";
import axios from 'axios'

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
    std_ID: '',
    std_fname: '',
    std_lname: '',
    sec_ID: '',
    std_mobile: '',
    std_email: '',
    std_address: '',
    province: '',
    district: '',
    subdistrict: '',
    zipcode: ''
  });
=======
<<<<<<< HEAD
>>>>>>> karan

  const stdID = localStorage.getItem('std_ID');

  const [section, setSection] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    fetch('/api/resume/student?id=' + stdID)
=======
    fetch('/api/resume/student?id=' + loginID)
=======
  const [value, setValue] = useState({
    std_ID: '',
    std_fname: '',
    std_lname: '',
    sec_ID: '',
    std_mobile: '',
    std_email: '',
    std_address: '',
    province: '',
    district: '',
    subdistrict: '',
    zipcode: ''
  });

  const stdID = localStorage.getItem('std_ID');

  const [section, setSection] = useState([]);

  useEffect(() => {
    fetch('/api/resume/student?id=' + stdID)
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        return response.json();
      })
      .then(data => {
<<<<<<< HEAD
        setValue((prev) => ({
          ...prev,
          ...data,
        }));
      })
      .catch(error => {
        console.error('Error:', error);
      });
=======
<<<<<<< HEAD
        setUsername(data.login_ID);
        setFnameValue(data.std_fname);
        setLnameValue(data.std_lname);
        setSectionIDValue(data.sec_ID);
        setSectionNameValue(data.sec_Name);
        setMobileValue(data.std_mobile);
        setEmailValue(data.std_email);
        setAddressValue(data.std_address);
        setSubdistrictValue(data.subdistrict);
        setDistrictValue(data.district);
        setProvinceValue(data.province);
        setZipcodeValue(data.zipcode);
      })
      .catch(error => console.error('Error fetching student data:', error));

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
        );
=======
<<<<<<< HEAD

        );

        const idProvince = sortedProvinces.map(province => [province.id, province.name_th]);

=======
        );
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        setProvinces(sortedProvinces);
      });

    fetch('/api/list/section')
      .then((respose) => respose.json())
      .then((result) => {
<<<<<<< HEAD
        setSection(result)
=======
<<<<<<< HEAD
        setSectionSelect(result)
>>>>>>> karan
      })

  }, [stdID]);

  const handlechange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

<<<<<<< HEAD
=======

=======
        setSection(result)
      })

  }, [stdID]);

  const handlechange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

>>>>>>> karan
  const handleSectionChange = (e) => {
    const selectedSecID = e.target.value;
    setValue((prev) => ({
      ...prev,
      sec_ID: selectedSecID,
    }));
  };
<<<<<<< HEAD
=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan

  const updateClick = (event) => {
    event.preventDefault();

<<<<<<< HEAD
    const updatedValue = {
      ...value,
      zipcode: zipcodeS || value.zipcode
    };

    fetch('/api/update/student/' + stdID, {
=======
<<<<<<< HEAD
    const dataJson = {
      fname: fnameValue,
      lname: lnameValue,
      section: sectionIDValue,
      mobile: mobileValue,
      email: emailValue,
      address: addressValue,
      province: provinceValue,
      district: districtsValue,
      subdistrict: subdistrictsValue,
      zipcode: zipcode,
    };
    fetch('/api/update/student/' + loginID, {
=======
    const updatedValue = {
      ...value,
      zipcode: zipcodeS || value.zipcode
    };

    fetch('/api/update/student/' + stdID, {
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
<<<<<<< HEAD
      body: JSON.stringify(updatedValue),
    })
      .then(response => {
=======
<<<<<<< HEAD
      body: JSON.stringify(dataJson),
    })
      .then(response => {
        console.log(response.data); // Log response data for debugging
=======
      body: JSON.stringify(updatedValue),
    })
      .then(response => {
>>>>>>> karan
        if (!response.ok) {
          throw new Error('Error updating data');
        }
        return response.json();
      })
      .then(data => {
<<<<<<< HEAD
=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        Swal.fire({
          title: 'แก้ไขประวัติส่วนตัวเสร็จสิ้น',
          icon: 'success',
        });
        setTimeout(() => {
          window.location = '/activity/profile';
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

  if (!value.std_ID) {
    return <div>Loading...</div>;
  }

<<<<<<< HEAD
  return (
=======
=======
  };

  if (!value.std_ID) {
    return <div>Loading...</div>;
  }

  return (
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
    <div className="w-full lg:w-2/3 mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <Link to='/activity/dashboard'>
        <div className="items-center mb-5"><ArrowBackIosNewIcon />ย้อนกลับ</div>
      </Link>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:px-10">
<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        <div className="mb-4">
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-600">
            รหัสนักศึกษา
          </label>
          <input
            type="text"
            id="username"
<<<<<<< HEAD
            name="std_ID"
            value={value.std_ID}
=======
<<<<<<< HEAD
            name="username"
            value={username}
=======
            name="std_ID"
            value={value.std_ID}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
            readOnly
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="classGroup" className="block text-sm font-medium text-gray-600">
            หมู่เรียน
          </label>
<<<<<<< HEAD
=======
<<<<<<< HEAD
          {/* bug */}
          {/* {sectionSelect && sectionSelect.length > 0 && (
            <select name="section" id="section" value={sectionNameValue} className="mt-1 p-2 border w-full rounded-md">
              <option>{sectionNameValue}</option>
              {sectionSelect.map((item) => (
                <option key={item.sec_ID} value={item.sec_ID} label={item.sec_Name}>{item.sec_Name}</option>
              ))}
            </select>
          )} */}


          <input
            type="text"
            id="section"
            name="section"
            onChange={updateSection}
            value={sectionNameValue}
            className="mt-1 p-2 border w-full rounded-md" />
=======
>>>>>>> karan
          <select value={value.sec_ID} onChange={handleSectionChange} name="sec_ID" className="mt-1 p-2 border w-full rounded-md">
            <option value="">{value.sec_Name || "Select a section"}</option>
            {section.map(sec => (
              <option key={sec.sec_ID} value={sec.sec_ID}>
                {sec.sec_name}
              </option>
            ))}
          </select>
<<<<<<< HEAD
=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
            ชื่อ
          </label>
          <input
            type="text"
            id="fname"
<<<<<<< HEAD
            name="std_fname"
            onChange={handlechange}
            value={value.std_fname}
=======
<<<<<<< HEAD
            name="fname"
            onChange={updateFname}
            value={fnameValue}
=======
            name="std_fname"
            onChange={handlechange}
            value={value.std_fname}
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
            name="std_lname"
            onChange={handlechange}
            value={value.std_lname}
=======
<<<<<<< HEAD
            name="lname"
            onChange={updateLname}
            value={lnameValue}
=======
            name="std_lname"
            onChange={handlechange}
            value={value.std_lname}
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
            name="std_mobile"
            onChange={handlechange}
            value={value.std_mobile}
=======
<<<<<<< HEAD
            name="tel"
            onChange={updateMobile}
            value={mobileValue}
=======
            name="std_mobile"
            onChange={handlechange}
            value={value.std_mobile}
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
            name="std_email"
            onChange={handlechange}
            value={value.std_email}
=======
<<<<<<< HEAD
            name="email"
            onChange={updateEmail}
            value={emailValue}
=======
            name="std_email"
            onChange={handlechange}
            value={value.std_email}
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
            name="std_address"
            onChange={handlechange}
            value={value.std_address}
=======
<<<<<<< HEAD
            name="address"
            onChange={updateAddress}
            value={addressValue}
=======
            name="std_address"
            onChange={handlechange}
            value={value.std_address}
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
=======
            onChange={handlechange}
            value={zipcodeS ?? value.zipcode}
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
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
<<<<<<< HEAD

>>>>>>> karan
  );
};

export default StudentForm;
<<<<<<< HEAD
=======
=======
  );
};

export default StudentForm;
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan
