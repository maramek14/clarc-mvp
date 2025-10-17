import { useState } from "react";

// Fake Phone Gallery Library - Pre-loaded with property/room images
// You can replace these URLs with your own images when deploying
const initialPhoneGallery = [
  // Living Room Photos
  { id: "ph1", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop", category: "living-room" },
  { id: "ph2", url: "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&h=800&fit=crop", category: "living-room" },
  { id: "ph3", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop", category: "living-room" },
  
  // Kitchen Photos
  { id: "ph4", url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=800&fit=crop", category: "kitchen" },
  { id: "ph5", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop", category: "kitchen" },
  { id: "ph6", url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=800&fit=crop", category: "kitchen" },
  
  // Bedroom Photos
  { id: "ph7", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=800&fit=crop", category: "bedroom" },
  { id: "ph8", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop", category: "bedroom" },
  { id: "ph9", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop", category: "bedroom" },
  { id: "ph10", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop", category: "bedroom" },
  
  // Bathroom Photos
  { id: "ph11", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=800&fit=crop", category: "bathroom" },
  { id: "ph12", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=800&fit=crop", category: "bathroom" },
  { id: "ph13", url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=800&fit=crop", category: "bathroom" },
  
  // Entrance/Hallway Photos
  { id: "ph14", url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=800&fit=crop", category: "entrance" },
  { id: "ph15", url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=800&fit=crop", category: "entrance" },
  
  // General Interior/Details
  { id: "ph16", url: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=800&fit=crop", category: "detail" },
  { id: "ph17", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=800&fit=crop", category: "detail" },
  { id: "ph18", url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&h=800&fit=crop", category: "detail" },
  
  // Damage/Issues (for damage reports)
  { id: "ph19", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop", category: "damage" },
  { id: "ph20", url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=800&fit=crop", category: "damage" },
  
  // Dining Room
  { id: "ph21", url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop", category: "dining" },
  { id: "ph22", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=800&fit=crop", category: "dining" },
  
  // Office/Study
  { id: "ph23", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop", category: "office" },
  { id: "ph24", url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=800&fit=crop", category: "office" },
  
  // Garden/Outdoor
  { id: "ph25", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=800&fit=crop", category: "garden" },
  { id: "ph26", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop", category: "garden" },
  
  // Additional variety
  { id: "ph27", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=800&fit=crop", category: "misc" },
  { id: "ph28", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=800&fit=crop", category: "misc" },
  { id: "ph29", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop", category: "misc" },
  { id: "ph30", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=800&fit=crop", category: "misc" },
];

// App Gallery - photos that have been added to properties/rooms
// Updated with tenancy fields
let globalAppGallery = [
  { 
    id: "app1", 
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop", 
    propertyId: "prop-1",
    roomId: "room-1",
    tags: ["check-in"],
    category: "living-room",
    tenancyId: "tenancy-1", // John Sheeves current tenancy
    tenancyType: "current",
    addedAt: "2024-06-01T10:00:00Z"
  },
  { 
    id: "app2", 
    url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=800&fit=crop", 
    propertyId: "prop-1",
    roomId: "room-2",
    tags: ["check-in"],
    category: "kitchen",
    tenancyId: "tenancy-1", // John Sheeves current tenancy
    tenancyType: "current",
    addedAt: "2024-06-01T10:15:00Z"
  },
];

export function useAppGallery() {
  const [photos, setPhotos] = useState(globalAppGallery);

  const addPhotos = (newPhotos) => {
    globalAppGallery = [...globalAppGallery, ...newPhotos];
    setPhotos(globalAppGallery);
  };

  const deletePhotos = (photoIds) => {
    globalAppGallery = globalAppGallery.filter(photo => !photoIds.includes(photo.id));
    setPhotos(globalAppGallery);
  };

  const movePhotos = (photoIds, newRoomId) => {
    globalAppGallery = globalAppGallery.map(photo => 
      photoIds.includes(photo.id) 
        ? { ...photo, roomId: newRoomId }
        : photo
    );
    setPhotos(globalAppGallery);
  };

  const resetGallery = () => {
    globalAppGallery = [];
    setPhotos(globalAppGallery);
  };

  return { photos, addPhotos, deletePhotos, movePhotos, resetGallery };
}

export function usePhoneGallery() {
  const [photos] = useState(initialPhoneGallery);
  return { photos };
}