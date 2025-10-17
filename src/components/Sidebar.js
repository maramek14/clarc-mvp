import { useNavigate } from "react-router-dom";
import { X, Bell, User, Settings, LogOut, Calendar, AlertCircle } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  // Mock notifications - you'll replace with real data
  const notifications = [
    {
      id: 1,
      type: "upcoming",
      title: "Checkout at 272D coming up",
      description: "Due in 8 days",
      date: "Mar 25, 2024",
      icon: <Calendar size={18} />,
      color: "#f59e0b"
    },
    {
      id: 2,
      type: "overdue",
      title: "Report incomplete",
      description: "45 Maple Street",
      date: "2 days overdue",
      icon: <AlertCircle size={18} />,
      color: "#ef4444"
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="sidebar-backdrop" onClick={onClose} />

      {/* Sidebar Panel */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-section">
          {notifications.length === 0 ? (
            <p className="empty-state">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <div className="notif-icon" style={{ color: notif.color }}>
                  {notif.icon}
                </div>
                <div className="notif-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.description}</p>
                  <span className="notif-date">{notif.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Menu Items */}
        <div className="menu-section">
          <button className="menu-item" onClick={() => { navigate('/profile'); onClose(); }}>
            <User size={20} />
            <span>Profile</span>
          </button>
          <button className="menu-item" onClick={() => { navigate('/settings'); onClose(); }}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="menu-item logout" onClick={() => { alert('Logout coming soon!'); onClose(); }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sidebar-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .sidebar {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          max-width: 90%;
          background: white;
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.2);
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #E6E3DD;
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-title h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9B958C;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #F5F3EF;
        }

        .notifications-section {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .empty-state {
          text-align: center;
          color: #9B958C;
          padding: 40px 20px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #F9F8F6;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .notif-icon {
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
        }

        .notif-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .notif-content p {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #5C5751;
        }

        .notif-date {
          font-size: 12px;
          color: #9B958C;
        }

        .menu-section {
          border-top: 1px solid #E6E3DD;
          padding: 16px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #2A2A2A;
          text-align: left;
          transition: background 0.2s;
        }

        .menu-item:hover {
          background: #F5F3EF;
        }

        .menu-item.logout {
          color: #B85C4F;
        }

        .menu-item.logout:hover {
          background: #FEF5F4;
        }
      `}</style>
    </>
  );
}