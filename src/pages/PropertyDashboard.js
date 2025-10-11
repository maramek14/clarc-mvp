import { useParams, useNavigate } from "react-router-dom";
import { FileText, Home, Info, ChevronRight } from "lucide-react";
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
      id: "rooms",
      label: "Rooms",
      description: "Manage rooms and room inventories",
      icon: Home,
      path: `/properties/${id}/rooms`,
      preview: `${totalRooms} room${totalRooms !== 1 ? 's' : ''}`
    },
    {
      id: "inventory",
      label: "Property Inventory",
      description: "Overview and property-level reports",
      icon: FileText,
      path: `/properties/${id}/inventory`,
      preview: lastInventory 
        ? `Last updated ${getDaysAgo(lastInventory.inspectionDate)}`
        : "No inventory data"
    }
  ];

  return (
    <div className="page-content">
      {/* Tenancy Info Banner */}
      <div className="info-banner">
        <div className="banner-content">
          <p className="banner-label">Current Tenancy</p>
          <p className="banner-value">
            <strong>{property.tenant}</strong> • Until {property.tenancyEnd}
          </p>
        </div>
      </div>

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
        .info-banner {
          background: linear-gradient(135deg, #0b63f6 0%, #0952d4 100%);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          color: white;
        }

        .banner-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .banner-label {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .banner-value {
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
        }

        .banner-value strong {
          font-weight: 600;
        }

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