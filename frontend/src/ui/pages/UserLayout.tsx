// frontend/src/ui/pages/UserLayout.tsx
import { useEffect } from 'react'
import { useAppSelector } from '@/ui/hooks'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar' // ย้ายมา import ตรงนี้
import Topbar from '../components/Topbar'   // ย้ายมา import ตรงนี้

export default function UserLayout() {
  const { currentUser, loading } = useAppSelector(s => s.auth)
  const navigate = useNavigate()

  const location = useLocation();

  useEffect(() => {
    // ถ้าเป็น Admin ให้เด้งไปหน้า Admin (ไม่ใช้ Layout นี้)
    if (!loading && currentUser && currentUser.role === 'admin') {
      navigate('/admin')
      return;
    }

    // ถ้าเป็นผู้ใช้ธรรมดา และไม่มีแพ็กเกจหรือแพ็กเกจหมดอายุ
    // ให้ไปยังหน้าซื้อแพ็กเกจ (ยกเว้นเมื่อเราอยู่ในหน้าชื่อ "packages" อยู่แล้ว)
    if (!loading && currentUser && currentUser.role !== 'admin') {
      const now = new Date();
      const hasPackage = currentUser.packageExpire && new Date(currentUser.packageExpire) > now;
      // allow user to visit packages route as well as checkout/ payment-review
      // otherwise they would get stuck redirecting when trying to buy
      const allowPaths = ['/packages', '/checkout', '/payment-review'];
      const inAllowed = allowPaths.some(p => location.pathname.startsWith(p));
      if (!hasPackage && !inAllowed) {
        navigate('/packages');
      }
    }
  }, [currentUser, loading, navigate, location]);

  if (loading) return <div className="flex items-center justify-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>
  
  // ถ้าเป็น Admin ไม่ต้อง render อะไร (รอเด้ง)
  if (currentUser && currentUser.role === 'admin') return null

  // --- โครงสร้างจัดหน้า (Flex Layout) อยู่ตรงนี้ ---
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. Sidebar ชิดซ้าย เต็มจอ */}
      <Sidebar />

      {/* 2. ส่วนเนื้อหาทางขวา */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar อยู่บน */}
        <Topbar />
        
        {/* เนื้อหา Page ต่างๆ (Outlet) จะแสดงตรงนี้ */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  )
}