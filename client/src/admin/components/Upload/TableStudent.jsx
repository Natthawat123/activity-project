import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import abi from "../../../components/contract/abi2.json";
const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";
import { formatDate, range, dateToUint32 } from "./Fx";
import axios from "axios";

//mui
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

function TableStudent({ activity = [] }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const days = range(activity.act_dateStart, activity.act_dateEnd);

  const handleCheckboxChange = (actID, stdID, date, checked) => {
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

  const handleCheckAllChange = (checked) => {
    setCheckAll(checked);

    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[activity.act_ID]) updated[activity.act_ID] = {};

      activity.students.forEach((s) => {
        if (checked) {
          updated[activity.act_ID][s.ID] = days.map((d) => dateToUint32(d));
        } else {
          delete updated[activity.act_ID][s.ID];
        }
      });

      if (Object.keys(updated[activity.act_ID]).length === 0)
        delete updated[activity.act_ID];

      return updated;
    });
  };

  const handleCheckAllStudentChange = (stdID, checked) => {
    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[activity.act_ID]) updated[activity.act_ID] = {};

      if (checked) {
        updated[activity.act_ID][stdID] = days.map((d) => dateToUint32(d));
      } else {
        delete updated[activity.act_ID][stdID];
      }

      if (Object.keys(updated[activity.act_ID]).length === 0)
        delete updated[activity.act_ID];

      return updated;
    });
  };

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = activity.students.every((student) =>
      days.every((d) =>
        checkedItems[activity.act_ID]?.[student.ID]?.includes(dateToUint32(d))
      )
    );
    setCheckAll(allChecked);
  }, [checkedItems, activity.act_ID, activity.students, days]);

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
        await axios.put(`/api/updateStatus/${actID}`);
        await axios.put(`/api/transection/${actID}`, {
          act_transaction: tx.transactionHash,
        });
        await axios.post("/api/news");

        console.log("Upload transaction sent:", tx);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Transaction: ${tx.transactionHash}`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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

  const columns = [
    { field: "id", headerName: "รหัสนักศึกษา", width: 90 },
    {
      field: "firstName",
      headerName: "ชื่อ-นามสกุล",
      width: 150,
    },
    {
      field: "checkAllStudent",
      headerName: "Check All",
      width: 100,
      renderCell: (params) => (
        <Checkbox
          checked={days.every((d) =>
            checkedItems[activity.act_ID]?.[params.row.id]?.includes(
              dateToUint32(d)
            )
          )}
          onChange={(e) =>
            handleCheckAllStudentChange(params.row.id, e.target.checked)
          }
        />
      ),
    },
    ...days.map((d) => ({
      field: `day_${activity.act_ID}_${dateToUint32(d)}`,
      headerName: formatDate(d).thdm,
      width: 100,
      editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={
            checkedItems[activity.act_ID]?.[params.row.id]?.includes(
              dateToUint32(d)
            ) || false
          }
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
  ];

  const rows = activity.students.map((student) => {
    return {
      id: student.ID,
      firstName: `${student.fname} ${student.lname}`,
      ...days.reduce((acc, d) => {
        acc[`day_${activity.act_ID}_${dateToUint32(d)}`] =
          checkedItems[activity.act_ID]?.[student.ID]?.includes(
            dateToUint32(d)
          ) || false;
        return acc;
      }, {}),
      act_ID: activity.act_ID,
    };
  });
  console.log(checkedItems);

  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
          <Checkbox
            checked={checkAll}
            onChange={(e) => handleCheckAllChange(e.target.checked)}
          />
          <span>Check All</span>
        </Box>
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
          disableSelectionOnClick
        />
      </Box>
      <Button variant="contained" color="secondary" onClick={upload}>
        Upload
      </Button>
    </div>
  );
}

export default TableStudent;
