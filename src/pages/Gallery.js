import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, X } from "lucide-react";
import { useAppGallery } from "../hooks";
import { properties } from "../data";

export default function Gallery() {
  const navigate = useNavigate();
  const { photos } = useAppGallery();
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Get unique rooms for the selected property
  const getAvailableRooms = () => {
    if (filterProperty === "all") return [];
    const property = properties.find(p => p.id === filterProperty);
    return property?.rooms || [];
  };

  // Filter photos based on selected filters
  const filteredPhotos = photos.filter(photo => {
    const matchProperty = filterProperty === "all" || photo.propertyId === filterProperty;
    const matchRoom = filterRoom === "all" || photo.roomId === filterRoom;
    const matchTag = filterTag === "all" || photo.tags?.includes(filterTag);
    return matchProperty && matchRoom && matchTag;
  });

  // Get property name helper
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || "Unknown Property";
  };

  // Get room name helper
  const getRoomName = (propertyId, roomId) => {
    const property = properties.find(p => p.id === propertyId);
    const room = property?.rooms.find(r => r.id === roomId);
    return room?.name || "Unknown Room";
  };

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  return (
    <div className="page-content">
      {/* Header with Add and Filter buttons */}
      <div className="gallery-header">
        <button
          className="button-primary"
          onClick={() => navigate("/gallery/add")}
        >
          <Plus size={20} />
          <span>Add Photos</span>
        </button>
        
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="filter-section">
          <div className="filter-group">
            <label>Property</label>
            <select 
              value={filterProperty} 
              onChange={(e) => {
                setFilterProperty(e.target.value);
                setFilterRoom("all");
              }}
            >
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {filterProperty !== "all" && (
            <div className="filter-group">
              <label>Room</label>
              <select value={filterRoom} onChange={(e) => setFilterRoom(e.target.value)}>
                <option value="all">All Rooms</option>
                {getAvailableRooms().map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group">
            <label>Tag</label>
            <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
              <option value="all">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {(filterProperty !== "all" || filterRoom !== "all" || filterTag !== "all") && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setFilterProperty("all");
                setFilterRoom("all");
                setFilterTag("all");
              }}
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Photo Count */}
      <div className="photo-count">
        {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
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
          <p>No photos found</p>
          <button
            className="button-primary"
            onClick={() => navigate("/gallery/add")}
          >
            Add Your First Photo
          </button>
        </div>
      )}

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
                <span>{getPropertyName(selectedPhoto.propertyId)}</span>
              </div>
              <div className="detail-row">
                <strong>Room:</strong>
                <span>{getRoomName(selectedPhoto.propertyId, selectedPhoto.roomId)}</span>
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