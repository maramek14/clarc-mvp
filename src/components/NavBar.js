import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/properties", label: "Properties" },
    { path: "/gallery", label: "Gallery" },
    { path: "/reports", label: "Reports" },
    { path: "/settings", label: "Profile" },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${pathname.startsWith(item.path) ? "active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
