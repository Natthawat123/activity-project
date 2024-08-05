import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import Abi from "../../components/contract/abi.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function DetailActivity() {
  const { act_ID } = useParams();
  const [activity, setActivity] = useState(null);
  const [join, setJoin] = useState([]);
  const navigate = useNavigate();

  const contractAddress = "0x9A00B0CB3A626c44c19f868b85A3819C8b630494";
  const stdID = localStorage.getItem("std_ID");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/api/activitys/${act_ID}`);
        setActivity(response.data);
      } catch (error) {
        console.error(error);
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
  }, [act_ID, stdID]);

  const formatDateToThai = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("th-TH", options).format(date);
  };

  const Status = () => {
    if (!activity) return null;

    const joinEntry = join.find(
      (j) => j.actID === activity[0].act_ID && j.stdIDs.includes(BigInt(stdID))
    );
    if (joinEntry) {
      return (
        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          เข้าร่วมแล้ว
        </span>
      );
    }

    return (
      <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
        ยังไม่ได้เข้าร่วม
      </span>
    );
  };

  if (!activity) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div
          className="items-center mb-5 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon />
          ย้อนกลับ
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
            <h1 className="text-3xl text-center font-bold mb-4 text-gray-800">
              ชื่อกิจกรรม: {activity[0].act_title}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  ข้อมูลกิจกรรม
                </h2>
                <table className="table-auto w-full">
                  <tbody>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        รหัสกิจกรรม:
                      </td>
                      <td className="text-gray-700">{activity[0].act_ID}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        รายละเอียด:
                      </td>
                      <td className="text-gray-700">{activity[0].act_desc}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 pr-5">
                        จำนวนผู้เข้าร่วม:
                      </td>
                      <td className="text-gray-700">
                        {activity[0].act_numStd}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">สถานที่:</td>
                      <td className="text-gray-700">
                        {activity[0].act_location}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        วันที่เริ่ม:
                      </td>
                      <td className="text-gray-700">
                        {formatDateToThai(activity[0].act_dateStart)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        วันที่สิ้นสุด:
                      </td>
                      <td className="text-gray-700">
                        {formatDateToThai(activity[0].act_dateEnd)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">สถานะ:</td>
                      <td className="text-gray-700">
                        <Status />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  ข้อมูลเจ้าหน้าที่
                </h2>
                <table className="table-auto w-full">
                  <tbody>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        รหัสเจ้าหน้าที่:
                      </td>
                      <td className="text-gray-700">{activity[0].staff_ID}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        ชื่อเจ้าหน้าที่:
                      </td>
                      <td className="text-gray-700">fgh</td>
                    </tr>

                    <h2 className="text-xl font-bold mb-2 text-gray-800 mt-5">
                      ข้อมูลนักศึกษา
                    </h2>

                    <tr>
                      <td className="font-semibold text-gray-700">
                        รหัสนักศึกษา:
                      </td>
                      <td className="text-gray-700">fg</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        ชื่อนักศึกษา:
                      </td>
                      <td className="text-gray-700">dfg</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">
                        หมู่เรียน:
                      </td>
                      <td className="text-gray-700">fg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailActivity;
