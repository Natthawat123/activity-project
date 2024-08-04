import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";

import Abi from "../../components/contract/abi.json";

// Helper function to format dates in Thai
const formatDateThai = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", options);
};

function DetailActivity() {
  const [data, setData] = useState(null);
  const [join, setJoin] = useState([]);
  const navigate = useNavigate();
  const { act_ID } = useParams();

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/api/activitys/${act_ID}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.getAll().call();

        const format = res[0].map((actID, index) => ({
          actID: Number(actID),
          stdIDs: res[1][index],
        }));

        setJoin(format);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivity();
    fetchSmartContract();
  }, [act_ID]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const url = `https://sepolia.etherscan.io/tx/${data[0].act_transaction}#eventlog`;

  return (
    <div>
      <div className="container m-10 mx-auto md:px-20 pt-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold mb-2">รายละเอียดกิจกรรม</h1>
            <div className="items-center mb-5" onClick={() => navigate(-1)}>
              <ArrowBackIosNewIcon />
              ย้อนกลับ
            </div>
          </div>
        </div>

        <div className="container m-10 mx-auto md:px-20 ">
          <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
            <div className="flex gap-2">
              <h1 className="text-lg font-bold mb-2">รายชื่อนักศึกษา</h1>
              <GroupIcon />
            </div>
            <hr className="mb-3" />
            <table className="text-center w-3/4 m-auto text-sm rtl:text-center text-gray-500 dark:text-gray-400">
              <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 w-1/6">ลำดับ</th>
                  <th className="px-6 py-3 w-2/6">รหัสนักศึกษา</th>
                  <th className="px-6 py-3 w-2/6">ชื่อ-นามสกุล</th>
                  <th className="px-6 py-3 w-2/6">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {data.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{student.login_ID}</td>
                    <td className="px-6 py-3">
                      {student.std_fname} {student.std_lname}
                    </td>
                    <td className="px-6 py-3">wait</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailActivity;
