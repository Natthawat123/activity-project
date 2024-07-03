import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import axios from 'axios'

const localizer = momentLocalizer(moment);

function CalendarFull() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [studentID, setstudentID] = useState(null);

    // table activity
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
                    status: item.act_status,
                    location: item.act_location,
                    id: item.act_ID,
                    color: index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'green' : 'red',
                }));
                setEvents(eventList);

            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาด: ', error);
            });

        const student_ID = localStorage.getItem('std_ID')
        setstudentID(student_ID);

    }, []);

    const handleReserve = async () => {
        try {
            // Check if the user is logged in
            if (!studentID) {
                Swal.fire({
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'คุณต้องเข้าสู่ระบบก่อนจองกิจกรรม',
                    icon: 'warning',
                });
                return;
            }
    
            let reservations = [];
            try {
                // Check for existing reservations
                const checkResponse = await axios.get('/api/manage');
                reservations = checkResponse.data;
            } catch (error) {
                console.warn('Unable to fetch existing reservations:', error);
                // Proceed without checking for existing reservations
            }
    
            console.log('Current studentID:', studentID);
            console.log('Current activity ID:', selectedEvent.id);
            console.log('All reservations:', reservations);
    
            if (Array.isArray(reservations) && reservations.length > 0) {
                const alreadyReserved = reservations.some(reservation => 
                    reservation.std_ID.toString() === studentID.toString() && 
                    reservation.act_ID.toString() === selectedEvent.id.toString()
                );
    
                console.log('Already reserved:', alreadyReserved);
    
                if (alreadyReserved) {
                    Swal.fire({
                        title: 'คุณได้จองกิจกรรมนี้ไปแล้ว',
                        icon: 'info',
                    });
                    return;
                }
            }
    
            // Proceed with reservation
            const reserve = {
                man_status: selectedEvent.status,
                std_ID: studentID,
                act_ID: selectedEvent.id
            };
    
            const reserveResponse = await axios.post('/api/reserve/activity', reserve);
    
            console.log('Reservation response:', reserveResponse);
    
            if (reserveResponse.data && (reserveResponse.data.success || reserveResponse.status === 200)) {
                Swal.fire({
                    title: 'ลงทะเบียนเรียบร้อย',
                    icon: 'success',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error('เกิดข้อผิดพลาดในการจองกิจกรรม: ไม่สามารถยืนยันการจองได้');
            }
        } catch (err) {
            console.error('Reservation error:', err);
            console.error('Error details:', err.response ? err.response.data : 'No response data');
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: err.message || 'ไม่สามารถจองกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
                icon: 'error',
            });
        }
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
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
                            <button className="btn px-2 py-1 bg-green-600 mt-4 text-center rounded-sm text-white" onClick={handleReserve}>
                                จองกิจกรรม
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarFull;