import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, X } from "lucide-react";
import { getPropertyById } from "../utils";
import { inventoryLists } from "../inventoryData";
import { getRoomInventoryStatus } from "../propertyReportsData";

const reportTypes = [
  { value: "check-in", label: "Tenancy Check-in" },
  { value: "check-out", label: "Tenancy Check-out" },
  { value: "annual-inspection", label: "Annual Inspection" },
  { value: "mid-tenancy", label: "Mid-Tenancy Inspection" },
  { value: "damage-assessment", label: "Damage Assessment" },
  { value: "maintenance", label: "Maintenance Inspection" }
];

export default function CreatePropertyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  const [step, setStep] = useState(1); // 1: Readiness Check, 2: Report Details, 3: Review
  const [formData, setFormData] = useState({
    name: "",
    reportType: "",
    tenantName: property?.tenant || "",
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const [roomStatuses] = useState(
    getRoomInventoryStatus(id, property?.rooms || [], inventoryLists)
  );
  const [selectedRooms, setSelectedRooms] = useState(
    roomStatuses.map(r => r.roomId)
  );

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

  const toggleRoomSelection = (roomId) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const getWarnings = () => {
    const warnings = [];
    
    selectedRooms.forEach(roomId => {
      const roomStatus = roomStatuses.find(r => r.roomId === roomId);
      if (roomStatus.status === 'missing') {
        warnings.push(`${roomStatus.roomName} has no inventory data`);
      } else if (roomStatus.status === 'outdated') {
        warnings.push(`${roomStatus.roomName} inventory is ${roomStatus.daysSinceLastInventory} days old`);
      } else if (roomStatus.status === 'needs-attention') {
        warnings.push(`${roomStatus.roomName} inventory may need updating (${roomStatus.daysSinceLastInventory} days old)`);
      }
    });

    return warnings;
  };

  const warnings = getWarnings();
  const hasIssues = roomStatuses.some(r => 
    selectedRooms.includes(r.roomId) && 
    (r.status === 'missing' || r.status === 'outdated')
  );

  const handleStep1Continue = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room to include in the report");
      return;
    }
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!formData.name || !formData.reportType) {
      alert("Please fill in all required fields");
      return;
    }
    setStep(3);
  };

  const handleSubmit = () => {
    // Calculate summary data
    const includedInventories = inventoryLists.filter(list =>
      list.propertyId === id && selectedRooms.includes(list.roomId)
    );

    const totalItems = includedInventories.reduce((sum, list) => sum + list.items.length, 0);
    
    const conditionSummary = includedInventories.reduce((summary, list) => {
      list.items.forEach(item => {
        const condition = item.condition.toLowerCase();
        summary[condition] = (summary[condition] || 0) + 1;
      });
      return summary;
    }, {});

    const newReport = {
      id: `prop-report-${Date.now()}`,
      propertyId: id,
      name: formData.name,
      reportType: formData.reportType,
      createdDate: new Date().toISOString().split('T')[0],
      inspectionDate: formData.inspectionDate,
      tenantName: formData.tenantName,
      status: warnings.length === 0 ? 'complete' : 'incomplete',
      roomsIncluded: selectedRooms,
      roomsExcluded: roomStatuses
        .filter(r => !selectedRooms.includes(r.roomId))
        .map(r => r.roomId),
      warnings: warnings,
      totalItems,
      conditionSummary,
      notes: formData.notes
    };

    console.log("New Property Report:", newReport);
    alert("Property report created successfully! (Data persists until page refresh)");
    navigate(`/properties/${id}/inventory`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up-to-date':
        return <CheckCircle size={18} />;
      case 'needs-attention':
        return <AlertTriangle size={18} />;
      case 'outdated':
      case 'missing':
        return <AlertTriangle size={18} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'up-to-date':
        return 'Up to Date';
      case 'needs-attention':
        return 'Needs Attention';
      case 'outdated':
        return 'Outdated';
      case 'missing':
        return 'No Inventory';
      default:
        return status;
    }
  };

  return (
    <div className="page-content">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? <Check size={20} /> : '1'}</div>
          <span>Room Readiness</span>
        </div>
        <div className="step-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? <Check size={20} /> : '2'}</div>
          <span>Report Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Review & Generate</span>
        </div>
      </div>

      {/* Step 1: Room Readiness Check */}
      {step === 1 && (
        <div className="form-step">
          <h2>Room Inventory Readiness Check</h2>
          <p className="step-description">
            Review the inventory status of each room before creating the property report
          </p>

          {hasIssues && (
            <div className="warning-banner">
              <AlertTriangle size={24} />
              <div>
                <strong>Some rooms have inventory issues</strong>
                <p>You can proceed with the report, but it may be incomplete. Consider updating room inventories first.</p>
              </div>
            </div>
          )}

          <div className="room-checklist">
            {roomStatuses.map((room) => (
              <div key={room.roomId} className="room-check-item">
                <div className="room-check-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.roomId)}
                      onChange={() => toggleRoomSelection(room.roomId)}
                    />
                    <span className="room-name">{room.roomName}</span>
                  </label>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: room.color }}
                  >
                    {getStatusIcon(room.status)}
                    <span>{getStatusLabel(room.status)}</span>
                  </div>
                </div>

                <div className="room-check-details">
                  {room.lastInventoryDate ? (
                    <>
                      <span>Last inventory: {room.lastInventoryDate}</span>
                      <span>•</span>
                      <span>{room.daysSinceLastInventory} days ago</span>
                      <span>•</span>
                      <span>{room.inventoryCount} lists available</span>
                    </>
                  ) : (
                    <span className="no-data">No inventory data available</span>
                  )}
                </div>

                {(room.status === 'missing' || room.status === 'outdated') && selectedRooms.includes(room.roomId) && (
                  <div className="room-action-hint">
                    <AlertTriangle size={14} />
                    <span>Consider updating this room's inventory before proceeding</span>
                    <button
                      type="button"
                      className="quick-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/properties/${id}/rooms/${room.roomId}/inventory`);
                      }}
                    >
                      Update Now →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="selection-summary">
            <p>
              <strong>{selectedRooms.length}</strong> of <strong>{roomStatuses.length}</strong> rooms selected
            </p>
            {warnings.length > 0 && (
              <p className="warning-text">
                <AlertTriangle size={16} />
                {warnings.length} warning{warnings.length !== 1 ? 's' : ''} detected
              </p>
            )}
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => navigate(`/properties/${id}/inventory`)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={handleStep1Continue}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Report Details */}
      {step === 2 && (
        <div className="form-step">
          <h2>Report Details</h2>
          <p className="step-description">Provide information about this property report</p>

          <div className="form-group">
            <label htmlFor="name">Report Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Annual Inspection 2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reportType">Report Type *</label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select report type</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tenantName">Tenant Name *</label>
            <input
              id="tenantName"
              name="tenantName"
              type="text"
              value={formData.tenantName}
              onChange={handleInputChange}
              placeholder="e.g., John Smith"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inspectionDate">Inspection Date *</label>
            <input
              id="inspectionDate"
              name="inspectionDate"
              type="date"
              value={formData.inspectionDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes about this inspection..."
              rows={4}
            />
          </div>

          <div className="step-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setStep(1)}
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={handleStep2Continue}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Generate */}
      {step === 3 && (
        <div className="form-step">
          <h2>Review & Generate Report</h2>
          <p className="step-description">Review the summary before generating the property report</p>

          {/* Report Summary */}
          <div className="review-section">
            <h3>Report Information</h3>
            <div className="review-grid">
              <div className="review-item">
                <span className="review-label">Report Name:</span>
                <span className="review-value">{formData.name}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Report Type:</span>
                <span className="review-value">
                  {reportTypes.find(t => t.value === formData.reportType)?.label}
                </span>
              </div>
              <div className="review-item">
                <span className="review-label">Tenant:</span>
                <span className="review-value">{formData.tenantName}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Inspection Date:</span>
                <span className="review-value">{formData.inspectionDate}</span>
              </div>
            </div>
          </div>

          {/* Rooms Summary */}
          <div className="review-section">
            <h3>Rooms Included ({selectedRooms.length})</h3>
            <div className="rooms-summary-grid">
              {roomStatuses
                .filter(r => selectedRooms.includes(r.roomId))
                .map(room => (
                  <div key={room.roomId} className="room-summary-card">
                    <div className="room-summary-header">
                      <span className="room-summary-name">{room.roomName}</span>
                      <div
                        className="status-badge-small"
                        style={{ backgroundColor: room.color }}
                      >
                        {getStatusLabel(room.status)}
                      </div>
                    </div>
                    {room.lastInventoryDate && (
                      <span className="room-summary-detail">
                        Last updated: {room.lastInventoryDate}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="review-section">
              <h3>Warnings ({warnings.length})</h3>
              <div className="warnings-list">
                {warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <AlertTriangle size={16} />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
              <p className="warning-note">
                These warnings indicate potential issues with the report data. You can still proceed, 
                but consider updating the affected room inventories for more accurate reporting.
              </p>
            </div>
          )}

          {/* Notes */}
          {formData.notes && (
            <div className="review-section">
              <h3>Notes</h3>
              <p className="notes-display">{formData.notes}</p>
            </div>
          )}

          <div className="step-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setStep(2)}
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={handleSubmit}
            >
              <Check size={20} />
              Generate Report
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .progress-step span {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .progress-step.active span {
          color: #0b63f6;
        }

        .progress-step.completed span {
          color: #10b981;
        }

        .step-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #6b7280;
          font-weight: 600;
          border: 2px solid #e5e7eb;
        }

        .progress-step.active .step-circle {
          background: #e0f0ff;
          color: #0b63f6;
          border-color: #0b63f6;
        }

        .progress-step.completed .step-circle {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: #e5e7eb;
          margin: 0 16px;
        }

        .form-step {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 32px;
        }

        .form-step h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .step-description {
          margin: 0 0 24px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .warning-banner {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 12px;
          margin-bottom: 24px;
          color: #92400e;
        }

        .warning-banner strong {
          display: block;
          margin-bottom: 4px;
        }

        .warning-banner p {
          margin: 0;
          font-size: 14px;
        }

        .room-checklist {
          display: grid;
          gap: 16px;
          margin-bottom: 24px;
        }

        .room-check-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }

        .room-check-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .room-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: white;
        }

        .room-check-details {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .no-data {
          color: #dc2626;
          font-weight: 500;
        }

        .room-action-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fef3c7;
          border-radius: 8px;
          font-size: 13px;
          color: #92400e;
          margin-top: 8px;
        }

        .quick-action-btn {
          margin-left: auto;
          padding: 4px 12px;
          background: white;
          border: 1px solid #d97706;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #92400e;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          background: #fffbeb;
        }

        .selection-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f3f4f6;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .selection-summary p {
          margin: 0;
          font-size: 14px;
        }

        .warning-text {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc2626;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        input[type="text"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #0b63f6;
        }

        textarea {
          resize: vertical;
        }

        .review-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
        }

        .review-section:last-of-type {
          border-bottom: none;
        }

        .review-section h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .review-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .review-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .review-value {
          font-size: 15px;
          color: #111827;
          font-weight: 500;
        }

        .rooms-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .room-summary-card {
          padding: 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .room-summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .room-summary-name {
          font-size: 14px;
          font-weight: 600;
        }

        .status-badge-small {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          color: white;
        }

        .room-summary-detail {
          font-size: 12px;
          color: #6b7280;
        }

        .warnings-list {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }

        .warning-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          color: #92400e;
          font-size: 14px;
        }

        .warning-note {
          margin: 0;
          padding: 12px;
          background: #fffbeb;
          border-radius: 8px;
          font-size: 13px;
          color: #92400e;
        }

        .notes-display {
          margin: 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          white-space: pre-wrap;
        }

        .step-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .button-primary,
        .button-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
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

        @media (max-width: 768px) {
          .progress-steps {
            flex-direction: column;
            gap: 16px;
          }

          .step-line {
            width: 2px;
            height: 30px;
            margin: 0;
          }

          .form-step {
            padding: 20px;
          }

          .room-check-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .review-grid {
            grid-template-columns: 1fr;
          }

          .rooms-summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}