import { useState } from "react";
import { useParams } from "react-router-dom";
import { Save, Edit2, MapPin, User, Calendar, Home, FileText, DollarSign, Phone, Mail } from "lucide-react";
import { getPropertyById } from "../utils";

export default function PropertyInformation() {
  const { id } = useParams();
  const property = getPropertyById(id);

  // Initialize state with existing property data and additional fields
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Existing fields from property
    name: property?.name || "",
    tenant: property?.tenant || "",
    tenancyEnd: property?.tenancyEnd || "",
    
    // Additional property information fields
    address: property?.address || "",
    postcode: property?.postcode || "",
    propertyType: property?.propertyType || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    purchasePrice: property?.purchasePrice || "",
    purchaseDate: property?.purchaseDate || "",
    
    // Tenant contact information
    tenantPhone: property?.tenantPhone || "",
    tenantEmail: property?.tenantEmail || "",
    
    // Financial information
    monthlyRent: property?.monthlyRent || "",
    deposit: property?.deposit || "",
    
    // Additional notes
    notes: property?.notes || "",
  });

  const [savedData, setSavedData] = useState(formData);

  if (!property) {
    return (
      <div className="page-content">
        <p>Property not found.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSavedData(formData);
    setIsEditing(false);
    // Show success message
    alert("Property information saved successfully! (Data will be reset on page refresh)");
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  const InfoField = ({ icon: Icon, label, value, name, type = "text", readOnly = false }) => (
    <div className="info-field">
      <div className="info-field-header">
        <Icon size={18} />
        <label>{label}</label>
      </div>
      {isEditing && !readOnly ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={handleInputChange}
            rows={4}
            className="info-input"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            className="info-input"
          />
        )
      ) : (
        <p className="info-value">{value || "Not specified"}</p>
      )}
    </div>
  );

  return (
    <div className="page-content">
      <div className="info-header">
        <h2>Property Details</h2>
        {!isEditing ? (
          <button
            className="button-primary"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={18} />
            Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button className="button-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="button-primary" onClick={handleSave}>
              <Save size={18} />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="info-sections">
        {/* Basic Property Information */}
        <section className="info-section">
          <h3>Basic Information</h3>
          <InfoField
            icon={Home}
            label="Property Name"
            value={formData.name}
            name="name"
            readOnly={true}
          />
          <InfoField
            icon={MapPin}
            label="Full Address"
            value={formData.address}
            name="address"
          />
          <InfoField
            icon={MapPin}
            label="Postcode"
            value={formData.postcode}
            name="postcode"
          />
          <InfoField
            icon={Home}
            label="Property Type"
            value={formData.propertyType}
            name="propertyType"
          />
          <div className="info-row">
            <InfoField
              icon={Home}
              label="Bedrooms"
              value={formData.bedrooms}
              name="bedrooms"
              type="number"
            />
            <InfoField
              icon={Home}
              label="Bathrooms"
              value={formData.bathrooms}
              name="bathrooms"
              type="number"
            />
          </div>
        </section>

        {/* Rooms List */}
        <section className="info-section">
          <h3>Rooms ({property.rooms?.length || 0})</h3>
          <div className="rooms-grid">
            {property.rooms?.map((room) => (
              <div key={room.id} className="room-chip">
                {room.name}
              </div>
            ))}
          </div>
        </section>

        {/* Tenant Information */}
        <section className="info-section">
          <h3>Tenant Information</h3>
          <InfoField
            icon={User}
            label="Tenant Name"
            value={formData.tenant}
            name="tenant"
          />
          <InfoField
            icon={Phone}
            label="Tenant Phone"
            value={formData.tenantPhone}
            name="tenantPhone"
            type="tel"
          />
          <InfoField
            icon={Mail}
            label="Tenant Email"
            value={formData.tenantEmail}
            name="tenantEmail"
            type="email"
          />
          <InfoField
            icon={Calendar}
            label="Tenancy End Date"
            value={formData.tenancyEnd}
            name="tenancyEnd"
            type="date"
          />
        </section>

        {/* Financial Information */}
        <section className="info-section">
          <h3>Financial Information</h3>
          <InfoField
            icon={DollarSign}
            label="Purchase Price (£)"
            value={formData.purchasePrice}
            name="purchasePrice"
            type="number"
          />
          <InfoField
            icon={Calendar}
            label="Purchase Date"
            value={formData.purchaseDate}
            name="purchaseDate"
            type="date"
          />
          <InfoField
            icon={DollarSign}
            label="Monthly Rent (£)"
            value={formData.monthlyRent}
            name="monthlyRent"
            type="number"
          />
          <InfoField
            icon={DollarSign}
            label="Deposit (£)"
            value={formData.deposit}
            name="deposit"
            type="number"
          />
        </section>

        {/* Additional Notes */}
        <section className="info-section">
          <h3>Additional Notes</h3>
          <InfoField
            icon={FileText}
            label="Notes"
            value={formData.notes}
            name="notes"
            type="textarea"
          />
        </section>
      </div>

      <style jsx>{`
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .button-primary, .button-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-primary {
          background: #0b63f6;
          color: white;
        }

        .button-primary:hover {
          background: #0952d4;
        }

        .button-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .button-secondary:hover {
          background: #e5e7eb;
        }

        .info-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .info-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .info-field {
          margin-bottom: 16px;
        }

        .info-field:last-child {
          margin-bottom: 0;
        }

        .info-field-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-field-header label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .info-value {
          margin: 0;
          font-size: 15px;
          color: #111827;
          padding: 8px 0;
        }

        .info-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }

        .info-input:focus {
          outline: none;
          border-color: #0b63f6;
        }

        textarea.info-input {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .rooms-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .room-chip {
          padding: 8px 16px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .info-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .edit-actions {
            width: 100%;
          }

          .button-primary, .button-secondary {
            flex: 1;
          }

          .info-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}