import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper } from "@mui/material";
import Activity from "../components/Upload/Activity";
import TableStudent from "../components/Upload/TableStudent";
const id = localStorage.getItem("id");

function Wallet() {
  const [activity, setActivity] = useState([]);
  const [manage, setManage] = useState([]);
  const [username, setUsername] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get("/api/auth/login");
        const usernames = res.data.map((item) => item.username);
        setUsername(usernames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchManage = async () => {
      try {
        const res = await axios.get(`/api/reserve`);
        setManage(res.data);
      } catch (e) {
        console.error("Error fetching manage data:", e);
      }
    };
    fetchUsername();
    fetchManage();
  }, []);

  const result = [];
  manage.forEach((item) => {
    let activity = result.find((act) => act.act_ID === item.act_ID);

    if (!activity) {
      activity = {
        act_ID: item.act_ID,
        act_title: item.act_title,
        act_desc: item.act_desc,
        act_dateStart: item.act_dateStart,
        act_dateEnd: item.act_dateEnd,
        act_numStd: item.act_numStd,
        act_numStdReserve: item.act_numStdReserve,
        act_location: item.act_location,
        staff_ID: item.staff_ID,
        staff_fname: item.staff_fname,
        staff_lname: item.staff_lname,
        staff_email: item.staff_email,
        students: [],
      };
      result.push(activity);
    }

    activity.students.push({
      ID: item.std_ID,
      fname: item.std_fname,
      lname: item.std_lname,
      email: item.std_email,
      section: item.sec_name,
      ids: item.ids,
    });
  });

  const filteredResult = result.filter((activity) =>
    activity.act_title.toLowerCase().includes(filter.toLowerCase())
  );

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
    <div className="pt-10 md:pt-20">
      {/* <Table activities={Activities} /> */}

      <div className="pb-4 items-center mb-0 container mx-auto md:justify-end flex justify-center">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1 ">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหากิจกรรม"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      {filteredResult.map((i) => {
        return (
          <>
            <div className="mb-10 container mx-auto ">
              <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 w-full">
                <Activity activity={i} />
                <hr />
                <TableStudent activity={i} id={id} username={username} />
              </div>
            </div>
          </>
        );
      })}
      {/* <Box sx={{ margin: 4, paddingTop: 10 }}>
        {result.map((i) => {
          return (
            <>
              <Box sx={{ marginY: 10 }}>
                <Grid container spacing={4}>
                  <Grid item xs={3}>
                    <Paper elevation="24" sx={{ padding: 1 }}>
                      <Activity activity={i} />
                    </Paper>
                  </Grid>
                  <Grid item xs={9}>
                    <Paper elevation="24">
                      <TableStudent activity={i} />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </>
          );
        })}
      </Box> */}
    </div>
  );
}

export default Wallet;
