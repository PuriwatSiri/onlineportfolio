import { useEffect } from "react";
import { useAppSelector } from "@/ui/hooks";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function UserLayout() {
  const { currentUser, loading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!loading && currentUser && currentUser.role === "admin") {
      navigate("/admin");
      return;
    }

    if (!loading && currentUser && currentUser.role !== "admin") {
      const now = new Date();
      const hasPackage =
        currentUser.packageExpire && new Date(currentUser.packageExpire) > now;
      const allowPaths = ["/packages", "/checkout", "/payment-review"];
      const inAllowed = allowPaths.some((p) => location.pathname.startsWith(p));
      if (!hasPackage && !inAllowed) {
        navigate("/packages");
      }
    }
  }, [currentUser, loading, navigate, location]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (currentUser && currentUser.role === "admin") return null;

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
