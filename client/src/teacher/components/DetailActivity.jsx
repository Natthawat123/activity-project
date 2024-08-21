import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Gauge } from "@mui/x-charts/Gauge";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";

import Abi from "../../components/contract/abi2.json";
import { Box } from "@mui/material";

const formatDateThai = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", options);
};

function DetailActivity() {
  const [data, setData] = useState(null);
  const [join, setJoin] = useState([]);
  const [day, setDay] = useState([]);
  const navigate = useNavigate();
  const { act_ID } = useParams();
  const [activity, setActivity] = useState(null);
  const [status, setStatus] = useState("");
  const [highlightedItem, setHighLightedItem] = useState(null);
  const [report, setReport] = useState({
    numReserve: "",
  });

  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";

  const range = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split("T")[0]);
    }

    return days;
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        const activityData = res.data[0];
        const numReserve = `${activityData.act_numStdReserve} / ${activityData.act_numStd}`;

        setReport({ numReserve });
        setData(res.data);
        setActivity(activityData);
        setStatus(activityData?.act_status || "");
        setDay(range(activityData.act_dateStart, activityData.act_dateEnd));
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();

        const format = res.map((item) => ({
          actID: item.activityId,
          students: item.studentIds.map((id, index) => ({
            studentId: id,
            dayJoin: item.dayJoin[index].map((date) => date.toString()),
          })),
        }));

        setJoin(format);
      } catch (err) {
        console.error("Error fetching smart contract:", err);
      }
    };

    fetchActivity();
    fetchSmartContract();
  }, [act_ID]);
  // const uniqueSecNames = [...new Set(data.map((item) => item.sec_name))];
  // const sectionData = data.reduce((acc, item) => {
  //   const { sec_name } = item;
  //   if (!acc[sec_name]) {
  //     acc[sec_name] = {
  //       label: sec_name,
  //       value: 0,
  //     };
  //   }
  //   acc[sec_name].value++;
  //   return acc;
  // }, {});

  // const sectionNames = Object.keys(sectionData);
  // const sectionValues = Object.values(sectionData).map((item) => item.value);

  // console.log(sectionNames);
  // console.log(sectionValues);

  const joinData = join.find((joinEntry) => joinEntry.actID == act_ID);

  const dateS = (dateString) => {
    return dateString.replace(/-/g, "");
  };

  const joinStudents = joinData?.students || [];

  if (!data) {
    return <p>Loading...</p>;
  }

  const url = `https://sepolia.etherscan.io/tx/${data[0].act_transaction}#eventlog`;

  const barChartsProps = {
    series: [
      {
        data: [3, 4, 1, 6, 5],
        id: "sync",
        highlightScope: { highlighted: "item", faded: "global" },
      },
    ],
    xAxis: [{ scaleType: "band", data: ["A", "B", "C", "D", "E"] }],
    height: 400,
    slotProps: {
      legend: {
        hidden: true,
      },
    },
  };

  const pieChartProps = {
    series: [
      {
        id: "sync",
        data: [
          { value: 3, label: "A", id: "A" },
          { value: 4, label: "B", id: "B" },
          { value: 1, label: "C", id: "C" },
          { value: 6, label: "D", id: "D" },
          { value: 5, label: "E", id: "E" },
        ],
        highlightScope: { highlighted: "item", faded: "global" },
      },
    ],
    height: 400,
    slotProps: {
      legend: {
        hidden: true,
      },
    },
  };

  return (
    <div className="container m-10 mx-auto md:px-20 pt-20">
      {/* Activity Detail */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
          <div
            className="items-center mb-5 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon /> ย้อนกลับ
          </div>
        </div>
        <hr className="mb-3" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200 text-md">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ชื่อกิจกรรม
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_title}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  รายละเอียด
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_desc}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">สถานที่</td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_location}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  จำนวนที่เปิดรับ
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_numStd}/{activity?.act_numStdReserve}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  เริ่มวันที่
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDateThai(activity?.act_dateStart)}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  สิ้นสุดวันที่
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDateThai(activity?.act_dateEnd)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">สถานะ</td>
                <td className="px-6 py-4 text-gray-500">
                  {activity?.act_status == 2
                    ? "กิจกรรมจบลงแล้ว"
                    : activity?.act_status == 1
                    ? "เปิดให้ลงทะเบียน"
                    : "ปิดลงทะเบียน"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ผู้จัดกิจกรรม
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {data[0].staff_fname} {data[0].staff_lname}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ตรวจสถานะการขึ้นบล้อกเชนจสอบ
                </td>
                <td className="px-6 py-4 text-gray-500 ">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {activity.act_transaction.length > 0
                      ? "ขึ้นแล้ว"
                      : "ยังไม่ขึ้น"}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="px-6 py-4 font-medium text-gray-900 w-full">
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>รายงานสรุป</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography>จำนวนนักศึกษา</Typography>
                  <Gauge
                    value={activity.act_numStdReserve}
                    valueMax={activity.act_numStd}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="80%"
                    outerRadius="100%"
                    width={100}
                    height={100}
                    text={report.numReserve}
                  />
                </Box>
                <Stack
                  direction={{ xs: "column", xl: "row" }}
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  <BarChart
                    {...barChartsProps}
                    highlightedItem={highlightedItem}
                    onHighlightChange={setHighLightedItem}
                  />
                  <PieChart
                    {...pieChartProps}
                    highlightedItem={highlightedItem}
                    onHighlightChange={setHighLightedItem}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Student Detail */}

      {!data[0].login_ID ? (
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 mt-8">
          <h1 className="text-lg font-bold">
            ยังไม่มีนักศึกษาลงทะเบียนเข้าร่วม
          </h1>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4 mt-8">
          <div className="flex gap-2 mb-4">
            <h1 className="text-lg font-bold">รายชื่อนักศึกษา</h1>
          </div>
          <hr className="mb-3" />
          <table className="text-center w-full m-auto text-sm rtl:text-center text-gray-500 dark:text-gray-400">
            <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 w-1/12">ลำดับ</th>
                <th className="px-6 py-3 w-2/12">รหัสนักศึกษา</th>
                <th className="px-6 py-3 w-2/12">ชื่อ-นามสกุล</th>
                {day.map((d, index) => (
                  <th key={index} className="px-6 py-3 w-2/12">
                    {dateS(d)}
                  </th>
                ))}
                <th className="px-6 py-3 w-2/12">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {data.map((i, index) => {
                const studentData = joinStudents.find(
                  (student) => student.studentId === BigInt(i.login_ID)
                );
                const daysJoined = studentData
                  ? studentData.dayJoin.filter((day) => day).length
                  : 0;

                return (
                  <tr key={i.login_ID}>
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{i.login_ID}</td>
                    <td className="px-6 py-3">
                      {i.std_fname} {i.std_lname}
                    </td>
                    {day.map((d, dayIndex) => (
                      <td key={dayIndex} className="px-6 py-3">
                        {studentData && studentData.dayJoin.includes(dateS(d))
                          ? "✔"
                          : "✘"}
                      </td>
                    ))}
                    <td className="px-6 py-3">
                      {daysJoined > 0
                        ? `เข้าร่วม ${daysJoined} วัน`
                        : i.man_status == 3
                        ? `ลงทะเบียนแต่ไม่ได้เข้าร่วม`
                        : "ลงทะเบียนแล้ว"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DetailActivity;
