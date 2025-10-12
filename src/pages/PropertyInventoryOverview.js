import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, AlertTriangle, CheckCircle, Clock, FileText, Package, Calendar, Info } from "lucide-react";
import { getPropertyById } from "../utils";
import { inventoryLists } from "../inventoryData";
import { getPropertyReportsByProperty, getRoomInventoryStatus } from "../propertyReportsData";

export default function PropertyInventoryOverview() {
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
  
  const totalInventoryLists = inventoryLists.filter(list => list.propertyId === id).length;
  const totalItems = inventoryLists
    .filter(list => list.propertyId === id)
    .reduce((sum, list) => sum + list.items.length, 0);

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

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#e0f0ff', color: '#0b63f6' }}>
            <Package size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Total Rooms</p>
            <p className="card-value">{totalRooms}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Up to Date</p>
            <p className="card-value">{upToDateRooms}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Needs Attention</p>
            <p className="card-value">{needsAttentionRooms}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Outdated/Missing</p>
            <p className="card-value">{outdatedRooms + missingRooms}</p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <FileText size={18} />
          <span>{totalInventoryLists} total inventory lists</span>
        </div>
        <div className="stat-item">
          <Package size={18} />
          <span>{totalItems} total items tracked</span>
        </div>
        <div className="stat-item">
          <Calendar size={18} />
          <span>{propertyReports.length} property reports generated</span>
        </div>
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
              {/* existing room card content stays the same */}
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
          color: #6b7280;
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
          background: linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%);
          border: 2px solid #0b63f6;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .property-info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(11, 99, 246, 0.2);
        }

        .property-info-icon {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0b63f6;
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
          color: #111827;
        }

        .property-info-address {
          margin: 0 0 4px 0;
          font-size: 15px;
          color: #374151;
        }

        .property-info-meta {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .property-info-arrow {
          font-size: 24px;
          color: #0b63f6;
          font-weight: bold;
          flex-shrink: 0;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 12px;
        }

        .card-content {
          flex: 1;
        }

        .card-label {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .card-value {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .stats-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 32px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .section {
          margin-bottom: 40px;
        }

        .section h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          margin: 0;
        }

        .section-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .room-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .room-status-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .room-status-card:hover {
          border-color: #0b63f6;
          box-shadow: 0 4px 12px rgba(11, 99, 246, 0.1);
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
          color: #6b7280;
        }

        .detail-value {
          color: #111827;
          font-weight: 500;
        }

        .no-inventory-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          color: #92400e;
          font-size: 13px;
        }

        .view-room-btn {
          width: 100%;
          padding: 10px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #0b63f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-room-btn:hover {
          background: #0b63f6;
          color: white;
        }

        .empty-state-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          color: #6b7280;
          text-align: center;
        }

        .empty-state-small p {
          margin: 16px 0 20px 0;
        }

        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .report-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .report-card:hover {
          border-color: #0b63f6;
          box-shadow: 0 4px 12px rgba(11, 99, 246, 0.1);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .report-header h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .report-meta {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .report-type-badge {
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .report-rooms {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

                  .add-room-card {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px dashed #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .add-room-card:hover {
          border-color: #0b63f6;
          background: linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%);
          transform: translateY(-2px);
        }

        .add-room-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6b7280;
          text-align: center;
          padding: 20px;
        }

        .add-room-content h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .add-room-content p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .add-room-card:hover .add-room-content {
          color: #0b63f6;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .room-status-grid {
            grid-template-columns: 1fr;
          }
          

        }
      `}</style>
    </div>
  );
}