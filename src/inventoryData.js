// Demo inventory lists data
// In a real app, this would come from a database

// Use a global variable like photos do
let globalInventoryLists = [
  {
    id: "inv-list-1",
    roomId: "room-1", // Living Room - Property 1
    propertyId: "prop-1",
    tenancyId: "tenancy-1", // John Sheeves
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
      }
    ]
  },
  {
    id: "inv-list-2",
    roomId: "room-2", // Kitchen - Property 1
    propertyId: "prop-1",
    tenancyId: "tenancy-1", // John Sheeves
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
      }
    ]
  }
];

// Export the array directly for reading
export const inventoryLists = globalInventoryLists;

// Helper function to add an inventory list
export function addInventoryList(newList) {
  globalInventoryLists = [...globalInventoryLists, newList];
  return globalInventoryLists;
}

// Helper function to get inventory lists by room
export function getInventoryListsByRoom(propertyId, roomId) {
  return globalInventoryLists.filter(
    list => list.propertyId === propertyId && list.roomId === roomId
  );
}

// Helper function to get a specific inventory list
export function getInventoryListById(listId) {
  return globalInventoryLists.find(list => list.id === listId);
}

// Helper function to get inventory lists by property
export function getInventoryListsByProperty(propertyId) {
  return globalInventoryLists.filter(list => list.propertyId === propertyId);
}