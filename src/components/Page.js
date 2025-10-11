export default function Page({ title, children }) {
  return (
    <div className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
