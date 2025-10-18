import { useState } from "react";
import { useParams } from "react-router-dom";
import { Save, Edit2, MapPin, User, Calendar, Home, FileText, DollarSign, Phone, Mail, Plus, Trash2, X } from "lucide-react";
import { getPropertyById } from "../utils";
import { 
  getTenanciesByProperty, 
  getCurrentTenancy, 
  getUpcomingTenancy,
  getTenancyStatusColor,
  getTenancyStatusLabel,
  checkTenancyOverlap,
  calculateTenancyStatus
} from "../tenancyData";

export default function PropertyInformation() {
  const { id } = useParams();
  const property = getPropertyById(id);

  // Property info editing state
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState({
    name: property?.name || "",
    address: property?.address || "",
    postcode: property?.postcode || "",
    propertyType: property?.propertyType || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    purchasePrice: property?.purchasePrice || "",
    purchaseDate: property?.purchaseDate || "",
    notes: property?.notes || "",
  });
  const [savedPropertyData, setSavedPropertyData] = useState(propertyFormData);

  // Tenancy management state
  const [tenancies, setTenancies] = useState(getTenanciesByProperty(id));
  const [showAddTenancy, setShowAddTenancy] = useState(false);
  const [editingTenancy, setEditingTenancy] = useState(null);
  const [tenancyFormData, setTenancyFormData] = useState({
    tenantName: "",
    startDate: "",
    endDate: "",
    tenantEmail: "",
    tenantPhone: "",
    monthlyRent: "",
    deposit: "",
    notes: ""
  });

  const currentTenancy = getCurrentTenancy(id);
  const upcomingTenancy = getUpcomingTenancy(id);

  if (!property) {
    return (
      <div className="page-content">
        <p>Property not found.</p>
      </div>
    );
  }

  // Property form handlers
  const handlePropertyInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertySave = () => {
    setSavedPropertyData(propertyFormData);
    setIsEditingProperty(false);
    alert("Property information saved successfully! (Data will be reset on page refresh)");
  };

  const handlePropertyCancel = () => {
    setPropertyFormData(savedPropertyData);
    setIsEditingProperty(false);
  };

  // Tenancy form handlers
  const handleTenancyInputChange = (e) => {
    const { name, value } = e.target;
    setTenancyFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetTenancyForm = () => {
    setTenancyFormData({
      tenantName: "",
      startDate: "",
      endDate: "",
      tenantEmail: "",
      tenantPhone: "",
      monthlyRent: "",
      deposit: "",
      notes: ""
    });
    setEditingTenancy(null);
    setShowAddTenancy(false);
  };

  const handleAddTenancy = () => {
    // Validation
    if (!tenancyFormData.tenantName.trim()) {
      alert("Please enter tenant name");
      return;
    }
    if (!tenancyFormData.startDate || !tenancyFormData.endDate) {
      alert("Please enter start and end dates");
      return;
    }

    const startDate = new Date(tenancyFormData.startDate);
    const endDate = new Date(tenancyFormData.endDate);

    if (endDate <= startDate) {
      alert("End date must be after start date");
      return;
    }

    // Check for overlaps
    const overlapCheck = checkTenancyOverlap(
      id, 
      tenancyFormData.startDate, 
      tenancyFormData.endDate,
      editingTenancy?.id
    );

    if (overlapCheck.hasOverlap) {
      const conflicting = overlapCheck.conflictingTenancy;
      if (!window.confirm(
        `This tenancy overlaps with ${conflicting.tenantName} (${conflicting.startDate} to ${conflicting.endDate}). Continue anyway?`
      )) {
        return;
      }
    }

    if (editingTenancy) {
      // Update existing tenancy
      setTenancies(prev => prev.map(t => 
        t.id === editingTenancy.id 
          ? {
              ...t,
              ...tenancyFormData,
              status: calculateTenancyStatus(tenancyFormData.startDate, tenancyFormData.endDate)
            }
          : t
      ));
      alert("Tenancy updated successfully!");
    } else {
      // Add new tenancy
      const newTenancy = {
        id: `tenancy-${Date.now()}`,
        propertyId: id,
        ...tenancyFormData,
        status: calculateTenancyStatus(tenancyFormData.startDate, tenancyFormData.endDate)
      };
      setTenancies(prev => [...prev, newTenancy]);
      alert("Tenancy added successfully!");
    }

    resetTenancyForm();
  };

  const handleEditTenancy = (tenancy) => {
    setEditingTenancy(tenancy);
    setTenancyFormData({
      tenantName: tenancy.tenantName,
      startDate: tenancy.startDate,
      endDate: tenancy.endDate,
      tenantEmail: tenancy.tenantEmail || "",
      tenantPhone: tenancy.tenantPhone || "",
      monthlyRent: tenancy.monthlyRent || "",
      deposit: tenancy.deposit || "",
      notes: tenancy.notes || ""
    });
    setShowAddTenancy(true);
  };

  const handleDeleteTenancy = (tenancyId) => {
    const tenancy = tenancies.find(t => t.id === tenancyId);
    if (window.confirm(`Are you sure you want to delete the tenancy for ${tenancy.tenantName}?`)) {
      setTenancies(prev => prev.filter(t => t.id !== tenancyId));
      alert("Tenancy deleted successfully!");
    }
  };

  const InfoField = ({ icon: Icon, label, value, name, type = "text", readOnly = false }) => (
    <div className="info-field">
      <div className="info-field-header">
        <Icon size={18} />
        <label>{label}</label>
      </div>
      {isEditingProperty && !readOnly ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={handlePropertyInputChange}
            rows={4}
            className="info-input"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handlePropertyInputChange}
            className="info-input"
          />
        )
      ) : (
        <p className="info-value">{value || "Not specified"}</p>
      )}
    </div>
  );

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formatDate = (date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
      <div className="page-content" style={{ paddingBottom: '4rem' }} >
      <div className="info-header">
        <h2>Property Details</h2>
        {!isEditingProperty ? (
          <button
            className="button-primary"
            onClick={() => setIsEditingProperty(true)}
          >
            <Edit2 size={18} />
            Edit Property
          </button>
        ) : (
          <div className="edit-actions">
            <button className="button-secondary" onClick={handlePropertyCancel}>
              Cancel
            </button>
            <button className="button-primary" onClick={handlePropertySave}>
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
            value={propertyFormData.name}
            name="name"
            readOnly={true}
          />
          <InfoField
            icon={MapPin}
            label="Full Address"
            value={propertyFormData.address}
            name="address"
          />
          <InfoField
            icon={MapPin}
            label="Postcode"
            value={propertyFormData.postcode}
            name="postcode"
          />
          <InfoField
            icon={Home}
            label="Property Type"
            value={propertyFormData.propertyType}
            name="propertyType"
          />
          <div className="info-row">
            <InfoField
              icon={Home}
              label="Bedrooms"
              value={propertyFormData.bedrooms}
              name="bedrooms"
              type="number"
            />
            <InfoField
              icon={Home}
              label="Bathrooms"
              value={propertyFormData.bathrooms}
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

        {/* Tenancies Section */}
        <section className="info-section">
          <div className="section-header">
            <h3>Tenancies ({tenancies.length})</h3>
            {!showAddTenancy && (
              <button
                className="button-primary"
                onClick={() => setShowAddTenancy(true)}
              >
                <Plus size={18} />
                Add Tenancy
              </button>
            )}
          </div>

          {/* Current Tenancy Highlight */}
          {currentTenancy && (
            <div className="tenancy-highlight">
              <div className="tenancy-highlight-header">
                <User size={20} />
                <div>
                  <h4>Current Tenant</h4>
                  <p>{currentTenancy.tenantName}</p>
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getTenancyStatusColor('current') }}
                >
                  Active
                </span>
              </div>
              <div className="tenancy-highlight-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{formatDateRange(currentTenancy.startDate, currentTenancy.endDate)}</span>
                </div>
                {currentTenancy.monthlyRent && (
                  <div className="detail-item">
                    <DollarSign size={16} />
                    <span>£{currentTenancy.monthlyRent}/month</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Tenancy Notice */}
          {upcomingTenancy && (
            <div className="tenancy-notice">
              <Calendar size={18} />
              <div>
                <strong>Upcoming:</strong> {upcomingTenancy.tenantName} starts {new Date(upcomingTenancy.startDate).toLocaleDateString('en-GB')}
              </div>
            </div>
          )}

          {/* Add/Edit Tenancy Form */}
          {showAddTenancy && (
            <div className="tenancy-form">
              <div className="form-header">
                <h4>{editingTenancy ? 'Edit Tenancy' : 'Add New Tenancy'}</h4>
                <button className="icon-button" onClick={resetTenancyForm}>
                  <X size={20} />
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tenant Name *</label>
                  <input
                    type="text"
                    name="tenantName"
                    value={tenancyFormData.tenantName}
                    onChange={handleTenancyInputChange}
                    placeholder="e.g., John Doe"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={tenancyFormData.startDate}
                    onChange={handleTenancyInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={tenancyFormData.endDate}
                    onChange={handleTenancyInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="tenantEmail"
                    value={tenancyFormData.tenantEmail}
                    onChange={handleTenancyInputChange}
                    placeholder="tenant@email.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="tenantPhone"
                    value={tenancyFormData.tenantPhone}
                    onChange={handleTenancyInputChange}
                    placeholder="+44 7700 900000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Rent (£)</label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={tenancyFormData.monthlyRent}
                    onChange={handleTenancyInputChange}
                    placeholder="1500"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Deposit (£)</label>
                  <input
                    type="number"
                    name="deposit"
                    value={tenancyFormData.deposit}
                    onChange={handleTenancyInputChange}
                    placeholder="1750"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={tenancyFormData.notes}
                    onChange={handleTenancyInputChange}
                    rows="3"
                    placeholder="Additional notes about this tenancy..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="button-secondary" onClick={resetTenancyForm}>
                  Cancel
                </button>
                <button className="button-primary" onClick={handleAddTenancy}>
                  <Save size={18} />
                  {editingTenancy ? 'Update Tenancy' : 'Add Tenancy'}
                </button>
              </div>
            </div>
          )}

          {/* Tenancies List */}
          {tenancies.length > 0 && (
            <div className="tenancies-list">
              {tenancies
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((tenancy) => (
                  <div key={tenancy.id} className="tenancy-card">
                    <div className="tenancy-card-header">
                      <div className="tenancy-info">
                        <User size={18} />
                        <div>
                          <h5>{tenancy.tenantName}</h5>
                          <p className="tenancy-dates">
                            {formatDateRange(tenancy.startDate, tenancy.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="tenancy-actions">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getTenancyStatusColor(tenancy.status) }}
                        >
                          {getTenancyStatusLabel(tenancy.status)}
                        </span>
                        <button
                          className="icon-button"
                          onClick={() => handleEditTenancy(tenancy)}
                          title="Edit tenancy"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => handleDeleteTenancy(tenancy.id)}
                          title="Delete tenancy"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {(tenancy.tenantEmail || tenancy.tenantPhone || tenancy.monthlyRent) && (
                      <div className="tenancy-card-details">
                        {tenancy.tenantEmail && (
                          <div className="detail-item">
                            <Mail size={14} />
                            <span>{tenancy.tenantEmail}</span>
                          </div>
                        )}
                        {tenancy.tenantPhone && (
                          <div className="detail-item">
                            <Phone size={14} />
                            <span>{tenancy.tenantPhone}</span>
                          </div>
                        )}
                        {tenancy.monthlyRent && (
                          <div className="detail-item">
                            <DollarSign size={14} />
                            <span>£{tenancy.monthlyRent}/month</span>
                          </div>
                        )}
                      </div>
                    )}

                    {tenancy.notes && (
                      <div className="tenancy-notes">
                        <p>{tenancy.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {tenancies.length === 0 && !showAddTenancy && (
            <div className="empty-state-small">
              <p>No tenancies recorded for this property yet.</p>
            </div>
          )}
        </section>

        {/* Financial Information */}
        <section className="info-section">
          <h3>Property Financial Information</h3>
          <InfoField
            icon={DollarSign}
            label="Purchase Price (£)"
            value={propertyFormData.purchasePrice}
            name="purchasePrice"
            type="number"
          />
          <InfoField
            icon={Calendar}
            label="Purchase Date"
            value={propertyFormData.purchaseDate}
            name="purchaseDate"
            type="date"
          />
        </section>

        {/* Additional Notes */}
        <section className="info-section">
          <h3>Additional Notes</h3>
          <InfoField
            icon={FileText}
            label="Notes"
            value={propertyFormData.notes}
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
          border-bottom: 1px solid #E6E3DD;
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
        }

        .button-primary {
          background: #2C5F8D;
          color: white;
        }

        .button-primary:active {
          background: #1E4466;
        }

        .button-secondary {
          background: #F5F3EF;
          color: #2A2A2A;
        }

        .button-secondary:active {
          background: #EBE8E1;
        }

        .info-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-section {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
        }

        .info-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          margin: 0;
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
          color: #9B958C;
        }

        .info-value {
          margin: 0;
          font-size: 15px;
          color: #2A2A2A;
          padding: 8px 0;
        }

        .info-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
        }

        .info-input:focus {
          outline: none;
          border-color: #2C5F8D;
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
          background: #F5F3EF;
          border-radius: 20px;
          font-size: 14px;
          color: #2A2A2A;
          font-weight: 500;
        }

        /* Tenancy Styles */
        .tenancy-highlight {
          background: linear-gradient(135deg, #F5F3EF 0%, #EBE8E1 100%);
          border: 2px solid #2C5F8D;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .tenancy-highlight-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .tenancy-highlight-header h4 {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tenancy-highlight-header p {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .tenancy-highlight-header > div {
          flex: 1;
        }

        .tenancy-highlight-details {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #2A2A2A;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tenancy-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #E8F1F8;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #2A2A2A;
        }

        .tenancy-form {
          background: #F5F3EF;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .form-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .icon-button {
          background: none;
          border: none;
          color: #9B958C;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-button:active {
          background: rgba(0, 0, 0, 0.05);
          color: #2A2A2A;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .form-input {
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        textarea.form-input {
          resize: vertical;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .tenancies-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tenancy-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
        }

        .tenancy-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .tenancy-info {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .tenancy-info h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .tenancy-dates {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #9B958C;
        }

        .tenancy-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .tenancy-card-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid #F5F3EF;
          margin-top: 12px;
        }

        .tenancy-card-details .detail-item {
          font-size: 13px;
          color: #6B7280;
        }

        .tenancy-notes {
          padding-top: 12px;
          border-top: 1px solid #F5F3EF;
          margin-top: 12px;
        }

        .tenancy-notes p {
          margin: 0;
          font-size: 14px;
          color: #6B7280;
          font-style: italic;
        }

        .empty-state-small {
          text-align: center;
          padding: 32px 16px;
          color: #9B958C;
        }

        .empty-state-small p {
          margin: 0;
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

          .info-row,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .tenancy-card-header {
            flex-direction: column;
            gap: 12px;
          }

          .tenancy-actions {
            width: 100%;
            justify-content: space-between;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .section-header .button-primary {
            width: 100%;
          }

          .tenancy-highlight-details {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}