import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Abi from '../../components/contract/abi.json';

function DetailStudent() {
    const [activity, setActivity] = useState([]);
    const [student, setStudent] = useState('');
    const [join, setJoin] = useState([]);
    const [reserve, setReserve] = useState([]);
    const [section, setSection] = useState([]);
    const [staff, setStaff] = useState([]);
    const [sortOrder, setSortOrder] = useState('latest');

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    const { std_ID } = useParams();
    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90';

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`/api/resume/student?id=${std_ID}`);
                setStudent(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchActivity = async () => {
            try {
                const response = await axios.get(`/api/activity`);
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
    }, [std_ID]);

    const sectionName = section.find(s => s.sec_ID == student.sec_ID);

    const getStatus = (activityID) => {
        const joinEntry = join.find(j => j.actID == activityID && j.stdIDs.includes(BigInt(std_ID)));
        if (joinEntry) {
            return 'Joined';
        }
        const reserveEntry = reserve.find(r => r.act_ID == activityID && r.std_ID == std_ID);
        if (reserveEntry) {
            return 'Reserved';
        }
        return 'Not joined';
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(0);
    };

    
    const handleSortChange = () => {
        setSortOrder(prevOrder => prevOrder === 'latest' ? 'oldest' : 'latest');
    };

    const filteredItems = activity.filter((item) => {
        const status = getStatus(item.act_ID);
        return (
            item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'default' ||
                (filter === 'joinEntry' && status === 'Joined') ||
                (filter === 'reserveEntry' && status === 'Reserved') ||
                (filter === 'notjoin' && status === 'Not joined'))
        );
    });

    const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
    const visibleItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
            <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-6'>
                        <div>
                            <h1 className='text-lg font-bold'>Student Information</h1>
                            <p className='text-base'>Student ID: {student.std_ID}</p>
                            <p className='text-base'>Name: {student.std_fname} {student.std_lname}</p>
                            <p className='text-base'>Section: {sectionName ? sectionName.sec_name : 'Not found'}</p>
                        </div>

                        <div>
                            <h1 className='text-lg font-bold'>Contact Information</h1>
                            <p className='text-base'>Email: {student.std_email}</p>
                            <p className='text-base'>Mobile: {student.std_mobile}</p>
                            <p className='text-base'>Address: {student.std_address}</p>
                            <p className='text-base'>Province: {student.province}</p>
                            <p className='text-base'>District: {student.district}</p>
                            <p className='text-base'>Sub District: {student.subdistrict}</p>
                            <p className='text-base'>Zipcode: {student.zipcode}</p>
                        </div>
                    </div>

                    <div className='mb-6'>
                        <h1 className='text-lg font-bold'>Activity History</h1>
                        <div className="flex justify-between">

                        <div className="pb-4 items-center">
                            <label htmlFor="table-search" className="sr-only">Search</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search"
                                    className='block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder="ค้นหากิจกรรม"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="flex pb-4 items-center">
                                <label htmlFor="filter-activity-type" className="sr-only">Filter</label>
                                <div className="relative">
                                    <select
                                        value={filter}
                                        onChange={handleFilterChange}
                                        className="text-xs block p-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="default" className='text-center'>ทั้งหมด</option>
                                        <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                                        <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                                        <option value="notjoin">ยังไม่ได้ลงทะเบียน</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex pb-4 items-center">
                                <button
                                    onClick={handleSortChange}
                                    className="block p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    วันที่ ({sortOrder === 'latest' ? 'ล่าสุด' : 'ใหม่สุด'})
                                </button>
                            </div>
                        </div>

                    </div>

                        <table className='w-full mt-4 text-sm text-gray-800'>
                            <thead className='bg-gray-200'>
                                <tr className='text-left'>
                                    <th className='px-6 py-3'>Activity ID</th>
                                    <th className='px-6 py-3'>Title</th>
                                    <th className='px-6 py-3'>Location</th>
                                    <th className='px-6 py-3'>Date</th>
                                    <th className='px-6 py-3'>Status</th>
                                    <th className='px-6 py-3'>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleItems.map((item) => (
                                    <tr key={item.act_ID} className='border-t'>
                                        <td className='px-6 py-4'>{item.act_ID}</td>
                                        <td className='px-6 py-4'>{item.act_title}</td>
                                        <td className='px-6 py-4'>{item.act_location}</td>
                                        <td className='px-6 py-4'>{item.act_dateStart.slice(0, 10)}</td>
                                        <td className={`px-6 py-4 ${getStatus(item.act_ID) === 'Joined' ? 'text-green-500' : getStatus(item.act_ID) === 'Not joined' ? 'text-red-500' : ''}`}>
                                            {getStatus(item.act_ID)}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <button
                                                className='text-blue-500 hover:underline focus:outline-none'
                                                onClick={() => navigate(`/activity/detail/${item.act_ID}`)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className='flex justify-end mt-4'>
                            <button
                                onClick={() => {
                                    if (currentPage > 0) {
                                        setCurrentPage((prev) => prev - 1);
                                    }
                                }}
                                disabled={currentPage === 0}
                                className={`px-4 py-2 mx-1 text-sm bg-gray-50 rounded-lg font-medium ${currentPage === 0 ? 'text-gray-400  cursor-not-allowed' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                ก่อนหน้า
                            </button>

                            {Array.from({ length: Math.min(5, lastPage + 1) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`px-4 py-2 mx-1 text-sm rounded-lg font-medium ${currentPage === index ? 'text-blue-500 bg-blue-100' : 'text-gray-700 hover:text-gray-900'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    if (currentPage < lastPage) {
                                        setCurrentPage((prev) => prev + 1);
                                    }
                                }}
                                disabled={currentPage >= lastPage}
                                className={`px-4 py-2 mx-1 text-sm bg-gray-50 rounded-lg font-medium ${currentPage === lastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 bg-gray-50'}`}
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailStudent;
