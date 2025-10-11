import { useParams, useNavigate } from "react-router-dom";
import { FileText, Camera, ChevronRight } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListsByRoom } from "../inventoryData";
import { useAppGallery } from "../hooks";

export default function RoomDashboard() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const { photos } = useAppGallery();

  if (!property || !room) {
    return (
      <div className="page-content">
        <p>Room not found.</p>
      </div>
    );
  }

  // Get data for previews
  const inventoryLists = getInventoryListsByRoom(id, roomId);
  const roomPhotos = photos.filter(
    p => p.propertyId === id && p.roomId === roomId
  );

  // Calculate last inventory
  const lastInventory = inventoryLists.length > 0
    ? inventoryLists.reduce((latest, current) => {
        const currentDate = new Date(current.inspectionDate);
        const latestDate = new Date(latest?.inspectionDate || 0);
        return currentDate > latestDate ? current : latest;
      })
    : null;

  const getDaysAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const dashboardActions = [
    {
      id: "inventory",
      label: "Room Inventory Lists",
      description: "View and manage inventory lists for this room",
      icon: FileText,
      path: `/properties/${id}/rooms/${roomId}/inventory`,
      preview: lastInventory
        ? `${inventoryLists.length} list${inventoryLists.length !== 1 ? 's' : ''} • Last updated ${getDaysAgo(lastInventory.inspectionDate)}`
        : inventoryLists.length > 0
        ? `${inventoryLists.length} list${inventoryLists.length !== 1 ? 's' : ''}`
        : "No inventory lists yet"
    },
    {
      id: "photos",
      label: "Room Photos",
      description: "Browse and manage photos for this room",
      icon: Camera,
      path: `/properties/${id}/rooms/${roomId}/photos`,
      preview: roomPhotos.length > 0
        ? `${roomPhotos.length} photo${roomPhotos.length !== 1 ? 's' : ''}`
        : "No photos yet"
    }
  ];

  return (
    <div className="page-content">
      {/* Action List */}
      <div className="action-list">
        {dashboardActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="action-item"
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon">
                <Icon size={24} />
              </div>
              <div className="action-content">
                <h3 className="action-title">{action.label}</h3>
                <p className="action-description">{action.description}</p>
                <p className="action-preview">{action.preview}</p>
              </div>
              <ChevronRight size={20} className="action-arrow" />
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .action-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }

        .action-item:hover {
          border-color: #0b63f6;
          box-shadow: 0 4px 12px rgba(11, 99, 246, 0.1);
          transform: translateY(-2px);
        }

        .action-item:active {
          transform: translateY(0);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0b63f6;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
          min-width: 0;
        }

        .action-title {
          margin: 0 0 4px 0;
          font-size: 17px;
          font-weight: 600;
          color: #111827;
        }

        .action-description {
          margin: 0 0 6px 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }

        .action-preview {
          margin: 0;
          font-size: 13px;
          color: #0b63f6;
          font-weight: 500;
        }

        .action-arrow {
          color: #d1d5db;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .action-item:hover .action-arrow {
          color: #0b63f6;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .action-icon {
            width: 48px;
            height: 48px;
          }

          .action-title {
            font-size: 16px;
          }

          .action-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}