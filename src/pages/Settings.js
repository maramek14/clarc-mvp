import { useState } from "react";
import { Bell, Lock, FileText, LogOut } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    reportReminders: true,
    inventoryReminders: false
  });

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = () => {
    alert("Password change feature coming soon!");
  };

  const handleExportData = () => {
    alert("Export data feature coming soon!");
  };

  const handleLogout = () => {
    alert("Logout feature coming soon!");
  };

  return (
    <div className="page-content">
      {/* Notifications Section */}
      <section className="settings-section">
        <div className="section-header">
          <Bell size={24} />
          <h2>Notifications</h2>
        </div>

        <div className="toggle-list">
          <div className="toggle-item">
            <div className="toggle-info">
              <p className="toggle-label">Email Alerts</p>
              <p className="toggle-description">Receive email notifications for important updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={() => handleNotificationToggle("emailAlerts")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <p className="toggle-label">Report Reminders</p>
              <p className="toggle-description">Get reminders for upcoming property reports</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.reportReminders}
                onChange={() => handleNotificationToggle("reportReminders")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <p className="toggle-label">Inventory Reminders</p>
              <p className="toggle-description">Reminders for inventory checks and updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.inventoryReminders}
                onChange={() => handleNotificationToggle("inventoryReminders")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section className="settings-section">
        <div className="section-header">
          <Lock size={24} />
          <h2>Account & Security</h2>
        </div>

        <div className="action-list">
          <button className="action-btn" onClick={handleChangePassword}>
            <Lock size={20} />
            <div className="action-content">
              <p className="action-label">Change Password</p>
              <p className="action-description">Update your account password</p>
            </div>
          </button>

          <button className="action-btn" onClick={handleExportData}>
            <FileText size={20} />
            <div className="action-content">
              <p className="action-label">Export Data</p>
              <p className="action-description">Download all your property data</p>
            </div>
          </button>

          <button className="action-btn logout" onClick={handleLogout}>
            <LogOut size={20} />
            <div className="action-content">
              <p className="action-label">Log Out</p>
              <p className="action-description">Sign out of your account</p>
            </div>
          </button>
        </div>
      </section>

      {/* App Info */}
      <div className="app-info">
        <p>Property Inventory Manager v1.0.0</p>
        <p className="app-info-sub">© 2024 - MVP Version</p>
      </div>

      <style jsx>{`
        .settings-section {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F5F3EF;
        }

        .section-header svg {
          color: #2C5F8D;
        }

        .section-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #F9F8F6;
          border-radius: 8px;
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-label {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .toggle-description {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #E6E3DD;
          transition: 0.3s;
          border-radius: 26px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: #2C5F8D;
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #F9F8F6;
        }

        .action-btn:active {
          background: #F5F3EF;
          border-color: #2C5F8D;
        }

        .action-btn svg {
          color: #9B958C;
          flex-shrink: 0;
        }

        .action-btn.logout {
          color: #B85C4F;
        }

        .action-btn.logout svg {
          color: #B85C4F;
        }

        .action-btn.logout:hover {
          background: #FEF5F4;
        }

        .action-btn.logout:active {
          background: #FDE8E6;
          border-color: #B85C4F;
        }

        .action-content {
          flex: 1;
        }

        .action-label {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .action-btn.logout .action-label {
          color: #B85C4F;
        }

        .action-description {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
        }

        .app-info {
          text-align: center;
          padding: 24px 0;
          margin-top: 20px;
        }

        .app-info p {
          margin: 4px 0;
          font-size: 13px;
          color: #9B958C;
        }

        .app-info-sub {
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .settings-section {
            padding: 20px;
          }

          .toggle-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .toggle-switch {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}