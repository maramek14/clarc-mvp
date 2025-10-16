import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Save, X, FileDown, Package, Calendar, User, FileText } from "lucide-react";
import { getPropertyReportsByProperty } from "../propertyReportsData";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListById } from "../inventoryData";

const conditionOptions = ["Excellent", "Good", "Fair", "Poor", "Damaged", "Missing"];

const conditionColors = {
  "Excellent": "#10b981",
  "Good": "#3b82f6",
  "Fair": "#f59e0b",
  "Poor": "#ef4444",
  "Damaged": "#dc2626",
  "Missing": "#6b7280"
};

export default function ViewInventoryList() {
  const { id, roomId, listId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const originalList = getInventoryListById(listId);

  const [isEditing, setIsEditing] = useState(false);
  const [listData, setListData] = useState(originalList);
  const [savedData, setSavedData] = useState(originalList);

  if (!property || !room || !originalList) {
    return (
      <div className="page-content">
        <p>Inventory list not found.</p>
      </div>
    );
  }

  const handleConditionChange = (itemId, newCondition) => {
    setListData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, condition: newCondition }
          : item
      )
    }));
  };

  const handleNotesChange = (itemId, newNotes) => {
    setListData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, notes: newNotes }
          : item
      )
    }));
  };

  const handleSave = () => {
    setSavedData(listData);
    setIsEditing(false);
    alert("Changes saved successfully! (Data persists until page refresh)");
  };

  const handleCancel = () => {
    setListData(savedData);
    setIsEditing(false);
  };

  const propertyReports = getPropertyReportsByProperty(id);
  const relatedReport = propertyReports.find(report => 
    report.roomInventoryListIds?.includes(listId)
  );

  // DEBUG - Remove after testing
// DEBUG - Remove after testing
// DEBUG - Remove after testing
  console.log('All Property Reports:', JSON.stringify(propertyReports, null, 2));
  console.log('Looking for room:', roomId);
  console.log('List inspection date:', listData.inspectionDate);
  console.log('List tenant name:', listData.tenantName);
  console.log('Related Report Found:', relatedReport);

  const handleExport = () => {
    // Navigate to export configuration page (to be built later)
    alert("Export to PDF feature coming soon!");
    // navigate(`/properties/${id}/rooms/${roomId}/inventory/${listId}/export`);
  };

  const groupedItems = listData.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="page-content">
      {/* Header */}
      <div className="list-header">
        <div className="list-info-section">
          <h2>{listData.name}</h2>
          <div className="list-meta">
            <div className="meta-item">
              <User size={16} />
              <span>{listData.tenantName}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{listData.inspectionDate}</span>
            </div>
            <div className="meta-item">
              <Package size={16} />
              <span>{listData.items.length} items</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {!isEditing ? (
            <>
              {relatedReport && (
                <button 
                  className="button-secondary" 
                  onClick={() => navigate(`/properties/${id}/inventory/reports/${relatedReport.id}`)}
                >
                  <FileText size={18} />
                  View Full Report
                </button>
              )}
              <button className="button-secondary" onClick={handleExport}>
                <FileDown size={18} />
                Export PDF
              </button>
              
              <button className="button-primary" onClick={() => setIsEditing(true)}>
                <Edit2 size={18} />
                Edit
              </button>
            </>
          ) : (
            <>
              <button className="button-secondary" onClick={handleCancel}>
                <X size={18} />
                Cancel
              </button>
              <button className="button-primary" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* List Details */}
      <div className="list-details-card">
        <div className="detail-row">
          <strong>Event Type:</strong>
          <span className="event-badge" style={{ backgroundColor: '#10b981' }}>
            {listData.eventType}
          </span>
        </div>
        <div className="detail-row">
          <strong>Tenancy Period:</strong>
          <span>{listData.tenancyPeriod}</span>
        </div>
        <div className="detail-row">
          <strong>Status:</strong>
          <span>{listData.status}</span>
        </div>
        {listData.notes && (
          <div className="detail-row">
            <strong>Notes:</strong>
            <span>{listData.notes}</span>
          </div>
        )}
      </div>

      {/* Items by Category */}
      <div className="items-section">
        <h3>Inventory Items</h3>
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="category-section">
            <h4 className="category-title">{category}</h4>
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-header">
                    <h5>{item.name}</h5>
                    {item.quantity > 1 && (
                      <span className="quantity-badge">x{item.quantity}</span>
                    )}
                  </div>

                  <div className="item-condition">
                    <label>Condition:</label>
                    {isEditing ? (
                      <select
                        value={item.condition}
                        onChange={(e) => handleConditionChange(item.id, e.target.value)}
                        className="condition-select"
                        style={{ borderColor: conditionColors[item.condition] }}
                      >
                        {conditionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="condition-badge"
                        style={{ backgroundColor: conditionColors[item.condition] }}
                      >
                        {item.condition}
                      </span>
                    )}
                  </div>

                  <div className="item-notes">
                    <label>Notes:</label>
                    {isEditing ? (
                      <textarea
                        value={item.notes}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        className="notes-input"
                        rows={2}
                        placeholder="Add notes..."
                      />
                    ) : (
                      <p>{item.notes || "No notes"}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

<style jsx>{`
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 16px;
        }

        .list-info-section h2 {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .list-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #9B958C;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .button-primary,
        .button-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
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
          border: 1px solid #E6E3DD;
        }

        .button-secondary:active {
          background: #EBE8E1;
        }

        .list-details-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 14px;
        }

        .detail-row:not(:last-child) {
          border-bottom: 1px solid #F5F3EF;
        }

        .detail-row strong {
          min-width: 140px;
          color: #2A2A2A;
        }

        .event-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .items-section h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .category-section {
          margin-bottom: 32px;
        }

        .category-title {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .item-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .item-header h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .quantity-badge {
          padding: 4px 8px;
          background: #F5F3EF;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #9B958C;
        }

        .item-condition {
          margin-bottom: 12px;
        }

        .item-condition label,
        .item-notes label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #9B958C;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .condition-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: white;
        }

        .condition-select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .condition-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(44, 95, 141, 0.1);
        }

        .item-notes p {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
          font-style: italic;
        }

        .notes-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
        }

        .notes-input:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        @media (max-width: 768px) {
          .list-header {
            flex-direction: column;
          }

          .action-buttons {
            width: 100%;
          }

          .button-primary,
          .button-secondary {
            flex: 1;
          }

          .list-meta {
            flex-direction: column;
            gap: 8px;
          }

          .items-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}