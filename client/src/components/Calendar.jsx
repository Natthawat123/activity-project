import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";


const localizer = momentLocalizer(moment);

function CalendarFull() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const now = new Date();
  const role = localStorage.getItem('role')

  useEffect(() => {
    fetch("/api/activitys")
      .then((response) => {
        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
        return response.json();
      })
      .then((data) => {
        const seenTitles = new Set(); // Create a set to track seen titles
        const eventList = data
          .filter((item) => {
            // Filter out items with duplicate titles
            if (seenTitles.has(item.act_title)) {
              return false;
            } else {
              seenTitles.add(item.act_title);
              return true;
            }
          })
          .map((item) => ({
            start: moment(item.act_dateStart).toDate(),
            end: moment(item.act_dateEnd).toDate(),
            reserveStart: moment(item.act_dateStart)
              .subtract(2, "weeks")
              .toDate(),
            reserveEnd: moment(item.act_dateStart).subtract(1, "day").toDate(),
            title: item.act_title,
            status: item.act_status,
            location: item.act_location,
            numStd: item.act_numStd,
            numStdReserve: item.act_numStdReserve,
            id: item.act_ID,
            color:
              item.act_status === 2
                ? "blue"
                : item.act_numStd === item.act_numStdReserve
                ? "red"
                : now >=
                    moment(item.act_dateStart).subtract(2, "weeks").toDate() &&
                  now <= moment(item.act_dateStart).subtract(1, "day").toDate()
                ? item.act_status === 1
                  ? "green"
                  : "red"
                : "gray",
          }));
        setEvents(eventList);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาด: ", error);
      });
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "10px",
      opacity: 0.8,
      color: "white",
      border: "0",
      display: "block",
      margin: "2px",
    };
    return {
      style,
    };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App w-3/4 mx-auto my-10 bg-slate-50 rounded-lg shadow-xl p-10 z-50">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-3xl font-bold mb-5"
      >
        ปฏิทินกิจกรรม
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={events}
          style={{ height: "70vh" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          className="z-50"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap my-3 gap-5 z-50"
      >
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 h-4 w-4 rounded-sm"></div>
          <p className="text-sm sm:text-base">เปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 h-4 w-4 rounded-sm"></div>
          <p className="text-sm sm:text-base">ลงทะเบียนเต็มแล้ว/ปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 h-4 w-4 rounded-sm"></div>
          <p className="text-sm sm:text-base">กิจกรรมจบลงแล้ว</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-600 h-4 w-4 rounded-sm"></div>
          <p className="text-sm sm:text-base">
            ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน
          </p>
        </div>
      </motion.div>

      {selectedEvent && showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="w-full flex justify-end">
              <div className="cursor-pointer" onClick={closePopup}>
                <CloseIcon />
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold mb-4">
                รายละเอียดกิจกรรม{" "}
                <Tooltip title="รายชื่อผู้ลงทะเบียน" placement="bottom-start">
                  <LibraryBooksIcon
                    sx={{
                      color: "teal",
                      transition: "0.3s ease",
                      marginLeft: 0.5,
                      "&:hover": {
                        color: "indigo",
                        transform: "scale(1.5) translateX(5px)",
                      },
                    }}
                    onClick={() => navigate(`/reserve/${selectedEvent.id}`)}
                  />
                </Tooltip>

                {role ? (
                 <Tooltip title="ดาวน์โหลดใบลงชื่อกิจกรรม" placement="bottom-start"> ||
                  <LibraryBooksIcon
                    sx={{
                      color: "teal",
                      transition: "0.3s ease",
                      marginLeft: 0.5,
                      "&:hover": {
                        color: "indigo",
                        transform: "scale(1.5) translateX(5px)",
                      },
                    }}
                    onClick={() => navigate(`/entry/${selectedEvent.id}`)}
                  />
                </Tooltip>
                ): null}

                
              </h2>
              <p className="text-xl">ชื่อกิจกรรม : {selectedEvent.title}</p>
              <p>สถานที่ : {selectedEvent.location}</p>
              <p>
                วันที่ :{" "}
                {selectedEvent.start.toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {selectedEvent.end.toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                เปิดลงทะเบียน :{" "}
                {selectedEvent.reserveStart.toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {selectedEvent.reserveEnd.toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <p>
                <span>จำนวนที่เปิดรับ :</span>
                <span
                  style={{
                    color:
                      selectedEvent.numStd === selectedEvent.numStdReserve
                        ? "red"
                        : "green",
                  }}
                >
                  {selectedEvent.numStd === selectedEvent.numStdReserve
                    ? `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}`
                    : `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}`}
                </span>
                <span> คน</span>
              </p>

              <p
                style={{
                  color:
                    selectedEvent.status === 2
                      ? "blue"
                      : selectedEvent.numStd === selectedEvent.numStdReserve
                      ? "red"
                      : now >= selectedEvent.reserveStart &&
                        now <= selectedEvent.reserveEnd
                      ? selectedEvent.status === 1
                        ? "green"
                        : "red"
                      : "gray",
                }}
              >
                {selectedEvent.status === 2
                  ? "กิจกรรมสิ้นสุดแล้ว"
                  : selectedEvent.numStd === selectedEvent.numStdReserve
                  ? "ลงทะเบียนเต็มแล้ว"
                  : now >= selectedEvent.reserveStart &&
                    now <= selectedEvent.reserveEnd
                  ? selectedEvent.status === 1
                    ? "เปิดลงทะเบียน"
                    : "ปิดลงทะเบียน"
                  : "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CalendarFull;
