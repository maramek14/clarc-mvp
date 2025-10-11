import { Link, useLocation } from "react-router-dom";
import { Home, Image, FileText, User } from "lucide-react";

export default function NavBar() {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/properties", label: "Properties", icon: <Home size={20}/> },
    { path: "/gallery", label: "Gallery", icon: <Image size={20}/> },
    { path: "/reports", label: "Reports", icon: <FileText size={20}/> },
    { path: "/settings", label: "Profile", icon: <User size={20}/> },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${pathname.startsWith(item.path) ? "active" : ""}`}
        >
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
