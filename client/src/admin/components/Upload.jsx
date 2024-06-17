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


  return (
    <>
      {data.map((item) => (
        <div className="container" >
          <h1 key={item.act_ID}>{item.act_title}</h1>
        </div>
      ))}
    </>
  );
}

export default Upload;
