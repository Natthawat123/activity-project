import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import './PrintCss.css';

export default function DataGridDemo() {
  const [reserves, setReserves] = useState([]);
  const [activity, setActivity] = useState({ title: '', desc: '' });
  const { act_ID } = useParams();
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios
      .get(`/api/reserve/${act_ID}`)
      .then((res) => {
        console.log(res.data); // Check the structure here

        const updatedReserves = res.data.map(s => ({
          ...s,
          fullname: `${s.std_fname} ${s.std_lname}` // Corrected template literal
        }));
        setReserves(updatedReserves);

        setActivity({
          title: res.data[0].act_title || '',
          desc: res.data[0].act_desc || ''
        });
      })
      .catch((error) => {
        console.error("Error fetching reserves:", error);
      });
  }, [act_ID]);

  const columns = [
    { field: "std_ID", headerName: "รหัสนักศึกษา", width: 150, headerAlign: 'center', align: 'center' },
    { field: "fullname", headerName: "ชื่อ - นามสกุล", width: 250, headerAlign: 'center' },
    { field: "sec_name", headerName: "หมู่เรียน", width: 150, headerAlign: 'center', align: 'center' },
  ];

  return (
    <div>
      <Box sx={{ height: 600, width: "100%", padding: "6rem" }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h4" component="div" className="print-content">{activity.title}</Typography>
          <Typography variant="subtitle1" component="div" className="print-content">{activity.desc}</Typography>
        </Box>
        <DataGrid
          rows={reserves} // Ensure this is an array
          columns={columns} // Ensure this is an array
          getRowId={(row) => row.std_ID} // Ensure this is correctly set
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          slots={{
            toolbar: role === 'admin' || role === 'teacher' ? GridToolbar : null,
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
                bodyClassName: 'print-content',
                
              },
              csvOptions: {
                fileName: 'รายชื่อผู้ลงทะเบียนเข้าร่วมกิจกรรม',
                utf8WithBom: true,
              },
            }
          }}
        />
      </Box>
    </div>
  );
}
