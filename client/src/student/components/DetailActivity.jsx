    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useParams } from 'react-router-dom';
    import { format } from 'date-fns';
    import Web3 from 'web3'
    import Abi from '../../components/contract/abi.json'

    function DetailActivity() {
    const { act_ID } = useParams();
    const [activity, setActivity] = useState(null);
    const [student, setStudent] = useState(null); 
    const [join, setJoin] = useState([]);
    const [reserve, setReserve] = useState([])
    const [section,setSection] = useState([]);
    const [staff,setStaff] = useState([])

    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90'
    const stdID = localStorage.getItem('std_ID');

    useEffect(() => {
        const fetchActivity = async () => {
        try {
            const response = await axios.get(`/api/activity/${act_ID}`);
            setActivity(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        const fetchManage = async () => {
            try {
                const res = await axios.get('/api/manage');
                setReserve(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchStudent = async () => {
        try {
            const response = await axios.get(`/api/resume/student?id=${stdID}`);
            setStudent(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        const fetchSmartContract = async () => {
            try {
                const web3 = new Web3('https://rpc.sepolia.org');
                const contract = new web3.eth.Contract(Abi, contractAddress);
                const res = await contract.methods.getAll().call();

                const format = res[0].map((actID, index) => ({
                    actID: Number(actID),
                    stdIDs: res[1][index]
                }));

                setJoin(format);
            } catch (err) {console.error(err)}
        };

        const fetchSection = async () => {
            try {
                const response = await axios.get(`/api/list/section`);
                setSection(response.data)
            } catch (error) {console.error(error)}
        }

        const fetchStaff = async () => {
            try {
                const response = await axios.get(`/api/list/staff`);
                setStaff(response.data)
            } catch (error) {console.error(error)}
        }

        fetchActivity();
        fetchStudent(); 
        fetchSmartContract()
        fetchManage()
        fetchSection()
        fetchStaff()
    }, [act_ID, stdID]); 
    console.log(section)
    console.log(student)

    if (!activity || !student ) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    
    const Status = () => {
        const joinEntry = join.find(j => j.actID == activity[0].act_ID && j.stdIDs.includes(BigInt(stdID)));
        if (joinEntry) {
        return <span className="badge badge-success">เข้าร่วมกิจกรรมแล้ว</span>;
        }

        const reserveEntry = reserve.find(r => r.act_ID == activity[0].act_ID && r.std_ID == stdID);
        if (reserveEntry) {
        return <span className="badge badge-primary">ลงทะเบียนสำเร็จ</span>;
        }

        return <span className="badge badge-warning">ยังไม่ได้เข้าร่วมกิจกรรม</span>;
    };

    const staffMember = staff.find(s => s.staff_ID == activity[0].staff_ID)
    const sectionName = section.find(s => s.sec_ID == student.sec_ID)

    return (
        <div>
        <h1>Title: {activity[0].act_title}</h1>
        <h1>Act ID: {activity[0].act_ID}</h1>
        <p>Description: {activity[0].act_desc}</p>
        <p>Number of Students: {activity[0].act_numStd}</p>
        <p>Staff ID: {activity[0].staff_ID}</p>
        <p>Staff Name: 
            {staffMember 
                ? `${staffMember.staff_fname} ${staffMember.staff_lname}`
                : 'Not found'
            }
        </p>      
        <p>Location: {activity[0].act_location}</p>
        <p>Start Date: {formatDate(activity[0].act_dateStart)}</p>
        <p>End Date: {formatDate(activity[0].act_dateEnd)}</p>
        <p>Status: <Status /></p>

        <hr />
        <p>ID : {student.std_ID}</p>
        <p>Name : {`${student.std_fname} ${student.std_lname}`}</p>
        <p>Section: 
            {sectionName 
                ? `${sectionName.sec_name}`
                : 'Not found'
            }
        </p>  
        <h1 className='text-9xl'>ขอปุ่มย้อนกลับด้วย</h1>
        </div>
    );
    }

    export default DetailActivity;
