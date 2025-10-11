export default function InventoryReports() {
  const reports = [
    { date: "12/03/2024", type: "Check-in" },
    { date: "01/03/2024", type: "Check-out" },
    { date: "01/03/2023", type: "Check-in" },
  ];

  return (
    <div>
      <h1>Inventory Reports</h1>
      <ul>
        {reports.map((r, i) => (
          <li key={i}>
            {r.date} — {r.type}
          </li>
        ))}
      </ul>

      <button className="button-primary">+ View/Create Current Inventory</button>
    </div>
  );
}
