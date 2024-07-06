import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from "web3";
import Abi from '../../components/contract/abi.json'

function Test() {
    const [reserve, setReserve] = useState([]);
    const [join, setJoin] = useState([]);
    const [activity, setActivity] = useState([]);
    const [status,setStatus] = useState('ไม่ได้ลงทะเบียน');

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(0);

    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90'
    const stdID = localStorage.getItem('std_ID');

    useEffect(() => {
        const fetchManage = async () => {
            try {
                const res = await axios.get('/api/manage');
                setReserve(res.data);
            } catch (err) {console.error(err)}
        };

        const fetchSmartContract = async () => {
            try {
                const web3 = new Web3('https://rpc.sepolia.org');
                const contract = new web3.eth.Contract(Abi, contractAddress);                    
                const res = await contract.methods.getAll().call()

                const format = res[0].map((actID, index) => ({
                    actID: Number(actID),
                    stdIDs: res[1][index]
                }));
                setJoin(format)
            } catch (err) { console.error(err)}
        };

        const fetchActivity = async () => {
            try{
                const res = await axios.get('/api/list/activity')
                setActivity(res.data)
            }catch (err) { console.log(err)}
        }

        fetchManage();
        fetchSmartContract();
        fetchActivity()
        setIsLoaded(true);
    }, []);

    const getStatus = (activityID) => {
        const joinEntry = join.find(j => j.actID == activityID && j.stdIDs.includes(stdID));
        if (joinEntry) {
            return 'เข้าร่วมกิจกรรมแล้ว';
        }
        const reserveEntry = reserve.find(r => r.act_ID == activityID && r.std_ID == stdID);
        if (reserveEntry) {
            return 'ลงทะเบียนสำเร็จ';
        }
        return 'ยังไม่ได้เข้าร่วมกิจกรรม';
    };

    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); 
    };

    const filteredItems = activity.filter((item) => {
        return item.act_title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
        const visibleItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

        return (
            <div className="mb-10 container mx-auto md:px-20">
                <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
                    <div className="text-lg font-bold mb-2">ประวัติการทำกิจกรรม</div>
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
                                    className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search for activity"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        <div className="mt-1 pb-4">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(+e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="block ps-6 pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
                            >
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
                            <tr className="flex w-full">
                                <th scope="col" className="px-6 py-3 w-1/6">รหัสกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-1/6">ชื่อกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-1/6">สถานที่จัดกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-1/6">วันที่จัดกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-1/6">สถานะการเข้าร่วม</th>
                                <th scope="col" className="px-6 py-3 w-1/6">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
    {visibleItems.map(item => (
        <tr key={item.act_ID} className="border-b-2 flex w-full">
            <td className="px-6 py-3 w-1/6">{item.act_ID}</td>
            <td className="px-6 py-3 w-1/6">{item.act_title}</td>
            <td className="px-6 py-3 w-1/6">{item.act_location}</td>
            <td className="px-6 py-3 w-1/6">{item.act_dateStart.slice(0, 10)}</td>
            <td className={`px-6 py-3 w-1/6 ${getStatus(item.act_ID) === 'เข้าร่วมกิจกรรมแล้ว' ? 'text-green-600' : 'text-red-600'}`}>
                                        {getStatus(item.act_ID)}
                                    </td>
            <td className="px-6 py-3 w-1/6">เพิ่มเติม</td>
        </tr>
    ))}
</tbody>
                    </table>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <button
                                onClick={() => {
                                    if (currentPage > 0) {
                                        setCurrentPage(prev => prev - 1);
                                    }
                                }}
                                disabled={currentPage === 0}
                                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Previous
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).slice(currentPage, currentPage + 4).map((_, i) => (
                                <button
                                    key={i + currentPage}
                                    onClick={() => setCurrentPage(currentPage + i)}
                                    className={`px-4 py-2 font-medium ${currentPage + i === currentPage ? "text-blue-600 bg-blue-100" : "text-gray-600 bg-gray-100"} border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                                >
                                    {currentPage + i + 1}
                                </button>
                            ))}

                            {currentPage + 4 < lastPage && (
                                <button
                                    onClick={() => {
                                        setCurrentPage(currentPage + 4);
                                    }}
                                    className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    ...
                                </button>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    if (currentPage < lastPage) {
                                        setCurrentPage(prev => prev + 1);
                                    }
                                }}
                                disabled={currentPage >= lastPage}
                                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Next
                            </button>
                        </div>

                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Test;