import { Link, useLocation } from "react-router-dom";
import { Home, Activity, FileText, Menu } from "lucide-react";

export default function NavBar({ onMenuClick }) {
  const { pathname } = useLocation();

  // Hide navbar on these routes
  const hiddenRoutes = ['/add-photos'];
  const shouldHide = hiddenRoutes.some(route => pathname.includes(route));

  const navItems = [
    { path: "/properties", label: "Properties", icon: <Home size={20}/> },
    { path: "/activity", label: "Activity", icon: <Activity size={20}/> },
    { path: "/reports", label: "Reports", icon: <FileText size={20}/> },
  ];

  if (shouldHide) {
    return null;
  }

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
      
      {/* Hamburger Menu Button */}
      <button 
        className="nav-item menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
          <Menu size={20}/>
          <span>Menu</span>
        </div>
      </button>
      
      <style jsx>{`
        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .menu-button:active {
          color: var(--accent);
        }
      `}</style>
    </nav>
  );
}