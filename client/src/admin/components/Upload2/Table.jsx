import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import abi from "../../../components/contract/abi2.json";
import { formatDate, range, dateToUint32 } from "./Fx";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

function Table({ activity = {}, student = [] }) {
  const { students = [] } = activity;
  const [checkedItems, setCheckedItems] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const days = range(activity.act_dateStart, activity.act_dateEnd);

  const handleCheckboxChange = (actID, stdID, date, checked) => {
    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[actID]) {
        updated[actID] = { act_title: activity.act_title, students: {} };
      }
      if (!updated[actID].students[stdID]) {
        updated[actID].students[stdID] = [];
      }

      if (checked) {
        updated[actID].students[stdID] = [
          ...new Set([...updated[actID].students[stdID], date]),
        ];
      } else {
        updated[actID].students[stdID] = updated[actID].students[stdID].filter(
          (d) => d !== date
        );
        if (updated[actID].students[stdID].length === 0) {
          delete updated[actID].students[stdID];
        }
      }

      if (Object.keys(updated[actID].students).length === 0) {
        delete updated[actID];
      }

      return updated;
    });
  };
  console.log(checkedItems);

  const handleCheckAllChange = (checked) => {
    setCheckAll(checked);

    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[activity.act_ID]) {
        updated[activity.act_ID] = {
          act_title: activity.act_title,
          students: {},
        };
      }

      activity.students.forEach((s) => {
        if (checked) {
          updated[activity.act_ID].students[s.ID] = days.map((d) =>
            dateToUint32(d)
          );
        } else {
          delete updated[activity.act_ID].students[s.ID];
        }
      });

      if (Object.keys(updated[activity.act_ID].students).length === 0) {
        delete updated[activity.act_ID];
      }

      console.log("Updated Check All:", updated);
      return updated;
    });
  };

  const handleCheckAllStudentChange = (stdID, checked) => {
    setCheckedItems((prev) => {
      const updated = { ...prev };
      if (!updated[activity.act_ID]) {
        updated[activity.act_ID] = {
          act_title: activity.act_title,
          students: {},
        };
      }

      if (checked) {
        updated[activity.act_ID].students[stdID] = days.map((d) =>
          dateToUint32(d)
        );
      } else {
        delete updated[activity.act_ID].students[stdID];
      }

      if (Object.keys(updated[activity.act_ID].students).length === 0) {
        delete updated[activity.act_ID];
      }

      return updated;
    });
  };

  useEffect(() => {
    if (activity.students) {
      const allChecked = activity.students.every((student) =>
        days.every((d) =>
          checkedItems[activity.act_ID]?.students[student.ID]?.includes(
            dateToUint32(d)
          )
        )
      );
      setCheckAll(allChecked);
    }
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
        const actData = checkedItems[actID];
        const studentIds = Object.keys(actData.students);
        const dayJoin = studentIds.map((stdId) => actData.students[stdId]);
        const actIDUint32 = web3Instance.utils.numberToHex(parseInt(actID));
        const studentIdsUint32 = studentIds.map((id) =>
          web3Instance.utils.numberToHex(parseInt(id))
        );

        const dayJoinUint32 = dayJoin.map((days) =>
          days.map((day) => web3Instance.utils.numberToHex(parseInt(day)))
        );

        const tx = await contractInstance.methods
          .add(actIDUint32, studentIdsUint32, dayJoinUint32)
          .send({ from: accounts[0] });

        // Await each API call to ensure sequential execution
        await axios.put(`/api/updateStatus/${actID}`);
        await axios.put(`/api/transection/${actID}`, {
          act_transaction: tx.transactionHash,
        });

        const notCheckedStudents = activity.students
          .filter(
            (student) => !checkedItems[activity.act_ID]?.students[student.ID]
          )
          .map((student) => student.ID);

        await axios.put(`/api/status/status`, {
          act_ID: actID,
          std_IDs: notCheckedStudents,
        });

        await axios.put(`/api/manage`, {
          act_ID: actID,
          std_ID: studentIds,
        });

        await axios.post(`/api/new`, {
          news_topic: `ยืนยันผลการเข้าร่วมกิจกรรม ${activity.act_title}`,
          news_desc: "สามารถดูรายละเอียดการเข้าร่วมกิจกรรมได้ที่แล้ววันนี้",
          news_date: new Date(),
          user_ID: studentIds,
        });

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
    {
      field: "checkAllStudent",
      headerName: (
        <>
          <Checkbox
            checked={checkAll}
            onChange={(e) => handleCheckAllChange(e.target.checked)}
          />
          <span>ทั้งหมด</span>
        </>
      ),
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          checked={days.every((d) =>
            checkedItems[activity.act_ID]?.students[params.row.id]?.includes(
              dateToUint32(d)
            )
          )}
          onChange={(e) =>
            handleCheckAllStudentChange(params.row.id, e.target.checked)
          }
        />
      ),
    },
    {
      field: "id",
      headerName: "รหัสนักศึกษา",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "ชื่อ-นามสกุล",
      width: 250,
      headerAlign: "center",
    },
    ...days.map((day, index) => ({
      field: `checkbox_${index}`,
      headerName: formatDate(day).th,
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
          checked={checkedItems[activity.act_ID]?.students[
            params.row.id
          ]?.includes(dateToUint32(day))}
          onChange={(e) =>
            handleCheckboxChange(
              activity.act_ID,
              params.row.id,
              dateToUint32(day),
              e.target.checked
            )
          }
        />
      ),
    })),
  ];

  const rows = student.map((i) => ({
    id: i.std_ID,
    name: i.std_fname + i.std_lname,
  }));

  return (
    <div>
      <Box sx={{ height: 400, width: "100%" }}>
        {rows.length > 0 ? (
          <DataGrid rows={rows} columns={columns} />
        ) : (
          <p>No students available</p>
        )}
      </Box>
      <Button onClick={upload}>Upload</Button>
    </div>
  );
}

export default Table;
