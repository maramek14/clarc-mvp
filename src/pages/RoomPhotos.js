import { Link, useParams } from "react-router-dom";
import { getPropertyById, getRoomById } from "../utils";
import { useAppGallery } from "../hooks";
import PhotoGrid from "../components/PhotoGrid";

export default function RoomPhotos() {
  const { id, roomId } = useParams();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const { photos } = useAppGallery();

  if (!property || !room) return <p>Room not found.</p>;

  const roomPhotos = photos.filter(
    (p) => p.propertyId === id && p.roomId === roomId
  );

  return (
    <div>
      <h1>{room.name} — Photos</h1>
      <PhotoGrid photos={roomPhotos} />

      <Link
        className="button-primary"
        to={`/properties/${id}/rooms/${roomId}/add-photos`}
      >
        + Add Photos
      </Link>
    </div>
  );
}
