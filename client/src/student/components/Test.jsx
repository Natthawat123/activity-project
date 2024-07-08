import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

function Test() {
    const [events, setEvents] = useState([]);
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
                    id: item.act_ID,
                    color: index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'green' : 'red',
                }));
                setEvents(eventList);
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาด: ', error);
            });
    }, []);
    

    const handleReserve = (event) => {
        const reserveData = {
            man_status: event.status,
            std_ID,
            act_ID: event.id
        };
        if(event.numStd == 0 ){
            alert('เต็ม');
            return
        }
        else if(event.status == 0 ){
        alert('ปิดลงทะเบียน');
        return
        }
        if(event.status == 1){
            axios.post('/api/reserve/activity', reserveData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
            alert('ลงทะเบียนสำเร็จ')
        }
        
        
        
    };

    return (
        <div>
            <h1>Test</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Reserve</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.title}</td>
                            <td>
                                {event.numStd === 0
                                    ? 'ลงทะเบียนเต็มแล้ว'
                                    : event.status === 1
                                        ? 'เปิดลงทะเบียน'
                                        : 'ปิดลงทะเบียน'}
                            </td>
                            <td>
                                <button onClick={() => handleReserve(event)}>Reserve</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Test;
