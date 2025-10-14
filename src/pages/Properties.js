import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { properties } from "../data";

export default function Properties() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <p className="subtitle">
        Select a property to manage rooms, photos, and reports.
      </p>

      <div className="property-list">
        {properties.map((p) => (
          <div
            key={p.id}
            className="property-card"
            onClick={() => navigate(`/properties/${p.id}/dashboard`)}
            role="button"
            tabIndex={0}
          >
            <img src={p.image} alt={p.name} className="property-thumb" />
            <div className="property-info">
              <h3>{p.name}</h3>
              <p>Tenant: {p.tenant}</p>
            </div>
          </div>
        ))}

        {/* Add New Property card */}
        <div
          className="property-card add-card"
          onClick={() => navigate("/add-property")}
          role="button"
          tabIndex={0}
        >
          <div className="add-card-content">
            <Plus size={28} strokeWidth={2.5} />
            <span>Add New Property</span>
          </div>
        </div>
      </div>
    </div>
  );
}

