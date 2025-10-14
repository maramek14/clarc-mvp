import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileText, Calendar, User, Package, Camera, X } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { getInventoryListsByRoom } from "../inventoryData";
import { useAppGallery } from "../hooks";

export default function RoomInventory() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const [inventoryLists] = useState(getInventoryListsByRoom(id, roomId));
  const { photos } = useAppGallery();
  
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" or "photos"
  const [filterTag, setFilterTag] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!property || !room) {
    return (
      <div className="page-content">
        <p>Room not found.</p>
      </div>
    );
  }

  // Available tags
  const availableTags = ["check-in", "check-out", "damage", "maintenance", "clean", "furnished"];

  // Get room photos
  const roomPhotos = photos.filter(
    (p) => p.propertyId === id && p.roomId === roomId
  );

  // Apply tag filter
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
                {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
                {filterTag !== "all" && ` with tag: ${filterTag}`}
              </p>
            </div>
            <button
              className="button-primary"
              onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
            >
              <Plus size={20} />
              Add Photos
            </button>
          </div>

          {/* Filter Section */}
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
              <Camera size={64} strokeWidth={1.5} />
              <h3>No Photos {filterTag !== "all" ? `with tag: ${filterTag}` : 'Yet'}</h3>
              <p>Add photos to this room to see them here.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
              >
                <Plus size={20} />
                Add Photos
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
                    <span>{property.name}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Room:</strong>
                    <span>{room.name}</span>
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
        </>
      )}

<style jsx>{`
        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 2px solid #E6E3DD;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #9B958C;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #2C5F8D;
        }

        .tab.active {
          color: #2C5F8D;
          border-bottom-color: #2C5F8D;
        }

        .page-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-header-section h2 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          color: #9B958C;
          font-size: 15px;
        }

        .filter-buttons-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .filter-chip {
          padding: 8px 16px;
          border: 1px solid #E6E3DD;
          border-radius: 20px;
          background: white;
          color: #9B958C;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-chip:hover {
          border-color: #2C5F8D;
          color: #2C5F8D;
        }

        .filter-chip.active {
          background: #2C5F8D;
          border-color: #2C5F8D;
          color: white;
        }

        .inventory-lists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .gallery-photo-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .gallery-photo-card:hover {
          transform: scale(1.05);
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
          transition: background 0.2s;
        }

        .close-modal-btn:hover {
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
          gap: 12px;
        }

        .detail-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .detail-row strong {
          min-width: 80px;
          color: #9B958C;
          font-size: 14px;
        }

        .detail-row span {
          color: #2A2A2A;
          font-size: 14px;
        }

        .tag-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag-badge {
          padding: 4px 10px;
          background: #E8F1F8;
          color: #2C5F8D;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #9B958C;
        }

        .empty-state h3 {
          margin: 16px 0 8px 0;
          color: #2A2A2A;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .page-header-section {
            flex-direction: column;
            align-items: stretch;
          }

          .tabs-container {
            overflow-x: auto;
          }

          .tab {
            white-space: nowrap;
          }

          .inventory-lists-grid {
            grid-template-columns: 1fr;
          }

          .photo-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}