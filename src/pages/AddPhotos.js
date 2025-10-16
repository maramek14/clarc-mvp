import { useNavigate, useParams } from "react-router-dom";
import { usePhoneGallery, useAppGallery } from "../hooks";
import { useState } from "react";
import { Check } from "lucide-react";

export default function AddPhotos() {
  const { id, roomId } = useParams();
  const { photos: phonePhotos } = usePhoneGallery();
  const { addPhotos } = useAppGallery();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: select photos, 2: tag photos
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoTags, setPhotoTags] = useState({}); // { photoId: [tags] }
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

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

  const handleContinueToTagging = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }
    setStep(2);
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

    // Create new photos with metadata
    const newPhotos = selectedPhotos.map(photo => ({
      ...photo,
      id: crypto.randomUUID(),
      propertyId: id,
      roomId,
      tags: photoTags[photo.id] || [],
      addedAt: new Date().toISOString()
    }));

    addPhotos(newPhotos);
    navigate(`/properties/${id}/rooms/${roomId}/inventory`);
  };

// Step 1: Select Photos
  if (step === 1) {
    return (
      <>
        <div className="page-content" style={{ paddingBottom: '80px' }}>
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

  // Step 2: Tag Each Photo
  const currentPhoto = selectedPhotos[currentPhotoIndex];
  const currentTags = getCurrentPhotoTags();

  return (
    <div className="page-content">
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

      {/* Date Display (optional) */}
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
    </div>
  );
}

