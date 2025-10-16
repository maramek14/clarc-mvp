import { useState } from "react";
import { User, Mail, Phone, MapPin, Bell, Lock, FileText, HelpCircle, LogOut } from "lucide-react";

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 7700 900000",
    company: "Property Management Ltd",
    address: "123 Main Street, London"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    reportReminders: true,
    inventoryReminders: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    alert("Profile saved! (Changes will reset on page refresh)");
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
      {/* Profile Section */}
      <section className="settings-section">
        <div className="section-header">
          <User size={24} />
          <h2>Profile Information</h2>
        </div>
        
        <div className="profile-form">
          <div className="form-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-field">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={profileData.company}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-field">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
            />
          </div>

          <button className="button-primary" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </section>

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
                onChange={() => handleNotificationToggle('emailAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <p className="toggle-label">Report Reminders</p>
              <p className="toggle-description">Get reminded about upcoming inspections</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.reportReminders}
                onChange={() => handleNotificationToggle('reportReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <p className="toggle-label">Inventory Reminders</p>
              <p className="toggle-description">Notifications when inventories need updating</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.inventoryReminders}
                onChange={() => handleNotificationToggle('inventoryReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="settings-section">
        <div className="section-header">
          <HelpCircle size={24} />
          <h2>Quick Actions</h2>
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

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .form-field input {
          padding: 12px 16px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          color: #2A2A2A;
        }

        .form-field input:focus {
          outline: none;
          border-color: #2C5F8D;
          box-shadow: 0 0 0 3px rgba(44, 95, 141, 0.1);
        }

        .button-primary {
          padding: 12px 24px;
          background: #2C5F8D;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          align-self: flex-start;
        }

        .button-primary:active {
          background: #1E4466;
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
          gap: 16px;
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
          flex-shrink: 0;
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
        }

        .action-btn:active {
          background: #F9F8F6;
          border-color: #2C5F8D;
        }

        .action-btn svg {
          color: #9B958C;
          flex-shrink: 0;
        }

        .action-btn.logout:active {
          background: #FEF5F4;
          border-color: #B85C4F;
        }

        .action-btn.logout:active svg {
          color: #B85C4F;
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
          }

          .toggle-switch {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}