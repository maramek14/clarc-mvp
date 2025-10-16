// Save this as: src/pages/Reports.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Filter, Search, AlertTriangle, Calendar, User, Package, Home, ChevronDown } from "lucide-react";
import { propertyReports } from "../propertyReportsData";
import { properties } from "../data";

export default function Reports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, name

  // Helper to get property name
  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || "Unknown Property";
  };

  // Filter and sort reports
  const getFilteredReports = () => {
    let filtered = [...propertyReports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPropertyName(report.propertyId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Property filter
    if (filterProperty !== "all") {
      filtered = filtered.filter(report => report.propertyId === filterProperty);
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(report => report.reportType === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(report => report.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.inspectionDate) - new Date(a.inspectionDate);
      } else if (sortBy === "date-asc") {
        return new Date(a.inspectionDate) - new Date(b.inspectionDate);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return filtered;
  };

  const filteredReports = getFilteredReports();

  // Calculate stats
  const totalReports = propertyReports.length;
  const reportsWithWarnings = propertyReports.filter(r => r.warnings.length > 0).length;
  const completeReports = propertyReports.filter(r => r.status === "complete").length;
  const incompleteReports = propertyReports.filter(r => r.status === "incomplete").length;

  // Get unique report types
  const reportTypes = [
    { value: "check-in", label: "Check-in" },
    { value: "check-out", label: "Check-out" },
    { value: "annual-inspection", label: "Annual Inspection" },
    { value: "mid-tenancy", label: "Mid-Tenancy" },
    { value: "damage-assessment", label: "Damage Assessment" },
    { value: "maintenance", label: "Maintenance" }
  ];

  const getReportTypeColor = (type) => {
    switch (type) {
      case "check-in": return "#10b981";
      case "check-out": return "#ef4444";
      case "annual-inspection": return "#2C5F8D";
      case "mid-tenancy": return "#f59e0b";
      case "damage-assessment": return "#dc2626";
      case "maintenance": return "#6b7280";
      default: return "#6b7280";
    }
  };

  return (
    <div className="page-content">
      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown
            size={16}
            style={{
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Property</label>
            <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)}>
              <option value="all">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Report Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm("");
              setFilterProperty("all");
              setFilterType("all");
              setFilterStatus("all");
              setSortBy("date-desc");
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="results-header">
        <p className="results-count">
          {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
          {(searchTerm || filterProperty !== "all" || filterType !== "all" || filterStatus !== "all") &&
            " (filtered)"}
        </p>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} strokeWidth={1.5} />
          <h3>No reports found</h3>
          <p>
            {searchTerm || filterProperty !== "all" || filterType !== "all" || filterStatus !== "all"
              ? "Try adjusting your filters or search term"
              : "Create your first property report to get started"}
          </p>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="report-card"
              onClick={() => navigate(`/properties/${report.propertyId}/inventory/reports/${report.id}`)}
            >
              {/* Report Header */}
              <div className="report-card-header">
                <div className="report-card-title-section">
                  <h3>{report.name}</h3>
                  <div className="report-card-property">
                    <Home size={14} />
                    <span>{getPropertyName(report.propertyId)}</span>
                  </div>
                </div>
                <span
                  className="report-type-badge"
                  style={{ backgroundColor: getReportTypeColor(report.reportType) }}
                >
                  {report.reportType.replace('-', ' ')}
                </span>
              </div>

              {/* Report Meta */}
              <div className="report-card-meta">
                <div className="meta-item">
                  <User size={16} />
                  <span>{report.tenantName}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{report.inspectionDate}</span>
                </div>
                <div className="meta-item">
                  <Package size={16} />
                  <span>{report.totalItems} items</span>
                </div>
              </div>

              {/* Report Stats */}
              <div className="report-card-stats">
                <div className="stat-badge">
                  <span className="stat-badge-label">Rooms:</span>
                  <span className="stat-badge-value">{report.roomsIncluded.length}</span>
                </div>
                <div className={`stat-badge ${report.status === 'complete' ? 'success' : 'warning'}`}>
                  <span className="stat-badge-label">Status:</span>
                  <span className="stat-badge-value">
                    {report.status === 'complete' ? '✓ Complete' : '⚠ Incomplete'}
                  </span>
                </div>
                {report.warnings.length > 0 && (
                  <div className="stat-badge danger">
                    <AlertTriangle size={14} />
                    <span className="stat-badge-value">{report.warnings.length} warnings</span>
                  </div>
                )}
              </div>

              {/* Report Notes */}
              {report.notes && (
                <div className="report-card-notes">
                  <p>{report.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

<style jsx>{`
        .search-filter-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          align-items: stretch;
        }

        .search-box {
          flex: 1;
          min-width: 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .search-box svg {
          color: #9B958C;
          flex-shrink: 0;
        }

        .search-box input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          font-size: 14px;
          color: #2A2A2A;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .search-box input::placeholder {
          color: #9B958C;
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #2A2A2A;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .filter-toggle-btn:active {
          background: #F9F8F6;
          border-color: #2C5F8D;
        }

        .filter-panel {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 13px;
          font-weight: 500;
          color: #2A2A2A;
        }

        .filter-group select {
          padding: 10px 12px;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          color: #2A2A2A;
          background: white;
          cursor: pointer;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #2C5F8D;
        }

        .clear-filters-btn {
          grid-column: 1 / -1;
          padding: 10px 16px;
          background: #F9F8F6;
          border: 1px solid #E6E3DD;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #9B958C;
          cursor: pointer;
        }

        .clear-filters-btn:active {
          background: #F5F3EF;
          color: #2A2A2A;
        }

        .results-header {
          margin-bottom: 16px;
        }

        .results-count {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
          font-weight: 500;
        }

        .empty-state {
          background: white;
          border: 2px dashed #E6E3DD;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-state svg {
          color: #E6E3DD;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
        }

        .reports-list {
          display: grid;
          gap: 16px;
        }

        .report-card {
          background: white;
          border: 1px solid #E6E3DD;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
        }

        .report-card:active {
          border-color: #2C5F8D;
          box-shadow: 0 4px 12px rgba(44, 95, 141, 0.1);
          transform: translateY(-2px);
        }

        .report-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }

        .report-card-title-section {
          flex: 1;
          min-width: 0;
        }

        .report-card-title-section h3 {
          margin: 0 0 6px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2A2A2A;
          word-wrap: break-word;
        }

        .report-card-property {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #9B958C;
        }

        .report-type-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .report-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F5F3EF;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #9B958C;
        }

        .report-card-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: #F5F3EF;
          border-radius: 8px;
          font-size: 13px;
        }

        .stat-badge.success {
          background: #E8F5EC;
          color: #3D7C5C;
        }

        .stat-badge.warning {
          background: #FFF8E7;
          color: #8B6914;
        }

        .stat-badge.danger {
          background: #FDECEA;
          color: #B85C4F;
        }

        .stat-badge-label {
          color: #9B958C;
          font-weight: 500;
        }

        .stat-badge-value {
          font-weight: 600;
          color: #2A2A2A;
        }

        .stat-badge.success .stat-badge-value {
          color: #3D7C5C;
        }

        .stat-badge.warning .stat-badge-value {
          color: #8B6914;
        }

        .stat-badge.danger .stat-badge-value {
          color: #B85C4F;
        }

        .report-card-notes {
          padding-top: 12px;
          border-top: 1px solid #F5F3EF;
        }

        .report-card-notes p {
          margin: 0;
          font-size: 14px;
          color: #9B958C;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .search-filter-bar {
            flex-direction: column;
          }

          .filter-panel {
            grid-template-columns: 1fr;
          }

          .report-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .report-type-badge {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}