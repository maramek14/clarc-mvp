import { useParams, Link } from "react-router-dom";
import { getPropertyById, getRoomById } from "../utils";
import { useAppGallery } from "../hooks";

export default function RoomPhotos() {
  const { id: propertyId, roomId } = useParams();
  const property = getPropertyById(propertyId);
  const room = getRoomById(property, roomId);
  const { photos } = useAppGallery();

  if (!property || !room) return <div>Room not found.</div>;

  const roomPhotos = photos.filter(
    (p) => p.propertyId === propertyId && p.roomId === roomId
  );

  return (
    <div className="page-content">
      {roomPhotos.length > 0 ? (
        <div className="photo-grid">
          {roomPhotos.map((p) => (
            <img
              key={p.id}
              src={p.url}
              alt={p.tags?.join(", ")}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                margin: "4px",
              }}
            />
          ))}
        </div>
      ) : (
        <p>No photos yet for this room.</p>
      )}

      <Link
        className="button-primary"
        to={`/properties/${propertyId}/rooms/${roomId}/add-photos`}
      >
        + Add Photos
      </Link>
    </div>
  );
}
