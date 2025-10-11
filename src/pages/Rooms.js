import { useParams } from "react-router-dom";
import { getPropertyById } from "../utils";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const { id } = useParams();
  const property = getPropertyById(id);

  if (!property) return <p>Property not found.</p>;

  return (
    <div>
      <h1>Rooms — {property.name}</h1>
      {property.rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
      <button className="button-primary">+ Add Room</button>
    </div>
  );
}
