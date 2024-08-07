import { useEffect, useState } from "react";
import axios from "axios";
import T from "./T";
import Web3 from "web3";
import Abi from "../../../components/contract/abi2.json";
const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

function Table() {
  const [activity, setActivity] = useState([]);
  const [join, setJoin] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/upload");
        setActivity(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();
        setJoin(res);
      } catch (err) {
        console.error("Error fetching smart contract:", err);
      }
    };

    const fetchDataAndContract = async () => {
      await Promise.all([fetchData(), fetchSmartContract()]);
      setLoading(false); // Set loading to false once both fetches are complete
    };

    fetchDataAndContract();
  }, []);

  useEffect(() => {
    if (activity.length > 0) {
      const filtered = activity.reduce((acc, act) => {
        if (!acc[act.act_ID]) {
          acc[act.act_ID] = {
            ...act,
            students: [],
          };
        }
        acc[act.act_ID].students.push({
          std_ID: act.std_ID,
          std_fname: act.std_fname,
          std_lname: act.std_lname,
        });
        return acc;
      }, {});

      setFilteredActivities(Object.values(filtered));
    }
  }, [activity]);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    <>
      <div className="mb-10 container mx-auto md:px-20 py-40">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <T activities={filteredActivities} join={join} />
        </div>
      </div>
    </>
  );
}

export default Table;
