import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { usePhoneGallery, useAppGallery } from "../hooks";
import { properties } from "../data";

export default function AddToGallery() {
  const navigate = useNavigate();
  const { photos: phonePhotos } = usePhoneGallery();
  const { addPhotos } = useAppGallery();
  
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  // Get rooms for selected property
  const getAvailableRooms = () => {
    if (!selectedProperty) return [];
    const property = properties.find(p => p.id === selectedProperty);
    return property?.rooms || [];
  };

  // Toggle photo selection
  const togglePhoto = (photo) => {
    setSelectedPhotos(prev =>
      prev.find(p => p.id === photo.id)
        ? prev.filter(p => p.id !== photo.id)
        : [...prev, photo]
    );
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Check if photo is selected
  const isPhotoSelected = (photo) => {
    return selectedPhotos.find(p => p.id === photo.id);
  };

  // Handle form submission
  const handleAddToGallery = () => {
    if (!selectedProperty) {
      alert("Please select a property");
      return;
    }
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }
    if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }

    // Create new photos with metadata
    const newPhotos = selectedPhotos.map(photo => ({
      ...photo,
      id: crypto.randomUUID(),
      propertyId: selectedProperty,
      roomId: selectedRoom,
      tags: selectedTags,
      addedAt: new Date().toISOString()
    }));

    addPhotos(newPhotos);
    alert(`${newPhotos.length} photo(s) added to gallery!`);
    navigate("/gallery");
  };

  return (
    <div className="page-content">
      <div className="add-gallery-form">
        {/* Property Selection */}
        <div className="form-group">
          <label>Select Property *</label>
          <select
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              setSelectedRoom("");
            }}
          >
            <option value="">-- Choose Property --</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Room Selection */}
        {selectedProperty && (
          <div className="form-group">
            <label>Select Room *</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">-- Choose Room --</option>
              {getAvailableRooms().map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Tag Selection */}
        <div className="form-group">
          <label>Select Tags * (select all that apply)</label>
          <div className="tag-selector">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {selectedTags.includes(tag) && <Check size={16} />}
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Selection */}
        <div className="form-group">
          <label>Select Photos * ({selectedPhotos.length} selected)</label>
          <div className="photo-grid">
            {phonePhotos.map((photo) => (
              <div
                key={photo.id}
                className={`selectable-photo ${isPhotoSelected(photo) ? 'selected' : ''}`}
                onClick={() => togglePhoto(photo)}
              >
                <img src={photo.url} alt="" />
                {isPhotoSelected(photo) && (
                  <div className="selection-indicator">
                    <Check size={24} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/gallery")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={handleAddToGallery}
            disabled={!selectedProperty || !selectedRoom || selectedPhotos.length === 0 || selectedTags.length === 0}
          >
            Add to Gallery ({selectedPhotos.length})
          </button>
        </div>
      </div>
    </div>
  );
}