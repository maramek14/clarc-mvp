import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, AlertTriangle, CheckCircle, Clock, FileText, Package, Calendar } from "lucide-react";
import { getPropertyById } from "../utils";
import { inventoryLists } from "../inventoryData";
import { getPropertyReportsByProperty, getRoomInventoryStatus } from "../propertyReportsData";

export default function PropertyInventoryOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const propertyReports = getPropertyReportsByProperty(id);
  
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
          <h2>Property Inventory Overview</h2>
          <p className="subtitle">Complete inventory management for {property.name}</p>
        </div>
        <button
          className="button-primary"
          onClick={() => navigate(`/properties/${id}/inventory/create-report`)}
        >
          <Plus size={20} />
          Create Property Report
        </button>
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
                View Room Inventories →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Property Reports History */}
      <div className="section">
        <div className="section-header">
          <h3>Property Reports History</h3>
          <p className="section-subtitle">{propertyReports.length} reports generated</p>
        </div>

        {propertyReports.length === 0 ? (
          <div className="empty-state-small">
            <FileText size={48} strokeWidth={1.5} />
            <p>No property reports yet</p>
            <button
              className="button-primary"
              onClick={() => navigate(`/properties/${id}/inventory/create-report`)}
            >
              Create First Report
            </button>
          </div>
        ) : (
          <div className="reports-list">
            {propertyReports.map((report) => (
              <div
                key={report.id}
                className="report-card"
                onClick={() => navigate(`/properties/${id}/inventory/reports/${report.id}`)}
              >
                <div className="report-header">
                  <div>
                    <h4>{report.name}</h4>
                    <p className="report-meta">
                      {report.tenantName} • {report.inspectionDate}
                    </p>
                  </div>
                  <span
                    className="report-type-badge"
                    style={{
                      backgroundColor: report.reportType === 'check-in' ? '#10b981' :
                        report.reportType === 'check-out' ? '#ef4444' :
                        report.reportType === 'annual-inspection' ? '#0b63f6' : '#6b7280'
                    }}
                  >
                    {report.reportType.replace('-', ' ')}
                  </span>
                </div>

                <div className="report-stats">
                  <div className="report-stat">
                    <Package size={16} />
                    <span>{report.totalItems} items</span>
                  </div>
                  <div className="report-stat">
                    <FileText size={16} />
                    <span>{report.roomsIncluded.length} rooms</span>
                  </div>
                  {report.warnings.length > 0 && (
                    <div className="report-stat warning">
                      <AlertTriangle size={16} />
                      <span>{report.warnings.length} warnings</span>
                    </div>
                  )}
                </div>

                {report.notes && (
                  <p className="report-notes">{report.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 16px;
        }

        .page-header-section h2 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        .button-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #0b63f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .button-primary:hover {
          background: #0952d4;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
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
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
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
          font-size: 12px;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }

        .room-status-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
        }

        .detail-row:not(:last-child) {
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-label {
          color: #6b7280;
        }

        .detail-value {
          font-weight: 500;
          color: #111827;
        }

        .no-inventory-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          color: #92400e;
          font-size: 14px;
        }

        .view-room-btn {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-room-btn:hover {
          background: #e5e7eb;
        }

        .empty-state-small {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          color: #6b7280;
        }

        .empty-state-small p {
          margin: 16px 0 24px;
          font-size: 15px;
        }

        .reports-list {
          display: grid;
          gap: 16px;
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
          margin-bottom: 12px;
          gap: 16px;
        }

        .report-header h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .report-meta {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .report-type-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .report-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .report-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
        }

        .report-stat.warning {
          color: #dc2626;
        }

        .report-notes {
          margin: 12px 0 0;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .stats-row {
            flex-direction: column;
            gap: 12px;
          }

          .room-status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}