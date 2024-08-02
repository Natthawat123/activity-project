import { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import { useNavigate } from "react-router-dom";

function Dash_users() {
  const [activity, setActivity] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [countActivity, setCountActivity] = useState(0);
  const [reserve, setReserve] = useState([]);
  const [join, setJoin] = useState([]);
  const [joinedCount, setJoinedCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [notJoinedCount, setNotJoinedCount] = useState(0);

  useEffect(() => {
    fetch("/api/activitys")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setActivity(result);

          setCountActivity(result.length);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";
  const stdID = localStorage.getItem("std_ID");

  useEffect(() => {
    const fetchManage = async () => {
      try {
        const res = await axios.get("/api/reserve");
        setReserve(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.getAll().call();

        const format = res[0].map((actID, index) => ({
          actID: Number(actID),
          stdIDs: res[1][index],
        }));

        setJoin(format);
      } catch (err) {
        console.error(err);
      }
    };

    fetchManage();
    fetchSmartContract();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (activity.length > 0) {
      const joined = activity.filter(
        (item) => getStatus(item.act_ID) == "เข้าร่วมกิจกรรมแล้ว"
      ).length;
      const registered = activity.filter(
        (item) => getStatus(item.act_ID) == "ลงทะเบียนสำเร็จ"
      ).length;
      const notJoined = activity.filter(
        (item) => getStatus(item.act_ID) == "ยังไม่ได้เข้าร่วมกิจกรรม"
      ).length;

      setJoinedCount(joined);
      setRegisteredCount(registered);
      setNotJoinedCount(notJoined);
    }
  }, [activity, join, reserve]);

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) => j.actID == activityID && j.stdIDs.includes(BigInt(stdID))
    );
    if (joinEntry) {
      return "เข้าร่วมกิจกรรมแล้ว";
    }
    const reserveEntry = reserve.find(
      (r) => r.act_ID == activityID && r.std_ID == stdID
    );
    if (reserveEntry) {
      return "ลงทะเบียนสำเร็จ";
    }
    return "ยังไม่ได้เข้าร่วมกิจกรรม";
  };

  return (
    <div className="container mx-auto px-10 md:px-20 mb-5">
      <div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-2 pl-2 pt-3">
            <div className="bg-teal-600 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-blue-600">
              <div className="text-2xl flex items-center gap-2">
                <div className="text-sm font-semibold">จำนวนกิจกรรมทั้งหมด</div>
              </div>
              <div className="text-center text-4xl font-bold">
                {countActivity}
              </div>
            </div>

            <div className="bg-green-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-green-600">
              <p className="text-sm font-semibold">
                จำนวนกิจกรรมที่เข้าร่วมแล้ว
              </p>
              <div className="text-center text-4xl font-bold">
                {" "}
                {joinedCount}
              </div>
            </div>

            <div className="bg-green-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-green-600">
              <p className="text-sm font-semibold">
                {" "}
                จำนวนกิจกรรมที่ลงทะเบียนแล้ว{" "}
              </p>
              <div className="text-center text-4xl font-bold">
                {registeredCount}
              </div>
            </div>
            <div className="bg-green-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-green-600">
              <p className="text-sm font-semibold">
                จำนวนกิจกรรมที่ยังไม่ได้เข้าร่วม{" "}
              </p>
              <div className="text-center text-4xl font-bold">
                {notJoinedCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash_users;
