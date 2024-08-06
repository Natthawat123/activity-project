import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridPrintExportMenuItem,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";

export default function DataGridDemo() {
  const [reserves, setReserves] = useState([]);
  const { act_ID } = useParams();

  useEffect(() => {
    axios
      .get(`/api/reserve/${act_ID}`)
      .then((res) => {
        setReserves(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reserves:", error);
      });
  }, [act_ID]);

  // const actTitle = reserves.map((r) => r.find((r) => ))

  const columns = [
    { field: "std_ID", headerName: "Student ID", width: 150 },
    { field: "std_fname", headerName: "First Name", width: 150 },
    { field: "std_lname", headerName: "Last Name", width: 150 },
    { field: "std_email", headerName: "Email", width: 200 },
    { field: "std_mobile", headerName: "Mobile", width: 150 },
    { field: "std_address", headerName: "Address", width: 200 },
    { field: "province", headerName: "Province", width: 150 },
    { field: "district", headerName: "District", width: 150 },
    { field: "subdistrict", headerName: "Subdistrict", width: 150 },
    { field: "zipcode", headerName: "Zipcode", width: 100 },
    { field: "act_ID", headerName: "Activity ID", width: 150 },
    { field: "act_title", headerName: "Activity Title", width: 200 },
    { field: "act_desc", headerName: "Activity Description", width: 250 },
    {
      field: "act_dateStart",
      headerName: "Start Date",
      width: 200,
      valueGetter: (params) =>
        params.row?.act_dateStart
          ? new Date(params.row.act_dateStart).toLocaleString()
          : "N/A",
    },
    {
      field: "act_dateEnd",
      headerName: "End Date",
      width: 200,
      valueGetter: (params) =>
        params.row?.act_dateEnd
          ? new Date(params.row.act_dateEnd).toLocaleString()
          : "N/A",
    },
    { field: "act_location", headerName: "Location", width: 150 },
    { field: "act_numStd", headerName: "Number of Students", width: 150 },
    {
      field: "act_numStdReserve",
      headerName: "Number of Reserved Students",
      width: 200,
    },
    { field: "act_status", headerName: "Activity Status", width: 150 },
    {
      field: "act_createAt",
      headerName: "Creation Date",
      width: 200,
      valueGetter: (params) =>
        params.row?.act_createAt
          ? new Date(params.row.act_createAt).toLocaleString()
          : "N/A",
    },
    { field: "act_transaction", headerName: "Transaction", width: 150 },
    { field: "sec_ID", headerName: "Section ID", width: 150 },
    { field: "sec_name", headerName: "Section Name", width: 150 },
    { field: "staff_ID", headerName: "Staff ID", width: 150 },
    { field: "staff_fname", headerName: "Staff First Name", width: 150 },
    { field: "staff_lname", headerName: "Staff Last Name", width: 150 },
    { field: "man_status", headerName: "Management Status", width: 150 },
    { field: "login_ID", headerName: "Login ID", width: 150 },
  ];

  return (
    <div>
      <Box sx={{ height: 600, width: "100%", padding: "6rem" }}>
        <DataGrid
          rows={reserves}
          columns={columns}
          getRowId={(row) => row.std_ID}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          slotProps={{
            toolbar: {
              printOptions: {
                hideFooter: true,
                hideToolbar: true,
              },
              csvOptions: {
                fileName: `รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม `,
                utf8WithBom: true,
              },
            },
          }}
        />
      </Box>
    </div>
  );
}
