import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDate } from "./Fx.jsx";

function Activity({ activity }) {
  if (!activity) {
    return <div>No activity data available</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-xl font-medium">
          รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม
        </h1>
        <h1 className="text-3xl font-bold pt-4">{activity.act_title}</h1>
      </div>
      <div className="flex justify-start">
        <Accordion
          sx={{
            width: "100%",
            boxShadow: "none",
            border: "none",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            รายละเอียดกิจกรรม
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid grid-cols-10 gap-2">
              <h1 className="col-span-2 font-semibold">กิจกรรม:</h1>
              <p className="col-span-8">{`${activity.act_title} (${activity.act_ID})`}</p>

              <h1 className="col-span-2 font-semibold">รายละเอียด:</h1>
              <p className="col-span-8">{activity.act_desc}</p>

              <h1 className="col-span-2 font-semibold">จำนวนที่เปิดรับ:</h1>
              <p className="col-span-8">
                {activity.act_numStdReserve} / {activity.act_numStd} คน
              </p>

              <h1 className="col-span-2 font-semibold">ระยะเวลา:</h1>
              <p className="col-span-8">
                {formatDate(activity.act_dateStart).th} -{" "}
                {formatDate(activity.act_dateEnd).th}
              </p>

              <h1 className="col-span-2 font-semibold">สถานที่:</h1>
              <p className="col-span-8">{activity.act_location}</p>

              <h1 className="col-span-2 font-semibold">
                อาจารย์ผู้จัดกิจกรรม:
              </h1>
              <p className="col-span-8">
                {activity.staff_fname} {activity.staff_lname}
              </p>

              <h1 className="col-span-2 font-semibold">ช่องทางการติดต่อ:</h1>
              <p className="col-span-8">{activity.staff_email}</p>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}

export default Activity;
