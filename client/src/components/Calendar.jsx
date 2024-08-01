import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const localizer = momentLocalizer(moment);

function CalendarFull() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const now = new Date();

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
      <h1 className="text-center text-3xl font-bold mb-5">ปฏิทินกิจกรรม</h1>

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

      <div className="flex my-3 gap-5 z-50">
        <div className="flex items-center">
          <div className="me-1 bg-green-600 h-[18px] w-[18px] rounded-sm"></div>
          <p className="me-2">เปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center">
          <div className="me-1 bg-red-600 h-[18px] w-[18px] rounded-sm"></div>
          <p className="me-2">ลงทะเบียนเต็มแล้ว/ปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center">
          <div className="me-1 bg-blue-600 h-[18px] w-[18px] rounded-sm"></div>
          <p className="me-2">กิจกรรมจบลงแล้ว</p>
        </div>
        <div className="flex items-center">
          <div className="me-1 bg-gray-600 h-[18px] w-[18px] rounded-sm"></div>
          <p className="me-2">ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน</p>
        </div>
      </div>

      {selectedEvent && showPopup && (
        <div className="fixed w-72 md:w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <div className="w-full justify-end flex ">
            <div className="cursor-pointer flex" onClick={closePopup}>
              <CloseIcon />
            </div>
          </div>
          <div className="text-left -mt-5">
            <h2 className="text-xl font-bold mb-4">รายละเอียดกิจกรรม</h2>
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
      )}
    </div>
  );
}

export default CalendarFull;
