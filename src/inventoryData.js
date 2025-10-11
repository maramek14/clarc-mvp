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
  // ===== LIVERPOOL STREET PROPERTY (prop-2) - PRELOADED DATA =====
  {
    id: "inv-list-liverpool-1",
    roomId: "room-1", // Living Room
    propertyId: "prop-2",
    name: "Check-in Inventory - Jack Brookes",
    eventType: "check-in",
    tenantName: "Jack Brookes",
    tenancyPeriod: "August 2024 - August 2025",
    createdDate: "2024-08-15",
    inspectionDate: "2024-08-15",
    status: "active",
    notes: "Initial check-in inspection for Jack Brookes",
    photos: ["ph20", "ph21", "ph22"],
    items: [
      {
        id: "liv-item-1",
        name: "Brown Leather Sofa",
        condition: "Good",
        quantity: 1,
        photoRef: "ph20",
        notes: "Minor wear on armrests, comfortable seating",
        category: "Furniture"
      },
      {
        id: "liv-item-2",
        name: "Wooden Coffee Table",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph20",
        notes: "Solid oak, no scratches",
        category: "Furniture"
      },
      {
        id: "liv-item-3",
        name: "TV Unit",
        condition: "Good",
        quantity: 1,
        photoRef: "ph21",
        notes: "White finish with two drawers, one drawer slightly stiff",
        category: "Furniture"
      },
      {
        id: "liv-item-4",
        name: "Flat Screen TV",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph21",
        notes: "43 inch Smart TV, working perfectly, remote included",
        category: "Electronics"
      },
      {
        id: "liv-item-5",
        name: "Floor Standing Lamp",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph22",
        notes: "Adjustable height, all functions working",
        category: "Lighting"
      },
      {
        id: "liv-item-6",
        name: "Bookshelf",
        condition: "Good",
        quantity: 1,
        photoRef: "ph22",
        notes: "5 shelves, minor paint chip on bottom corner",
        category: "Furniture"
      },
      {
        id: "liv-item-7",
        name: "Area Rug",
        condition: "Good",
        quantity: 1,
        photoRef: "ph20",
        notes: "Navy blue, professionally cleaned, small stain near edge",
        category: "Soft Furnishings"
      },
      {
        id: "liv-item-8",
        name: "Curtains",
        condition: "Excellent",
        quantity: 2,
        photoRef: "ph22",
        notes: "Beige blackout curtains, both panels in perfect condition",
        category: "Soft Furnishings"
      },
      {
        id: "liv-item-9",
        name: "Wall Mirror",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph21",
        notes: "Large decorative mirror, no cracks or damage",
        category: "Decor"
      },
      {
        id: "liv-item-10",
        name: "Throw Pillows",
        condition: "Excellent",
        quantity: 4,
        photoRef: "ph20",
        notes: "Matching set, clean and fresh",
        category: "Soft Furnishings"
      }
    ]
  },
  {
    id: "inv-list-liverpool-2",
    roomId: "room-2", // Kitchen
    propertyId: "prop-2",
    name: "Check-in Inventory - Jack Brookes",
    eventType: "check-in",
    tenantName: "Jack Brookes",
    tenancyPeriod: "August 2024 - August 2025",
    createdDate: "2024-08-15",
    inspectionDate: "2024-08-15",
    status: "active",
    notes: "Kitchen appliances and fixtures inspection",
    photos: ["ph23", "ph24", "ph25"],
    items: [
      {
        id: "kit-item-1",
        name: "Integrated Refrigerator",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph23",
        notes: "Built-in fridge-freezer, working perfectly, clean inside",
        category: "Appliances"
      },
      {
        id: "kit-item-2",
        name: "Electric Oven",
        condition: "Good",
        quantity: 1,
        photoRef: "ph23",
        notes: "All heating elements working, minor grease marks inside",
        category: "Appliances"
      },
      {
        id: "kit-item-3",
        name: "Ceramic Hob",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph23",
        notes: "4-zone induction hob, pristine condition",
        category: "Appliances"
      },
      {
        id: "kit-item-4",
        name: "Extractor Hood",
        condition: "Good",
        quantity: 1,
        photoRef: "ph23",
        notes: "Working well, filter cleaned",
        category: "Appliances"
      },
      {
        id: "kit-item-5",
        name: "Dishwasher",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph24",
        notes: "Integrated dishwasher, runs quietly, no leaks",
        category: "Appliances"
      },
      {
        id: "kit-item-6",
        name: "Microwave",
        condition: "Good",
        quantity: 1,
        photoRef: "ph24",
        notes: "Built-in microwave, fully functional",
        category: "Appliances"
      },
      {
        id: "kit-item-7",
        name: "Kitchen Sink",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph25",
        notes: "Stainless steel double sink, no scratches, taps working perfectly",
        category: "Fixtures"
      },
      {
        id: "kit-item-8",
        name: "Kitchen Cabinets (Upper)",
        condition: "Good",
        quantity: 6,
        photoRef: "ph25",
        notes: "White gloss finish, all doors close properly, minor marks on two doors",
        category: "Fixtures"
      },
      {
        id: "kit-item-9",
        name: "Kitchen Cabinets (Lower)",
        condition: "Good",
        quantity: 8,
        photoRef: "ph25",
        notes: "Matching white gloss, soft-close mechanisms working",
        category: "Fixtures"
      },
      {
        id: "kit-item-10",
        name: "Worktop",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph25",
        notes: "Granite effect laminate, no chips or burns",
        category: "Fixtures"
      },
      {
        id: "kit-item-11",
        name: "Breakfast Bar Stools",
        condition: "Good",
        quantity: 2,
        photoRef: "ph24",
        notes: "Chrome and leather, slight wear on seat cushions",
        category: "Furniture"
      },
      {
        id: "kit-item-12",
        name: "Kettle",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph24",
        notes: "Stainless steel kettle, working perfectly",
        category: "Small Appliances"
      },
      {
        id: "kit-item-13",
        name: "Toaster",
        condition: "Good",
        quantity: 1,
        photoRef: "ph24",
        notes: "4-slice toaster, all functions working, minor crumbs inside",
        category: "Small Appliances"
      }
    ]
  },
  {
    id: "inv-list-liverpool-3",
    roomId: "room-3", // Bedroom 1
    propertyId: "prop-2",
    name: "Check-in Inventory - Jack Brookes",
    eventType: "check-in",
    tenantName: "Jack Brookes",
    tenancyPeriod: "August 2024 - August 2025",
    createdDate: "2024-08-15",
    inspectionDate: "2024-08-15",
    status: "active",
    notes: "Master bedroom check-in inspection",
    photos: ["ph26", "ph27", "ph28"],
    items: [
      {
        id: "bed-item-1",
        name: "King Size Bed Frame",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph26",
        notes: "Solid wood frame with upholstered headboard, no damage",
        category: "Furniture"
      },
      {
        id: "bed-item-2",
        name: "King Size Mattress",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph26",
        notes: "Memory foam mattress, excellent support, no stains or marks",
        category: "Furniture"
      },
      {
        id: "bed-item-3",
        name: "Built-in Wardrobe",
        condition: "Good",
        quantity: 1,
        photoRef: "ph27",
        notes: "3 sliding doors, mirror on center panel, all tracks working smoothly, minor scuff on bottom rail",
        category: "Fixtures"
      },
      {
        id: "bed-item-4",
        name: "Bedside Tables",
        condition: "Excellent",
        quantity: 2,
        photoRef: "ph26",
        notes: "Matching oak veneer, two drawers each, perfect condition",
        category: "Furniture"
      },
      {
        id: "bed-item-5",
        name: "Table Lamps",
        condition: "Excellent",
        quantity: 2,
        photoRef: "ph26",
        notes: "Matching ceramic base lamps, both working perfectly",
        category: "Lighting"
      },
      {
        id: "bed-item-6",
        name: "Chest of Drawers",
        condition: "Good",
        quantity: 1,
        photoRef: "ph27",
        notes: "5 drawers, oak finish, all drawers slide smoothly, small scratch on top",
        category: "Furniture"
      },
      {
        id: "bed-item-7",
        name: "Full Length Mirror",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph27",
        notes: "Free-standing mirror, no cracks or damage",
        category: "Decor"
      },
      {
        id: "bed-item-8",
        name: "Blackout Curtains",
        condition: "Excellent",
        quantity: 2,
        photoRef: "ph28",
        notes: "Grey fabric, both panels pristine, effective light blocking",
        category: "Soft Furnishings"
      },
      {
        id: "bed-item-9",
        name: "Carpet",
        condition: "Good",
        quantity: 1,
        photoRef: "ph28",
        notes: "Beige fitted carpet, professionally cleaned, no visible stains",
        category: "Flooring"
      },
      {
        id: "bed-item-10",
        name: "Ceiling Light Fixture",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph28",
        notes: "Modern pendant light, working perfectly",
        category: "Lighting"
      },
      {
        id: "bed-item-11",
        name: "Throw Blanket",
        condition: "Excellent",
        quantity: 1,
        photoRef: "ph26",
        notes: "Soft grey blanket at foot of bed, clean condition",
        category: "Soft Furnishings"
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