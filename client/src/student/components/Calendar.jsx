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

    const std_ID = localStorage.getItem('std_ID');


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
                    numStd: item.act_numStd,
                    numStdReserve: item.act_numStdReserve,
                    id: item.act_ID,
                    color: index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'green' : 'red',
                }));
                setEvents(eventList);
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาด: ', error);
            });

    }, []);
    

    const handleReserve = async () => {
        try {
            if (!std_ID) {
                Swal.fire({
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'คุณต้องเข้าสู่ระบบก่อนจองกิจกรรม',
                    icon: 'warning',
                });
                return;
            }
    
            if (selectedEvent.numStd == selectedEvent.numStdReserve) {
                alert('เต็ม');
                return;
            } else if (selectedEvent.status == 0) {
                alert('ปิดลงทะเบียน');
                return;
            }
    
            const reserve = {
                man_status: selectedEvent.status,
                std_ID: std_ID,
                act_ID: selectedEvent.id
            };
    
            let reservations = [];
            try {
                const checkResponse = await axios.get('/api/manage');
                reservations = checkResponse.data;
            } catch (error) {
                console.log(error);
            }
    
            if (Array.isArray(reservations) && reservations.length > 0) {
                const alreadyReserved = reservations.some(reservation => 
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
    
            const reserveResponse = await axios.post('/api/reserve/activity', reserve);
    
            if (reserveResponse.data && (reserveResponse.data.success || reserveResponse.status === 200)) {
                const updatedNumStdReserve = selectedEvent.numStdReserve + 1;
                const setActNumStdReserve = await axios.put(`/api/reserve/numStdReserve`, {
                    act_ID: selectedEvent.id,
                    numStdReserve: updatedNumStdReserve
                });
                console.log(setActNumStdReserve);
    
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
                        </div>
                    </div>
                    <div className="text-left -mt-5">
                        <h2 className="text-xl font-bold mb-4">รายละเอียดกิจกรรม</h2>
                        <p className="text-xl">ชื่อกิจกรรม : {selectedEvent.title}</p>
                        <p>สถานที่ : {selectedEvent.location}</p>
                        <p>วันที่ : {selectedEvent.start.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })} - {selectedEvent.end.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <p>
                            <span>จำนวนที่เปิดรับ :</span> 
                            <span style={{ color: selectedEvent.numStd == selectedEvent.numStdReserve ? 'red' : 'green' }}>
                                {selectedEvent.numStd == selectedEvent.numStdReserve 
                                    ? `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}` 
                                    : `${selectedEvent.numStdReserve} / ${selectedEvent.numStd}`}
                            </span>
                            <span> คน</span>
                        </p>

                        <p style={{ color: selectedEvent.numStd == selectedEvent.numStdReserve ? 'red' : selectedEvent.status === 1 ? 'green' : 'gray' }}>
                                {selectedEvent.numStd == selectedEvent.numStdReserve
                                    ? 'ลงทะเบียนเต็มแล้ว'
                                    : selectedEvent.status === 1
                                        ? 'เปิดลงทะเบียน'
                                        : 'ปิดลงทะเบียน'}
                            </p>
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
