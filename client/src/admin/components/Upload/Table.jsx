import { useEffect, useState } from "react";
import axios from "axios";
import T from "./T";

function Table() {
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
      <div className="mb-10 container mx-auto md:px-20 py-40">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
          <T activities={Activities} />
        </div>
      </div>
    </>
  );
}

export default Table;
