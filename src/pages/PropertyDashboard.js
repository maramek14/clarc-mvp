import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, AlertTriangle, CheckCircle, Clock, FileText, Package, Calendar, Info } from "lucide-react";
import { getPropertyById } from "../utils";
import { inventoryLists } from "../inventoryData";
import { getPropertyReportsByProperty, getRoomInventoryStatus } from "../propertyReportsData";

export default function PropertyDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const propertyReports = getPropertyReportsByProperty(id) || [];
  
  const [roomStatuses] = useState(
    getRoomInventoryStatus(id, property?.rooms || [], inventoryLists)
  );

  if (!property) {
    return (
      <div className="page-content">
        <p>Property not found.</p>
      </div>
    );
  }

  // Calculate summary statistics
  const totalRooms = roomStatuses.length;
  const upToDateRooms = roomStatuses.filter(r => r.status === 'up-to-date').length;
  const needsAttentionRooms = roomStatuses.filter(r => r.status === 'needs-attention').length;
  const outdatedRooms = roomStatuses.filter(r => r.status === 'outdated').length;
  const missingRooms = roomStatuses.filter(r => r.status === 'missing').length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'up-to-date':
        return <CheckCircle size={20} />;
      case 'needs-attention':
        return <Clock size={20} />;
      case 'outdated':
        return <AlertTriangle size={20} />;
      case 'missing':
        return <AlertTriangle size={20} />;
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
      {/* Header */}
      <div className="page-header-section">
        <div>
          <h2>{property.name}</h2>
          <p className="subtitle">Complete inventory management</p>
        </div>
        <div className="header-actions">
          <button
            className="button-primary"
            onClick={() => navigate(`/properties/${id}/inventory/create-report`)}
          >
            <Plus size={20} />
            Create Property Report
          </button>
        </div>
      </div>

      {/* Property Information Card */}
      <div 
        className="property-info-card"
        onClick={() => navigate(`/properties/${id}/information`)}
      >
        <div className="property-info-icon">
          <Info size={24} />
        </div>
        <div className="property-info-content">
          <h3>Property Information</h3>
          <p className="property-info-address">{property.address || "Add property details"}</p>
          <p className="property-info-meta">
            {property.bedrooms && `${property.bedrooms} bed • `}
            {property.bathrooms && `${property.bathrooms} bath • `}
            {property.type || "View details"}
          </p>
        </div>
        <div className="property-info-arrow">→</div>
      </div>

      {/* Compact Status Card */}
      <div className="compact-status-card">
        <div className="status-main">
          <div className="status-icon">
            <Package size={24} />
          </div>
          <div className="status-content">
            <p className="status-label">Total Rooms</p>
            <p className="status-value">{totalRooms}</p>
          </div>
        </div>
        
        <div className="status-breakdown">
          <div className="breakdown-item">
            <CheckCircle size={16} />
            <span><strong>{upToDateRooms}</strong> Up to Date</span>
          </div>
          <div className="breakdown-item">
            <Clock size={16} />
            <span><strong>{needsAttentionRooms}</strong> Needs Attention</span>
          </div>
          <div className="breakdown-item">
            <AlertTriangle size={16} />
            <span><strong>{outdatedRooms + missingRooms}</strong> Outdated/Missing</span>
          </div>
        </div>
      </div>

      {/* Reports Summary */}
      <div className="reports-summary">
        <Calendar size={18} />
        <span><strong>{propertyReports.length}</strong> property report{propertyReports.length !== 1 ? 's' : ''} generated</span>
      </div>

      {/* Room Status Grid */}
      <div className="section">
        <h3>Room Inventory Status</h3>
        <div className="room-status-grid">
          {roomStatuses.map((room) => (
            <div
              key={room.roomId}
              className="room-status-card"
              onClick={() => navigate(`/properties/${id}/rooms/${room.roomId}/inventory`)}
            >
              <div className="room-status-header">
                <h4>{room.roomName}</h4>
                <div
                  className="status-badge"
                  style={{ backgroundColor: room.color }}
                >
                  {getStatusIcon(room.status)}
                  <span>{getStatusLabel(room.status)}</span>
                </div>
              </div>

              <div className="room-status-details">
                {room.lastInventoryDate ? (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Last Inventory:</span>
                      <span className="detail-value">{room.lastInventoryDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Days Since:</span>
                      <span className="detail-value">{room.daysSinceLastInventory} days</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Lists:</span>
                      <span className="detail-value">{room.inventoryCount}</span>
                    </div>
                  </>
                ) : (
                  <div className="no-inventory-message">
                    <AlertTriangle size={16} />
                    <span>No inventory data available</span>
                  </div>
                )}
              </div>

              <button className="view-room-btn">
                View Room Inventory →
              </button>
            </div>
          ))}

          {/* Add Room Card */}
          <div
            className="room-status-card add-room-card"
            onClick={() => navigate(`/properties/${id}/add-room`)}
          >
            <div className="add-room-content">
              <Plus size={48} strokeWidth={2} />
              <h4>Add New Room</h4>
              <p>Create a new room to start tracking inventory</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-header-section h2 {
          margin: 0 0 4px 0;
          font-size: 32px;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          color: #9B958C;
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .property-info-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, #F8FBFD 0%, #E8F1F8 100%);
          border: 2px solid #2C5F8D;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .property-info-card:active {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(44, 95, 141, 0.2);
        }

        .property-info-icon {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2C5F8D;
          flex-shrink: 0;
        }

        .property-info-content {
          flex: 1;
          min-width: 0;
        }

        .property-info-content h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .property-info-address {
          margin: 0 0 4px 0;
          font-size: 15px;
          color: #2A2A2A;
        }

        .property-info-meta {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
        }

        .property-info-arrow {
          font-size: 24px;
          color: #2C5F8D;
          font-weight: bold;
          flex-shrink: 0;
        }

        .compact-status-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .status-main {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .status-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(135deg, #E8F1F8 0%, #D6E7F5 100%);
          color: #2C5F8D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .status-content {
          flex: 1;
        }

        .status-label {
          margin: 0 0 2px 0;
          font-size: 14px;
          color: #9B958C;
          font-weight: 500;
        }

        .status-value {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #2A2A2A;
          line-height: 1;
        }

        .status-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-left: 60px;
          border-left: 3px solid #E6E3DD;
          margin-left: 24px;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #2A2A2A;
        }

        .breakdown-item svg {
          flex-shrink: 0;
        }

        .breakdown-item:nth-child(1) svg {
          color: #10b981;
        }

        .breakdown-item:nth-child(1) strong {
          color: #10b981;
        }

        .breakdown-item:nth-child(2) svg {
          color: #f59e0b;
        }

        .breakdown-item:nth-child(2) strong {
          color: #f59e0b;
        }

        .breakdown-item:nth-child(3) svg {
          color: #ef4444;
        }

        .breakdown-item:nth-child(3) strong {
          color: #ef4444;
        }

        .reports-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 32px;
          font-size: 14px;
          color: #2A2A2A;
        }

        .reports-summary svg {
          color: #9B958C;
          flex-shrink: 0;
        }

        .section {
          margin-bottom: 40px;
        }

        .section h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .room-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .room-status-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
        }

        .room-status-card:active {
          border-color: #2C5F8D;
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
          transform: translateY(-2px);
        }

        .room-status-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .room-status-header h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .room-status-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .detail-label {
          color: #9B958C;
        }

        .detail-value {
          color: #2A2A2A;
          font-weight: 500;
        }

        .no-inventory-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #FFF8E7;
          border-radius: 8px;
          color: #8B6914;
          font-size: 13px;
        }

        .view-room-btn {
          width: 100%;
          padding: 10px;
          background: #F9F8F6;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          color: #2C5F8D;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .view-room-btn:active {
          background: #2C5F8D;
          color: white;
        }

        .add-room-card {
          background: linear-gradient(135deg, #F9F8F6 0%, #F5F3EF 100%);
          border: 2px dashed #E6E3DD;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .add-room-card:active {
          border-color: #2C5F8D;
          background: linear-gradient(135deg, #F8FBFD 0%, #E8F1F8 100%);
          transform: translateY(-2px);
        }

        .add-room-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9B958C;
          text-align: center;
          padding: 20px;
        }

        .add-room-content h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .add-room-content p {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
        }

        .add-room-card:active .add-room-content {
          color: #2C5F8D;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .room-status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}