import { useParams, useNavigate } from "react-router-dom";
import { Image, List } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";

export default function RoomDashboard() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);

  if (!property || !room) {
    return <div className="page-content"><p>Room not found.</p></div>;
  }

  const roomActions = [
    {
      id: "photos",
      label: "Photos",
      icon: Image,
      path: `/properties/${id}/rooms/${roomId}/photos`,
      color: "#0b63f6"
    },
    {
      id: "inventory",
      label: "Inventory List",
      icon: List,
      path: `/properties/${id}/rooms/${roomId}/inventory`,
      color: "#0b63f6"
    }
  ];

  return (
    <div className="page-content">
      <div className="dashboard-actions">
        {roomActions.map((action) => {
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