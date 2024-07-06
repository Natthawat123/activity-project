import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from 'axios'
import contractAbi from '../../components/contract/abi.json';

const ProductTable = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activity, setActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(0);

    // reserve
    const [reserve, setReserve] = useState([])

    //web3
    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90';
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [getAll, setGetAll] = useState([]);
    const [stdID, setStdID] = useState('');

    // Connect to MetaMask 
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);
                setContract(contractInstance);
                return web3Instance; // Return the initialized web3 instance
            } catch (err) {
                console.error(err);
                return null;
            }
        } else {
            alert('Please install MetaMask');
            return null;
        }
    };

    // Function to handle getAll button click
    const handleGetAll = async () => {
        try {
            const web3Instance = await connectWallet();
    
            if (!web3Instance || !contract) {
                console.error('Contract or web3 not initialized.');
                return;
            }
    
            const allData = await contract.methods.getAll().call();
            const formattedData = allData[0].map((actID, index) => ({
                actID: Number(actID),
                stdIDs: allData[1][index]
            }));
    
            setGetAll(formattedData);
            console.log(formattedData);
    
            // Update activity status based on blockchain data
            const updatedActivity = activity.map(item => {
                const blockchainParticipation = formattedData.find(
                    data => data.actID === item.act_ID && data.stdIDs.includes(BigInt(stdID))
                );
                return {
                    ...item,
                    registrationStatus: blockchainParticipation 
                        ? 'เข้าร่วม' 
                        : (item.registrationStatus === 'ลงทะเบียนสำเร็จ' ? 'ไม่ได้เข้าร่วม' : 'ยังไม่ได้ลงทะเบียน')
                };
            });
    
            setActivity(updatedActivity);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityResponse = await fetch('/api/list/activity');
                const activityData = await activityResponse.json();
    
                const storedStdID = localStorage.getItem('std_ID');
                setStdID(storedStdID);
    
                const manageResponse = await axios.get('/api/manage');
                const reserveData = manageResponse.data;
                setReserve(reserveData);
                
                
                // Combine activity and reserve data
                const activityWithStatus = activityData.map(activity => {
                    const isRegistered = reserveData.some(
                        reserve => reserve.std_ID === storedStdID && reserve.act_ID === activity.act_ID.toString()
                    );
                    return {
                        ...activity,
                        registrationStatus: isRegistered ? 'ลงทะเบียนสำเร็จ' : 'ยังไม่ได้ลงทะเบียน'
                    };
                });
    
                setActivity(activityWithStatus);
                setIsLoaded(true);
            } catch (error) {
                setIsLoaded(true);
                setError(error);
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset currentPage when searching
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
            <td className={`px-6 py-3 w-1/6 ${
                item.registrationStatus === 'ลงทะเบียนสำเร็จ' || item.registrationStatus === 'เข้าร่วม' 
                    ? 'text-green-600' 
                    : 'text-red-600'
            }`}>
                {item.registrationStatus}
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

                        <button onClick={handleGetAll} className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                            Get All
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

export default ProductTable;
