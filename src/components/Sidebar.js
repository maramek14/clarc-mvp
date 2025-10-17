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
            <div className="empty-notifications">
              <Bell size={48} strokeWidth={1.5} />
              <p>No new notifications</p>
            </div>
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

        {/* Profile Section at Bottom */}
        <div className="profile-section">
          <div 
            className="profile-header"
            onClick={() => {
              navigate('/settings');
              onClose();
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar">
              <User size={24} />
            </div>
            <div className="profile-info">
              <h3>Maram</h3>
              <p>Property Manager</p>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="profile-action-btn"
              onClick={() => {
                navigate('/settings');
                onClose();
              }}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="profile-action-btn">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-backdrop {
          position: fixed;
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
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          max-width: 90vw;
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
        }

        .close-btn:active {
          background: #F5F3EF;
        }

        .notifications-section {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .empty-notifications {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #9B958C;
        }

        .empty-notifications p {
          margin: 12px 0 0 0;
          font-size: 14px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 8px;
          background: #F9FAFB;
          cursor: pointer;
          transition: all 0.2s;
        }

        .notification-item:active {
          background: #F3F4F6;
          transform: scale(0.98);
        }

        .notif-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .notif-content p {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #6B7280;
        }

        .notif-date {
          font-size: 12px;
          color: #9B958C;
        }

        .profile-section {
          border-top: 1px solid #E6E3DD;
          padding: 20px;
          background: #F9FAFB;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .profile-header:active {
          background: rgba(44, 95, 141, 0.05);
        }

        .profile-header:active {
          background: rgba(44, 95, 141, 0.1);
          transform: scale(0.98);
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2C5F8D 0%, #1E4466 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .profile-info h3 {
          margin: 0 0 2px 0;
          font-size: 16px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .profile-info p {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          color: #2A2A2A;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-action-btn:active {
          background: #F5F3EF;
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}