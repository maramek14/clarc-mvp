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

  const [step, setStep] = useState(1); // 1: select tenancy, 2: select photos
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const tenancyOptions = getPhotoAssignmentOptions(id);

  // Auto-generate tags based on tenancy type
  const getAutoTags = (tenancyType) => {
    if (tenancyType === 'maintenance') {
      return ['maintenance'];
    } else if (tenancyType === 'upcoming') {
      return ['check-in'];
    } else if (tenancyType === 'current') {
      return ['check-in'];
    } else {
      return ['general'];
    }
  };

  // Toggle photo selection
  const togglePhoto = (photo) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.find(p => p.id === photo.id);
      if (isSelected) {
        return prev.filter(p => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  const isPhotoSelected = (photo) => {
    return selectedPhotos.find(p => p.id === photo.id);
  };

  const handleSelectTenancy = (option) => {
    setSelectedTenancy(option);
    setStep(2);
  };

  const handleConfirm = () => {
    if (selectedPhotos.length === 0) {
      alert("Please select at least one photo");
      return;
    }

    // Auto-tag photos based on tenancy context
    const autoTags = getAutoTags(selectedTenancy.type);

    const newPhotos = selectedPhotos.map(photo => ({
      ...photo,
      id: crypto.randomUUID(),
      propertyId: id,
      roomId,
      tags: autoTags,
      tenancyId: selectedTenancy.value === 'maintenance' ? null : selectedTenancy.value,
      tenancyType: selectedTenancy.type,
      addedAt: new Date().toISOString()
    }));

    addPhotos(newPhotos);
    navigate(`/properties/${id}/rooms/${roomId}/inventory`, { replace: true });
  };

  // Step 1: Select Tenancy
  if (step === 1) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h2>Assign Photos To</h2>
          <p style={{ color: '#9B958C', fontSize: '14px', margin: '4px 0 0 0' }}>
            Select which tenancy these photos belong to
          </p>
        </div>

        {tenancyOptions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {tenancyOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectTenancy(option)}
                style={{
                  background: 'white',
                  border: '2px solid #E6E3DD',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.borderColor = '#2C5F8D';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#E6E3DD';
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: option.tenancy ? '16px' : '0' }}>
                  {option.type === 'maintenance' ? (
                    <Calendar size={28} style={{ color: '#2C5F8D', flexShrink: 0 }} />
                  ) : (
                    <User size={28} style={{ color: '#2C5F8D', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600', color: '#2A2A2A' }}>
                      {option.type === 'maintenance' ? 'Property Maintenance' : option.tenancy.tenantName}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#9B958C' }}>
                      {option.label}
                    </p>
                  </div>
                </div>

                {option.tenancy && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #F5F3EF',
                    fontSize: '14px',
                    color: '#6B7280'
                  }}>
                    <Calendar size={14} />
                    <span>
                      {new Date(option.tenancy.startDate).toLocaleDateString('en-GB')} - {new Date(option.tenancy.endDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  textTransform: 'capitalize',
                  background: option.type === 'current' ? '#10b981' : option.type === 'upcoming' ? '#3b82f6' : '#9B958C'
                }}>
                  {option.type === 'current' ? 'Active Now' : option.type === 'upcoming' ? 'Upcoming' : 'Between Tenancies'}
                </div>
              </div>
            ))}
          </div>
        ) : (
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

  // Step 2: Select Photos (Final Step!)
  return (
    <>
      <div className="page-content" style={{ paddingBottom: '6rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #F5F3EF 0%, #EBE8E1 100%)',
          border: '1px solid #2C5F8D',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#2A2A2A'
        }}>
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

        <p className="subtitle">Select Photos From Phone Gallery:</p>

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
          onClick={handleConfirm}
        >
          Add {selectedPhotos.length} {selectedPhotos.length === 1 ? 'Photo' : 'Photos'}
        </button>
      </div>
    </>
  );
}