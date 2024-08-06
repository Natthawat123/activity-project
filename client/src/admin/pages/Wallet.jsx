import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Upload/Table";

function Wallet() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/upload");
        setActivity(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Activities = Object.values(
    activity.reduce((acc, act) => {
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
    }, {})
  );

  return (
    <>
      <Table activities={Activities} />
    </>
  );
}

export default Wallet;
