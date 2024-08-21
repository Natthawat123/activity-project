import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDate } from "./Fx";

function Activity({ activity = {} }) {
  return (
    <>
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-xl font-medium">
          รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม555
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
          <AccordionSummary aria-controls="panel1-content" id="panel1-header">
            รายละเอียดกิจกรรม
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid grid-cols-10 ">
              <h1 className="col-span-1">กิจกรรม</h1>
              <h1 className="col-span-9">{`${activity.act_title} (${activity.act_ID})`}</h1>

              <h1 className="col-span-1">รายละเอียด</h1>
              <h1 className="col-span-9">{activity.act_desc}</h1>

              <h1 className="col-span-1">จำนวนที่เปิดรับ</h1>
              <h1 className="col-span-9">
                {activity.act_numStdReserve} / {activity.act_numStd} คน
              </h1>

              <h1 className="col-span-1">ระยะเวลา</h1>
              <h1 className="col-span-9">
                {formatDate(activity.act_dateStart).th} -{" "}
                {formatDate(activity.act_dateEnd).th}
              </h1>

              <h1 className="col-span-1">สถานที่</h1>
              <h1 className="col-span-9">{activity.act_location}</h1>

              <h1 className="col-span-1">อาจารย์ผู้จัดกิจกรรม</h1>
              <h1 className="col-span-9">
                {activity.staff_fname} {activity.staff_lname}
              </h1>

              <h1 className="col-span-1">ช่องทางการติดต่อ</h1>
              <h1 className="col-span-9">{activity.staff_email}</h1>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}

export default Activity;
