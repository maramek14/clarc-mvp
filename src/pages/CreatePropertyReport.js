import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, X, User, Calendar } from "lucide-react";
import { getPropertyById } from "../utils";
import { getInventoryLists, getInventoryListsByRoom } from "../inventoryData";
import { getRoomInventoryStatus } from "../propertyReportsData";
import { getInventoryListTenancyOptions, getTenancyById } from "../tenancyData";
import { addPropertyReport } from "../propertyReportsData";


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

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    reportType: "",
    tenantName: property?.tenant || "",
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const [selectedTenancyOption, setSelectedTenancyOption] = useState(null);
  const [roomStatuses] = useState(
    getRoomInventoryStatus(id, property?.rooms || [], getInventoryLists())
  );
  const [selectedRoomLists, setSelectedRoomLists] = useState({});

  if (!property) {
    return (
      <div className="page-content">
        <p>Property not found.</p>
      </div>
    );
  }

  const tenancyOptions = getInventoryListTenancyOptions(id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomListSelection = (roomId, listId) => {
    setSelectedRoomLists(prev => ({
      ...prev,
      [roomId]: listId === "none" ? null : listId
    }));
  };

  const getAvailableListsForRoom = (roomId) => {
    const allLists = getInventoryListsByRoom(id, roomId);
    
    if (!selectedTenancyOption) return allLists;
    
    return allLists.filter(list => {
      // Maintenance lists can be used for any report
      if (list.tenancyType === 'maintenance') return true;
      
      // Otherwise match tenancy
      return list.tenancyId === selectedTenancyOption.value;
    });
  };

  const getSelectedRoomIds = () => {
    return Object.keys(selectedRoomLists).filter(roomId => selectedRoomLists[roomId] !== null);
  };

  const getWarnings = () => {
    const warnings = [];
    
    getSelectedRoomIds().forEach(roomId => {
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
    getSelectedRoomIds().includes(r.roomId) && 
    (r.status === 'missing' || r.status === 'outdated')
  );

  const handleStep1Continue = () => {
    if (getSelectedRoomIds().length === 0) {
      alert("Please select at least one room with an inventory list");
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
    const selectedListIds = Object.values(selectedRoomLists).filter(id => id !== null);
    const includedInventories = getInventoryLists().filter(list =>
      selectedListIds.includes(list.id)
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
      roomsIncluded: getSelectedRoomIds(),
      roomsExcluded: roomStatuses
        .filter(r => !getSelectedRoomIds().includes(r.roomId))
        .map(r => r.roomId),
      roomInventoryListIds: selectedListIds,
      warnings: warnings,
      totalItems,
      conditionSummary,
      notes: formData.notes
    };

    // Import at top: import { addPropertyReport } from "../propertyReportsData";

    addPropertyReport(newReport);
    alert("Property report created successfully!");
    navigate(`/properties/${id}/inventory`, { replace: true });
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

  const getAvailableReportTypes = () => {
    if (!selectedTenancyOption) return reportTypes;
    
    if (selectedTenancyOption.type === 'current') {
      return reportTypes.filter(t => 
        ['mid-tenancy', 'annual-inspection', 'damage-assessment'].includes(t.value)
      );
    } else if (selectedTenancyOption.type === 'upcoming') {
      return reportTypes.filter(t => t.value === 'check-in');
    } else if (selectedTenancyOption.type === 'maintenance') {
      return reportTypes.filter(t => t.value === 'maintenance');
    }
    return reportTypes;
  };

  const handleSelectTenancy = (option) => {
    setSelectedTenancyOption(option);
    
    const tenancy = option.tenancy;
    
    if (option.type === 'maintenance') {
      setFormData(prev => ({
        ...prev,
        tenantName: "Property Maintenance",
        name: `Maintenance Inspection - ${property.name}`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tenantName: tenancy.tenantName,
        name: `Property Report - ${tenancy.tenantName}`
      }));
    }
    // Auto-select most recent list for each room
    const autoSelectedLists = {};
    property.rooms.forEach(room => {
      const availableLists = getInventoryListsByRoom(id, room.id).filter(list => {
        // Maintenance lists can be used for any report
        if (list.tenancyType === 'maintenance') return true;
        // Otherwise match tenancy
        return list.tenancyId === option.value;
      });
      
      if (availableLists.length > 0) {
        // Sort by inspection date, most recent first
        const sortedLists = availableLists.sort((a, b) => 
          new Date(b.inspectionDate) - new Date(a.inspectionDate)
        );
        autoSelectedLists[room.id] = sortedLists[0].id;
      }
    });
    
    setSelectedRoomLists(autoSelectedLists);

    setStep(1);
  };

  const handleCancel = () => {
    navigate(`/properties/${id}/inventory`, { replace: true });
  };

  return (
    <div className="page-content">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`progress-step ${step >= 0 ? 'active' : ''} ${step > 0 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 0 ? <Check size={20} /> : '0'}</div>
          <span>Select Tenancy</span>
        </div>
        <div className="step-line"></div>
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? <Check size={20} /> : '1'}</div>
          <span>Select Lists</span>
        </div>
        <div className="step-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? <Check size={20} /> : '2'}</div>
          <span>Report Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Review</span>
        </div>
      </div>

      {/* Step 0: Select Tenancy */}
      {step === 0 && (
        <div className="form-step">
          <h2>Select Tenancy</h2>
          <p className="step-description">
            Choose which tenancy this property report is for
          </p>

          {tenancyOptions.length > 0 ? (
            <div className="tenancy-options">
              {tenancyOptions.map((option) => (
                <div
                  key={option.value}
                  className="tenancy-option-card"
                  onClick={() => handleSelectTenancy(option)}
                >
                  <div className="tenancy-option-header">
                    <User size={24} />
                    <div className="tenancy-option-info">
                      <h4>{option.tenancy.tenantName}</h4>
                      <p>{option.label}</p>
                    </div>
                  </div>

                  <div className="tenancy-option-details">
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>
                        {new Date(option.tenancy.startDate).toLocaleDateString('en-GB')} - {new Date(option.tenancy.endDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>

                  {option.type === 'current' && (
                    <div className="tenancy-badge current">Current</div>
                  )}
                  {option.type === 'upcoming' && (
                    <div className="tenancy-badge upcoming">Upcoming</div>
                  )}
                  {option.type === 'maintenance' && (
                    <div className="tenancy-badge maintenance">Maintenance</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tenancies found. Please add a tenancy in Property Information first.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/information`)}
              >
                Go to Property Information
              </button>
            </div>
          )}

          <div className="step-actions">
            <button className="button-secondary" onClick={handleCancel}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Select Inventory Lists */}
      {step === 1 && (
        <div className="form-step">
          <h2>Select Inventory Lists</h2>
          <p className="step-description">
            Choose which inventory list to use for each room
          </p>

          {hasIssues && (
            <div className="warning-banner">
              <AlertTriangle size={24} />
              <div>
                <strong>Some rooms have inventory issues</strong>
                <p>You can proceed with the report, but it may be incomplete.</p>
              </div>
            </div>
          )}

          <div className="room-checklist">
            {roomStatuses.map((room) => {
              const availableLists = getAvailableListsForRoom(room.roomId);
              
              return (
                <div key={room.roomId} className="room-select-item">
                  <div className="room-select-header">
                    <span className="room-name">{room.roomName}</span>
                    <div className="status-badge" style={{ backgroundColor: room.color }}>
                      {getStatusIcon(room.status)}
                      <span>{getStatusLabel(room.status)}</span>
                    </div>
                  </div>

                  <div className="list-selector">
                    <select
                      value={selectedRoomLists[room.roomId] || "none"}
                      onChange={(e) => handleRoomListSelection(room.roomId, e.target.value)}
                      className="list-dropdown"
                    >
                      <option value="none">Don't include this room</option>
                      {availableLists.map(list => (
                        <option key={list.id} value={list.id}>
                          {list.name} - {list.inspectionDate} ({list.items.length} items)
                        </option>
                      ))}
                    </select>
                  </div>

                  {availableLists.length === 0 && (
                    <div className="room-action-hint">
                      <AlertTriangle size={14} />
                      <span>No inventory lists available for this room and tenancy</span>
                      <button
                        type="button"
                        className="quick-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/properties/${id}/rooms/${room.roomId}/inventory/create`);
                        }}
                      >
                        Create List →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="selection-summary">
            <p>
              <strong>{getSelectedRoomIds().length}</strong> of <strong>{roomStatuses.length}</strong> rooms selected
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
              onClick={() => setStep(0)}
            >
              <ChevronLeft size={20} />
              Back
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
              {getAvailableReportTypes().map(type => (
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
              disabled
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

          <div className="review-section">
            <h3>Rooms Included ({getSelectedRoomIds().length})</h3>
            <div className="rooms-summary-grid">
              {roomStatuses
                .filter(r => getSelectedRoomIds().includes(r.roomId))
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
          border: 1px solid #E6E3DD;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .progress-step span {
          font-size: 13px;
          color: #9B958C;
          font-weight: 500;
        }

        .progress-step.active span {
          color: #2C5F8D;
        }

        .progress-step.completed span {
          color: #3D7C5C;
        }

        .step-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #F5F3EF;
          color: #9B958C;
          font-weight: 600;
          border: 2px solid #E6E3DD;
        }

        .progress-step.active .step-circle {
          background: #E8F1F8;
          color: #2C5F8D;
          border-color: #2C5F8D;
        }

        .progress-step.completed .step-circle {
          background: #3D7C5C;
          color: white;
          border-color: #3D7C5C;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: #E6E3DD;
          margin: 0 16px;
        }

        .form-step {
          background: white;
          border: 1px solid #E6E3DD;
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
          color: #9B958C;
          font-size: 14px;
        }

        .tenancy-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tenancy-option-card {
          background: white;
          border: 2px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .tenancy-option-card:active {
          border-color: #2C5F8D;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
        }

        .tenancy-option-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .tenancy-option-info {
          flex: 1;
        }

        .tenancy-option-info h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .tenancy-option-info p {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
        }

        .tenancy-option-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid #F5F3EF;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6B7280;
        }

        .tenancy-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .tenancy-badge.current {
          background: #10b981;
        }

        .tenancy-badge.upcoming {
          background: #3b82f6;
        }

        .tenancy-badge.maintenance {
          background: #f59e0b;
        }

        .warning-banner {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #FFF8E7;
          border: 1px solid #D4A574;
          border-radius: 12px;
          margin-bottom: 24px;
          color: #8B6914;
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

        .room-select-item {
          background: #F9F8F6;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
        }

        .room-select-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .room-name {
          font-size: 16px;
          font-weight: 600;
          color: #2A2A2A;
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

        .list-selector {
          margin-bottom: 8px;
        }

        .list-dropdown {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: white;
        }

        .list-dropdown:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        .room-action-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #FFF8E7;
          border-radius: 8px;
          font-size: 13px;
          color: #8B6914;
        }

        .quick-action-btn {
          margin-left: auto;
          padding: 4px 12px;
          background: white;
          border: 1px solid #D4A574;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #8B6914;
          cursor: pointer;
        }

        .quick-action-btn:active {
          background: #FFFBF0;
        }

        .selection-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #F5F3EF;
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
          color: #B85C4F;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
          margin-bottom: 8px;
        }

        input[type="text"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          font-family: inherit;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        input:disabled {
          background: #F5F3EF;
          cursor: not-allowed;
        }

        textarea {
          resize: vertical;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          background: #F5F3EF;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .empty-state p {
          margin: 0 0 16px 0;
          color: #6B7280;
        }

        .review-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #E6E3DD;
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
          color: #9B958C;
          font-weight: 500;
        }

        .review-value {
          font-size: 15px;
          color: #2A2A2A;
          font-weight: 500;
        }

        .rooms-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .room-summary-card {
          padding: 12px;
          background: #F9F8F6;
          border: 1px solid #E6E3DD;
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
          color: #9B958C;
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
          background: #FFF8E7;
          border-radius: 8px;
          color: #8B6914;
          font-size: 14px;
        }

        .warning-note {
          margin: 0;
          padding: 12px;
          background: #FFFBF0;
          border-radius: 8px;
          font-size: 13px;
          color: #8B6914;
        }

        .notes-display {
          margin: 0;
          padding: 16px;
          background: #F9F8F6;
          border-radius: 8px;
          font-size: 14px;
          color: #2A2A2A;
          white-space: pre-wrap;
        }

        .step-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #E6E3DD;
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

        @media (max-width: 768px) {
          .progress-steps {
            padding: 16px;
          }

          .step-line {
            width: 30px;
            margin: 0 8px;
          }

          .progress-step span {
            font-size: 11px;
          }

          .form-step {
            padding: 20px;
          }

          .review-grid {
            grid-template-columns: 1fr;
          }

          .rooms-summary-grid {
            grid-template-columns: 1fr;
          }

          .tenancy-option-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}