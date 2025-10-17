// Demo property-level reports data
// In a real app, this would come from a database

let globalPropertyReports = [
  {
    id: "prop-report-1",
    propertyId: "prop-1",
    name: "Annual Inspection 2024",
    reportType: "annual-inspection",
    createdDate: "2024-09-15",
    inspectionDate: "2024-09-15",
    tenantName: "John Sheeves",
    status: "complete",
    roomsIncluded: ["room-1", "room-2", "room-3"],
    roomsExcluded: [],
    roomInventoryListIds: ["inv-list-1", "inv-list-2", "inv-list-3"],
    warnings: [],
    totalItems: 15,
    conditionSummary: {
      excellent: 9,
      good: 5,
      fair: 1,
      poor: 0,
      damaged: 0
    },
    notes: "Annual inspection completed successfully"
  },
  {
    id: "prop-report-2",
    propertyId: "prop-1",
    name: "Mid-Tenancy Check - John Sheeves",
    reportType: "mid-tenancy",
    createdDate: "2024-03-10",
    inspectionDate: "2024-03-10",
    tenantName: "John Sheeves",
    status: "complete",
    roomsIncluded: ["room-1", "room-2", "room-3", "room-4"],
    roomsExcluded: ["room-5", "room-6", "room-7"],
    roomInventoryListIds: ["inv-list-1", "inv-list-2", "inv-list-3", "inv-list-4"],
    warnings: [
      "Bathrooms 1 & 2 and Entrance Hall excluded - no recent inventories"
    ],
    totalItems: 20,
    conditionSummary: {
      excellent: 8,
      good: 10,
      fair: 2,
      poor: 0,
      damaged: 0
    },
    notes: "Mid-tenancy inspection - some rooms excluded due to missing data"
  },
  {
    id: "prop-report-3",
    propertyId: "prop-2",
    name: "Check-in Report - Jack Brookes",
    reportType: "check-in",
    createdDate: "2023-08-15",
    inspectionDate: "2023-08-15",
    tenantName: "Jack Brookes",
    status: "complete",
    roomsIncluded: ["room-1", "room-2", "room-3"],
    roomsExcluded: [],
    roomInventoryListIds: ["inv-list-liverpool-1", "inv-list-liverpool-2", "inv-list-liverpool-3"],
    warnings: [],
    totalItems: 12,
    conditionSummary: {
      excellent: 5,
      good: 5,
      fair: 2,
      poor: 0,
      damaged: 0
    },
    notes: "Initial check-in inventory for new tenancy"
  }
];

export const liverpoolPropertyReport = {
  id: "prop-report-liverpool-1",
  propertyId: "prop-2",
  name: "Check-in Property Report - Jack Brookes",
  reportType: "check-in",
  tenantName: "Jack Brookes",
  tenancyPeriod: "August 2024 - August 2025",
  createdDate: "2024-08-15",
  inspectionDate: "2024-08-15",
  status: "complete",
  roomsIncluded: ["room-1", "room-2", "room-3"],
  roomsExcluded: [],
  roomInventoryListIds: ["inv-list-liverpool-1", "inv-list-liverpool-2", "inv-list-liverpool-3"],
  warnings: [],
  totalItems: 34,
  conditionSummary: {
    excellent: 21,
    good: 13,
    fair: 0,
    poor: 0,
    damaged: 0
  },
  notes: "Complete check-in inspection for Jack Brookes. All rooms inspected and documented. Property in excellent overall condition with minor wear on select furniture items. All appliances tested and working. Tenant briefed on property condition and given keys."
};

// Export function to get all reports
export function getPropertyReports() {
  return globalPropertyReports;
}

// Add function to add new reports
export function addPropertyReport(newReport) {
  globalPropertyReports = [...globalPropertyReports, newReport];
  return globalPropertyReports;
}

// Helper function to get property reports by property
export function getPropertyReportsByProperty(propertyId) {
  return globalPropertyReports.filter(report => report.propertyId === propertyId);
}

// Helper function to get a specific property report
export function getPropertyReportById(reportId) {
  return globalPropertyReports.find(report => report.id === reportId);
}

// Helper function to get room inventory status for a property
export function getRoomInventoryStatus(propertyId, rooms, inventoryLists) {
  const now = new Date();
  
  return rooms.map(room => {
    const roomLists = inventoryLists.filter(
      list => list.propertyId === propertyId && list.roomId === room.id
    );

    if (roomLists.length === 0) {
      return {
        roomId: room.id,
        roomName: room.name,
        status: 'missing',
        lastInventoryDate: null,
        daysSinceLastInventory: null,
        inventoryCount: 0,
        color: '#6b7280'
      };
    }

    const latestList = roomLists.reduce((latest, current) => {
      const currentDate = new Date(current.inspectionDate);
      const latestDate = new Date(latest.inspectionDate);
      return currentDate > latestDate ? current : latest;
    });

    const lastInventoryDate = new Date(latestList.inspectionDate);
    const daysSince = Math.floor((now - lastInventoryDate) / (1000 * 60 * 60 * 24));

    let status, color;
    if (daysSince <= 30) {
      status = 'up-to-date';
      color = '#10b981';
    } else if (daysSince <= 90) {
      status = 'needs-attention';
      color = '#f59e0b';
    } else {
      status = 'outdated';
      color = '#ef4444';
    }

    return {
      roomId: room.id,
      roomName: room.name,
      status,
      lastInventoryDate: latestList.inspectionDate,
      daysSinceLastInventory: daysSince,
      inventoryCount: roomLists.length,
      color,
      latestListId: latestList.id
    };
  });
}