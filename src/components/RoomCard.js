import { Link, useParams } from "react-router-dom";

export default function RoomCard({ room }) {
  const { id } = useParams();

  return (
    <div className="room-card">
      <h4>{room.name}</h4>
      <div className="room-actions">
        <Link className="button" to={`/properties/${id}/rooms/${room.id}/inventory`}>
          Inventory
        </Link>
        <Link className="button" to={`/properties/${id}/rooms/${room.id}/photos`}>
          Photos
        </Link>
      </div>
    </div>
  );
}
