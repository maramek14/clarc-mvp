import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

export default function Activity() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, upcoming, overdue

  // Activity data based on your actual properties
  const activities = [
    {
      id: 1,
      type: "checkout",
      property: "272 D Earl's Court Rd",
      room: "Bedroom 1",
      date: "2025-11-05",
      dueIn: 19,
      status: "upcoming",
      action: "Check-out report due",
      propertyId: "prop-1",
      roomId: "room-3"
    },
    {
      id: 2,
      type: "report",
      property: "3 Liverpool Grove",
      date: "2025-10-15",
      dueIn: -2,
      status: "overdue",
      action: "Annual inspection overdue",
      propertyId: "prop-2"
    },
    {
      id: 3,
      type: "maintenance",
      property: "272 D Earl's Court Rd",
      room: "Kitchen",
      date: "2025-10-25",
      dueIn: 8,
      status: "upcoming",
      action: "Kitchen appliance check scheduled",
      propertyId: "prop-1",
      roomId: "room-2"
    },
    {
      id: 4,
      type: "completed",
      property: "272 D Earl's Court Rd",
      date: "2024-09-15",
      status: "completed",
      action: "Annual Inspection 2024 completed",
      propertyId: "prop-1"
    },
    {
      id: 5,
      type: "checkout",
      property: "3 Liverpool Grove",
      room: "Living Room",
      date: "2025-08-10",
      dueIn: -68,
      status: "overdue",
      action: "Tenancy ending - inventory needed",
      propertyId: "prop-2",
      roomId: "room-1"
    },
    {
      id: 6,
      type: "completed",
      property: "3 Liverpool Grove",
      date: "2023-08-15",
      status: "completed",
      action: "Check-in report - Jack Brookes",
      propertyId: "prop-2"
    },
    {
      id: 7,
      type: "maintenance",
      property: "272 D Earl's Court Rd",
      room: "Bathroom 1",
      date: "2025-11-01",
      dueIn: 15,
      status: "upcoming",
      action: "Bathroom maintenance inspection",
      propertyId: "prop-1",
      roomId: "room-5"
    }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    if (filter === "upcoming") return activity.status === "upcoming";
    if (filter === "overdue") return activity.status === "overdue";
    return true;
  });

  const getIcon = (type, status) => {
    if (status === "overdue") return <AlertCircle size={20} color="#ef4444" />;
    if (status === "completed") return <CheckCircle size={20} color="#10b981" />;
    if (type === "checkout" || type === "maintenance") return <Clock size={20} color="#f59e0b" />;
    return <FileText size={20} color="#3b82f6" />;
  };

  const getStatusColor = (status) => {
    if (status === "overdue") return "#FEE2E2";
    if (status === "upcoming") return "#FEF3C7";
    if (status === "completed") return "#D1FAE5";
    return "#F3F4F6";
  };

  const formatDueDate = (dueIn) => {
    if (dueIn < 0) return `${Math.abs(dueIn)} days overdue`;
    if (dueIn === 0) return "Due today";
    if (dueIn === 1) return "Due tomorrow";
    return `Due in ${dueIn} days`;
  };

  const handleActivityClick = (activity) => {
    if (activity.propertyId) {
      if (activity.roomId) {
        navigate(`/properties/${activity.propertyId}/rooms/${activity.roomId}/inventory`);
      } else {
        navigate(`/properties/${activity.propertyId}/dashboard`);
      }
    }
  };

  return (
    <div className="page-content" style={{ paddingBottom: '8rem' }}>
      {/* Filter Chips */}
      <div className="filter-row">
        <button
          className={`filter-chip ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Activity
        </button>
        <button
          className={`filter-chip ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-chip ${filter === "overdue" ? "active" : ""}`}
          onClick={() => setFilter("overdue")}
        >
          Overdue
        </button>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="activity-card"
            style={{ backgroundColor: getStatusColor(activity.status) }}
            onClick={() => handleActivityClick(activity)}
          >
            <div className="activity-icon">
              {getIcon(activity.type, activity.status)}
            </div>
            
            <div className="activity-content">
              <h3>{activity.action}</h3>
              <p className="activity-property">{activity.property}</p>
              {activity.room && <p className="activity-room">{activity.room}</p>}
              
              <div className="activity-meta">
                <Calendar size={14} />
                <span>{activity.date}</span>
                {activity.dueIn !== undefined && (
                  <span className="due-badge">{formatDueDate(activity.dueIn)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="empty-state">
          <CheckCircle size={64} strokeWidth={1.5} color="#9B958C" />
          <h3>No {filter} activities</h3>
          <p>You're all caught up!</p>
        </div>
      )}

      <style jsx>{`
        .filter-row {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: 8px 16px;
          border: 2px solid #E6E3DD;
          border-radius: 20px;
          background: white;
          color: #9B958C;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-chip:active {
          transform: scale(0.98);
        }

        .filter-chip.active {
          background: #2C5F8D;
          border-color: #2C5F8D;
          color: white;
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-card {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .activity-card:active {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #2C5F8D;
        }

        .activity-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 10px;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-content h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #2A2A2A;
        }

        .activity-property {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #2C5F8D;
        }

        .activity-room {
          margin: 2px 0 0 0;
          font-size: 13px;
          color: #6B7280;
        }

        .activity-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 12px;
          color: #6B7280;
        }

        .due-badge {
          margin-left: 8px;
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          font-weight: 500;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-state h3 {
          margin: 16px 0 8px 0;
          color: #2A2A2A;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0;
          color: #9B958C;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}