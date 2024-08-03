import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Summary({ activity }) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          กิจกรรม : &nbsp; {`${activity.act_title} (${activity.act_ID})`}
        </AccordionSummary>
        <AccordionDetails>
          <p>รายละเอียด: {activity.act_desc}</p>
          <p>สถานที่: {activity.act_location}</p>
          <p>
            ระยะเวลา: {`${activity.act_dateStart} - ${activity.act_dateEnd}`}
          </p>
          <p>
            จำนวน: {`${activity.act_numStdReserve} / ${activity.act_numStd}`}
          </p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
