import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import Abi from '../../components/contract/abi.json';

function DetailActivity() {
    const [reserve, setReserve] = useState([]);
    const [join, setJoin] = useState([]);
    const [activity, setActivity] = useState({
        act_title: "",
        act_desc: "",
        act_location: "",
        act_dateStart: "",
        act_dateEnd: "",
        act_numStd: "",
        act_status: "",
        staff_ID: "",
    });
    const { act_ID } = useParams();

    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90';

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                await axios.get(`/api/activity/${act_ID}`)
                    .then((res) => {
                        setActivity(res.data[0]);
                    });
            } catch (err) {
                console.error(err);
            }
        };

        const fetchReserve = async () => {
            try {
                await axios.get(`/api/manage`)
                    .then((res) => {
                        setReserve(res.data);
                    });
            } catch (err) {
                console.error(err);
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

        fetchSmartContract();
        fetchActivity();
        fetchReserve();
    }, [act_ID]);

    const joinedStudents = join.find(j => j.actID === Number(act_ID))?.stdIDs || [];
    const reservedStudents = reserve.filter(r => r.act_ID === act_ID).map(r => r.std_ID);

    const allJoinedStudents = joinedStudents.map(stdID => ({ stdID: stdID.toString(), status: 'เข้าร่วม' }));
    const allReservedStudents = reservedStudents.map(stdID => ({ stdID, status: 'ลงทะเบียนแล้ว' }));

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">ชื่อกิจกรรม: {activity.act_title}</h1>
                <p className="mb-2"><strong>รายละเอียด:</strong> {activity.act_desc}</p>
                <p className="mb-2"><strong>สถานที่:</strong> {activity.act_location}</p>
                <p className="mb-2"><strong>วันที่เริ่ม:</strong> {activity.act_dateStart}</p>
                <p className="mb-2"><strong>วันที่สิ้นสุด:</strong> {activity.act_dateEnd}</p>
                <p className="mb-2"><strong>จำนวนผู้เข้าร่วม:</strong> {activity.act_numStd}</p>
                <p className="mb-2"><strong>สถานะ:</strong> {activity.act_status}</p>
                <p className="mb-2"><strong>รหัสเจ้าหน้าที่:</strong> {activity.staff_ID}</p>

                <h2 className="text-2xl font-bold mt-6">ผู้เข้าร่วมกิจกรรม:</h2>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-100 text-left text-gray-800">
                                <th className="border-b border-gray-200 px-4 py-2">รหัสนักศึกษา</th>
                                <th className="border-b border-gray-200 px-4 py-2">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allJoinedStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="border-b border-gray-200 px-4 py-2">{student.stdID}</td>
                                    <td className="border-b border-gray-200 px-4 py-2">
                                        <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white">
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-bold mt-6">ผู้ลงทะเบียนแล้ว:</h2>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-100 text-left text-gray-800">
                                <th className="border-b border-gray-200 px-4 py-2">รหัสนักศึกษา</th>
                                <th className="border-b border-gray-200 px-4 py-2">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allReservedStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="border-b border-gray-200 px-4 py-2">{student.stdID}</td>
                                    <td className="border-b border-gray-200 px-4 py-2">
                                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white">
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => window.history.back()}
                >
                    ย้อนกลับ
                </button>
            </div>
        </div>
    );
}

export default DetailActivity;
