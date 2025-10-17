import { useState } from "react";
import { User, Mail, Phone, Building, MapPin, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  
  // This would come from your auth/database in a real app
  const [savedProfile, setSavedProfile] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 7700 900000",
    company: "Property Management Ltd",
    address: "123 Main Street, London"
  });

  const [editingProfile, setEditingProfile] = useState(savedProfile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSavedProfile(editingProfile);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditingProfile(savedProfile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="page-content">
      <section className="profile-section">
        <div className="section-header">
          <User size={24} />
          <h2>Profile Information</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
        
        {isEditing ? (
          // Edit Mode
          <div className="profile-form">
            <div className="form-field">
              <label>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={editingProfile.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-field">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editingProfile.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label>
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={editingProfile.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-field">
              <label>
                <Building size={16} />
                Company
              </label>
              <input
                type="text"
                name="company"
                value={editingProfile.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
              />
            </div>

            <div className="form-field">
              <label>
                <MapPin size={16} />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editingProfile.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
            </div>

            <div className="button-group">
              <button className="button-secondary" onClick={handleCancel}>
                <X size={18} />
                Cancel
              </button>
              <button className="button-primary" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="profile-view">
            <div className="info-item">
              <div className="info-label">
                <User size={16} />
                Full Name
              </div>
              <div className="info-value">{savedProfile.name}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Mail size={16} />
                Email
              </div>
              <div className="info-value">{savedProfile.email}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Phone size={16} />
                Phone
              </div>
              <div className="info-value">{savedProfile.phone}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <Building size={16} />
                Company
              </div>
              <div className="info-value">{savedProfile.company}</div>
            </div>

            <div className="info-item">
              <div className="info-label">
                <MapPin size={16} />
                Address
              </div>
              <div className="info-value">{savedProfile.address}</div>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .profile-section {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
          margin: 0 auto;
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
          flex: 1;
          font-size: 20px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #2C5F8D;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .edit-btn:hover {
          background: #1E4466;
        }

        .edit-btn:active {
          background: #163552;
        }

        /* View Mode Styles */
        .profile-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: #F9F8F6;
          border-radius: 8px;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-label svg {
          color: #9B958C;
        }

        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #2A2A2A;
          padding-left: 24px;
        }

        /* Edit Mode Styles */
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
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #5C5751;
        }

        .form-field label svg {
          color: #9B958C;
        }

        .form-field input {
          padding: 12px 16px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          color: #2A2A2A;
          background: white;
        }

        .form-field input:focus {
          outline: none;
          border-color: #2C5F8D;
          box-shadow: 0 0 0 3px rgba(44, 95, 141, 0.1);
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .button-group button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .button-secondary {
          padding: 12px 24px;
          background: white;
          color: #5C5751;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-secondary:hover {
          background: #F9F8F6;
          border-color: #9B958C;
        }

        .button-secondary:active {
          background: #F5F3EF;
        }

        @media (max-width: 768px) {
          .profile-section {
            padding: 20px;
          }

          .section-header {
            flex-wrap: wrap;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .button-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}