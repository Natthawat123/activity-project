import { useState } from 'react';
import axios from 'axios';


function ChangePassword() {
  const [oldPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const ID = localStorage.getItem('id');
  const role = localStorage.getItem('role');


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`/api/change-password/${ID}`, {
        oldPassword,
        newPassword,
        role
      });
      setSuccess(response,'Password changed successfully');
      setError('');
      // Clear the form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Error changing password');
      setSuccess('');
    }
  };
  

  return (
    <div className='flex justify-center items-center h-screen' >
        <div className="max-w-md mx-auto mt-10 p-6 border  border-gray-300 w-96 rounded shadow-lg" >
        <div className="text-4xl font-bold text-center mb-4">
          <span className="text-[#ff7700]">I</span>
          <span className="text-[#00a8ff]">T</span>
        </div>
          <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">รหัสผ่านเดิม</label>
              <input
                type="password"
                id="currentPassword"
                value={oldPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ยืนยันการเปลี่ยนรหัสผ่าน
            </button>
          </form>
        </div>
    </div>
  );
}

export default ChangePassword;
