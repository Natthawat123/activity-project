import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "./PrintCss.css";
import { Typography } from "@mui/material";

export default function DataGridDemo() {
  const [reserves, setReserves] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnGroupingModel, setColumnGroupingModel] = useState([]);
  const { act_ID } = useParams();
  const role = localStorage.getItem("role");

  const dateS = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0].replace(/-/g, "");
  };

  const th = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    return `${Number(day)} ${thaiMonths[parseInt(month, 10) - 1]} ${
      parseInt(year, 10) + 543
    }`;
  };

  useEffect(() => {
    axios
      .get(`/api/reserve/${act_ID}`)
      .then((res) => {
        const staticColumns = [
          {
            field: "OrderNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 0.5,
          },
          {
            field: "std_ID",
            headerName: "รหัสนักศึกษา",
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 1,
          },
          {
            field: "fullname",
            headerName: "ชื่อ - นามสกุล",
            headerAlign: "center",
            flex: 2,
          },
          {
            field: "sec_name",
            headerName: "หมู่เรียน",
            headerAlign: "center",
            align: "center",
            flex: 1,
          },
        ];

        setColumns(staticColumns);

        const updatedReserves = res.data.map((s, i) => ({
          ...s,
          fullname: `${s.std_fname} ${s.std_lname}`,
          OrderNo: i + 1,
        }));

        setReserves(updatedReserves);
      })
      .catch((error) => {
        console.error("Error fetching reserves:", error);
      });
  }, [act_ID]);

  const rowHeight = 45;

  return (
    <div className="App">
      <div className="container">
        <Box className="dataGridContainer">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              {`รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม ${reserves[0]?.act_title || ''}`}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {reserves[0]?.act_desc || ''}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {reserves[0]?.act_dateStart && reserves[0]?.act_dateEnd
                ? `ระหว่างวันที่ ${th(dateS(reserves[0].act_dateStart))} - ${th(dateS(reserves[0].act_dateEnd))}`
                : ''}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {reserves[0]?.act_location ? `ณ ${reserves[0].act_location}` : ''}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {reserves[0]?.staff_fname && reserves[0]?.staff_lname
                ? `โดย ${reserves[0].staff_fname} ${reserves[0].staff_lname}`
                : ''}
            </Typography>
          </Box>
          <DataGrid
            disableColumnSelector={!role || role == 'student' ? true : false}
            disableDensitySelector={!role || role == 'student' ? true : false}
            rows={reserves}
            columns={columns}
            rowHeight={rowHeight}
            columnGroupingModel={columnGroupingModel}
            getRowId={(row) => row.std_ID}
            pagination={false}
            sx={{
              "& .MuiDataGrid-root": {
                height: "100%",
                width: "100%",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-footerCell": {
                borderTop: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "pre-line",
              },
              "& .MuiDataGrid-main": {
                overflow: "hidden",
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                printOptions: {
                  disableToolbarButton: true,
                },
                csvOptions: role && role != "student"
                  ? {
                      fileName: "รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม",
                      utf8WithBom: true,
                    }
                  : {
                      disableToolbarButton: true,
                    },
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}
