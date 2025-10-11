import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileText, Calendar, User, Package } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListsByRoom } from "../inventoryData";

export default function RoomInventoryLists() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const [inventoryLists] = useState(getInventoryListsByRoom(id, roomId));

  if (!property || !room) {
    return (
      <div className="page-content">
        <p>Room not found.</p>
      </div>
    );
  }

  const getEventTypeBadgeColor = (eventType) => {
    const colors = {
      'check-in': '#10b981',
      'check-out': '#ef4444',
      'mid-tenancy': '#f59e0b',
      'damage-assessment': '#dc2626',
      'maintenance': '#3b82f6'
    };
    return colors[eventType] || '#6b7280';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? '#10b981' : '#6b7280';
  };

  return (
    <div className="page-content">
      <div className="page-header-section">
        <div>
          <h2>Inventory Lists</h2>
          <p className="subtitle">
            {inventoryLists.length} {inventoryLists.length === 1 ? 'list' : 'lists'} for this room
          </p>
        </div>
        <button
          className="button-primary"
          onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`)}
        >
          <Plus size={20} />
          Create New List
        </button>
      </div>

      {inventoryLists.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} strokeWidth={1.5} />
          <h3>No Inventory Lists Yet</h3>
          <p>Create your first inventory list to start tracking items in this room.</p>
          <button
            className="button-primary"
            onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`)}
          >
            <Plus size={20} />
            Create First List
          </button>
        </div>
      ) : (
        <div className="inventory-lists-grid">
          {inventoryLists.map((list) => (
            <div
              key={list.id}
              className="inventory-list-card"
              onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/${list.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="card-header">
                <div className="card-title-section">
                  <h3>{list.name}</h3>
                  <div className="badges">
                    <span
                      className="badge"
                      style={{ backgroundColor: getEventTypeBadgeColor(list.eventType) }}
                    >
                      {list.eventType}
                    </span>
                    <span
                      className="badge"
                      style={{ backgroundColor: getStatusBadgeColor(list.status) }}
                    >
                      {list.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <User size={16} />
                  <span>{list.tenantName}</span>
                </div>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>{list.tenancyPeriod}</span>
                </div>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>Inspection: {list.inspectionDate}</span>
                </div>
                <div className="info-row">
                  <Package size={16} />
                  <span>{list.items.length} items</span>
                </div>
              </div>

              {list.notes && (
                <div className="card-notes">
                  <p>{list.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 16px;
        }

        .page-header-section h2 {
          margin: 0 0 4px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .button-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .empty-state h3 {
          margin: 16px 0 8px;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .empty-state p {
          margin: 0 0 24px;
          font-size: 15px;
        }

        .inventory-lists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .inventory-list-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .inventory-list-card:hover {
          border-color: #0b63f6;
          box-shadow: 0 4px 12px rgba(11, 99, 246, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          margin-bottom: 16px;
        }

        .card-title-section h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .card-notes {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .card-notes p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .inventory-lists-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}