import React, { useState, useEffect } from 'react';
import axios from 'axios';
import contractAbi from '../contract/abi.json';
import Web3 from 'web3';

function Upload() {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [selectedActID, setSelectedActID] = useState(null); 
  const [selectedStdIDs, setSelectedStdIDs] = useState([]); 

  // Web3 and contract
  const contractAddress = '0x1E6f16857E1A2a97FE86892aEAbc6272E0Df2FdC';
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // State to hold getAll results
  const [getAll, setGetAll] = useState([]);

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

  const sortedActivities = Object.keys(groupedData).map(actTitle => ({
    actTitle,
    activities: groupedData[actTitle],
  })).sort((a, b) => a.activities[0].act_ID - b.activities[0].act_ID);

  const handleCheckboxChange = (stdID, actID) => {
    const isSelected = selectedItems.some(item => item.stdID === stdID && item.actID === actID);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(item => !(item.stdID === stdID && item.actID === actID)));
      setSelectedStdIDs(prev => prev.filter(id => id !== stdID)); 
      setSelectedActID(null);
    } else {
      setSelectedItems(prev => [...prev, { stdID, actID }]);
      setSelectedStdIDs(prev => [...prev, stdID]);
      setSelectedActID(actID);
    }
  };

  // Connect to MetaMask and set up contract instance
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        setContract(contract);

      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  // Function to handle getAll button click
  const handleGetAll = async () => {
    try {
      await connectWallet();

      if (!contract || !web3) {
        console.error('Contract or web3 not initialized.');
        return;
      }

      const allData = await contract.methods.getAll().call();

      // Format the getAll data
      const formattedData = allData[0].map((actID, index) => ({
        actID: actID,
        stdIDs: allData[1][index]
      }));

      setGetAll(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle upload button click
  const handleUpload = async () => {
    try {
      await connectWallet();

      if (!contract || !web3) {
        console.error('Contract or web3 not initialized.');
        return;
      }

      if (selectedActID === null || selectedStdIDs.length === 0) {
        console.error('No activity or students selected.');
        return;
      }

      const accounts = await web3.eth.getAccounts();
      const tx = await contract.methods.Upload(selectedActID, selectedStdIDs).send({ from: accounts[0] });
      console.log('Transaction successful:', tx.transactionHash);
    } catch (err) {
      console.error('Error uploading data:', err);
    }
  };

  return (
    <div>
      {sortedActivities.map(({ actTitle, activities }) => (
        <div key={actTitle}>
          <h1>Activity: {actTitle}</h1>
          <p>Activity ID: {activities[0].act_ID}</p>
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
              {activities.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
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
      ))}
      <button onClick={handleUpload}>Submit</button>

      <hr />
      <button onClick={handleGetAll}>getAll</button>
      <div>
        <h2>getAll Results</h2>
        {getAll.map((item, idx) => (
          <div key={idx}>
            <p>Activity ID: {item.actID}</p>
            <p>Student IDs: {item.stdIDs.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upload;
