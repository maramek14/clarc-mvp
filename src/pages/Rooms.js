import { Link, useParams } from "react-router-dom";
import { getPropertyById } from "../utils";

export default function Rooms() {
  const { id } = useParams();
  const property = getPropertyById(id);
  if (!property) return <div>Property not found.</div>;

  return (
    <div className="page-content">
      <ul className="clean">
        {property.rooms.map((room) => (
          <li key={room.id}>
            <Link className="button" to={`/properties/${id}/rooms/${room.id}`}>
              {room.name}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="button-primary"
        onClick={() => alert("Add Room feature coming soon")}
      >
        + Add Room
      </button>
    </div>
  );
}
