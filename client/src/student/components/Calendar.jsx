import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";

const localizer = momentLocalizer(moment);

function CalendarFull() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [reserveValue, setReservations] = useState([]);
  const navigate = useNavigate();

  const std_ID = localStorage.getItem("id");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/participate?std_ID=${std_ID}`);
        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
        const data = await response.json();

        const seenTitles = new Set();
        const eventList = data
          .filter((item) => {
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
            std_ID: item.std_ID,
            color: getEventColor(item),
          }));
        setEvents(eventList);
      } catch (error) {
        console.error("เกิดข้อผิดพลาด: ", error);
      }
    };

    // const fetchReservations = async () => {
    //   try {
    //     const response = await axios.get("/api/reserve");
    //     setReservations(response.data);
    //   } catch (error) {
    //     console.error("Error fetching reservations: ", error);
    //   }
    // };

    fetchActivities();
    // fetchReservations();
  }, []);

  const getEventColor = (item) => {
    const now = new Date();
    if (item.act_status === 2) return "blue";
    if (item.act_numStd === item.act_numStdReserve) return "red";
    if (
      now >= moment(item.act_dateStart).subtract(2, "weeks").toDate() &&
      now <= moment(item.act_dateStart).subtract(1, "day").toDate()
    ) {
      return item.act_status === 1 ? "green" : "red";
    }
    return "gray";
  };

  const handleReserve = async () => {
    if (!std_ID) {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนจองกิจกรรม",
        icon: "warning",
      });
      return;
    }

    const now = new Date();
    if (now >= selectedEvent.reserveStart && now <= selectedEvent.reserveEnd) {
      if (selectedEvent.numStd === selectedEvent.numStdReserve) {
        alert("เต็ม");
        return;
      }
      if (selectedEvent.status === 0) {
        alert("ปิดลงทะเบียน");
        return;
      }

      const reserve = {
        std_ID: std_ID,
        act_ID: selectedEvent.id,
      };
      console.log(selectedEvent);

      try {
        // const checkResponse = await axios.get("/api/reserve");
        // const reservations = checkResponse.data;

        // const alreadyReserved = reservations.some(
        //   (reservation) =>
        //     reservation.std_ID == std_ID &&
        //     reservation.act_ID == selectedEvent.id
        // );

        // if (alreadyReserved) {
        //   Swal.fire({
        //     position: "top-end",
        //     icon: "info",
        //     title: "คุณได้ลงทะเบียนกิจกรรมนี้ไปเรียบร้อยแล้ว",
        //     showConfirmButton: false,
        //     timer: 1500,
        //   });
        //   return;
        // }

        const reserveResponse = await axios.post("/api/participate", reserve);
        // await axios.post(`/api/new`, {
        //   news_topic: "ลงทะเบียนสำเร็จ",
        //   news_desc: `ลงทะเบียนเข้าร่วมกิจกรรม ${selectedEvent.title}`,
        //   news_date: new Date().toISOString(),
        //   user_ID: std_ID,
        // });

        if (
          reserveResponse.data &&
          (reserveResponse.data.success || reserveResponse.status === 200)
        ) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "ลงทะเบียนสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("ไม่ได้อยู่ในช่วงลงทะเบียน");
    }
  };

  const eventStyleGetter = (event) => {
    const isRegistered = reserveValue.some(
      (reservation) =>
        reservation.std_ID == std_ID && reservation.act_ID == event.id
    );

    const backgroundColor = isRegistered ? "orange" : event.color;

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
    <div className="App w-full max-w-4xl mx-auto my-10 bg-slate-50 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-5">
        ปฏิทินกิจกรรม
      </h1>

      <div className="relative">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={events}
          style={{ height: "70vh" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-5">
        <div className="flex items-center">
          <div className="me-2 bg-orange-400 h-4 w-4 rounded-sm"></div>
          <p>ลงทะเบียนแล้ว</p>
        </div>
        <div className="flex items-center">
          <div className="me-2 bg-green-600 h-4 w-4 rounded-sm"></div>
          <p>เปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center">
          <div className="me-2 bg-red-600 h-4 w-4 rounded-sm"></div>
          <p>ลงทะเบียนเต็มแล้ว/ปิดลงทะเบียน</p>
        </div>
        <div className="flex items-center">
          <div className="me-2 bg-blue-600 h-4 w-4 rounded-sm"></div>
          <p>กิจกรรมจบลงแล้ว</p>
        </div>
        <div className="flex items-center">
          <div className="me-2 bg-gray-600 h-4 w-4 rounded-sm"></div>
          <p>ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน</p>
        </div>
      </div>

      {selectedEvent &&
        showPopup &&
        (() => {
          const now = new Date();
          return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-end">
                  <div className="cursor-pointer" onClick={closePopup}>
                    <CloseIcon />
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold mb-4">รายละเอียดกิจกรรม</h2>
                  <p className="text-lg mb-2">
                    ชื่อกิจกรรม : {selectedEvent.title}
                  </p>
                  <p className="mb-2">สถานที่ : {selectedEvent.location}</p>
                  <p className="mb-2">
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
                  <p className="mb-2">
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
                  <p className="mb-4">สถานะกิจกรรม : {selectedEvent.status}</p>
                  {selectedEvent.std_ID ? (
                    <div className="text-end">
                      <button className="btn px-4 py-2 bg-red-600 text-white rounded-sm">
                        ลงทะเบียนเข้าร่วมกิจกรรมแล้ว
                      </button>
                    </div>
                  ) : (
                    <div className="text-end">
                      <button
                        className="btn px-4 py-2 bg-green-600 text-white rounded-sm"
                        onClick={handleReserve}
                      >
                        ลงทะเบียนเข้าร่วมกิจกรรม
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

export default CalendarFull;
