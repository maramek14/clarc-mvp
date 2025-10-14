import { useParams, useNavigate } from "react-router-dom";
import { FileDown, Calendar, User, Package, AlertTriangle, Home } from "lucide-react";
import { getPropertyById } from "../utils";
import { getPropertyReportById } from "../propertyReportsData";
import { inventoryLists } from "../inventoryData";

const conditionColors = {
  "excellent": "#10b981",
  "good": "#3b82f6",
  "fair": "#f59e0b",
  "poor": "#ef4444",
  "damaged": "#dc2626"
};

export default function ViewPropertyReport() {
  const { id, reportId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const report = getPropertyReportById(reportId);

  if (!property || !report) {
    return (
      <div className="page-content">
        <p>Report not found.</p>
      </div>
    );
  }

  // Get room details for included rooms
  const includedRooms = property.rooms.filter(room =>
    report.roomsIncluded.includes(room.id)
  );

  // Get excluded rooms if any
  const excludedRooms = property.rooms.filter(room =>
    report.roomsExcluded.includes(room.id)
  );

  // Get all inventory data for included rooms
  const roomInventories = includedRooms.map(room => {
    const roomLists = inventoryLists.filter(
      list => list.propertyId === id && list.roomId === room.id
    );
    
    // Get the most recent list
    const latestList = roomLists.reduce((latest, current) => {
      const currentDate = new Date(current.inspectionDate);
      const latestDate = new Date(latest?.inspectionDate || 0);
      return currentDate > latestDate ? current : latest;
    }, null);

    return {
      room,
      latestList,
      totalItems: latestList?.items.length || 0
    };
  });

  const handleExport = () => {
    alert("Export to PDF feature coming soon!");
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="report-header">
        <div>
          <h2>{report.name}</h2>
          <div className="report-meta">
            <div className="meta-item">
              <User size={16} />
              <span>{report.tenantName}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{report.inspectionDate}</span>
            </div>
            <div className="meta-item">
              <Package size={16} />
              <span>{report.totalItems} items</span>
            </div>
          </div>
        </div>

        <button className="button-primary" onClick={handleExport}>
          <FileDown size={18} />
          Export PDF
        </button>
      </div>

      {/* Report Details Card */}
      <div className="details-card">
        <div className="detail-row">
          <strong>Report Type:</strong>
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
        <div className="detail-row">
          <strong>Status:</strong>
          <span className={`status-text ${report.status}`}>
            {report.status === 'complete' ? '✓ Complete' : '⚠ Incomplete'}
          </span>
        </div>
        <div className="detail-row">
          <strong>Created:</strong>
          <span>{report.createdDate}</span>
        </div>
        <div className="detail-row">
          <strong>Rooms Included:</strong>
          <span>{report.roomsIncluded.length} of {property.rooms.length}</span>
        </div>
        {report.notes && (
          <div className="detail-row notes-row">
            <strong>Notes:</strong>
            <span>{report.notes}</span>
          </div>
        )}
      </div>

      {/* Warnings */}
      {report.warnings.length > 0 && (
        <div className="warnings-section">
          <h3>
            <AlertTriangle size={20} />
            Warnings ({report.warnings.length})
          </h3>
          <div className="warnings-list">
            {report.warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <AlertTriangle size={16} />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Summary */}
      <div className="section">
        <h3>Overall Condition Summary</h3>
        <div className="condition-summary-grid">
          {Object.entries(report.conditionSummary).map(([condition, count]) => (
            <div key={condition} className="condition-summary-card">
              <div
                className="condition-indicator"
                style={{ backgroundColor: conditionColors[condition] }}
              ></div>
              <div className="condition-content">
                <p className="condition-label">{condition}</p>
                <p className="condition-count">{count} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room-by-Room Breakdown */}
      <div className="section">
        <h3>Room-by-Room Breakdown</h3>
        <div className="rooms-breakdown">
          {roomInventories.map(({ room, latestList, totalItems }) => (
            <div key={room.id} className="room-breakdown-card">
              <div className="room-breakdown-header">
                <div>
                  <h4>{room.name}</h4>
                  <p className="room-meta">{totalItems} items tracked</p>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/properties/${id}/rooms/${room.id}/inventory/${latestList?.id}`)}
                  disabled={!latestList}
                >
                  <Home size={16} />
                  View Details
                </button>
              </div>

              {latestList ? (
                <div className="room-items-preview">
                  <p className="preview-label">Latest Inventory ({latestList.inspectionDate}):</p>
                  <div className="items-list-preview">
                    {latestList.items.slice(0, 5).map((item, index) => (
                      <div key={index} className="item-preview">
                        <span className="item-name">{item.name}</span>
                        <span
                          className="item-condition"
                          style={{ color: conditionColors[item.condition.toLowerCase()] }}
                        >
                          {item.condition}
                        </span>
                      </div>
                    ))}
                    {latestList.items.length > 5 && (
                      <p className="more-items">+{latestList.items.length - 5} more items</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-data-message">
                  <AlertTriangle size={16} />
                  <span>No inventory data available for this room</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Excluded Rooms */}
      {excludedRooms.length > 0 && (
        <div className="section">
          <h3>Excluded Rooms ({excludedRooms.length})</h3>
          <div className="excluded-rooms-list">
            {excludedRooms.map(room => (
              <div key={room.id} className="excluded-room-item">
                <span>{room.name}</span>
                <span className="excluded-badge">Not included in report</span>
              </div>
            ))}
          </div>
        </div>
      )}

<style jsx>{`
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 16px;
        }

        .report-header h2 {
          margin: 0 0 12px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .report-meta {
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

        .button-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #2C5F8D;
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
          background: #1E4466;
        }

        .details-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          font-size: 15px;
        }

        .detail-row:not(:last-child) {
          border-bottom: 1px solid #F5F3EF;
        }

        .detail-row strong {
          min-width: 140px;
          color: #2A2A2A;
          font-weight: 600;
        }

        .notes-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .notes-row span {
          margin-top: 8px;
          padding: 12px;
          background: #F9F8F6;
          border-radius: 8px;
          width: 100%;
        }

        .report-type-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .status-text {
          font-weight: 500;
        }

        .status-text.complete {
          color: #3D7C5C;
        }

        .status-text.incomplete {
          color: #B85C4F;
        }

        .warnings-section {
          background: #FFF8E7;
          border: 1px solid #D4A574;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .warnings-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #8B6914;
        }

        .warnings-list {
          display: grid;
          gap: 8px;
        }

        .warning-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #FFFBF0;
          border-radius: 8px;
          color: #8B6914;
          font-size: 14px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .condition-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .condition-summary-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
        }

        .condition-indicator {
          width: 12px;
          height: 40px;
          border-radius: 6px;
        }

        .condition-content {
          flex: 1;
        }

        .condition-label {
          margin: 0 0 4px 0;
          font-size: 13px;
          color: #9B958C;
          text-transform: capitalize;
        }

        .condition-count {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #2A2A2A;
        }

        .rooms-breakdown {
          display: grid;
          gap: 20px;
        }

        .room-breakdown-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
        }

        .room-breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
        }

        .room-breakdown-header h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .room-meta {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
        }

        .view-details-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #F5F3EF;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .view-details-btn:hover:not(:disabled) {
          background: #EBE8E1;
        }

        .view-details-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .room-items-preview {
          padding: 16px;
          background: #F9F8F6;
          border-radius: 8px;
        }

        .preview-label {
          margin: 0 0 12px 0;
          font-size: 13px;
          font-weight: 600;
          color: #9B958C;
        }

        .items-list-preview {
          display: grid;
          gap: 8px;
        }

        .item-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          font-size: 14px;
        }

        .item-name {
          color: #2A2A2A;
        }

        .item-condition {
          font-weight: 600;
          font-size: 13px;
        }

        .more-items {
          margin: 8px 0 0;
          font-size: 13px;
          color: #9B958C;
          font-style: italic;
          text-align: center;
        }

        .no-data-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #FFF8E7;
          border-radius: 8px;
          color: #8B6914;
          font-size: 14px;
        }

        .excluded-rooms-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
        }

        .excluded-room-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
        }

        .excluded-badge {
          padding: 4px 10px;
          background: #F5F3EF;
          border-radius: 12px;
          font-size: 12px;
          color: #9B958C;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .report-header {
            flex-direction: column;
          }

          .report-meta {
            flex-direction: column;
            gap: 8px;
          }

          .condition-summary-grid {
            grid-template-columns: 1fr;
          }

          .room-breakdown-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .view-details-btn {
            width: 100%;
            justify-content: center;
          }

          .excluded-rooms-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}