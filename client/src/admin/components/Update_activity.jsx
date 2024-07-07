import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateActivity() {
  const { act_ID } = useParams();

  useEffect(() => {
    axios.get('http://localhost:3001/activities/' + act_ID)
  })



  return (
    <div>
      <h1>Update Activity</h1>
    <p>Activity ID: {act_ID}</p>


    </div>
  );
}

export default UpdateActivity;
