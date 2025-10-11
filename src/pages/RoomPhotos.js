import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { useAppGallery } from "../hooks";

export default function RoomPhotos() {
  const { id: propertyId, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(propertyId);
  const room = getRoomById(property, roomId);
  const { photos } = useAppGallery();
  
  const [filterTag, setFilterTag] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!property || !room) return <div>Room not found.</div>;

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  // Get room photos (property and room are pre-filtered)
  const roomPhotos = photos.filter(
    (p) => p.propertyId === propertyId && p.roomId === roomId
  );

  // Apply tag filter
  const filteredPhotos = filterTag === "all" 
    ? roomPhotos 
    : roomPhotos.filter(p => p.tags?.includes(filterTag));

  return (
    <div className="page-content">
      {/* Filter Section */}
      <div className="room-photos-header">
        <div className="filter-buttons-row">
          <button
            className={`filter-chip ${filterTag === "all" ? 'active' : ''}`}
            onClick={() => setFilterTag("all")}
          >
            All Tags
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              className={`filter-chip ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Count */}
      <div className="photo-count">
        {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
        {filterTag !== "all" && ` with tag: ${filterTag}`}
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="photo-grid">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-photo-card"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.url} alt="" />
              <div className="photo-card-overlay">
                <span className="photo-tag">{photo.tags?.[0] || "untagged"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No photos {filterTag !== "all" ? `with tag: ${filterTag}` : 'yet for this room'}</p>
        </div>
      )}

      {/* Add Photos Button */}
      <button
        className="button-primary"
        onClick={() => navigate(`/properties/${propertyId}/rooms/${roomId}/add-photos`)}
        style={{ marginTop: '1rem' }}
      >
        <Plus size={20} />
        <span>Add Photos</span>
      </button>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="photo-detail-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-detail-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            
            <img src={selectedPhoto.url} alt="" className="detail-photo" />
            
            <div className="photo-details">
              <div className="detail-row">
                <strong>Property:</strong>
                <span>{property.name}</span>
              </div>
              <div className="detail-row">
                <strong>Room:</strong>
                <span>{room.name}</span>
              </div>
              <div className="detail-row">
                <strong>Tags:</strong>
                <div className="tag-list">
                  {selectedPhoto.tags?.map((tag, i) => (
                    <span key={i} className="tag-badge">{tag}</span>
                  )) || <span className="tag-badge">untagged</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}