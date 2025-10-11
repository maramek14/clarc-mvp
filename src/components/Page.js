import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";

/**
 * Universal Page wrapper with:
 * - Back button (auto hidden on root tabs)
 * - Dynamic header: e.g. "Rooms — 272 D Earl’s Bourt Rd"
 */
export default function Page({ title, children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id: propertyId, roomId } = useParams();

  // Define root-level pages where back button should be hidden
  const hideBack = ["/properties", "/gallery", "/reports", "/settings"].includes(
    pathname
  );

  // Get property and room names if applicable
  const property = propertyId ? getPropertyById(propertyId) : null;
  const room = property && roomId ? getRoomById(property, roomId) : null;

  // Build context-aware title
  let fullTitle = title;
  if (room && property) {
    fullTitle = `${title} — ${room.name} — ${property.name}`;
  } else if (property) {
    fullTitle = `${title} — ${property.name}`;
  }

  return (
    <div className="page">
      <header className="page-header">
        {!hideBack && (
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className="page-title">{fullTitle}</h1>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}
