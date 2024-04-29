"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
 
import axios from 'axios';

const ResetPassword: React.FC = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token');
    const router = useRouter()

  const [newPassword, setNewPassword] = useState('');
  const [password, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const headers = {
        'Session-Id': token ,      
      };
      
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/change-password`, 
      {password},
        {headers});
      setMessage("Password changed successfully");
      router.push('/')
    } catch (error) {
      console.error('Reset password failed!', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={password}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Reset Password
          </button>
        </div>
        {message && (
          <div className="mt-4 text-green-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
