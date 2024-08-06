import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Web3 from "web3";
import abi from "../../../components/contract/abi2.json";
const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";
import { formatDate, range, dateToUint32 } from "./Fx";

//mui
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

function T({ activities = [] }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkAllStates, setCheckAllStates] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const handleCheckboxChange = (actID, stdID, date, checked) => {
    console.log(
      `Checkbox Change - Activity ID: ${actID}, Student ID: ${stdID}, Date: ${date}, Checked: ${checked}`
    );

    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[actID]) updated[actID] = {};
      if (!updated[actID][stdID]) updated[actID][stdID] = [];

      if (checked) {
        updated[actID][stdID] = [...new Set([...updated[actID][stdID], date])];
      } else {
        updated[actID][stdID] = updated[actID][stdID].filter((d) => d !== date);
        if (updated[actID][stdID].length === 0) delete updated[actID][stdID];
      }

      if (Object.keys(updated[actID]).length === 0) delete updated[actID];

      return updated;
    });
  };

  const handleCheckAllChange = (actID, checked) => {
    setCheckAllStates((prev) => ({
      ...prev,
      [actID]: checked,
    }));

    const activity = activities.find((a) => a.act_ID === actID);
    const days = range(activity.act_dateStart, activity.act_dateEnd);

    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[actID]) updated[actID] = {};

      activity.students.forEach((s) => {
        if (checked) {
          updated[actID][s.std_ID] = days.map((d) => dateToUint32(d));
        } else {
          delete updated[actID][s.std_ID];
        }
      });

      if (Object.keys(updated[actID]).length === 0) delete updated[actID];

      return updated;
    });
  };

  const upload = async () => {
    if (!window.ethereum) {
      Swal.fire({
        icon: "error",
        title: "MetaMask Not Detected",
        text: "Please install MetaMask to proceed.",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3Instance = new Web3(window.ethereum);
      const contractInstance = new web3Instance.eth.Contract(
        abi,
        contractAddress
      );

      setWeb3(web3Instance);
      setContract(contractInstance);

      for (const actID in checkedItems) {
        const studentIds = Object.keys(checkedItems[actID] || {});
        const dayJoin = studentIds.map((stdId) => checkedItems[actID][stdId]);

        const tx = await contractInstance.methods
          .add(actID, studentIds, dayJoin)
          .send({ from: accounts[0] });
        console.log("Upload transaction sent:", tx);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Transaction: ${tx.transactionHash}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Error handling upload:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "An error occurred during upload.",
      });
    }
  };

  return (
    <div>
      {activities.map((activity) => {
        const days = range(activity.act_dateStart, activity.act_dateEnd);

        // Define columns specific to each activity
        const columns = [
          { field: "id", headerName: "รหัสนักศึกษา", width: 90 },
          {
            field: "firstName",
            headerName: "ชื่อ-นามสกุล",
            width: 150,
          },
          ...days.map((d) => ({
            field: `day_${activity.act_ID}_${dateToUint32(d)}`,
            headerName: formatDate(d).thdm,
            width: 100,
            editable: true,
            renderCell: (params) => (
              <input
                type="checkbox"
                checked={params.value}
                onChange={(e) =>
                  handleCheckboxChange(
                    activity.act_ID,
                    params.row.id,
                    dateToUint32(d),
                    e.target.checked
                  )
                }
              />
            ),
          })),
          {
            field: "checkAll",
            headerName: "ทั้งหมด",
            width: 120,
            renderCell: () => (
              <input
                type="checkbox"
                checked={checkAllStates[activity.act_ID] || false}
                onChange={(e) =>
                  handleCheckAllChange(activity.act_ID, e.target.checked)
                }
              />
            ),
          },
        ];

        const rows = activity.students.map((student) => {
          return {
            id: student.std_ID,
            firstName: `${student.std_fname} ${student.std_lname}`,
            ...days.reduce((acc, d) => {
              acc[`day_${activity.act_ID}_${dateToUint32(d)}`] =
                checkedItems[activity.act_ID]?.[student.std_ID]?.includes(
                  dateToUint32(d)
                ) || false;
              return acc;
            }, {}),
            act_ID: activity.act_ID,
          };
        });

        return (
          <div key={activity.act_ID}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${activity.act_ID}-content`}
                id={`panel${activity.act_ID}-header`}
              >
                <h2>{`${activity.act_title} (ID: ${activity.act_ID})`}</h2>
              </AccordionSummary>
              <AccordionDetails>
                <p>Description: {activity.act_desc}</p>
                <p>Duration: {days.length} days</p>
                <p>Dates: {days.map((d) => formatDate(d).th).join(", ")}</p>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                selectionModel={selectedRows}
                onSelectionModelChange={(newSelection) => {
                  setSelectedRows(newSelection);
                  handleCheckAllChange(activity.act_ID, newSelection);
                }}
              />
            </Box>
            <AccordionActions>
              <Button variant="contained" color="secondary" onClick={upload}>
                Upload
              </Button>
            </AccordionActions>
          </div>
        );
      })}
    </div>
  );
}

T.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      act_ID: PropTypes.number.isRequired,
      act_title: PropTypes.string.isRequired,
      act_desc: PropTypes.string,
      act_dateStart: PropTypes.string.isRequired,
      act_dateEnd: PropTypes.string.isRequired,
      students: PropTypes.arrayOf(
        PropTypes.shape({
          std_ID: PropTypes.string.isRequired,
          std_fname: PropTypes.string.isRequired,
          std_lname: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default T;
