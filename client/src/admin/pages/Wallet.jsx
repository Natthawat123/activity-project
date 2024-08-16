import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper } from "@mui/material";
import Activity from "../components/Upload/Activity";
import TableStudent from "../components/Upload/TableStudent";
const id = localStorage.getItem("staff_ID");

function Wallet() {
  const [activity, setActivity] = useState([]);
  const [manage, setManage] = useState([]);
  const [username, setUsername] = useState([]);

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
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/manage/upload");
        setActivity(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchManage = async () => {
      try {
        const res = await axios.get(`/api/manage/manages`);
        setManage(res.data);
      } catch (e) {
        console.error("Error fetching manage data:", e);
      }
    };
    fetchUsername();
    fetchData();
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
    });
  });

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
      {/* <Table activities={Activities} /> */}

      {result.map((i) => {
        return (
          <>
            <div className="mb-10 container mx-auto pt-20">
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
    </>
  );
}

export default Wallet;
