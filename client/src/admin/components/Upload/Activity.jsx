import React from "react";
import { Box, Card, CardContent, Paper } from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import { formatDate } from "./Fx";

function Activity({ activity = [] }) {
  return (
    <>
      <h1>กิจกรรม : {activity.act_title}</h1>
      <h1>รายละเอียด : {activity.act_desc}</h1>
      <p>
        {" "}
        ระยะเวลา {formatDate(activity.act_dateStart).th} {" - "}
        {formatDate(activity.act_dateEnd).th}
      </p>

      <p>ณ {activity.act_location}</p>
    </>
  );
}

export default Activity;
