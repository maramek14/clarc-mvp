import { useNavigate, useParams } from "react-router-dom";
import { usePhoneGallery, useAppGallery } from "../hooks";
import { useState } from "react";

export default function AddPhotos() {
  const { id, roomId } = useParams();
  const { photos: phonePhotos } = usePhoneGallery();
  const { addPhotos } = useAppGallery();
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggle = (photo) => {
    setSelected((prev) =>
      prev.includes(photo) ? prev.filter((p) => p !== photo) : [...prev, photo]
    );
  };

  const handleConfirm = () => {
    const newPhotos = selected.map((p) => ({
      ...p,
      id: crypto.randomUUID(),
      propertyId: id,
      roomId,
    }));
    addPhotos(newPhotos);
    navigate(`/properties/${id}/rooms/${roomId}/photos`);
  };

  return (
    <div>
      <h1>Add Photos from Phone Gallery</h1>

      <div className="photo-grid">
        {phonePhotos.map((p) => (
          <img
            key={p.id}
            src={p.url}
            alt=""
            onClick={() => toggle(p)}
            style={{
              border: selected.includes(p)
                ? "3px solid #007bff"
                : "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <button
        className="button-primary"
        disabled={!selected.length}
        onClick={handleConfirm}
      >
        Add {selected.length} Photos
      </button>
    </div>
  );
}
