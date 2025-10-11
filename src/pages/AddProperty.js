import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, X } from "lucide-react";
import { usePhoneGallery } from "../hooks";

export default function AddProperty() {
  const navigate = useNavigate();
  const { photos: phonePhotos } = usePhoneGallery();
  const [formData, setFormData] = useState({
    name: "",
    tenant: "",
    tenancyEnd: "",
    image: "",
  });
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPhoto = (photoUrl) => {
    setFormData(prev => ({ ...prev, image: photoUrl }));
    setShowPhotoGallery(false);
  };

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      setRooms(prev => [...prev, { id: `room-${Date.now()}`, name: newRoomName.trim() }]);
      setNewRoomName("");
    }
  };

  const handleRemoveRoom = (roomId) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a property name");
      return;
    }
    if (!formData.tenant.trim()) {
      alert("Please enter a tenant name");
      return;
    }
    if (!formData.tenancyEnd) {
      alert("Please select a tenancy end date");
      return;
    }
    if (rooms.length === 0) {
      alert("Please add at least one room");
      return;
    }

    // Create new property object
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...formData,
      image: formData.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
      rooms: rooms
    };

    // In a real app, this would save to backend/database
    console.log("New Property:", newProperty);
    
    // For now, just navigate back to properties page
    alert("Property added successfully!");
    navigate("/properties");
  };

  return (
    <div className="page-content">
      <form onSubmit={handleSubmit} className="property-form">
        
        {/* Property Name */}
        <div className="form-group">
          <label htmlFor="name">Property Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. 123 Main Street"
            required
          />
        </div>

        {/* Tenant Name */}
        <div className="form-group">
          <label htmlFor="tenant">Tenant Name *</label>
          <input
            id="tenant"
            name="tenant"
            type="text"
            value={formData.tenant}
            onChange={handleInputChange}
            placeholder="e.g. John Smith"
            required
          />
        </div>

        {/* Tenancy End Date */}
        <div className="form-group">
          <label htmlFor="tenancyEnd">Tenancy End Date *</label>
          <input
            id="tenancyEnd"
            name="tenancyEnd"
            type="date"
            value={formData.tenancyEnd}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Cover Photo */}
        <div className="form-group">
          <label>Cover Photo</label>
          <div className="image-upload-area">
            {formData.image ? (
              <div className="image-preview">
                <img src={formData.image} alt="Property preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="upload-label"
                onClick={() => setShowPhotoGallery(true)}
              >
                <Upload size={32} />
                <span>Select from Gallery</span>
                <small>Click to choose a photo</small>
              </button>
            )}
          </div>
        </div>

        {/* Photo Gallery Modal */}
        {showPhotoGallery && (
          <div className="photo-gallery-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Select a Photo</h3>
                <button
                  type="button"
                  className="close-modal-btn"
                  onClick={() => setShowPhotoGallery(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="photo-grid">
                {phonePhotos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.category}
                    onClick={() => handleSelectPhoto(photo.url)}
                    className="gallery-photo"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rooms Section */}
        <div className="form-group">
          <label>Rooms *</label>
          <div className="rooms-input-area">
            <div className="room-input-row">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g. Living Room"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRoom();
                  }
                }}
              />
              <button
                type="button"
                className="add-room-btn"
                onClick={handleAddRoom}
              >
                <Plus size={20} />
              </button>
            </div>

            {rooms.length > 0 && (
              <div className="rooms-list">
                {rooms.map((room) => (
                  <div key={room.id} className="room-tag">
                    <span>{room.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(room.id)}
                      className="remove-room-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {rooms.length === 0 && (
            <small className="form-hint">Add at least one room to continue</small>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/properties")}
          >
            Cancel
          </button>
          <button type="submit" className="button-primary">
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
}