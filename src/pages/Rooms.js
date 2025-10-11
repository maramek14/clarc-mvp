import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getPropertyById } from "../utils";

// Room type to emoji mapping
const roomEmojis = {
  "Living Room": "🛋️",
  "Kitchen": "🍳",
  "Bedroom": "🛏️",
  "Bathroom": "🚿",
  "Entrance Hall": "🚪",
  "Dining Room": "🍽️",
  "Garden": "🌿",
  "Office": "💼",
  "default": "🚪"
};

function getRoomEmoji(roomName) {
  // Check for exact matches first
  if (roomEmojis[roomName]) return roomEmojis[roomName];
  
  // Check for partial matches
  for (const [key, emoji] of Object.entries(roomEmojis)) {
    if (roomName.toLowerCase().includes(key.toLowerCase())) {
      return emoji;
    }
  }
  
  return roomEmojis.default;
}

export default function Rooms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  
  if (!property) return <div>Property not found.</div>;

  const handleRoomClick = (roomId) => {
    navigate(`/properties/${id}/rooms/${roomId}/dashboard`);
  };

  return (
    <div className="page-content">
      <p className="subtitle">
        Select a room to view inventory and photos.
      </p>

      <div className="room-list">
        {property.rooms.map((room) => (
          <div
            key={room.id}
            className="room-card-clean"
            onClick={() => handleRoomClick(room.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRoomClick(room.id);
              }
            }}
          >
            <div className="room-icon-clean">
              {getRoomEmoji(room.name)}
            </div>
            <div className="room-info-clean">
              <h3>{room.name}</h3>
            </div>
            <div className="room-arrow">
              →
            </div>
          </div>
        ))}

        {/* Add New Room card */}
        <div
          className="room-card-clean add-room-card"
          onClick={() => navigate(`/properties/${id}/add-room`)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(`/properties/${id}/add-room`);
            }
          }}
        >
          <div className="add-room-content">
            <Plus size={24} strokeWidth={2.5} />
            <span>Add New Room</span>
          </div>
        </div>
      </div>
    </div>
  );
}