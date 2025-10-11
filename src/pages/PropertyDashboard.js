import { Link, useParams } from "react-router-dom";
import { getPropertyById } from "../utils";

export default function PropertyDashboard() {
  const { id } = useParams();
  const property = getPropertyById(id);

  if (!property) return <p>Property not found.</p>;

  return (
    <div>
      <h1>{property.name}</h1>
      <p><strong>Current Tenancy:</strong> {property.tenant}</p>

      <div className="tabs">
        <Link className="button" to={`/properties/${id}/rooms`}>Rooms</Link>
        <Link className="button" to={`/properties/${id}/reports`}>Inventory Reports</Link>
      </div>
    </div>
  );
}
