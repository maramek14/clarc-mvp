import { useParams, useNavigate } from "react-router-dom";
import { FileText, Home, Info } from "lucide-react";
import { getPropertyById } from "../utils";

export default function PropertyDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  if (!property) return <div className="page-content"><p>Property not found.</p></div>;

  const dashboardActions = [
    {
      id: "information",
      label: "Information",
      icon: Info,
      path: `/properties/${id}/information`,
      color: "#0b63f6"
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: Home,
      path: `/properties/${id}/rooms`,
      color: "#0b63f6"
    },
    {
      id: "reports",
      label: "Inventory Reports",
      icon: FileText,
      path: `/properties/${id}/reports`,
      color: "#0b63f6"
    }
  ];

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <p className="dashboard-tenancy">
          Current Tenancy: <strong>{property.tenant}</strong> until <strong>{property.tenancyEnd}</strong>
        </p>
      </div>

      <div className="dashboard-actions">
        {dashboardActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="dashboard-action-btn"
              onClick={() => navigate(action.path)}
              style={{ backgroundColor: action.color }}
            >
              <Icon size={28} strokeWidth={2} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}