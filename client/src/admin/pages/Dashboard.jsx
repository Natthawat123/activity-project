
import Dash_users from '../components/Dash_users'
import ListUsers from '../components/ListUsers'
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate();


 
  return (
    <div>
      <Dash_users />
      <ListUsers />
    </div>
  )
}

export default Dashboard