import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <h3>{property.name}</h3>
      <p>Tenant: {property.tenant}</p>
      <Link className="button" to={`/properties/${property.id}/dashboard`}>
        View
      </Link>
    </div>
  );
}
