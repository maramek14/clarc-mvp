import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { usePhoneGallery, useAppGallery } from "../hooks";
import { properties } from "../data";

export default function AddToGallery() {
  const navigate = useNavigate();
  const { photos: phonePhotos } = usePhoneGallery();
  const { addPhotos } = useAppGallery();
  
  const [step, setStep] = useState(1); // 1: Select Photos, 2: Tag Photos
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoMetadata, setPhotoMetadata] = useState({}); // Store property, room, tags for each photo

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  // Toggle photo selection (Step 1)
  const togglePhoto = (photo) => {
    setSelectedPhotos(prev =>
      prev.find(p => p.id === photo.id)
        ? prev.filter(p => p.id !== photo.id)
        : [...prev, photo]
    );
  };

  const isPhotoSelected = (photo) => {
    return selectedPhotos.find(p => p.id === photo.id);
  };

  const handleConfirmSelection = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }
    setStep(2);
    setCurrentPhotoIndex(0);
  };

  // Get rooms for selected property
  const getAvailableRooms = (propertyId) => {
    if (!propertyId) return [];
    const property = properties.find(p => p.id === propertyId);
    return property?.rooms || [];
  };

  // Get current photo metadata
  const getCurrentMetadata = () => {
    const photoId = selectedPhotos[currentPhotoIndex]?.id;
    return photoMetadata[photoId] || {
      property: "",
      room: "",
      tags: []
    };
  };

  // Update current photo metadata
  const updateCurrentMetadata = (updates) => {
    const photoId = selectedPhotos[currentPhotoIndex]?.id;
    setPhotoMetadata(prev => ({
      ...prev,
      [photoId]: {
        ...getCurrentMetadata(),
        ...updates
      }
    }));
  };

  // Toggle tag for current photo
  const toggleTag = (tag) => {
    const currentMeta = getCurrentMetadata();
    const newTags = currentMeta.tags.includes(tag)
      ? currentMeta.tags.filter(t => t !== tag)
      : [...currentMeta.tags, tag];
    
    updateCurrentMetadata({ tags: newTags });
  };

  // Navigation between photos
  const handleNextPhoto = () => {
    const currentMeta = getCurrentMetadata();
    
    if (!currentMeta.property || !currentMeta.room || currentMeta.tags.length === 0) {
      alert("Please select property, room, and at least one tag");
      return;
    }

    if (currentPhotoIndex < selectedPhotos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Create new photos with metadata
    const newPhotos = selectedPhotos.map(photo => {
      const meta = photoMetadata[photo.id];
      return {
        ...photo,
        id: crypto.randomUUID(),
        propertyId: meta.property,
        roomId: meta.room,
        tags: meta.tags,
        addedAt: new Date().toISOString()
      };
    });

    addPhotos(newPhotos);
    alert(`${newPhotos.length} photo(s) added to gallery!`);
    navigate("/gallery");
  };

  const currentMeta = getCurrentMetadata();
  const canProceed = currentMeta.property && currentMeta.room && currentMeta.tags.length > 0;

  // Step 1: Select Photos
  if (step === 1) {
    return (
      <div className="page-content">
        <div className="selection-header">
          <h2>Select Photos</h2>
          <p className="subtitle">{selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected</p>
        </div>

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

        {/* Fixed Action Bar */}
        <div className="fixed-action-bar">
          <div className="fixed-action-content">
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
              onClick={handleConfirmSelection}
              disabled={selectedPhotos.length === 0}
            >
              Confirm Selection ({selectedPhotos.length})
            </button>
          </div>
        </div>

        <style jsx>{`
          .selection-header {
            margin-bottom: 24px;
          }

          .selection-header h2 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
          }

          .subtitle {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
          }

          .photo-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 100px;
          }

          .selectable-photo {
            position: relative;
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            border: 3px solid transparent;
          }

          .selectable-photo.selected {
            border-color: #2C5F8D;
          }

          .selectable-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .selection-indicator {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #2C5F8D;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .fixed-action-bar {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 420px;
            max-width: 420px;
            background: white;
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
            z-index: 11;
            padding: 16px 20px;
          }

          .fixed-action-content {
            display: flex;
            gap: 12px;
          }

          .button-primary,
          .button-secondary {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 20px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
          }

          .button-primary {
            background: #2C5F8D;
            color: white;
          }

          .button-primary:active:not(:disabled) {
            background: #1E4466;
          }

          .button-primary:disabled {
            background: #d1d5db;
            cursor: not-allowed;
          }

          .button-secondary {
            background: white;
            border: 2px solid #e5e7eb;
            color: #374151;
          }

          .button-secondary:active {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          @media (max-width: 768px) {
            .fixed-action-bar {
              width: 100%;
              max-width: 100%;
              left: 0;
              transform: none;
            }

            .photo-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    );
  }

  // Step 2: Tag Each Photo
  const currentPhoto = selectedPhotos[currentPhotoIndex];

  return (
    <div className="page-content">
      <div className="tagging-header">
        <h2>Photo {currentPhotoIndex + 1} of {selectedPhotos.length}</h2>
        <button
          className="back-to-selection"
          onClick={() => setStep(1)}
        >
          ← Back to Selection
        </button>
      </div>

      {/* Photo Preview */}
      <div className="photo-preview">
        <img src={currentPhoto.url} alt="" />
        {canProceed && (
          <div className="completion-badge">
            <Check size={32} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Property Selection */}
      <div className="form-section">
        <label>Property *</label>
        <select
          value={currentMeta.property}
          onChange={(e) => updateCurrentMetadata({ property: e.target.value, room: "" })}
        >
          <option value="">-- Select Property --</option>
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Room Selection */}
      {currentMeta.property && (
        <div className="form-section">
          <label>Room *</label>
          <select
            value={currentMeta.room}
            onChange={(e) => updateCurrentMetadata({ room: e.target.value })}
          >
            <option value="">-- Select Room --</option>
            {getAvailableRooms(currentMeta.property).map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tags Selection */}
      <div className="form-section">
        <label>Tags * (select all that apply)</label>
        <div className="tag-buttons">
          {availableTags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-button ${currentMeta.tags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {currentMeta.tags.includes(tag) && <Check size={16} />}
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed-action-bar">
        <div className="fixed-action-content">
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
            disabled={!canProceed}
          >
            {currentPhotoIndex < selectedPhotos.length - 1 ? (
              <>
                Next
                <ChevronRight size={20} />
              </>
            ) : (
              <>
                Finish
                <Check size={20} />
              </>
            )}
          </button>
        </div>
      </div>

<style jsx>{`
        .tagging-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .tagging-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .back-to-selection {
          background: none;
          border: none;
          color: #2C5F8D;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .back-to-selection:active {
          background: #F8FBFD;
        }

        .photo-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          border: 2px solid #E6E3DD;
        }

        .photo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .completion-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #3D7C5C;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(61, 124, 92, 0.3);
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .form-section select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 15px;
          color: #2A2A2A;
          background: white;
          cursor: pointer;
        }

        .form-section select:focus {
          outline: none;
          border-color: #2C5F8D;
          box-shadow: 0 0 0 3px rgba(44, 95, 141, 0.1);
        }

        .tag-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: white;
          border: 2px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
          cursor: pointer;
        }

        .tag-button:active {
          border-color: #2C5F8D;
          background: #F8FBFD;
        }

        .tag-button.selected {
          background: #2C5F8D;
          border-color: #2C5F8D;
          color: white;
        }

        .fixed-action-bar {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 420px;
          max-width: 420px;
          background: white;
          border-top: 1px solid #E6E3DD;
          box-shadow: 0 -4px 12px rgba(44, 95, 141, 0.1);
          z-index: 11;
          padding: 16px 20px;
        }

        .fixed-action-content {
          display: flex;
          gap: 12px;
        }

        .button-primary,
        .button-secondary {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .button-primary {
          background: #2C5F8D;
          color: white;
        }

        .button-primary:active:not(:disabled) {
          background: #1E4466;
        }

        .button-primary:disabled {
          background: #E6E3DD;
          cursor: not-allowed;
        }

        .button-secondary {
          background: white;
          border: 2px solid #E6E3DD;
          color: #2A2A2A;
        }

        .button-secondary:active:not(:disabled) {
          background: #F9F8F6;
          border-color: #E6E3DD;
        }

        .button-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .fixed-action-bar {
            width: 100%;
            max-width: 100%;
            left: 0;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}