import { useParams, useNavigate } from "react-router-dom";
import { FileText, Info, ChevronRight } from "lucide-react";
import { getPropertyById } from "../utils";
import { getInventoryListsByProperty } from "../inventoryData";
import { getPropertyReportsByProperty } from "../propertyReportsData";

export default function PropertyDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  
  if (!property) return <div className="page-content"><p>Property not found.</p></div>;

  // Get data for previews
  const inventoryLists = getInventoryListsByProperty(id);
  const propertyReports = getPropertyReportsByProperty(id);
  const totalRooms = property.rooms.length;

  // Calculate last inventory date
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
      id: "information",
      label: "Property Information",
      description: "View and edit property details",
      icon: Info,
      path: `/properties/${id}/information`,
      preview: property.address || "Add property details"
    },
    {
      id: "inventory",
      label: "Property Inventory",
      description: "Manage rooms, inventory lists, and property reports",
      icon: FileText,
      path: `/properties/${id}/inventory`,
      preview: lastInventory 
        ? `${totalRooms} room${totalRooms !== 1 ? 's' : ''} • Last inventory ${getDaysAgo(lastInventory.inspectionDate)}`
        : `${totalRooms} room${totalRooms !== 1 ? 's' : ''} • No inventory yet`
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
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .action-item:active {
          border-color: #2C5F8D;
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
          transform: translateY(-2px);
        }

        .action-item:active {
          transform: translateY(0);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #F8FBFD 0%, #E8F1F8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2C5F8D;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
          min-width: 0;
        }

        .action-title {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .action-description {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #9B958C;
          line-height: 1.5;
        }

        .action-preview {
          margin: 0;
          font-size: 13px;
          color: #2C5F8D;
          font-weight: 500;
        }

        .action-arrow {
          color: #9B958C;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .action-item {
            padding: 16px;
          }

          .action-icon {
            width: 48px;
            height: 48px;
          }

          .action-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}