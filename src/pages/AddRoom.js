import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePhoneGallery } from "../hooks";
import { getPropertyById } from "../utils";

// Common room types with emojis for quick selection
const roomTemplates = [
  { name: "Living Room", emoji: "🛋️" },
  { name: "Kitchen", emoji: "🍳" },
  { name: "Bedroom", emoji: "🛏️" },
  { name: "Bathroom", emoji: "🚿" },
  { name: "Dining Room", emoji: "🍽️" },
  { name: "Office", emoji: "💼" },
  { name: "Garden", emoji: "🌿" },
  { name: "Entrance Hall", emoji: "🚪" },
  { name: "Garage", emoji: "🚗" },
  { name: "Laundry Room", emoji: "🧺" },
  { name: "Storage", emoji: "📦" },
  { name: "Balcony", emoji: "🏙️" },
];

export default function AddRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const { photos: phonePhotos } = usePhoneGallery();

  const [formData, setFormData] = useState({
    name: "",
    floorLevel: "",
    squareFootage: "",
    description: "",
    features: [],
  });

  const [customFeature, setCustomFeature] = useState("");
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Photo management state
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoTags, setPhotoTags] = useState({}); // { photoId: [tags] }
  const [photoStep, setPhotoStep] = useState(1); // 1: select, 2: tag
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  // Common room features
  const availableFeatures = [
    "Window", "Natural Light", "Built-in Storage", "Carpet", 
    "Hardwood Floor", "Tile Floor", "Ceiling Fan", "Fireplace",
    "Air Conditioning", "Heating", "Closet", "En-suite"
  ];

  if (!property) {
    return (
      <div className="page-content">
        <p>Property not found.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.name);
    setFormData(prev => ({ ...prev, name: template.name }));
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, customFeature.trim()]
      }));
      setCustomFeature("");
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  // Photo selection functions
  const togglePhotoSelection = (photo) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.find(p => p.id === photo.id);
      if (isSelected) {
        // Remove photo and its tags
        const newTags = { ...photoTags };
        delete newTags[photo.id];
        setPhotoTags(newTags);
        return prev.filter(p => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  const isPhotoSelected = (photo) => {
    return selectedPhotos.find(p => p.id === photo.id);
  };

  const handleOpenPhotoGallery = () => {
    setShowPhotoGallery(true);
    setPhotoStep(1);
  };

  const handleContinueToTagging = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }
    setPhotoStep(2);
    setCurrentPhotoIndex(0);
  };

  // Photo tagging functions
  const togglePhotoTag = (tag) => {
    const currentPhoto = selectedPhotos[currentPhotoIndex];
    if (!currentPhoto) return;

    setPhotoTags(prev => {
      const currentTags = prev[currentPhoto.id] || [];
      const hasTag = currentTags.includes(tag);
      
      return {
        ...prev,
        [currentPhoto.id]: hasTag
          ? currentTags.filter(t => t !== tag)
          : [...currentTags, tag]
      };
    });
  };

  const getCurrentPhotoTags = () => {
    const currentPhoto = selectedPhotos[currentPhotoIndex];
    return currentPhoto ? (photoTags[currentPhoto.id] || []) : [];
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < selectedPhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      // All photos tagged, close gallery
      handleFinishPhotoSelection();
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleFinishPhotoSelection = () => {
    // Check if all photos have at least one tag
    const untaggedPhotos = selectedPhotos.filter(
      photo => !photoTags[photo.id] || photoTags[photo.id].length === 0
    );

    if (untaggedPhotos.length > 0) {
      alert("Please add at least one tag to each photo");
      return;
    }

    setShowPhotoGallery(false);
    setPhotoStep(1);
  };

  const handleRemovePhoto = (photoId) => {
    setSelectedPhotos(prev => prev.filter(p => p.id !== photoId));
    const newTags = { ...photoTags };
    delete newTags[photoId];
    setPhotoTags(newTags);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a room name");
      return;
    }

    // Create new room object
    const newRoom = {
      id: `room-${Date.now()}`,
      name: formData.name.trim(),
      floorLevel: formData.floorLevel,
      squareFootage: formData.squareFootage,
      description: formData.description,
      features: formData.features,
      photos: selectedPhotos.map(photo => ({
        ...photo,
        tags: photoTags[photo.id] || []
      })),
      createdAt: new Date().toISOString()
    };

    // In a real app, this would save to backend/database
    console.log("New Room:", newRoom);

    // Show success message and navigate back
    alert("Room added successfully! (Data will persist until page refresh)");
    navigate(`/properties/${id}/rooms`);
  };

  return (
    <div className="page-content">
      <form onSubmit={handleSubmit} className="room-form">
        
        {/* Room Name - Quick Templates */}
        <div className="form-group">
          <label>Room Type *</label>
          <p className="form-hint">Select a template or enter custom name below</p>
          <div className="room-templates">
            {roomTemplates.map((template) => (
              <button
                key={template.name}
                type="button"
                className={`template-btn ${selectedTemplate === template.name ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <span className="template-emoji">{template.emoji}</span>
                <span className="template-name">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Room Name */}
        <div className="form-group">
          <label htmlFor="name">Room Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Master Bedroom, Guest Bathroom"
            required
          />
        </div>

        {/* Floor Level */}
        <div className="form-group">
          <label htmlFor="floorLevel">Floor Level</label>
          <select
            id="floorLevel"
            name="floorLevel"
            value={formData.floorLevel}
            onChange={handleInputChange}
          >
            <option value="">Select floor level</option>
            <option value="basement">Basement</option>
            <option value="ground">Ground Floor</option>
            <option value="first">First Floor</option>
            <option value="second">Second Floor</option>
            <option value="third">Third Floor</option>
            <option value="attic">Attic</option>
          </select>
        </div>

        {/* Square Footage */}
        <div className="form-group">
          <label htmlFor="squareFootage">Square Footage (sq ft)</label>
          <input
            id="squareFootage"
            name="squareFootage"
            type="number"
            value={formData.squareFootage}
            onChange={handleInputChange}
            placeholder="e.g. 150"
            min="0"
          />
        </div>

        {/* Room Features */}
        <div className="form-group">
          <label>Room Features</label>
          <p className="form-hint">Select all that apply</p>
          <div className="features-grid">
            {availableFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                className={`feature-btn ${formData.features.includes(feature) ? 'selected' : ''}`}
                onClick={() => toggleFeature(feature)}
              >
                {formData.features.includes(feature) && <Check size={16} />}
                <span>{feature}</span>
              </button>
            ))}
          </div>

          {/* Add Custom Feature */}
          <div className="custom-feature-input">
            <input
              type="text"
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              placeholder="Add custom feature..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomFeature();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomFeature}
              className="add-feature-btn"
            >
              Add
            </button>
          </div>

          {/* Selected Features */}
          {formData.features.length > 0 && (
            <div className="selected-features">
              {formData.features.map((feature) => (
                <div key={feature} className="feature-tag">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="remove-feature-btn"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room Photos */}
        <div className="form-group">
          <label>Room Photos</label>
          <p className="form-hint">Add photos and tag them for organization</p>
          
          {selectedPhotos.length > 0 && (
            <div className="selected-photos-grid">
              {selectedPhotos.map((photo) => (
                <div key={photo.id} className="selected-photo-item">
                  <img src={photo.url} alt="" />
                  <div className="photo-tags-display">
                    {(photoTags[photo.id] || []).map(tag => (
                      <span key={tag} className="mini-tag">{tag}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="remove-photo-btn"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="select-photo-btn"
            onClick={handleOpenPhotoGallery}
          >
            <Upload size={20} />
            <span>{selectedPhotos.length > 0 ? 'Add More Photos' : 'Select Photos from Gallery'}</span>
          </button>

          {/* Photo Gallery Modal */}
          {showPhotoGallery && (
            <div className="photo-gallery-modal">
              {photoStep === 1 ? (
                // Step 1: Select Photos
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Select Photos ({selectedPhotos.length} selected)</h3>
                    <button
                      type="button"
                      onClick={() => setShowPhotoGallery(false)}
                      className="close-btn"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="photo-grid-compact">
                    {phonePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`gallery-photo ${isPhotoSelected(photo) ? 'selected' : ''}`}
                        onClick={() => togglePhotoSelection(photo)}
                      >
                        <img src={photo.url} alt="" />
                        {isPhotoSelected(photo) && (
                          <div className="selection-indicator">
                            <Check size={20} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setShowPhotoGallery(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={handleContinueToTagging}
                      disabled={selectedPhotos.length === 0}
                    >
                      Continue to Tag Photos ({selectedPhotos.length})
                    </button>
                  </div>
                </div>
              ) : (
                // Step 2: Tag Photos
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Tag Photo {currentPhotoIndex + 1} of {selectedPhotos.length}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoGallery(false);
                        setPhotoStep(1);
                      }}
                      className="close-btn"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="tagging-view">
                    <div className="current-photo-display">
                      <img src={selectedPhotos[currentPhotoIndex]?.url} alt="" />
                    </div>

                    <div className="tags-section">
                      <p className="tags-prompt">Select tags for this photo:</p>
                      <div className="tags-grid">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className={`tag-btn ${getCurrentPhotoTags().includes(tag) ? 'selected' : ''}`}
                            onClick={() => togglePhotoTag(tag)}
                          >
                            {getCurrentPhotoTags().includes(tag) && <Check size={16} />}
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={handlePrevPhoto}
                      disabled={currentPhotoIndex === 0}
                    >
                      <ChevronLeft size={20} />
                      Previous
                    </button>
                    <button
                      type="button"
                      className="button-primary"
                      onClick={handleNextPhoto}
                    >
                      {currentPhotoIndex === selectedPhotos.length - 1 ? 'Finish' : 'Next'}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description / Notes</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any additional notes about this room..."
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate(`/properties/${id}/rooms`)}
          >
            Cancel
          </button>
          <button type="submit" className="button-primary">
            Add Room
          </button>
        </div>
      </form>

<style jsx>{`
        .room-form {
          max-width: 100%;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
          margin-bottom: 8px;
        }

        .form-hint {
          font-size: 13px;
          color: #9B958C;
          margin-top: 4px;
          margin-bottom: 12px;
        }

        .room-templates {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }

        .template-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          border: 2px solid #E6E3DD;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-btn:hover {
          border-color: #2C5F8D;
          background: #F8FBFD;
        }

        .template-btn.selected {
          border-color: #2C5F8D;
          background: #E8F1F8;
        }

        .template-emoji {
          font-size: 32px;
        }

        .template-name {
          font-size: 13px;
          font-weight: 500;
          color: #2A2A2A;
          text-align: center;
        }

        input[type="text"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        textarea {
          resize: vertical;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        .feature-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .feature-btn:hover {
          border-color: #2C5F8D;
          background: #F8FBFD;
        }

        .feature-btn.selected {
          border-color: #2C5F8D;
          background: #E8F1F8;
          color: #2C5F8D;
          font-weight: 500;
        }

        .custom-feature-input {
          display: flex;
          gap: 8px;
        }

        .custom-feature-input input {
          flex: 1;
        }

        .add-feature-btn {
          padding: 10px 20px;
          background: #F5F3EF;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-feature-btn:hover {
          background: #EBE8E1;
        }

        .selected-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #E8F1F8;
          border-radius: 20px;
          font-size: 13px;
          color: #2C5F8D;
          font-weight: 500;
        }

        .remove-feature-btn {
          display: flex;
          align-items: center;
          padding: 2px;
          border: none;
          background: transparent;
          color: #2C5F8D;
          cursor: pointer;
        }

        .selected-photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .selected-photo-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #E6E3DD;
        }

        .selected-photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-tags-display {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 4px;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .mini-tag {
          font-size: 10px;
          padding: 2px 6px;
          background: #2C5F8D;
          color: white;
          border-radius: 4px;
        }

        .selected-photo-item .remove-photo-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }

        .selected-photo-item .remove-photo-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .select-photo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px 20px;
          border: 2px dashed #E6E3DD;
          border-radius: 12px;
          background: #F9F8F6;
          color: #9B958C;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .select-photo-btn:hover {
          border-color: #2C5F8D;
          background: #F8FBFD;
          color: #2C5F8D;
        }

        .photo-gallery-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #E6E3DD;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: #F5F3EF;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #EBE8E1;
        }

        .photo-grid-compact {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .gallery-photo {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
          border: 3px solid transparent;
        }

        .gallery-photo:hover {
          transform: scale(1.05);
        }

        .gallery-photo.selected {
          border-color: #2C5F8D;
        }

        .gallery-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .selection-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: #2C5F8D;
          border-radius: 50%;
          color: white;
        }

        .tagging-view {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .current-photo-display {
          width: 100%;
          max-width: 400px;
          margin: 0 auto 24px;
          border-radius: 12px;
          overflow: hidden;
        }

        .current-photo-display img {
          width: 100%;
          height: auto;
          display: block;
        }

        .tags-section {
          max-width: 500px;
          margin: 0 auto;
        }

        .tags-prompt {
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
          margin-bottom: 12px;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }

        .tag-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .tag-btn:hover {
          border-color: #2C5F8D;
          background: #F8FBFD;
        }

        .tag-btn.selected {
          border-color: #2C5F8D;
          background: #E8F1F8;
          color: #2C5F8D;
          font-weight: 500;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #E6E3DD;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #E6E3DD;
        }

        .button-primary,
        .button-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .button-primary {
          background: #2C5F8D;
          color: white;
        }

        .button-primary:hover:not(:disabled) {
          background: #1E4466;
        }

        .button-primary:disabled {
          background: #E6E3DD;
          cursor: not-allowed;
        }

        .button-secondary {
          background: #F5F3EF;
          color: #2A2A2A;
        }

        .button-secondary:hover:not(:disabled) {
          background: #EBE8E1;
        }

        .button-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .room-templates {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .photo-grid-compact {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }

          .modal-content {
            max-height: 95vh;
          }

          .tags-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}