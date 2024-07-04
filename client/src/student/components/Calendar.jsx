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
<<<<<<< HEAD
    const [studentID, setstudentID] = useState(null);

    // table activity
=======
    const [studentID, setStudentID] = useState(null);

>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
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
<<<<<<< HEAD

=======
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาด: ', error);
            });

<<<<<<< HEAD
        const student_ID = localStorage.getItem('std_ID')
        setstudentID(student_ID);

    }, []);

    const handleReserve = async () => {
        const reserve = {
            man_status: selectedEvent.status,
            std_ID: studentID,
            act_ID: selectedEvent.id
        }

        try {
            await axios.post('/api/reserve/activity', reserve)
            Swal.fire({
                title: 'ละทะเบียนเรียบร้อย',
                icon: 'success',
            });
            setTimeout(() => {
                window.location = '/activity/calendar';
            }, 1500);
        } catch (err) { console.log(err) }

    }

    const eventStyleGetter = (event, start, end, isSelected) => {
=======
        const student_ID = localStorage.getItem('std_ID');
        setStudentID(student_ID);
    }, []);

    const handleReserve = async () => {
        try {
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
                const checkResponse = await axios.get('/api/manage');
                reservations = checkResponse.data;
            } catch (error) {
                console.log(error);
            }
        
            if (Array.isArray(reservations) && reservations.length > 0) {
                const alreadyReserved = reservations.some(reservation => 
                    reservation.std_ID.toString() === studentID.toString() && 
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
    
            const reserve = {
                man_status: selectedEvent.status,
                std_ID: studentID,
                act_ID: selectedEvent.id
            };
    
            const reserveResponse = await axios.post('/api/reserve/activity', reserve);
    
    
            if (reserveResponse.data && (reserveResponse.data.success || reserveResponse.status === 200)) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "ลงทะเบียนสำเร็จ",
                    showConfirmButton: false,
                    timer: 1500
                  });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } 
        } catch (err) {
            console.log(err);
        }
    };

    const eventStyleGetter = (event) => {
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
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
<<<<<<< HEAD
                        </div></div>
=======
                        </div>
                    </div>
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
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

<<<<<<< HEAD
export default CalendarFull;
=======
export default CalendarFull;
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
