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

  const std_ID = localStorage.getItem("std_ID");

  const [reserveValue, setReservations] = useState([]);

  useEffect(() => {
    fetch("/api/activitys")
      .then((response) => {
        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
        return response.json();
      })
      .then((data) => {
        const eventList = data.map((item) => ({
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
            item.act_status == 2
              ? "blue"
              : item.act_numStd == item.act_numStdReserve
              ? "red"
              : now >=
                  moment(item.act_dateStart).subtract(2, "weeks").toDate() &&
                now <= moment(item.act_dateStart).subtract(1, "day").toDate()
              ? item.act_status == 1
                ? "green"
                : "red"
              : "gray",
        }));
        setEvents(eventList);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาด: ", error);
      });

    axios
      .get("/api/manage")
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservations: ", error);
      });
  }, []);

  const now = new Date();
  const isInRegistrationPeriod =
    selectedEvent &&
    now >= selectedEvent.reserveStart &&
    now <= selectedEvent.reserveEnd;

  const handleReserve = async () => {
    try {
      if (!std_ID) {
        Swal.fire({
          title: "กรุณาเข้าสู่ระบบ",
          text: "คุณต้องเข้าสู่ระบบก่อนจองกิจกรรม",
          icon: "warning",
        });
        return;
      }
      const now = new Date();
      if (
        now >= selectedEvent.reserveStart &&
        now <= selectedEvent.reserveEnd
      ) {
        if (selectedEvent.numStd == selectedEvent.numStdReserve) {
          alert("เต็ม");
          return;
        } else if (selectedEvent.status == 0) {
          alert("ปิดลงทะเบียน");
          return;
        }

        const reserve = {
          man_status: selectedEvent.status,
          std_ID: std_ID,
          act_ID: selectedEvent.id,
        };

        let reservations = [];
        try {
          const checkResponse = await axios.get("/api/reserve");
          reservations = checkResponse.data;
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "ลงทะเบียนสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.log(error);
        }

        if (Array.isArray(reservations) && reservations.length > 0) {
          const alreadyReserved = reservations.some(
            (reservation) =>
              reservation.std_ID.toString() === std_ID.toString() &&
              reservation.act_ID.toString() === selectedEvent.id.toString()
          );
          if (alreadyReserved) {
            Swal.fire({
              position: "top-end",
              icon: "info",
              title: "คุณได้ลงทะเบียนกิจกรรมนี้ไปเรียบร้อยแล้ว",
              showConfirmButton: false,
              timer: 1500,
            });
            return;
          }
        }

        const reserveResponse = await axios.post("/api/reserve", reserve);

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
          closePopup();
        }
      } else {
        alert("ไม่ได้อยู่ในช่วงละเทียน");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const eventStyleGetter = (event) => {
    const isRegistered = reserveValue.some(
      (reservation) =>
        reservation.std_ID.toString() === std_ID.toString() &&
        reservation.act_ID.toString() === event.id.toString()
    );

    const backgroundColor = isRegistered ? "yellow" : event.color;

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
    <div className="App w-3/4 mx-auto my-10 bg-slate-50 rounded-lg shadow-xl p-10">
      <h1 className="text-center text-3xl font-bold mb-5">ปฏิทินกิจกรรม</h1>

      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: "70vh" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
      />

      <div className="flex my-3 gap-5">
        <div className="flex items-center">
          <div className="me-1 bg-yellow-400 h-[18px] w-[18px] rounded-sm"></div>
          <p className="me-2">ลงทะเบียนแล้ว</p>
        </div>
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
            {/* <p style={{ color: isInRegistrationPeriod ? 'green' : 'red' }}>
                        {isInRegistrationPeriod ? 'อยู่ในช่วงลงทะเบียน' : 'ไม่อยู่ในช่วงลงทะเบียน'}
                    </p> */}
            <p>
              <span>จำนวนที่เปิดรับ :</span>
              <span
                style={{
                  color:
                    selectedEvent.numStd == selectedEvent.numStdReserve
                      ? "red"
                      : "green",
                }}
              >
                {selectedEvent.numStd == selectedEvent.numStdReserve
                  ? `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}`
                  : `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}`}
              </span>
              <span> คน</span>
            </p>

            <p
              style={{
                color: reserveValue.some(
                  (reservation) =>
                    reservation.std_ID.toString() === std_ID.toString() &&
                    reservation.act_ID.toString() ===
                      selectedEvent.id.toString()
                )
                  ? "yellow"
                  : selectedEvent.status === 2
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
              {reserveValue.some(
                (reservation) =>
                  reservation.std_ID.toString() === std_ID.toString() &&
                  reservation.act_ID.toString() === selectedEvent.id.toString()
              )
                ? "ลงทะเบียนแล้ว"
                : selectedEvent.status === 2
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

            {selectedEvent.numStd != selectedEvent.numStdReserve &&
              now >= selectedEvent.reserveStart &&
              now <= selectedEvent.reserveEnd &&
              selectedEvent.status == 1 && (
                <div className="text-end">
                  <button
                    className="btn px-2 py-1 bg-green-600 mt-4 text-center rounded-sm text-white"
                    onClick={handleReserve}
                  >
                    ลงทะเบียนเข้าร่วมกิจกรรม
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarFull;
