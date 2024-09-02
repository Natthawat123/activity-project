import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import Abi from "../../../components/contract/abi2.json";

export const ContextActivity = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [contract, setContract] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activitys`);
        setActivities(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoaded(true);
      }
    };
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeacher(res.data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };
    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();
        setContract(res);
      } catch (err) {
        console.error("Error fetching smart contract:", err);
      }
    };

    fetchActivity();
    fetchTeacher();
    fetchSmartContract();
  }, []);

  const getActivityByID = (act_ID) => {
    const activity = activities.find((i) => i.act_ID == act_ID);
    return activity;
  };

  return (
    <ContextActivity.Provider
      value={{
        activities,
        setActivities,
        error,
        isLoaded,
        getActivityByID,
        teacher,
        setTeacher,
        contract,
        setContract,
      }}
    >
      {children}
    </ContextActivity.Provider>
  );
};
