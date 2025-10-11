import PropertyCard from "../components/PropertyCard";
import { properties } from "../data";

export default function Properties() {
  return (
    <div>
      <h1>My Properties</h1>
      <button className="button-primary">+ Add New Property</button>

      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
