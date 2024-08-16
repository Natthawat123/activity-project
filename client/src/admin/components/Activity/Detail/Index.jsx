import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Web3 from "web3";

import Abi from "../../../../components/contract/abi2.json";

import ActivityDetail from "./ActivityDetail.jsx";
import Student from "./Student.jsx";
import { range } from "./Fx.jsx";

function Index() {
  const [data, setData] = useState([]);
  const [join, setJoin] = useState([]);
  const [day, setDay] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [activity, setActivity] = useState([]);
  const { act_ID } = useParams();
  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";
  const id = localStorage.getItem("staff_ID");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        setData(res.data);
        setActivity(res.data[0]);
        setDay(range(res.data[0].act_dateStart, res.data[0].act_dateEnd));
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();

        const format = res.map((item) => ({
          actID: item.activityId,
          students: item.studentIds.map((id, index) => ({
            studentId: id,
            dayJoin: item.dayJoin[index].map((date) => date.toString()),
          })),
        }));
        const joinData = format.find((joinEntry) => joinEntry.actID == act_ID);

        setJoin(joinData);
      } catch (err) {
        console.error("Error fetching smart contract:", err);
      }
    };
    fetchTeacher();
    fetchActivity();
    fetchSmartContract();
  }, [act_ID]);

  if (data.length === 0) {
    return <p>Loading...</p>;
  }
  if (data.length > 0 && data[0].act_ID !== parseInt(act_ID)) {
    return <p>No activity found.</p>;
  }

  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <ActivityDetail
          activity={activity}
          teacher={teacher}
          act_ID={act_ID}
          id={id}
        />

        <Student
          act_ID={act_ID}
          day={day}
          data={data}
          join={join}
          id={id}
          activity={activity}
        />
      </div>
    </div>
  );
}

export default Index;
