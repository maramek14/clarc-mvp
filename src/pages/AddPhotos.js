import { useNavigate, useParams } from "react-router-dom";
import { usePhoneGallery, useAppGallery } from "../hooks";
import { useState } from "react";
import { Check, User, Calendar } from "lucide-react";
import { getPhotoAssignmentOptions } from "../tenancyData";
import { getPropertyById } from "../utils";

export default function AddPhotos() {
  const { id, roomId } = useParams();
  const { photos: phonePhotos } = usePhoneGallery();
  const { addPhotos } = useAppGallery();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  const [step, setStep] = useState(1); // 1: select tenancy, 2: select photos, 3: tag photos
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoTags, setPhotoTags] = useState({}); // { photoId: [tags] }
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];
  const tenancyOptions = getPhotoAssignmentOptions(id);

  // Toggle photo selection
  const togglePhoto = (photo) => {
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

  // Toggle tag for current photo
  const toggleTag = (tag) => {
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
      handleConfirm();
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleSelectTenancy = (option) => {
    setSelectedTenancy(option);
    setStep(2);
  };

  const handleContinueToTagging = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }
    setStep(3);
    setCurrentPhotoIndex(0);
  };

  const handleConfirm = () => {
    // Check if all photos have at least one tag
    const untaggedPhotos = selectedPhotos.filter(
      photo => !photoTags[photo.id] || photoTags[photo.id].length === 0
    );

    if (untaggedPhotos.length > 0) {
      alert("Please add at least one tag to each photo");
      return;
    }

    // Create new photos with metadata including tenancy
    const newPhotos = selectedPhotos.map(photo => ({
      ...photo,
      id: crypto.randomUUID(),
      propertyId: id,
      roomId,
      tags: photoTags[photo.id] || [],
      tenancyId: selectedTenancy.value === 'maintenance' ? null : selectedTenancy.value,
      tenancyType: selectedTenancy.type, // current, upcoming, or maintenance
      addedAt: new Date().toISOString()
    }));

    addPhotos(newPhotos);
    navigate(`/properties/${id}/rooms/${roomId}/inventory`);
  };

  // Step 1: Select Tenancy
  if (step === 1) {
    return (
      <div className="page-content">
        <h2>Assign Photos To</h2>
        <p className="subtitle">Select which tenancy these photos belong to</p>

        <div className="tenancy-options">
          {tenancyOptions.map((option) => (
            <div
              key={option.value}
              className="tenancy-option-card"
              onClick={() => handleSelectTenancy(option)}
            >
              <div className="tenancy-option-header">
                {option.type === 'maintenance' ? (
                  <Calendar size={24} />
                ) : (
                  <User size={24} />
                )}
                <div className="tenancy-option-info">
                  <h4>{option.type === 'maintenance' ? 'Property Maintenance' : option.tenancy.tenantName}</h4>
                  <p>{option.label}</p>
                </div>
              </div>

              {option.tenancy && (
                <div className="tenancy-option-details">
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>
                      {new Date(option.tenancy.startDate).toLocaleDateString('en-GB')} - {new Date(option.tenancy.endDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              )}

              {option.type === 'current' && (
                <div className="tenancy-badge current">Active Now</div>
              )}
              {option.type === 'upcoming' && (
                <div className="tenancy-badge upcoming">Upcoming</div>
              )}
              {option.type === 'maintenance' && (
                <div className="tenancy-badge maintenance">Between Tenancies</div>
              )}
            </div>
          ))}
        </div>

        {tenancyOptions.length === 0 && (
          <div className="empty-state">
            <p>No tenancy information available. Please add a tenancy in Property Information first.</p>
            <button
              className="button-primary"
              onClick={() => navigate(`/properties/${id}/information`)}
            >
              Go to Property Information
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Select Photos
  if (step === 2) {
    return (
      <>
        <div className="page-content" style={{ paddingBottom: '80px' }}>
          {/* Show selected tenancy */}
          <div className="selected-tenancy-banner">
            {selectedTenancy.type === 'maintenance' ? (
              <>
                <Calendar size={18} />
                <span>Property Maintenance</span>
              </>
            ) : (
              <>
                <User size={18} />
                <span>{selectedTenancy.tenancy.tenantName} ({selectedTenancy.type === 'current' ? 'Current' : 'Upcoming'})</span>
              </>
            )}
          </div>

          <p className="subtitle">Select From Phone Gallery:</p>

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

        <div className="fixed-bottom-button">
          <button
            className="button-primary"
            disabled={selectedPhotos.length === 0}
            onClick={handleContinueToTagging}
          >
            Confirm Selection ({selectedPhotos.length})
          </button>
        </div>
      </>
    );
  }

  // Step 3: Tag Each Photo
  const currentPhoto = selectedPhotos[currentPhotoIndex];
  const currentTags = getCurrentPhotoTags();

  return (
    <div className="page-content">
      {/* Show selected tenancy */}
      <div className="selected-tenancy-banner">
        {selectedTenancy.type === 'maintenance' ? (
          <>
            <Calendar size={18} />
            <span>Property Maintenance</span>
          </>
        ) : (
          <>
            <User size={18} />
            <span>{selectedTenancy.tenancy.tenantName} ({selectedTenancy.type === 'current' ? 'Current' : 'Upcoming'})</span>
          </>
        )}
      </div>

      <p className="subtitle">Add Tags:</p>

      {/* Photo Preview */}
      <div className="tagging-photo-preview">
        <img src={currentPhoto.url} alt="" />
        {currentTags.length > 0 && (
          <div className="photo-confirmation-badge">
            <Check size={48} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Selected Tags Display */}
      {currentTags.length > 0 && (
        <div className="selected-tags-display">
          <span className="tags-label">Tags:</span>
          <div className="tags-chips">
            {currentTags.map(tag => (
              <span key={tag} className="tag-chip-blue">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Date Display */}
      <div className="date-display">
        Date: {new Date().toLocaleDateString('en-GB')}
      </div>

      {/* Tag Buttons */}
      <div className="tag-buttons-column">
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`tag-button-large ${currentTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="photo-tagging-nav">
        {currentPhotoIndex > 0 && (
          <button
            className="button-secondary"
            onClick={handlePrevPhoto}
          >
            Previous
          </button>
        )}
        <span className="photo-counter">
          {currentPhotoIndex + 1} / {selectedPhotos.length}
        </span>
        <button
          className="button-primary"
          onClick={handleNextPhoto}
          disabled={currentTags.length === 0}
        >
          {currentPhotoIndex < selectedPhotos.length - 1 ? 'Next' : 'Confirm'}
        </button>
      </div>

      <style jsx>{`
        .page-content {
          padding-bottom: 20px;
        }

        .page-content h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .subtitle {
          color: #9B958C;
          font-size: 14px;
          margin: 0 0 24px 0;
        }

        .tenancy-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tenancy-option-card {
          background: white;
          border: 2px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .tenancy-option-card:hover {
          border-color: #2C5F8D;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
        }

        .tenancy-option-card:active {
          transform: translateY(0);
          border-color: #1E4466;
        }

        .tenancy-option-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 16px;
        }

        .tenancy-option-header > svg {
          flex-shrink: 0;
          color: #2C5F8D;
        }

        .tenancy-option-info {
          flex: 1;
        }

        .tenancy-option-info h4 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .tenancy-option-info p {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
        }

        .tenancy-option-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 16px;
          border-top: 1px solid #F5F3EF;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6B7280;
        }

        .detail-item svg {
          flex-shrink: 0;
        }

        .tenancy-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-transform: capitalize;
        }

        .tenancy-badge.current {
          background: #10b981;
        }

        .tenancy-badge.upcoming {
          background: #3b82f6;
        }

        .tenancy-badge.maintenance {
          background: #9B958C;
        }

        .selected-tenancy-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #F5F3EF 0%, #EBE8E1 100%);
          border: 1px solid #2C5F8D;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          background: #F5F3EF;
          border-radius: 12px;
          margin-top: 20px;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          color: #6B7280;
        }
      `}</style>
    </div>
  );
}