import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks'
import { logout } from '@/store/slices/authSlice'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const { currentUser } = useAppSelector(s => s.auth)
  const payments = useAppSelector(s => s.payments.items);
  const dispatch = useAppDispatch()
  const navigate = useNavigate() 

  const [timeLeftMinutes, setTimeLeftMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'admin' || !currentUser.packageExpire) {
        setTimeLeftMinutes(null);
        return;
    }

    const calculateTimeLeft = () => {
      const expireDate = new Date(currentUser.packageExpire!).getTime();
      const now = new Date().getTime();
      const diffInMs = expireDate - now;

      if (diffInMs > 0) {
        setTimeLeftMinutes(Math.floor(diffInMs / 60000));
      } else {
        setTimeLeftMinutes(0);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); 
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const formatTimeDisplay = (minutes: number) => {
    if (minutes <= 0) return "Expired";
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;
    
    if (days > 0) return `${days}d ${hours}h ${mins}m left`;
    return `${hours}h ${mins}m left`;
  }

  return (
    <div className="navbar bg-base-100 border-b px-6">
      <div className="flex-1">
        <span className="text-lg font-semibold"></span>
      </div>
      <div className="flex-none gap-4 items-center">
        
        {currentUser && currentUser.role !== 'admin' && (
          <div className="text-sm font-medium mr-2 flex flex-col">
             {timeLeftMinutes !== null ? (
               <span className={timeLeftMinutes > 0 ? "text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200" : "text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200"}>
                 ⏳ {formatTimeDisplay(timeLeftMinutes)}
               </span>
             ) : (
               <span
                 className="text-gray-400 text-xs cursor-pointer"
                 onClick={() => navigate('/packages')}
               >
                 No active package
               </span>
             )}
             {payments.some(p => p.status === 'pending') && (
               <span className="text-xs text-yellow-700">Pending Payment</span>
             )}
          </div>
        )}

        {currentUser ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              {currentUser.firstname} {currentUser.lastname} ({currentUser.role})
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow border">
              <li><Link to={currentUser.role === 'admin' ? '/admin/profile' : '/profile'}>Profile</Link></li>
              <li><button onClick={handleLogout} className="text-error font-semibold">Log out</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link className="btn btn-outline btn-sm" to="/login">Login</Link>
            <Link className="btn bg-black text-white btn-sm" to="/register">Register</Link>
          </div>
        )}
      </div>
    </div>
  )
}