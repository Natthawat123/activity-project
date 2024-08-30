import LogoutIcon from '@mui/icons-material/Logout';

function Logout() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div onClick={handleLogout} className="hover:bg-gray-100">
    <div className="flex gap-3 items-center px-4 py-2 text-sm  hover:bg-gray-200 hover:text-red-600 text-red-700 font-bold">
    <div><LogoutIcon /></div>
      ออกจากระบบ
    </div>
  </div>
  
  );
}

export default Logout;
