import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

import UserIcon from "@/assets/icon/user.png";
import TemplatesIcon from "@/assets/icon/templates.png";
import PaymentsIcon from "@/assets/icon/payments.png";
import PackagesIcon from "@/assets/icon/packages.png";
import ReportsIcon from "@/assets/icon/report.png";
import AdminIcon from "@/assets/icon/admin.png";
import HomeIcon from "@/assets/icon/home.png";
import CreateIcon from "@/assets/icon/create.png";
import MyportsIcon from "@/assets/icon/myports.png";

const nav = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/templates", label: "Templates", icon: TemplatesIcon },
  { to: "/editor", label: "Create", icon: CreateIcon },
  { to: "/my-ports", label: "My Ports", icon: MyportsIcon },
  { to: "/packages", label: "Packages", icon: PackagesIcon },
  { to: "/report", label: "Report Issues", icon: ReportsIcon },
];

const admin = [
  { to: "/admin/users", label: "Users Management", icon: UserIcon },
  { to: "/admin/templates", label: "Template Management", icon: TemplatesIcon },
  { to: "/admin/payments", label: "Payments Management", icon: PaymentsIcon },
  { to: "/admin/packages", label: "Packages Management", icon: PackagesIcon },
  { to: "/admin/issues", label: "Report Issues Management", icon: ReportsIcon },
  { to: "/admin/Profile", label: "Admin", icon: AdminIcon },
];

export default function Sidebar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if ((path === "/editor" || path === "/my-ports") && !auth.currentUser) {
      e.preventDefault();
      if (confirm("Please log in before using this section")) {
        navigate("/login");
      }
    }
  };

  return (
    <aside className="w-64 bg-white shadow rounded-2xl p-4 flex flex-col gap-4 min-h-screen overflow-y-auto shrink-0">
      <h1 className="text-xl font-bold mb-4"></h1>

      {(!auth.currentUser || auth.currentUser.role !== "admin") && (
        <ul className="menu gap-4">
          {nav.map((i) => (
            <li key={i.to} className={loc.pathname === i.to ? "bordered" : ""}>
              <Link
                to={i.to}
                onClick={(e) => handleNavClick(e, i.to)}
                className="flex items-center gap-4 text-base"
              >
                {i.icon && (
                  <img
                    src={i.icon}
                    alt={i.label}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span>{i.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {auth.currentUser && auth.currentUser.role === "admin" && (
        <>
          <ul className="menu gap-4">
            {admin.map((i) => (
              <li
                key={i.to}
                className={loc.pathname === i.to ? "bordered" : ""}
              >
                <Link to={i.to} className="flex items-center gap-4 text-base">
                  {i.icon && (
                    <img
                      src={i.icon}
                      alt={i.label}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span>{i.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
