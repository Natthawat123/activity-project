import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/IT_logo_Standard.png";
import Logout from "../../components/Logout";
import axios from "axios";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SlideBar from "../../components/news/SlideBar";
import KeyIcon from "@mui/icons-material/Key";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Header = () => {
  const ID = localStorage.getItem("id");
  const [username, setUsername] = useState("");
  const Homeurl = "localhost:5173/activity/calendar";

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/api/student/${ID}`);
        // setUsername(`${response.data.std_fname} ${response.data.std_lname}`);
        setUsername(response.data);
      } catch (error) {
        console.error("Error fetching the username:", error);
      }
    };

    if (Homeurl) {
      setSelectedItem("ปฏิทินกิจกรรม");
      setListVisible(false);
    }

    if (ID) {
      fetchUsername();
    }
  }, [ID]);

  const [selectedItem, setSelectedItem] = useState("ปฏิทินกิจกรรม");
  const [isListVisible, setListVisible] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setListVisible(false);
  };

  const toggleListVisibility = () => {
    setListVisible((prevState) => !prevState);
  };

  const getItemClass = (itemName) =>
    `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-gray-600 border border-white bg-gray-50 cursor-pointer px-3 py-2.5 font-normal text-xs leading-3 shadow-md rounded ${
      selectedItem === itemName
        ? "bg-indigo-600 text-white"
        : "bg-gray-50 text-gray-600 border border-white"
    }`;

  const getItemClassXs = () =>
    `px-4 py-3 text-gray-600 bg-gray-50 border border-gray-50 focus:outline-none focus:bg-gray-100 hover:bg-gray-100 duration-100 cursor-pointer text-xs leading-3 font-normal`;

  const getItemLogoutXs = (itemName) =>
    `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 font-bold text-red-500 border border-white bg-grey-500 cursor-pointer px-3 py-2.5 text-xs leading-3 shadow-md rounded ${
      selectedItem === itemName
        ? "bg-red-600 text-white"
        : "bg-gray-50 text-gray-600 border border-white"
    }`;
  return (
    <div className="3xl:container 3xl:mx-auto top-0 fixed z-50 w-full">
      <div className="bg-white rounded shadow-lg py-5 px-7 md:pl-28 md:pr-28">
        <nav className="flex justify-between">
          <div className="flex items-center space-x-3 lg:pr-16 pr-6">
            <img src={Logo} className="w-10" alt="IT Logo" />
            <h2 className="font-bold text-md leading-6 text-gray-800">
              INFORMATION TECHNOLOGY
            </h2>
          </div>
          <ul className="hidden md:flex flex-auto space-x-2 items-center justify-center">
            <Link to="/activity/calendar">
              <li
                onClick={() => handleItemClick("Calendar")}
                className={getItemClass("Calendar")}
              >
                หน้าแรก
              </li>
            </Link>
            <Link to="/activity/profile">
              <li
                onClick={() => handleItemClick("Profile")}
                className={getItemClass("Profile")}
              >
                ประวัติส่วนตัว
              </li>
            </Link>
            <Link to="/activity/list-activity">
              <li
                onClick={() => handleItemClick("กิจกรรม")}
                className={getItemClass("กิจกรรม")}
              >
                กิจกรรม
              </li>
            </Link>
          </ul>
          <div className="flex items-center gap-5">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className=" inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs md:text-sm font-semibold text-gray-900  ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {username.std_fname}
                  {"  "}
                  {username.std_lname}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 h-5 w-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      <PersonPinIcon className="text-blue-500" />
                      <div className="">
                        <div className="">
                          {username.std_fname} {username.std_lname}
                        </div>
                        <div className="text-xs text-gray-400">
                          {username.std_email}
                        </div>
                      </div>
                    </a>
                  </MenuItem>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <Link
                      to={`/activity/change-password/${ID}`}
                      className="flex gap-3 items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      <KeyIcon />
                      <p>เปลี่ยนรหัสผ่าน</p>
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <SlideBar />
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>

            <div className="hidden md:flex">
              <Logout />
            </div>
          </div>
        </nav>
        <div className="relative block md:hidden w-full mt-5">
          <div
            onClick={toggleListVisibility}
            className="cursor-pointer px-4 py-3 text-white bg-indigo-600 rounded flex justify-between items-center w-full"
          >
            <div className="flex space-x-2">
              <span
                id="s1"
                className={`font-semibold text-sm leading-3 ${
                  isListVisible ? "" : "hidden"
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
              className={`relative font-normal text-base leading-4 top-2 w-full rounded shadow-md transition-all duration-700 ${
                isListVisible
                  ? "opacity-100 max-h-40"
                  : "opacity-0 max-h-0 hidden"
              }`}
            >
              <Link to="/activity/calendar">
                <li
                  onClick={() => handleItemClick("ปฏิทินกิจกรรม")}
                  className={getItemClassXs("ปฏิทินกิจกรรม")}
                >
                  ปฏิทินกิจกรรม
                </li>
              </Link>
              <Link to="/activity/profile">
                <li
                  onClick={() => handleItemClick("ประวัติส่วนตัว")}
                  className={getItemClassXs("listStudent")}
                >
                  ประวัติส่วนตัว
                </li>
              </Link>
              <Link to="/activity/list-activity">
                <li
                  onClick={() => handleItemClick("กิจกรรม")}
                  className={getItemClassXs("Profile")}
                >
                  กิจกรรม
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

export default Header;
