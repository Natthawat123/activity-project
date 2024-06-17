import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CloseIcon from '@mui/icons-material/Close';

const localizer = momentLocalizer(moment);

function CalendarFull() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch('/api/list/activity')
      .then(response => {
        if (!response.ok) {
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        return response.json();
      })
      .then(data => {
        const eventList = data.map((item, index) => ({
          start: moment(item.act_dateStart).toDate(),
          end: moment(item.act_dateEnd).toDate(),
          title: item.act_title,
          location: item.act_location,
          id: item.act_ID,
          color: index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'green' : 'red',
        }));
        setEvents(eventList);

      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาด: ', error);
      });


  }, []);


  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: '10px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block',
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
        style={{ height: "50vh" }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
      />

      {selectedEvent && showPopup && (
        <div className="fixed w-72 md:w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <div className="w-full justify-end flex ">
            <div className="cursor-pointer flex" onClick={closePopup}>
              <CloseIcon />
            </div></div>
          <div className="text-left -mt-5">
            <h2 className="text-xl font-bold mb-4">รายละเอียดกิจกรรม</h2>
            <p className="text-xl">ชื่อกิจกรรม : {selectedEvent.title}</p>
            <p>สถานที่ : {selectedEvent.location}</p>
            <p>เริ่มวันที่ : {selectedEvent.start.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p>สิ้นสุดวันที่ : {selectedEvent.end.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="text-end">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarFull;