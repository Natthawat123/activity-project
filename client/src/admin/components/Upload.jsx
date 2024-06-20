import { useState, useEffect } from 'react';
import axios from 'axios';

function Upload() {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const handleCheckboxChange = (stdID, actID) => {
    const isSelected = selectedItems.some(item => item.stdID === stdID && item.actID === actID);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(item => !(item.stdID === stdID && item.actID === actID)));
    } else {
      setSelectedItems(prev => [...prev, { stdID, actID }]);
    }
  };

  const handleUpload = () => {
    console.log('Selected Items:', selectedItems);

  };

  return (
    <div>
      {Object.keys(groupedData).map((actTitle) => {
        let index = 0;
        return (
          <div key={actTitle}>
            <h1>Activity: {actTitle}</h1>
            <table>
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
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.some(si => si.stdID === item.std_ID && si.actID === item.act_ID)}
                        onChange={() => handleCheckboxChange(item.std_ID, item.act_ID)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <button onClick={handleUpload}>Submit</button>
    </div>
  );
}

export default Upload;
