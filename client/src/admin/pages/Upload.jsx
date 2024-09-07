import { useEffect, useState, lazy } from "react";
import axios from "axios";

const Activity = lazy(() => import("../components/Upload2/Activity"));
const Table = lazy(() => import("../components/Upload2/Table"));

function Upload() {
  const [activity, setActivity] = useState([]);
  const [participate, setParticipate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/actByStatus`);
        setActivity(res.data);
      } catch (error) {
        console.error("fetch activity fail", error);
      }
    };
    const fetchParicipate = async () => {
      try {
        const res = await axios.get(`/api/par`);
        setParticipate(res.data);
        setLoading(false);
      } catch (error) {
        console.error("fetch participate fail", error);
      }
    };
    fetchActivity();
    fetchParicipate();
  }, []);

  const parByAct_ID = (act_ID) => {
    return participate.filter((i) => i.act_ID === act_ID);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-10 container mx-auto md:px-20 py-40 ">
      {activity.map((i, index) => (
        <div
          className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full"
          key={index}
        >
          <Activity activity={i} />
          <Table activity={i} student={parByAct_ID(i.act_ID)} />
        </div>
      ))}
    </div>
  );
}

export default Upload;
