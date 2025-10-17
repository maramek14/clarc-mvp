export default function PhotoGrid({ photos }) {
  if (!photos?.length) return <p>No photos available.</p>;

  return (
    <div className="photo-grid" >
      {photos.map((p) => (
        <img
          key={p.id}
          src={p.url}
          alt={p.tag || "photo"}
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ))}
    </div>
  );
}
