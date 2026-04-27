import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/ui/hooks";
import Sidebar from "@/ui/components/Sidebar";
import Topbar from "@/ui/components/Topbar";

export default function AdminLayout() {
  const { currentUser, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser || currentUser.role !== "admin") {
        navigate("/");
      }
    }
  }, [currentUser, loading, navigate]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
