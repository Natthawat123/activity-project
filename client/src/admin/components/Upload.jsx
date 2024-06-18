import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Upload() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/list/upload');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.act_title]) {
      acc[item.act_title] = [];
    }
    acc[item.act_title].push(item);
    return acc;
  }, {});

  const handleUpload = (e) => {

  }

  return (
<<<<<<< HEAD
    <>

    </>
=======
    <div>
      {Object.keys(groupedData).map((actTitle) => {
        let index = 0;  // Initialize index inside the map function
        return (
          <div key={actTitle}>
            <h1>Activity: {actTitle}</h1>
            <table onSubmit={handleUpload}>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>เข้าร่วม</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[actTitle].map((item) => (
                  <tr key={item.id}>
                    <td>{++index}</td>
                    <td>{item.std_ID}</td>
                    <td>{item.std_fname} {item.std_lname}</td>
                    <td><input type="checkbox" /></td>
                  </tr>
                ))}
              </tbody>

              <button>submit</button>
            </table>
          </div>
        );
      })}
    </div>
>>>>>>> origin/wave
  );
}

export default Upload;
