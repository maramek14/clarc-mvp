import { useParams } from "react-router-dom";
import { getPropertyById, getRoomById } from "../utils";

export default function RoomInventory() {
  const { id, roomId } = useParams();
  const property = getPropertyById(id);
  const room = getRoomById(property, roomId);

  const items = [
    { name: "Bedframe", condition: "Good" },
    { name: "Standing Mirror", condition: "Tarnished" },
    { name: "Desk", condition: "New" },
  ];

  if (!property || !room) return <p>Room not found.</p>;

  return (
    <div>
      <h1>{room.name} — Inventory</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.name}>
              <td>{i.name}</td>
              <td>{i.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="button-primary">Generate Report</button>
    </div>
  );
}
