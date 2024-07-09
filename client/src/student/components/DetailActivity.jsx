import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Web3 from 'web3';
import Abi from '../../components/contract/abi.json';

function DetailActivity() {
    const { act_ID } = useParams();
    const [activity, setActivity] = useState(null);
    const [student, setStudent] = useState(null);
    const [join, setJoin] = useState([]);
    const [reserve, setReserve] = useState([]);
    const [section, setSection] = useState([]);
    const [staff, setStaff] = useState([]);
    const navigate = useNavigate();

    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90';
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
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSection = async () => {
            try {
                const response = await axios.get(`/api/list/section`);
                setSection(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchStaff = async () => {
            try {
                const response = await axios.get(`/api/list/staff`);
                setStaff(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivity();
        fetchStudent();
        fetchSmartContract();
        fetchManage();
        fetchSection();
        fetchStaff();
    }, [act_ID, stdID]);

    if (!activity || !student) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd MMMM yyyy');
    };

    const Status = () => {
        const joinEntry = join.find(j => j.actID === activity[0].act_ID && j.stdIDs.includes(BigInt(stdID)));
        if (joinEntry) {
            return <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">เข้าร่วมแล้ว</span>;
        }

        const reserveEntry = reserve.find(r => r.act_ID === activity[0].act_ID && r.std_ID === stdID);
        if (reserveEntry) {
            return <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm">ลงทะเบียนแล้ว</span>;
        }

        return <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">ยังไม่ได้เข้าร่วม</span>;
    };

    const staffMember = staff.find(s => s.staff_ID === activity[0].staff_ID);
    const sectionName = section.find(s => s.sec_ID === student.sec_ID);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8 ">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
                    onClick={() => navigate(-1)}
                >
                    ย้อนกลับ
                </button>
                <div className='justify-center flex'>
                <div className="bg-white p-6 rounded-lg shadow-md w-fit ">

                    <h1 className="text-3xl text-center font-bold mb-4  text-gray-800">ชื่อกิจกรรม: {activity[0].act_title}</h1>
                    <div className='flex justify-center gap-9'>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">ข้อมูลกิจกรรม</h2>
                            <table className="table-auto">
                                <tbody>
                                    <tr>
                                        <td className="font-semibold text-gray-700">รหัสกิจกรรม:</td>
                                        <td className="text-gray-700">{activity[0].act_ID}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700">รายละเอียด:</td>
                                        <td className="text-gray-700">{activity[0].act_desc}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700 pr-5">จำนวนผู้เข้าร่วม: </td>
                                        <td className="text-gray-700">{activity[0].act_numStd}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700">สถานที่:</td>
                                        <td className="text-gray-700">{activity[0].act_location}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700">วันที่เริ่ม:</td>
                                        <td className="text-gray-700">{formatDate(activity[0].act_dateStart)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700">วันที่สิ้นสุด:</td>
                                        <td className="text-gray-700">{formatDate(activity[0].act_dateEnd)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold text-gray-700">สถานะ:</td>
                                        <td className="text-gray-700"><Status /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <div className="mb-8">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">ข้อมูลกิจกรรม</h2>
                        <table className="table-auto">
                            <tbody>
                                <tr>
                                    <td className="font-semibold text-gray-700">รหัสกิจกรรม:</td>
                                    <td className="text-gray-700">{activity[0].act_ID}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700">รายละเอียด:</td>
                                    <td className="text-gray-700">{activity[0].act_desc}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700 pr-5">จำนวนผู้เข้าร่วม: </td>
                                    <td className="text-gray-700">{activity[0].act_numStd}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700">สถานที่:</td>
                                    <td className="text-gray-700">{activity[0].act_location}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700">วันที่เริ่ม:</td>
                                    <td className="text-gray-700">{formatDate(activity[0].act_dateStart)}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700">วันที่สิ้นสุด:</td>
                                    <td className="text-gray-700">{formatDate(activity[0].act_dateEnd)}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-700">สถานะ:</td>
                                    <td className="text-gray-700"><Status /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                        <div>
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">ข้อมูลเจ้าหน้าที่</h2>
                                <p className="text-gray-700"><span className="font-semibold">รหัสเจ้าหน้าที่:</span> {activity[0].staff_ID}</p>
                                <p className="text-gray-700"><span className="font-semibold">ชื่อเจ้าหน้าที่:</span>
                                    {staffMember
                                        ? `${staffMember.staff_fname} ${staffMember.staff_lname}`
                                        : 'ไม่พบข้อมูล'
                                    }
                                </p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-gray-800">ข้อมูลนักศึกษา</h2>
                                <p className="text-gray-700"><span className="font-semibold">รหัสนักศึกษา:</span> {student.std_ID}</p>
                                <p className="text-gray-700"><span className="font-semibold">ชื่อนักศึกษา:</span> {`${student.std_fname} ${student.std_lname}`}</p>
                                <p className="text-gray-700"><span className="font-semibold">หมู่เรียน:</span>
                                    {sectionName
                                        ? `${sectionName.sec_name}`
                                        : 'ไม่พบข้อมูล'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

    );
}

export default DetailActivity;
