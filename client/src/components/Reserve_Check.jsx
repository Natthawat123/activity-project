import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "./PrintCss.css";
import { range } from "../admin/components/Upload/Fx";

export default function DataGridDemo() {
  const [reserves, setReserves] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnGroupingModel, setColumnGroupingModel] = useState([]);
  const { act_ID } = useParams();
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios
      .get(`/api/reserve/${act_ID}`)
      .then((res) => {
        const dateRange = range(
          res.data[0].act_dateStart,
          res.data[0].act_dateEnd
        );

        // Generate dynamic columns with editable fields
        const dateColumns = dateRange.map((date) => ({
          field: date,
          headerName: date,
          headerAlign: "center",
          align: "center",
          flex: 1,
        }));

        const staticColumns = [
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

        setColumns([...staticColumns, ...dateColumns]);

        // Set up column grouping
        setColumnGroupingModel([
          {
            groupId: "Headers",
            headerName: `รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม ${res.data[0].act_title}`,
            headerAlign: "center",
            headerClassName: "custom-header",
            children: [
              {
                groupId: "Date",
                headerName: "วันที่จัดกิจกรรม",
                headerAlign: "center",
                children: dateColumns.map((column) => ({
                  field: column.field,
                })),
              },
              {
                groupId: "Activity",
                headerName: "รายละเอียดผู้ลงทะเบียน",
                headerAlign: "center",
                children: staticColumns.map((column) => ({
                  field: column.field,
                })),
              },
            ],
          },
        ]);

        const updatedReserves = res.data.map((s) => ({
          ...s,
          fullname: `${s.std_fname} ${s.std_lname}`,
          ...dateRange.reduce(
            (acc, date) => ({
              ...acc,
              [date]: s[date] || "",
            }),
            {}
          ),
        }));

        setReserves(updatedReserves);
      })
      .catch((error) => {
        console.error("Error fetching reserves:", error);
      });
  }, [act_ID]);

  // Calculate row height based on the number of rows and available A4 height
  const rowHeight = 55; // Set a default height here
  const numRows = reserves.length;
  const totalHeight = numRows * rowHeight;
  const maxRowsPerPage = Math.floor((210 - 20) / rowHeight); // A4 height minus margins

  return (
    <div className="App w-3/4 mx-auto my-10 bg-slate-50 rounded-lg shadow-xl p-10 z-50 flex justify-center print-content">
      <div className="w-[297mm] h-[210mm] border text-center">
        <Box sx={{ height: "100%", width: "100%"}}>
          <DataGrid
            rows={reserves}
            columns={columns}
            rowHeight={rowHeight}
            columnGroupingModel={columnGroupingModel}
            getRowId={(row) => row.std_ID}
            pagination={false} // Disable pagination during print
            sx={{
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-footerCell": {
                borderTop: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-main": {
                overflowY: "hidden",
              },
              "@media print": {
                ".MuiDataGrid-main": {
                  width: "297mm",
                  height: "210mm",
                  margin: "0", 
                  padding: "0",
                },
                ".MuiDataGrid-row": {
                  pageBreakInside: "avoid", // Ensure rows don't split across pages
                },
                ".MuiDataGrid-columnHeaders": {
                  pageBreakInside: "avoid", // Ensure headers don't split across pages
                },
                ".MuiDataGrid-footer": {
                  display: "none", // Hide footer for a better print layout
                },
                ".MuiDataGrid-scrollbar": {
                  display: "none !important", // Hide scrollbars during print
                },
              },
            }}
            slots={{
              toolbar:
                role === "admin" || role === "teacher" ? GridToolbar : null,
            }}
            slotProps={{
              toolbar: {
                printOptions: {
                  hideFooter: true,
                  hideToolbar: true,
                  bodyClassName: "print-content",
                },
                csvOptions: {
                  fileName: "รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม",
                  utf8WithBom: true,
                },
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
}
