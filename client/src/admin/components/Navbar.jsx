import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/IT_logo_Standard.png";
import Logout from "../../components/Logout";
import axios from "axios";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SlideBar from "../../components/news/SlideBar";
import KeyIcon from '@mui/icons-material/Key';

const NavBar = () => {
  const ID = localStorage.getItem("id");
  const [username, setUsername] = useState("");
  const Homeurl = "localhost:5173/admin/dashboard";


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/api/admins/${ID}`);
        setUsername(response.data);
      } catch (error) {
        console.error("Error fetching the username:", error);
      }
    };

    if (Homeurl) {
      setSelectedItem("จัดการผู้ใช้");
      setListVisible(false);
    }

    if (ID) {
      fetchUsername();
    }
  }, [ID]);

  const [selectedItem, setSelectedItem] = useState("จัดการผู้ใช้");
  const [isListVisible, setListVisible] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setListVisible(false);
  };

  const toggleListVisibility = () => {
    setListVisible((prevState) => !prevState);
  };

  const getItemClass = (itemName) =>
    `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-gray-600 border border-white bg-gray-50 cursor-pointer px-3 py-2.5 font-normal text-xs leading-3 shadow-md rounded ${selectedItem === itemName
      ? "bg-indigo-600 text-white"
      : "bg-gray-50 text-gray-600 border border-white"
    }`;
  // const getItemLogout = (itemName) => `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-red-600 border border-white bg-grey-500 cursor-pointer px-3 py-2.5 font-normal text-xs leading-3 shadow-md rounded ${selectedItem === itemName ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-600 border border-white'}`;

  const getItemClassXs = () =>
    `px-4 py-3 text-gray-600 bg-gray-50 border border-gray-50 focus:outline-none focus:bg-gray-100 hover:bg-gray-100 duration-100 cursor-pointer text-xs leading-3 font-normal`;
  const getItemLogoutXs = (itemName) =>
    `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 font-bold text-red-500 border border-white bg-grey-500 cursor-pointer px-3 py-2.5 text-xs leading-3 shadow-md rounded ${selectedItem === itemName
      ? "bg-red-600 text-white"
      : "bg-gray-50 text-gray-600 border border-white"
    }`;



  return (
    <div className="3xl:container 3xl:mx-auto top-0 fixed w-full z-10">
      <div className="bg-white rounded shadow-lg py-5 px-7 md:pl-28 md:pr-28">
        <nav className="flex justify-between">
          <div className="flex items-center space-x-3 lg:pr-16 pr-6">
            <img src={Logo} className="w-10" alt="IT Logo" />
            <h2 className="font-bold text-md  leading-6 text-gray-800">
              ADMIN Dashboard
            </h2>
          </div>
          <ul className="hidden md:flex flex-auto space-x-2 items-center justify-center">
            <Link to="/admin/dashboard">
              <li
                onClick={() => handleItemClick("Dashboard")}
                className={getItemClass("Dashboard")}
              >
                จัดการผู้ใช้
              </li>
            </Link>
            <Link to="/admin/activity">
              <li
                onClick={() => handleItemClick("Activity")}
                className={getItemClass("Activity")}
              >
                กิจกรรม
              </li>
            </Link>
            <Link to="/admin/calendar">
              <li
                onClick={() => handleItemClick("Calendar")}
                className={getItemClass("Calendar")}
              >
                ปฏิทินกิจกรรม
              </li>
            </Link>
            <Link to="/admin/wallet">
              <li
                onClick={() => handleItemClick("Wallet")}
                className={getItemClass("Wallet")}
              >
                บันทึกข้อมูลกิจกรรมขึ้น Blockchain
              </li>
            </Link>

            {/* <li ></li> */}

            {/* Add similar li elements for other menu items */}
          </ul>
          <div className="flex items-center gap-5 ">
            <p className="md:flex items-center">
              <PersonPinIcon className="mx-2 text-blue-500" />
              {username.fname}
              <Link to={`/admin/change-password/${ID}`}><KeyIcon/></Link>
            </p>

            <SlideBar />
            <div className="hidden md:flex">
              <Logout />
            </div>

          </div>
        </nav>

        <div className="relative block md:hidden w-full mt-5 ">
          <div
            onClick={toggleListVisibility}
            className="cursor-pointer  px-4 py-3 text-white bg-indigo-600 rounded flex justify-between items-center w-full"
          >
            <div className="flex space-x-2 ">
              <span
                id="s1"
                className={`font-semibold text-sm leading-3 ${isListVisible ? "" : "hidden"
                  }`}
              >
                {" "}
              </span>
              <p
                id="textClicked"
                className="font-normal text-sm leading-3 focus:outline-none hover:bg-gray-800 duration-100 cursor-pointer"
              >
                {selectedItem}
              </p>
            </div>
            <svg
              id="ArrowSVG"
              className={`transform ${isListVisible ? "rotate-180" : ""}`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 9L12 15L18 9" stroke="white" />
            </svg>
          </div>

          <div className="relative">
            <ul
              id="list"
              className={`relative font-normal text-base leading-4 top-2 w-full rounded shadow-md transition-all duration-700 ${isListVisible
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 hidden"
                }`}
            >
              <Link to="/admin/dashboard">
                <li
                  onClick={() => handleItemClick("จัดการผู้ใช้")}
                  className={getItemClassXs("จัดการผู้ใช้")}
                >
                  จัดการผู้ใช้
                </li>
              </Link>
              <Link to="/admin/activity">
                <li
                  onClick={() => handleItemClick("กิจกรรม")}
                  className={getItemClassXs("กิจกรรม")}
                >
                  กิจกรรม
                </li>
              </Link>
              <Link to="/admin/calendar">
                <li
                  onClick={() => handleItemClick("ปฏิทินกิจกรรม")}
                  className={getItemClassXs("ปฏิทินกิจกรรม")}
                >
                  ปฏิทินกิจกรรม
                </li>
              </Link>

              <Link to="/admin/wallet">
                <li
                  onClick={() => handleItemClick("บันทึกข้อมูลกิจกรรมขึ้น Blockchain")}
                  className={getItemClassXs("บันทึกข้อมูลกิจกรรมขึ้น Blockchain")}
                >
                  บันทึกข้อมูลกิจกรรมขึ้น Blockchain
                </li>
              </Link>

              <li
                onClick={() => handleItemClick("Logout")}
                className={getItemLogoutXs("Logout")}
              >
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
