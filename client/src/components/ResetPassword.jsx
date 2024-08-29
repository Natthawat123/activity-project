import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (message && !message.includes('Error')) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reset-password/${token}`, { password });
      setMessage('Password has been reset. Redirecting in');
      setCountdown(3);
    } catch (error) {
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen  bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%'>
      <div className="bg-[#1a1c23] text-white p-8 rounded-lg w-96 mx-auto">
        <div className="text-4xl font-bold text-center mb-4">
          <span className="text-[#ff7700]">I</span>
          <span className="text-[#00a8ff]">T</span>
        </div>
        <h2 className="text-center text-2xl mb-6">รีเซ็ตรหัสผ่าน</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">รหัสผ่านใหม่</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#2a2e37] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white py-3 rounded-md font-bold hover:bg-purple-700 transition duration-300"
          >
            ยืนยันการเปลี่ยนรหัสผ่าน
          </button>
        </form>
        {message && (
          <p className={`text-center mt-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message} {!message.includes('Error') && countdown > 0 && `${countdown}...`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;