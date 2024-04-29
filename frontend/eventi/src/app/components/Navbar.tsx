import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests
import { useRouter } from 'next/navigation';
const Navbar: React.FC = () => {
    
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const handleLogout = async () => {
    try {
        const headers = {
            'Session-Id': sessionStorage.getItem("sessionId") ,
            'email': sessionStorage.getItem("email"),
          };
          
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/logout`,{headers}); 
      sessionStorage.setItem('sessionId',"");
      sessionStorage.setItem('email',"");
      sessionStorage.setItem('role',"");
      
      router.push("/");
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (loggingOut) {
      handleLogout();
    }
  }, [loggingOut]);

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <ul className="flex">
        <li className="mr-6">
              <div className="text-white font-bold">Hi, {email}</div>
          </li>
          <li className="mr-6">
            <Link href="/myevents">
              <div className="text-white font-bold">My Events</div>
            </Link>
          </li>
          <li>
            <Link href="/events">
              <div className="text-white font-bold">Events</div>
            </Link>
          </li>
          <li className='ml-4'>

            <button className="text-white font-bold" onClick={() => setLoggingOut(true)}>Logout</button>
          </li>{role == "admin" &&
          <li className='ml-4'>
            <Link href="/add">
              <div className="text-white font-bold">Add Event</div>
            </Link>
          </li>
          }         
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
