import { useEffect, useState } from "react";
import axios from "axios";
import Summary from "./Summary";
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

  const groupedActivities = activity.reduce((acc, act) => {
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
  console.log(Object.values(groupedActivities));

  return (
    <>
      <h1 className="mt-[200px]"></h1>
      {Object.values(groupedActivities).map((act) => (
        <div key={act.act_ID}>
          <Summary activity={act} />
          <T
            students={act.students}
            activity={act} // This is fine as it shows all activities
          />
        </div>
      ))}
    </>
  );
}

export default Table;
