// Tenancy management data
// In a real app, this would come from a database

export const tenancies = [
  {
    id: "tenancy-1",
    propertyId: "prop-1",
    tenantName: "John Sheeves",
    startDate: "2024-06-01",
    endDate: "2026-06-01",
    status: "current", // current, upcoming, past
    tenantEmail: "john.sheeves@email.com",
    tenantPhone: "+44 7700 900123",
    monthlyRent: 1850,
    deposit: 2150,
    notes: "First tenancy at this property"
  },
  {
    id: "tenancy-2",
    propertyId: "prop-1",
    tenantName: "Mike Johnson",
    startDate: "2022-01-15",
    endDate: "2024-05-31",
    status: "past",
    tenantEmail: "mike.j@email.com",
    tenantPhone: "+44 7700 900456",
    monthlyRent: 1650,
    deposit: 1950,
    notes: "Previous tenant, left property in good condition"
  },
  {
    id: "tenancy-3",
    propertyId: "prop-2",
    tenantName: "Jack Brookes",
    startDate: "2024-08-15",
    endDate: "2026-08-15", // Extended to 2026 so it's still current
    status: "current",
    tenantEmail: "jack.brookes@email.com",
    tenantPhone: "+44 7700 900789",
    monthlyRent: 1400,
    deposit: 1600,
    notes: "Current tenant at Liverpool Grove"
  },
  {
    id: "tenancy-4",
    propertyId: "prop-1",
    tenantName: "Sarah Williams",
    startDate: "2026-07-01",
    endDate: "2027-07-01",
    status: "upcoming",
    tenantEmail: "sarah.w@email.com",
    tenantPhone: "+44 7700 900321",
    monthlyRent: 1950,
    deposit: 2250,
    notes: "Future tenant, starts after John's tenancy"
  }
];

// Helper function to calculate tenancy status based on dates
export function calculateTenancyStatus(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (today >= start && today <= end) {
    return "current";
  } else if (today < start) {
    return "upcoming";
  } else {
    return "past";
  }
}

// Update tenancy statuses based on current date
export function updateTenancyStatuses() {
  return tenancies.map(tenancy => ({
    ...tenancy,
    status: calculateTenancyStatus(tenancy.startDate, tenancy.endDate)
  }));
}

// Get all tenancies for a property
export function getTenanciesByProperty(propertyId) {
  return updateTenancyStatuses().filter(t => t.propertyId === propertyId);
}

// Get current tenancy for a property (if exists)
export function getCurrentTenancy(propertyId) {
  const tenanciesForProperty = getTenanciesByProperty(propertyId);
  return tenanciesForProperty.find(t => t.status === "current") || null;
}

// Get upcoming tenancy for a property (if exists)
export function getUpcomingTenancy(propertyId) {
  const tenanciesForProperty = getTenanciesByProperty(propertyId);
  // Get the earliest upcoming tenancy
  const upcomingTenancies = tenanciesForProperty
    .filter(t => t.status === "upcoming")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
  return upcomingTenancies[0] || null;
}

// Get past tenancies for a property
export function getPastTenancies(propertyId) {
  const tenanciesForProperty = getTenanciesByProperty(propertyId);
  return tenanciesForProperty
    .filter(t => t.status === "past")
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate)); // Most recent first
}

// Get all tenancies for a property sorted by date
export function getAllTenanciesSorted(propertyId) {
  const tenanciesForProperty = getTenanciesByProperty(propertyId);
  return tenanciesForProperty.sort((a, b) => {
    // Sort by start date, most recent first
    return new Date(b.startDate) - new Date(a.startDate);
  });
}

// Get a specific tenancy by ID
export function getTenancyById(tenancyId) {
  return updateTenancyStatuses().find(t => t.id === tenancyId) || null;
}

// Check if a property has an active tenancy
export function hasActiveTenancy(propertyId) {
  return getCurrentTenancy(propertyId) !== null;
}

// Get available tenancies for photo assignment
// Returns current tenant if active, otherwise upcoming or maintenance option
export function getPhotoAssignmentOptions(propertyId) {
  const current = getCurrentTenancy(propertyId);
  const upcoming = getUpcomingTenancy(propertyId);
  
  const options = [];
  
  if (current) {
    // Active tenancy - can only assign to current tenant
    options.push({
      type: "current",
      tenancy: current,
      label: `${current.tenantName} (Current)`,
      value: current.id
    });
  } else {
    // No active tenancy - can assign to upcoming or maintenance
    if (upcoming) {
      options.push({
        type: "upcoming",
        tenancy: upcoming,
        label: `${upcoming.tenantName} (Upcoming - Check-in prep)`,
        value: upcoming.id
      });
    }
    
    options.push({
      type: "maintenance",
      tenancy: null,
      label: "Property Maintenance / Between Tenancies",
      value: "maintenance"
    });
  }
  
  return options;
}

// Get available tenancies for inventory list creation
export function getInventoryListTenancyOptions(propertyId) {
  const current = getCurrentTenancy(propertyId);
  const upcoming = getUpcomingTenancy(propertyId);
  const past = getPastTenancies(propertyId);
  
  const options = [];
  
  if (current) {
    options.push({
      type: "current",
      tenancy: current,
      label: `${current.tenantName} (Current: ${formatDateRange(current.startDate, current.endDate)})`,
      value: current.id
    });
  }
  
  if (upcoming) {
    options.push({
      type: "upcoming",
      tenancy: upcoming,
      label: `${upcoming.tenantName} (Upcoming: ${formatDateRange(upcoming.startDate, upcoming.endDate)})`,
      value: upcoming.id
    });
  }
  
  // Include recent past tenancies (last 2)
  past.slice(0, 2).forEach(tenancy => {
    options.push({
      type: "past",
      tenancy: tenancy,
      label: `${tenancy.tenantName} (Past: ${formatDateRange(tenancy.startDate, tenancy.endDate)})`,
      value: tenancy.id
    });
  });
  
  return options;
}

// Format date range helper
function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  };
  
  return `${formatDate(start)} - ${formatDate(end)}`;
}

// Get tenancy status badge color
export function getTenancyStatusColor(status) {
  const colors = {
    current: '#10b981',   // Green
    upcoming: '#3b82f6',  // Blue
    past: '#6b7280'       // Gray
  };
  return colors[status] || '#6b7280';
}

// Get tenancy status label
export function getTenancyStatusLabel(status) {
  const labels = {
    current: 'Current',
    upcoming: 'Upcoming',
    past: 'Past'
  };
  return labels[status] || status;
}

// Check if dates overlap with existing tenancies
export function checkTenancyOverlap(propertyId, startDate, endDate, excludeTenancyId = null) {
  const tenanciesForProperty = getTenanciesByProperty(propertyId)
    .filter(t => t.id !== excludeTenancyId);
  
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);
  
  for (const tenancy of tenanciesForProperty) {
    const existingStart = new Date(tenancy.startDate);
    const existingEnd = new Date(tenancy.endDate);
    
    // Check if dates overlap
    if (newStart <= existingEnd && newEnd >= existingStart) {
      return {
        hasOverlap: true,
        conflictingTenancy: tenancy
      };
    }
  }
  
  return {
    hasOverlap: false,
    conflictingTenancy: null
  };
}