import React , {useState,useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Web3 from 'web3';

import Abi from '../../components/contract/abi.json'


function DetailActivity() {
    const [reserve, setReserve] = useState([]);
    const [join, setJoin] = useState([])
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
    
    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90'

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                await axios.get(`/api/activity/${act_ID}`)
                .then((res)=>{
                    setActivity(res.data[0])
                })
            }catch(err) {console.error(err);}
        }

        const fetchReserve =   async () => {
            try {
                await axios.get(`/api/manage`)
                .then((res)=>{
                    setReserve(res.data)
                })
            }catch(err) {console.error(err);}
        }

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

        fetchSmartContract()
        fetchActivity()
        fetchReserve()
    }, [act_ID]);
    console.log(act_ID)
    console.log(join)
    console.log(reserve)
    
    const joinedStudents = join.find(j => j.actID == Number(act_ID))?.stdIDs || [];
    const reservedStudents = reserve.filter(r => r.act_ID == act_ID).map(r => r.std_ID);

    const allStudents = [
        ...joinedStudents.map(stdID => ({ stdID: stdID.toString(), status: 'เข้าร่วม' })),
        ...reservedStudents.map(stdID => ({ stdID, status: 'ลงทะเบียนแล้ว' }))
      ];
    
  return (
    <div>
        <h1>title : {activity.act_title}</h1>
        <p>desc : {activity.act_desc}</p>
        <p>Location: {activity.act_location}</p>
        <p>Start Date: {activity.act_dateStart}</p>
        <p>End Date: {activity.act_dateEnd}</p>
        <p>Number of Students: {activity.act_numStd}</p>
        <p>Status: {activity.act_status}</p>
        <p>Staff ID: {activity.staff_ID}</p>

        

<h2>Student Participants:</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Student ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {allStudents.map((student, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.stdID}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  
                  color: student.status === 'เข้าร่วม' ? '#4CAF50' : '#FFC107'
                }}>
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 className='text-9xl'>Go back</h1>
    </div>
  )
}

export default DetailActivity