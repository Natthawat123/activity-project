import { useState, useEffect } from "react";
import moment from "moment";
import Popup from "./Popup_addAc";
import { motion } from "framer-motion";

function Dash_users() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/activitys")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          const filteredItems = result.filter((item) => item.act_title);
          setItems(filteredItems);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const getActivityStatus = (item, now) => {
    const dateStart = moment(item.act_dateStart);
    const twoWeeksBefore = dateStart.subtract(2, "weeks").toDate();
    const oneDayBefore = dateStart.subtract(1, "day").toDate();

    if (item.act_status === 2) {
      return "กิจกรรมสิ้นสุดแล้ว";
    } else if (item.act_numStd === item.act_numStdReserve) {
      return "ลงทะเบียนเต็มแล้ว";
    } else if (now >= twoWeeksBefore && now <= oneDayBefore) {
      return item.act_status === 1 ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน";
    } else {
      return "ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน";
    }
  };

  const now = new Date();

  // Count activities by status
  const statusCounts = {
    เปิดลงทะเบียน: 0,
    ปิดลงทะเบียน: 0,
    ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน: 0,
    ลงทะเบียนเต็มแล้ว: 0,
    กิจกรรมสิ้นสุดแล้ว: 0,
  };

  items.forEach((item) => {
    const status = getActivityStatus(item, now);
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto md:px-10 mb-5">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">การจัดการกิจกรรม</h2>
          <Popup />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
          <motion.div
            className="bg-blue-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-blue-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">จำนวนกิจกรรมทั้งหมด</div>
            <div className="text-center text-4xl font-bold">{items.length}</div>
          </motion.div>

          <motion.div
            className="bg-green-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-green-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">
              จำนวนกิจกรรมที่เปิดลงทะเบียน
            </div>
            <div className="text-center text-4xl font-bold">
              {statusCounts["เปิดลงทะเบียน"]}
            </div>
          </motion.div>

          <motion.div
            className="bg-red-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-red-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">
              จำนวนกิจกรรมที่ปิดลงทะเบียน
            </div>
            <div className="text-center text-4xl font-bold">
              {statusCounts["ปิดลงทะเบียน"]}
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-blue-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">
              จำนวนกิจกรรมที่ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน
            </div>
            <div className="text-center text-4xl font-bold">
              {statusCounts["ไม่อยู่ช่วงเวลาที่เปิดลงทะเบียน"]}
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-blue-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">
              จำนวนกิจกรรมที่ลงทะเบียนเต็มแล้ว
            </div>
            <div className="text-center text-4xl font-bold">
              {statusCounts["ลงทะเบียนเต็มแล้ว"]}
            </div>
          </motion.div>

          <motion.div
            className="bg-red-500 p-4 text-white h-28 rounded-md shadow-lg flex flex-col justify-center items-center transition-all hover:bg-red-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-semibold">
              จำนวนกิจกรรมที่กิจกรรมสิ้นสุดแล้ว
            </div>
            <div className="text-center text-4xl font-bold">
              {statusCounts["กิจกรรมสิ้นสุดแล้ว"]}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dash_users;
