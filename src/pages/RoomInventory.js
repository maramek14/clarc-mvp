import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileText, Calendar, User, Package, Camera, X, Check, Trash2, FolderOpen } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListsByRoom } from "../inventoryData";
import { useAppGallery } from "../hooks";

export default function RoomInventory() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const [inventoryLists] = useState(getInventoryListsByRoom(id, roomId));
  const { photos, deletePhotos, movePhotos } = useAppGallery();
  
  const [activeTab, setActiveTab] = useState("inventory");
  const [filterTag, setFilterTag] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showMoveModal, setShowMoveModal] = useState(false);

  if (!property || !room) {
    return (
      <div className="page-content">
        <p>Room not found.</p>
      </div>
    );
  }

  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  const roomPhotos = photos.filter(
    (p) => p.propertyId === id && p.roomId === roomId
  );

  const filteredPhotos = filterTag === "all" 
    ? roomPhotos 
    : roomPhotos.filter(p => p.tags?.includes(filterTag));

  const getEventTypeBadgeColor = (eventType) => {
    const colors = {
      'check-in': '#10b981',
      'check-out': '#ef4444',
      'mid-tenancy': '#f59e0b',
      'damage-assessment': '#dc2626',
      'maintenance': '#3b82f6'
    };
    return colors[eventType] || '#6b7280';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? '#10b981' : '#6b7280';
  };

  // Selection mode handlers
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPhotos([]);
  };

  const togglePhotoSelection = (photo) => {
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

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedPhotos.length} photo(s)?`)) {
      const photoIds = selectedPhotos.map(p => p.id);
      deletePhotos(photoIds);
      setSelectedPhotos([]);
      setSelectionMode(false);
    }
  };

  const handleMoveSelected = () => {
    setShowMoveModal(true);
  };

  const confirmMove = (targetRoomId) => {
    const photoIds = selectedPhotos.map(p => p.id);
    movePhotos(photoIds, targetRoomId);
    setSelectedPhotos([]);
    setSelectionMode(false);
    setShowMoveModal(false);
  };

  const handlePhotoClick = (photo) => {
    if (selectionMode) {
      togglePhotoSelection(photo);
    } else {
      setSelectedPhoto(photo);
    }
  };

  return (
    <div className="page-content">
      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === "inventory" ? "active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          <FileText size={20} />
          <span>Inventory Lists ({inventoryLists.length})</span>
        </button>
        <button
          className={`tab ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <Camera size={20} />
          <span>Photos ({roomPhotos.length})</span>
        </button>
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Inventory Lists</h2>
              <p className="subtitle">
                {inventoryLists.length} {inventoryLists.length === 1 ? 'list' : 'lists'} for this room
              </p>
            </div>
            <button
              className="button-primary"
              onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`)}
            >
              <Plus size={20} />
              Create New List
            </button>
          </div>

          {inventoryLists.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} strokeWidth={1.5} />
              <h3>No Inventory Lists Yet</h3>
              <p>Create your first inventory list to start tracking items in this room.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`)}
              >
                <Plus size={20} />
                Create First List
              </button>
            </div>
          ) : (
            <div className="inventory-lists-grid">
              {inventoryLists.map((list) => (
                <div
                  key={list.id}
                  className="inventory-list-card"
                  onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/${list.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header">
                    <div className="card-title-section">
                      <h3>{list.name}</h3>
                      <div className="badges">
                        <span
                          className="badge"
                          style={{ backgroundColor: getEventTypeBadgeColor(list.eventType) }}
                        >
                          {list.eventType}
                        </span>
                        <span
                          className="badge"
                          style={{ backgroundColor: getStatusBadgeColor(list.status) }}
                        >
                          {list.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <User size={16} />
                      <span>{list.tenantName}</span>
                    </div>
                    <div className="info-row">
                      <Calendar size={16} />
                      <span>{list.tenancyPeriod}</span>
                    </div>
                    <div className="info-row">
                      <Package size={16} />
                      <span>{list.items.length} items tracked</span>
                    </div>
                  </div>

                  {list.notes && (
                    <div className="card-notes">
                      <p>{list.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Room Photos</h2>
              <p className="subtitle">
                {selectionMode 
                  ? `${selectedPhotos.length} selected`
                  : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photo' : 'photos'}`
                }
                {filterTag !== "all" && !selectionMode && ` with tag: ${filterTag}`}
              </p>
            </div>
            {!selectionMode ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="button-secondary"
                  onClick={toggleSelectionMode}
                >
                  Select
                </button>
                <button
                  className="button-primary"
                  onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
                >
                  <Plus size={20} />
                  Add Photos
                </button>
              </div>
            ) : (
              <button
                className="button-secondary"
                onClick={toggleSelectionMode}
              >
                Cancel
              </button>
            )}
          </div>

          {/* Filter Section - Only show when not in selection mode */}
          {!selectionMode && (
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
          )}

          {/* Photo Grid */}
          {filteredPhotos.length > 0 ? (
            <div className="photo-grid">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className={`gallery-photo-card ${selectionMode && isPhotoSelected(photo) ? 'selected' : ''}`}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img src={photo.url} alt="" />
                  {selectionMode && isPhotoSelected(photo) && (
                    <div className="selection-indicator">
                      <Check size={24} strokeWidth={3} />
                    </div>
                  )}
                  {!selectionMode && (
                    <div className="photo-card-overlay">
                      <span className="photo-tag">{photo.tags?.[0] || "untagged"}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Camera size={64} strokeWidth={1.5} />
              <h3>No Photos {filterTag !== "all" ? `with tag: ${filterTag}` : 'Yet'}</h3>
              <p>Add photos to start building your room gallery.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
              >
                <Plus size={20} />
                Add First Photo
              </button>
            </div>
          )}
        </>
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
                <strong>Tags</strong>
                <div className="tag-list">
                  {selectedPhoto.tags?.map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="detail-row">
                <strong>Added</strong>
                <span>{new Date(selectedPhoto.addedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Mode Action Bar */}
      {selectionMode && selectedPhotos.length > 0 && (
        <div className="fixed-bottom-button">
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <button
              className="button-secondary"
              onClick={handleMoveSelected}
              style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <FolderOpen size={20} />
              Move
            </button>
            <button
              className="button-primary"
              onClick={handleDeleteSelected}
              style={{ 
                flex: '1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                background: 'var(--error)',
              }}
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Move Photos Modal */}
      {showMoveModal && (
        <div className="photo-detail-modal" onClick={() => setShowMoveModal(false)}>
          <div className="move-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Move {selectedPhotos.length} photo(s) to:</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowMoveModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="room-list">
              {property.rooms
                .filter(r => r.id !== roomId)
                .map((targetRoom) => (
                  <button
                    key={targetRoom.id}
                    className="room-option"
                    onClick={() => confirmMove(targetRoom.id)}
                  >
                    <span className="room-icon">{targetRoom.icon}</span>
                    <span className="room-name">{targetRoom.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #E6E3DD;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          color: #9B958C;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: -2px;
        }

        .tab:active {
          background: #F5F3EF;
        }

        .tab.active {
          color: #2C5F8D;
          border-bottom-color: #2C5F8D;
          font-weight: 600;
        }

        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 16px;
        }

        .page-header-section h2 {
          margin: 0 0 4px 0;
          font-size: 22px;
          font-weight: 600;
        }

        .subtitle {
          color: #9B958C;
          font-size: 14px;
          margin: 0;
        }

        .inventory-lists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .inventory-list-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
        }

        .inventory-list-card:active {
          border-color: #2C5F8D;
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          margin-bottom: 16px;
        }

        .card-title-section h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #9B958C;
        }

        .card-notes {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #E6E3DD;
        }

        .card-notes p {
          margin: 0;
          font-size: 13px;
          color: #9B958C;
          font-style: italic;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .gallery-photo-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
        }

        .gallery-photo-card:active {
          transform: scale(1.05);
        }

        .gallery-photo-card.selected {
          border-color: #2C5F8D;
        }

        .gallery-photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          display: flex;
          justify-content: flex-start;
        }

        .photo-tag {
          padding: 4px 8px;
          background: rgba(255,255,255,0.9);
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #2A2A2A;
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .photo-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .photo-detail-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .close-modal-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .close-modal-btn:active {
          background: rgba(0, 0, 0, 0.7);
        }

        .detail-photo {
          width: 100%;
          max-height: 60vh;
          object-fit: contain;
        }

        .photo-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row strong {
          font-size: 12px;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-badge {
          background: #E8F1F8;
          color: #2C5F8D;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
        }

        .filter-buttons-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 16px;
          -webkit-overflow-scrolling: touch;
        }

        .filter-chip {
          flex-shrink: 0;
          padding: 8px 16px;
          border: 2px solid #E6E3DD;
          background: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
          cursor: pointer;
          white-space: nowrap;
        }

        .filter-chip:active {
          border-color: #2C5F8D;
          background: #E8F1F8;
        }

        .filter-chip.active {
          border-color: #2C5F8D;
          background: #2C5F8D;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9B958C;
        }

        .empty-state h3 {
          margin: 16px 0 8px;
          font-size: 20px;
          color: #2A2A2A;
        }

        .empty-state p {
          margin-bottom: 24px;
          font-size: 15px;
        }

        .move-modal-content {
          background: white;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
          color: #2A2A2A;
        }

        .room-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }

        .room-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border: 2px solid #E6E3DD;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .room-option:active {
          background: #E8F1F8;
          border-color: #2C5F8D;
        }

        .room-icon {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F3EF;
          border-radius: 12px;
        }

        .room-name {
          font-size: 16px;
          font-weight: 600;
          color: #2A2A2A;
        }
      `}</style>
    </div>
  );
}