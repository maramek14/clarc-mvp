import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, X, ArrowRight, Check, Sparkles, User, Calendar } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import { useAppGallery } from "../hooks";
import { getInventoryListTenancyOptions, getTenancyById } from "../tenancyData";

const eventTypeOptions = ["check-in", "check-out", "mid-tenancy", "annual-inspection"];
const conditionOptions = ["Excellent", "Good", "Fair", "Poor", "Damaged", "Missing"];
const categoryOptions = ["Furniture", "Lighting", "Appliances", "Soft Furnishings", "Flooring", "Decor", "Kitchen Items", "Bathroom Items"];

export default function CreateInventoryList() {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);
  const { photos } = useAppGallery();

  const [step, setStep] = useState(1); // 1: Select Tenancy, 2: Select Photos, 3: List Details & Items, 4: Review

  // Selected tenancy
  const [selectedTenancyOption, setSelectedTenancyOption] = useState(null);

  // Form data (will be auto-filled from tenancy)
  const [formData, setFormData] = useState({
    name: "",
    eventType: "check-in",
    tenantName: "",
    tenancyPeriod: "",
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Selected photos from room
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Generated items from photos
  const [items, setItems] = useState([]);

  if (!property || !room) {
    return (
      <div className="page-content">
        <p>Property or room not found.</p>
      </div>
    );
  }

  const tenancyOptions = getInventoryListTenancyOptions(id);

  // Get photos for this room filtered by selected tenancy
  const getRoomPhotos = () => {
    const roomPhotos = photos.filter(
      (p) => p.propertyId === id && p.roomId === roomId
    );

    // If tenancy selected, filter by tenancy
    if (selectedTenancyOption) {
      return roomPhotos.filter(p => {
        // If maintenance photos, they can be used for upcoming tenancies
        if (p.tenancyType === 'maintenance' && selectedTenancyOption.type === 'upcoming') {
          return true;
        }
        // Otherwise match the tenancy ID
        return p.tenancyId === selectedTenancyOption.value;
      });
    }

    return roomPhotos;
  };

  const roomPhotos = getRoomPhotos();

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectTenancy = (option) => {
    setSelectedTenancyOption(option);
    
    // Auto-fill form data from tenancy
    const tenancy = option.tenancy;
    
    if (option.type === 'maintenance') {
      // Handle maintenance option
      setFormData(prev => ({
        ...prev,
        tenantName: "Property Maintenance",
        tenancyPeriod: "N/A",
        name: `Maintenance Inventory - ${room.name}`
      }));
    } else {
      // Handle regular tenancy option
      const startDate = new Date(tenancy.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      const endDate = new Date(tenancy.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      
      setFormData(prev => ({
        ...prev,
        tenantName: tenancy.tenantName,
        tenancyPeriod: `${startDate} - ${endDate}`,
        name: `${prev.eventType === 'check-in' ? 'Check-in' : prev.eventType === 'check-out' ? 'Check-out' : 'Mid-tenancy'} Inventory - ${tenancy.tenantName}`
      }));
    }

    setStep(2);
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

  const generateItemsFromPhotos = () => {
    // In a real app, this would use AI/ML to detect items in photos
    // For now, we'll create placeholder items based on photo categories
    const newItems = selectedPhotos.flatMap((photo, index) => {
      // Generate 2-3 items per photo as examples
      const itemsForPhoto = [];
      
      if (photo.category === 'living-room') {
        itemsForPhoto.push({
          id: `item-${photo.id}-1`,
          name: "Sofa",
          condition: "Excellent",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
        itemsForPhoto.push({
          id: `item-${photo.id}-2`,
          name: "Coffee Table",
          condition: "Good",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
      } else if (photo.category === 'kitchen') {
        itemsForPhoto.push({
          id: `item-${photo.id}-1`,
          name: "Refrigerator",
          condition: "Good",
          quantity: 1,
          category: "Appliances",
          notes: "Detected from photo",
          photoRef: photo.id
        });
        itemsForPhoto.push({
          id: `item-${photo.id}-2`,
          name: "Kitchen Cabinets",
          condition: "Good",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
      } else if (photo.category === 'bedroom') {
        itemsForPhoto.push({
          id: `item-${photo.id}-1`,
          name: "Bed Frame",
          condition: "Excellent",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
        itemsForPhoto.push({
          id: `item-${photo.id}-2`,
          name: "Wardrobe",
          condition: "Good",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
      } else if (photo.category === 'bathroom') {
        itemsForPhoto.push({
          id: `item-${photo.id}-1`,
          name: "Shower Unit",
          condition: "Good",
          quantity: 1,
          category: "Bathroom Items",
          notes: "Detected from photo",
          photoRef: photo.id
        });
        itemsForPhoto.push({
          id: `item-${photo.id}-2`,
          name: "Sink",
          condition: "Good",
          quantity: 1,
          category: "Bathroom Items",
          notes: "Detected from photo",
          photoRef: photo.id
        });
      } else {
        // Generic item
        itemsForPhoto.push({
          id: `item-${photo.id}-1`,
          name: "Item from photo",
          condition: "Good",
          quantity: 1,
          category: "Furniture",
          notes: "Detected from photo",
          photoRef: photo.id
        });
      }
      
      return itemsForPhoto;
    });

    setItems(newItems);
    setStep(3);
  };

  const handleItemChange = (itemId, field, value) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addManualItem = () => {
    const newItem = {
      id: `item-manual-${Date.now()}`,
      name: "New Item",
      condition: "Excellent",
      quantity: 1,
      category: "Furniture",
      notes: "",
      photoRef: null
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a list name");
      return;
    }
    if (!formData.tenantName.trim()) {
      alert("Please enter a tenant name");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one item to the inventory");
      return;
    }

    // Import the add function
    const { addInventoryList } = require("../inventoryData");

    // Create the new list
    const newList = {
      id: `inv-list-${Date.now()}`,
      roomId: roomId,
      propertyId: id,
      tenancyId: selectedTenancyOption.value,
      ...formData,
      createdDate: new Date().toISOString().split('T')[0],
      status: "active",
      photos: selectedPhotos.map(p => p.id),
      items: items
    };

    // Actually add it to the global list
    addInventoryList(newList);
    
    alert("Inventory list created successfully!");
    navigate(`/properties/${id}/rooms/${roomId}/inventory`);
  };

  const handleCancel = () => {
    if (selectedPhotos.length > 0 || items.length > 0 || formData.name || formData.tenantName) {
      if (window.confirm("Are you sure you want to cancel? All unsaved data will be lost.")) {
        navigate(`/properties/${id}/rooms/${roomId}/inventory`);
      }
    } else {
      navigate(`/properties/${id}/rooms/${roomId}/inventory`);
    }
  };

  // Group items by category for display
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="page-content">
      {/* Progress Steps */}
      <div className="steps-container">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span>Select Tenancy</span>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Select Photos</span>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span>List Details</span>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span>Review</span>
        </div>
      </div>

      {/* Step 1: Select Tenancy */}
      {step === 1 && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Select Tenancy</h2>
              <p className="subtitle">
                Choose which tenancy this inventory list is for
              </p>
            </div>
            <button className="button-secondary" onClick={handleCancel}>
              <X size={18} />
              Cancel
            </button>
          </div>

          {tenancyOptions.length > 0 ? (
            <div className="tenancy-options">
              {tenancyOptions.map((option) => (
                <div
                  key={option.value}
                  className="tenancy-option-card"
                  onClick={() => handleSelectTenancy(option)}
                >
                  <div className="tenancy-option-header">
                    <User size={24} />
                    <div className="tenancy-option-info">
                      <h4>{option.tenancy.tenantName}</h4>
                      <p>{option.label}</p>
                    </div>
                  </div>

                  <div className="tenancy-option-details">
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>
                        {new Date(option.tenancy.startDate).toLocaleDateString('en-GB')} - {new Date(option.tenancy.endDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>

                  {option.type === 'current' && (
                    <div className="tenancy-badge current">Current</div>
                  )}
                  {option.type === 'upcoming' && (
                    <div className="tenancy-badge upcoming">Upcoming</div>
                  )}
                  {option.type === 'past' && (
                    <div className="tenancy-badge past">Past</div>
                  )}
                  {option.type === 'maintenance' && (
                    <div className="tenancy-badge maintenance">Maintenance</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tenancies found. Please add a tenancy in Property Information first.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/information`)}
              >
                Go to Property Information
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 2: Select Photos */}
      {step === 2 && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Select Photos</h2>
              <p className="subtitle">
                Choose photos from {room.name} for {selectedTenancyOption.tenancy.tenantName}
              </p>
            </div>
            <div className="action-buttons">
              <button className="button-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className="button-primary" 
                onClick={generateItemsFromPhotos}
                disabled={selectedPhotos.length === 0}
              >
                <Sparkles size={18} />
                Generate Items ({selectedPhotos.length})
              </button>
            </div>
          </div>

          {/* Selected Tenancy Banner */}
          <div className="selected-tenancy-banner">
            <User size={18} />
            <span>{selectedTenancyOption.tenancy.tenantName} ({selectedTenancyOption.type === 'current' ? 'Current' : selectedTenancyOption.type === 'upcoming' ? 'Upcoming' : selectedTenancyOption.type === 'maintenance' ? 'Maintenance' : 'Past'})</span>
          </div>

          {roomPhotos.length > 0 ? (
            <div className="photo-grid">
              {roomPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`selectable-photo ${isPhotoSelected(photo) ? 'selected' : ''}`}
                  onClick={() => togglePhotoSelection(photo)}
                >
                  <img src={photo.url} alt="" />
                  {isPhotoSelected(photo) && (
                    <div className="selection-indicator">
                      <Check size={20} />
                    </div>
                  )}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="photo-card-overlay">
                      <span className="photo-tag">{photo.tags[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No photos for this tenancy yet. Add photos first to create an inventory list.</p>
              <button
                className="button-primary"
                onClick={() => navigate(`/properties/${id}/rooms/${roomId}/add-photos`)}
              >
                <Plus size={20} />
                Add Photos
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 3: List Details & Items */}
      {step === 3 && (
        <>
          <div className="page-header-section">
            <div>
              <h2>List Details & Items</h2>
              <p className="subtitle">
                {items.length} items generated from {selectedPhotos.length} photos
              </p>
            </div>
            <div className="action-buttons">
              <button className="button-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="button-primary" onClick={() => setStep(4)}>
                <ArrowRight size={18} />
                Review & Save
              </button>
            </div>
          </div>

          {/* Selected Tenancy Banner */}
          <div className="selected-tenancy-banner">
            <User size={18} />
            <span>{selectedTenancyOption.tenancy.tenantName} ({selectedTenancyOption.type === 'current' ? 'Current' : selectedTenancyOption.type === 'upcoming' ? 'Upcoming' : selectedTenancyOption.type === 'maintenance' ? 'Maintenance' : 'Past'})</span>
          </div>

          {/* List Details Form */}
          <div className="form-card">
            <h3>List Details</h3>
            
            <div className="form-group">
              <label>List Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g., Check-in Inventory - John Doe"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  className="form-input"
                  value={formData.eventType}
                  onChange={(e) => {
                    handleFormChange('eventType', e.target.value);
                    // Update list name when event type changes
                    const eventLabel = e.target.value === 'check-in' ? 'Check-in' : 
                                     e.target.value === 'check-out' ? 'Check-out' : 'Mid-tenancy';
                    handleFormChange('name', `${eventLabel} Inventory - ${selectedTenancyOption.tenancy.tenantName}`);
                  }}
                >
                  {eventTypeOptions.map(type => (
                    <option key={type} value={type}>
                      {type.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Inspection Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.inspectionDate}
                  onChange={(e) => handleFormChange('inspectionDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tenant Name * (Auto-filled)</label>
              <input
                type="text"
                className="form-input"
                value={formData.tenantName}
                onChange={(e) => handleFormChange('tenantName', e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="form-group">
              <label>Tenancy Period (Auto-filled)</label>
              <input
                type="text"
                className="form-input"
                value={formData.tenancyPeriod}
                onChange={(e) => handleFormChange('tenancyPeriod', e.target.value)}
                placeholder="e.g., June 2024 - June 2026"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Additional notes about this inventory list..."
              />
            </div>
          </div>

          {/* Generated Items - Editable */}
          <div className="items-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Generated Items ({items.length})</h3>
              <button className="button-secondary" onClick={addManualItem}>
                <Plus size={18} />
                Add Item
              </button>
            </div>
            
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="category-section">
                <h4 className="category-title">{category}</h4>
                <div className="items-grid">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="item-edit-card">
                      <div className="item-header">
                        <input
                          type="text"
                          className="form-input-inline"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                        />
                        <button
                          className="icon-button-danger"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="item-edit-fields">
                        <select
                          className="form-input-small"
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                        >
                          {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>

                        <select
                          className="form-input-small"
                          value={item.condition}
                          onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
                        >
                          {conditionOptions.map(cond => (
                            <option key={cond} value={cond}>{cond}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          className="form-input-small"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                        />
                      </div>

                      <textarea
                        className="form-input-small"
                        rows="2"
                        value={item.notes}
                        onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                        placeholder="Item notes..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 4: Review & Save */}
      {step === 4 && (
        <>
          <div className="page-header-section">
            <div>
              <h2>Review & Save</h2>
              <p className="subtitle">
                Review your inventory list before saving
              </p>
            </div>
            <div className="action-buttons">
              <button className="button-secondary" onClick={() => setStep(3)}>
                Back to Edit
              </button>
              <button className="button-primary" onClick={handleSave}>
                <Save size={18} />
                Save List
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="form-card">
            <h3>{formData.name || "Untitled List"}</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Tenancy:</span>
                <span className="value">{selectedTenancyOption.tenancy.tenantName} ({selectedTenancyOption.type})</span>
              </div>
              <div className="summary-item">
                <span className="label">Event Type:</span>
                <span className="value">{formData.eventType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Tenant:</span>
                <span className="value">{formData.tenantName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date:</span>
                <span className="value">{formData.inspectionDate}</span>
              </div>
              <div className="summary-item">
                <span className="label">Period:</span>
                <span className="value">{formData.tenancyPeriod || "N/A"}</span>
              </div>
              <div className="summary-item">
                <span className="label">Photos:</span>
                <span className="value">{selectedPhotos.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Items:</span>
                <span className="value">{items.length}</span>
              </div>
            </div>
            {formData.notes && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E6E3DD' }}>
                <strong>Notes:</strong>
                <p style={{ margin: '8px 0 0 0', color: '#6B7280' }}>{formData.notes}</p>
              </div>
            )}
          </div>

          {/* Items Preview */}
          <div className="items-section">
            <h3>Items ({items.length})</h3>
            
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="category-section">
                <h4 className="category-title">{category}</h4>
                <div className="items-grid">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <h5>{item.name}</h5>
                        {item.quantity > 1 && (
                          <span className="quantity-badge">x{item.quantity}</span>
                        )}
                      </div>

                      <div className="item-details">
                        <div className="item-detail-row">
                          <span className="label">Condition:</span>
                          <span className="condition-badge" style={{
                            backgroundColor: item.condition === 'Excellent' ? '#10b981' :
                                           item.condition === 'Good' ? '#3b82f6' :
                                           item.condition === 'Fair' ? '#f59e0b' :
                                           item.condition === 'Poor' ? '#ef4444' :
                                           item.condition === 'Damaged' ? '#dc2626' : '#6b7280'
                          }}>
                            {item.condition}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="item-notes">
                            <p>{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .steps-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #E6E3DD;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.4;
        }

        .step.active {
          opacity: 1;
        }

        .step.completed {
          opacity: 0.7;
        }

        .step.completed .step-number {
          background: #10b981;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #E6E3DD;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }

        .step.active .step-number {
          background: #2C5F8D;
        }

        .step span {
          font-size: 13px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .step-divider {
          width: 40px;
          height: 2px;
          background: #E6E3DD;
          margin: 0 12px;
        }

        .tenancy-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
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
        }

        .tenancy-option-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .tenancy-option-info {
          flex: 1;
        }

        .tenancy-option-info h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
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
          padding-top: 12px;
          border-top: 1px solid #F5F3EF;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6B7280;
        }

        .tenancy-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .tenancy-badge.current {
          background: #10b981;
        }

        .tenancy-badge.upcoming {
          background: #3b82f6;
        }

        .tenancy-badge.past {
          background: #6b7280;
        }

        .tenancy-badge.maintenance {
          background: #f59e0b;
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

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .selectable-photo {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.2s;
        }

        .selectable-photo:hover {
          transform: scale(1.05);
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

        .form-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .form-card h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .items-section h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .category-section {
          margin-bottom: 32px;
        }

        .category-title {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #9B958C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .item-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
        }

        .item-edit-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .item-header h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .form-input-inline {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
        }

        .form-input-inline:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        .form-input-small {
          padding: 8px 10px;
          border: 1px solid #E6E3DD;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          background: white;
        }

        .form-input-small:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        .item-edit-fields {
          display: grid;
          grid-template-columns: 1.5fr 1fr 0.5fr;
          gap: 8px;
        }

        .icon-button-danger {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-button-danger:hover {
          background: #fee2e2;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .item-detail-row .label {
          color: #6B7280;
          font-weight: 500;
        }

        .condition-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: white;
        }

        .quantity-badge {
          padding: 4px 8px;
          background: #F5F3EF;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .item-notes {
          padding-top: 8px;
          border-top: 1px solid #F5F3EF;
        }

        .item-notes p {
          margin: 0;
          font-size: 13px;
          color: #6B7280;
          line-height: 1.5;
        }

        .empty-state {
          background: #F5F3EF;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-state p {
          margin: 0 0 16px 0;
          color: #6B7280;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item .label {
          font-size: 12px;
          color: #6B7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-item .value {
          font-size: 16px;
          color: #2A2A2A;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .form-row,
          .item-edit-fields {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .steps-container {
            padding: 16px;
          }

          .step span {
            display: none;
          }

          .step-divider {
            width: 20px;
            margin: 0 8px;
          }
        }
      `}</style>
    </div>
  );
}