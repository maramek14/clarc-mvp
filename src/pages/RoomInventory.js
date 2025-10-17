import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileText, Calendar, User, Package, Camera, X, Check, Trash2, FolderOpen, Filter } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListsByRoom } from "../inventoryData";
import { useAppGallery } from "../hooks";
import { getTenanciesByProperty, getTenancyById, getTenancyStatusColor, getTenancyStatusLabel } from "../tenancyData";

export default function RoomInventory() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  
  // Don't use useState - get fresh data each render
  const roomInventoryLists = getInventoryListsByRoom(id, roomId);
  
  const { photos, deletePhotos, movePhotos } = useAppGallery();
  
  const [activeTab, setActiveTab] = useState("inventory");
  const [filterTag, setFilterTag] = useState("all");
  const [filterTenancy, setFilterTenancy] = useState("all"); // New: tenancy filter
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
  const tenancies = getTenanciesByProperty(id);

  const roomPhotos = photos.filter(
    (p) => p.propertyId === id && p.roomId === roomId
  );

  // Filter photos by tag AND tenancy
  const filteredPhotos = roomPhotos.filter(p => {
    const tagMatch = filterTag === "all" || p.tags?.includes(filterTag);
    const tenancyMatch = filterTenancy === "all" || 
                         p.tenancyId === filterTenancy || 
                         (filterTenancy === "maintenance" && p.tenancyType === "maintenance");
    return tagMatch && tenancyMatch;
  });

  // Filter inventory lists by tenancy
  const filteredInventoryLists = filterTenancy === "all" 
    ? roomInventoryLists
    : roomInventoryLists.filter(list => list.tenancyId === filterTenancy);

  // Group inventory lists by tenancy
  const groupedLists = filteredInventoryLists.reduce((acc, list) => {
    const tenancyId = list.tenancyId || 'unknown';
    if (!acc[tenancyId]) {
      acc[tenancyId] = [];
    }
    acc[tenancyId].push(list);
    return acc;
  }, {});

  const getEventTypeBadgeColor = (eventType) => {
    const colors = {
      'check-in': '#10b981',
      'check-out': '#ef4444',
      'mid-tenancy': '#f59e0b',
      'damage-assessment': '#dc2626',
      'maintenance': '#3b82f6',
      'annual-inspection': '#8b5cf6'
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
          <span>Inventory Lists ({roomInventoryLists.length})</span>
        </button>
        <button
          className={`tab ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <Camera size={20} />
          <span>Photos ({roomPhotos.length})</span>
        </button>
      </div>

      {/* Tenancy Filter (shown on both tabs) */}
      <div className="filter-section">
        <div className="filter-header">
          <Filter size={16} />
          <span>Filter by Tenancy:</span>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterTenancy === "all" ? "active" : ""}`}
            onClick={() => setFilterTenancy("all")}
          >
            All
          </button>
          {tenancies.map(tenancy => (
            <button
              key={tenancy.id}
              className={`filter-btn ${filterTenancy === tenancy.id ? "active" : ""}`}
              onClick={() => setFilterTenancy(tenancy.id)}
            >
              <span>{tenancy.tenantName}</span>
              <span 
                className="filter-badge"
                style={{ backgroundColor: getTenancyStatusColor(tenancy.status) }}
              >
                {getTenancyStatusLabel(tenancy.status)}
              </span>
            </button>
          ))}
          <button
            className={`filter-btn ${filterTenancy === "maintenance" ? "active" : ""}`}
            onClick={() => setFilterTenancy("maintenance")}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Inventory Lists</h2>
              <p className="subtitle">
                {filteredInventoryLists.length} {filteredInventoryLists.length === 1 ? 'list' : 'lists'} 
                {filterTenancy !== "all" && " for this tenancy"}
              </p>
            </div>
            <button
              className="button-primary"
              onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`, { replace: true })}
            >
              <Plus size={20} />
              Create New List
            </button>
          </div>

          {filteredInventoryLists.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} strokeWidth={1.5} />
              <h3>No Inventory Lists {filterTenancy !== "all" && "for this tenancy"}</h3>
              <p>
                {filterTenancy !== "all" 
                  ? "No inventory lists found for the selected tenancy." 
                  : "Create your first inventory list to start tracking items in this room."}
              </p>
              {filterTenancy === "all" && (
                <button
                  className="button-primary"
                  onClick={() => navigate(`/properties/${id}/rooms/${roomId}/inventory/create`, { replace: true })}
                >
                  <Plus size={20} />
                  Create First List
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Group lists by tenancy if showing all */}
              {filterTenancy === "all" ? (
                Object.entries(groupedLists).map(([tenancyId, lists]) => {
                  const tenancy = getTenancyById(tenancyId);
                  return (
                    <div key={tenancyId} className="tenancy-group">
                      <div className="tenancy-group-header">
                        <User size={20} />
                        <h3>{tenancy ? tenancy.tenantName : 'Maintenance'}</h3>
                        {tenancy && (
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getTenancyStatusColor(tenancy.status) }}
                          >
                            {getTenancyStatusLabel(tenancy.status)}
                          </span>
                        )}
                      </div>
                      <div className="inventory-lists-grid">
                        {lists.map((list) => (
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
                                <Calendar size={16} />
                                <span>{list.inspectionDate}</span>
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
                    </div>
                  );
                })
              ) : (
                // Showing filtered lists without grouping
                <div className="inventory-lists-grid">
                  {filteredInventoryLists.map((list) => (
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
                          <span>{list.inspectionDate}</span>
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
                  : `${filteredPhotos.length} photos${filterTenancy !== "all" || filterTag !== "all" ? " (filtered)" : ""}`
                }
              </p>
            </div>
            <div className="header-actions">
              {!selectionMode ? (
                <>
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
                </>
              ) : (
                <button
                  className="button-secondary"
                  onClick={toggleSelectionMode}
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="tag-filter-section">
            <div className="filter-header">
              <span>Filter by Tag:</span>
            </div>
            <div className="tag-filter-buttons">
              <button
                className={`tag-filter-btn ${filterTag === "all" ? "active" : ""}`}
                onClick={() => setFilterTag("all")}
              >
                All
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter-btn ${filterTag === tag ? "active" : ""}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredPhotos.length > 0 ? (
            <div className="photo-grid">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`gallery-photo-card ${isPhotoSelected(photo) ? 'selected' : ''}`}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img src={photo.url} alt="" />
                  {selectionMode && isPhotoSelected(photo) && (
                    <div className="selection-indicator">
                      <Check size={20} />
                    </div>
                  )}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="photo-card-overlay">
                      <span className="photo-tag">{photo.tags[0]}</span>
                    </div>
                  )}
                  {/* Show tenancy info */}
                  {photo.tenancyId && (
                    <div className="photo-tenancy-badge">
                      <User size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Camera size={64} strokeWidth={1.5} />
              <h3>No Photos {filterTag !== "all" || filterTenancy !== "all" ? "matching filters" : "Yet"}</h3>
              <p>
                {filterTag !== "all" || filterTenancy !== "all"
                  ? "Try adjusting your filters or add new photos."
                  : "Add photos to start building your room gallery."}
              </p>
              {filterTag === "all" && filterTenancy === "all" && (
                <button
                  className="button-primary"
                  onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
                >
                  <Plus size={20} />
                  Add First Photo
                </button>
              )}
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
              {selectedPhoto.tenancyId && (
                <div className="detail-row">
                  <strong>Tenancy</strong>
                  <span>{getTenancyById(selectedPhoto.tenancyId)?.tenantName || 'Unknown'}</span>
                </div>
              )}
              {selectedPhoto.tenancyType === 'maintenance' && (
                <div className="detail-row">
                  <strong>Type</strong>
                  <span>Property Maintenance</span>
                </div>
              )}
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
              style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#dc2626' }}
            >
              <Trash2 size={20} />
              Delete ({selectedPhotos.length})
            </button>
          </div>
        </div>
      )}

      {/* Move Photos Modal */}
      {showMoveModal && (
        <div className="photo-detail-modal" onClick={() => setShowMoveModal(false)}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <h3>Move to Room</h3>
            <div className="room-list-modal">
              {property.rooms
                .filter(r => r.id !== roomId)
                .map(targetRoom => (
                  <button
                    key={targetRoom.id}
                    className="room-option-btn"
                    onClick={() => confirmMove(targetRoom.id)}
                  >
                    {targetRoom.name}
                  </button>
                ))}
            </div>
            <button
              className="button-secondary"
              onClick={() => setShowMoveModal(false)}
              style={{ width: '100%', marginTop: '12px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs-container {
          display: flex;
          border-bottom: 2px solid #E6E3DD;
          margin-bottom: 20px;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 15px;
          color: #9B958C;
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

        .filter-section {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F5F3EF;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #2A2A2A;
        }

        .filter-btn:hover {
          background: #EBE8E1;
        }

        .filter-btn.active {
          background: white;
          border-color: #2C5F8D;
          color: #2C5F8D;
        }

        .filter-badge {
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .tenancy-group {
          margin-bottom: 32px;
        }

        .tenancy-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #E6E3DD;
        }

        .tenancy-group-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          flex: 1;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          transition: all 0.2s;
        }

        .inventory-list-card:hover {
          border-color: #2C5F8D;
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
          transform: translateY(-2px);
        }

        .inventory-list-card:active {
          transform: translateY(0);
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

        .tag-filter-section {
          margin-bottom: 20px;
        }

        .tag-filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag-filter-btn {
          padding: 6px 14px;
          background: #F5F3EF;
          border: 2px solid transparent;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #2A2A2A;
          text-transform: capitalize;
        }

        .tag-filter-btn:hover {
          background: #EBE8E1;
        }

        .tag-filter-btn.active {
          background: white;
          border-color: #2C5F8D;
          color: #2C5F8D;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .gallery-photo-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.2s;
        }

        .gallery-photo-card:hover {
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

        .photo-tenancy-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(44, 95, 141, 0.9);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
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
        }

        .detail-photo {
          width: 100%;
          max-height: 60vh;
          object-fit: contain;
          background: #000;
        }

        .photo-details {
          padding: 20px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid #E6E3DD;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row strong {
          font-size: 12px;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-row span {
          font-size: 15px;
          color: #2A2A2A;
        }

        .tag-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag-badge {
          padding: 4px 10px;
          background: #F5F3EF;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .close-modal-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .close-modal-btn:hover {
          background: rgba(0, 0, 0, 0.9);
        }

        .modal-content-small {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
        }

        .modal-content-small h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .room-list-modal {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .room-option-btn {
          padding: 12px 16px;
          background: #F5F3EF;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          color: #2A2A2A;
        }

        .room-option-btn:hover {
          background: #EBE8E1;
          border-color: #2C5F8D;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          background: #F5F3EF;
          border-radius: 12px;
          margin-top: 20px;
        }

        .empty-state h3 {
          margin: 12px 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          color: #9B958C;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions button {
            flex: 1;
          }

          .filter-buttons,
          .tag-filter-buttons {
            justify-content: flex-start;
          }

          .inventory-lists-grid {
            grid-template-columns: 1fr;
          }

          .photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .tenancy-group-header {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}