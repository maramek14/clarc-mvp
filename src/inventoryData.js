// Demo inventory lists data
// In a real app, this would come from a database

export const inventoryLists = [
  {
    id: "inv-list-1",
    roomId: "room-1", // Living Room - Property 1
    propertyId: "prop-1",
    name: "Check-in Inventory - John Sheeves",
    eventType: "check-in",
    tenantName: "John Sheeves",
    tenancyPeriod: "June 2024 - June 2026",
    createdDate: "2024-06-01",
    inspectionDate: "2024-06-01",
    status: "active",
    notes: "Initial check-in inspection",
    photos: ["ph1", "ph2"],
    items: [
      {
        id: "item-1",
        name: "Grey Fabric Sofa",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph1",
        notes: "Brand new, no visible wear",
        category: "Furniture"
      },
      {
        id: "item-2",
        name: "Glass Coffee Table",
        condition: "Good",
        quantity: 1,
        photoRef: "ph1",
        notes: "Minor scratches on surface",
        category: "Furniture"
      },
      {
        id: "item-3",
        name: "Floor Lamp",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph2",
        notes: "Working perfectly",
        category: "Lighting"
      },
      {
        id: "item-4",
        name: "TV Stand",
        condition: "Good",
        quantity: 1,
        photoRef: "ph2",
        notes: "Slight discoloration on one corner",
        category: "Furniture"
      },
      {
        id: "item-5",
        name: "Decorative Cushions",
        condition: "Excellent",
        quantity: 4,
        photoRef: "ph1",
        notes: "Clean, no stains",
        category: "Soft Furnishings"
      }
    ]
  },
  {
    id: "inv-list-2",
    roomId: "room-2", // Kitchen - Property 1
    propertyId: "prop-1",
    name: "Check-in Inventory - John Sheeves",
    eventType: "check-in",
    tenantName: "John Sheeves",
    tenancyPeriod: "June 2024 - June 2026",
    createdDate: "2024-06-01",
    inspectionDate: "2024-06-01",
    status: "active",
    notes: "Kitchen check-in inspection",
    photos: ["ph4", "ph5"],
    items: [
      {
        id: "item-6",
        name: "Refrigerator",
        condition: "Good",
        quantity: 1,
        photoRef: "ph4",
        notes: "Working well, minor dent on left side",
        category: "Appliances"
      },
      {
        id: "item-7",
        name: "Gas Stove",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph4",
        notes: "All burners working",
        category: "Appliances"
      },
      {
        id: "item-8",
        name: "Kitchen Cabinets",
        condition: "Good",
        quantity: 8,
        photoRef: "ph5",
        notes: "Some wear on handles",
        category: "Fixtures"
      },
      {
        id: "item-9",
        name: "Countertop",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph5",
        notes: "Granite, no chips or stains",
        category: "Fixtures"
      },
      {
        id: "item-10",
        name: "Dishwasher",
        condition: "Good",
        quantity: 1,
        photoRef: "ph4",
        notes: "Working properly",
        category: "Appliances"
      }
    ]
  },
  {
    id: "inv-list-3",
    roomId: "room-3", // Bedroom 1 - Property 1
    propertyId: "prop-1",
    name: "Check-in Inventory - John Sheeves",
    eventType: "check-in",
    tenantName: "John Sheeves",
    tenancyPeriod: "June 2024 - June 2026",
    createdDate: "2024-06-01",
    inspectionDate: "2024-06-01",
    status: "active",
    notes: "Master bedroom check-in",
    photos: ["ph7", "ph8"],
    items: [
      {
        id: "item-11",
        name: "Queen Bed Frame",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph7",
        notes: "Sturdy, no wobbling",
        category: "Furniture"
      },
      {
        id: "item-12",
        name: "Mattress",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph7",
        notes: "New, still has protective cover",
        category: "Furniture"
      },
      {
        id: "item-13",
        name: "Wardrobe",
        condition: "Good",
        quantity: 1,
        photoRef: "ph8",
        notes: "Small scratch on door",
        category: "Furniture"
      },
      {
        id: "item-14",
        name: "Bedside Tables",
        condition: "Excellent",
        quantity: 2,
        photoRef: "ph7",
        notes: "Matching set, perfect condition",
        category: "Furniture"
      },
      {
        id: "item-15",
        name: "Curtains",
        condition: "Good",
        quantity: 1,
        photoRef: "ph8",
        notes: "Clean, slight fading",
        category: "Soft Furnishings"
      }
    ]
  },
  {
    id: "inv-list-4",
    roomId: "room-1", // Living Room - Property 2
    propertyId: "prop-2",
    name: "Check-in Inventory - Jack Brookes",
    eventType: "check-in",
    tenantName: "Jack Brookes",
    tenancyPeriod: "August 2023 - August 2025",
    createdDate: "2023-08-15",
    inspectionDate: "2023-08-15",
    status: "active",
    notes: "Initial check-in inspection",
    photos: ["ph1"],
    items: [
      {
        id: "item-16",
        name: "Leather Sofa",
        condition: "Good",
        quantity: 1,
        photoRef: "ph1",
        notes: "Some creasing on cushions",
        category: "Furniture"
      },
      {
        id: "item-17",
        name: "Wooden Coffee Table",
        condition: "Fair",
        quantity: 1,
        photoRef: "ph1",
        notes: "Visible scratches and water rings",
        category: "Furniture"
      },
      {
        id: "item-18",
        name: "Bookshelf",
        condition: "Good",
        quantity: 1,
        photoRef: "ph1",
        notes: "Sturdy, minor wear",
        category: "Furniture"
      }
    ]
  }
];

// Helper function to get inventory lists by room
export function getInventoryListsByRoom(propertyId, roomId) {
  return inventoryLists.filter(
    list => list.propertyId === propertyId && list.roomId === roomId
  );
}

// Helper function to get a specific inventory list
export function getInventoryListById(listId) {
  return inventoryLists.find(list => list.id === listId);
}

// Helper function to get inventory lists by property
export function getInventoryListsByProperty(propertyId) {
  return inventoryLists.filter(list => list.propertyId === propertyId);
}