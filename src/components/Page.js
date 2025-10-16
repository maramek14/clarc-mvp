import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getPropertyById, getRoomById } from "../utils";
import Logo from "./Logo";

/**
 * Universal Page wrapper with clean, hierarchical header
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

  return (
    <div className="page">
      <header className="page-header">
        {!hideBack && (
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        
        {/* Show logo on main pages instead of back button */}
        {hideBack && (
          <div className="logo-container">
            <Logo width={180} height={96} />
          </div>
        )}
        
        <div className="page-title-section">
          {/* Breadcrumb for context */}
          {(property || room) && (
            <div className="breadcrumb">
              {property && <span className="breadcrumb-item">{property.name}</span>}
              {room && (
                <>
                  <ChevronRight size={14} className="breadcrumb-separator" />
                  <span className="breadcrumb-item">{room.name}</span>
                </>
              )}
            </div>
          )}
          
          {/* Main page title */}
          <h1 className="page-title">{title}</h1>
        </div>
      </header>

      <main className="page-content">{children}</main>

      <style jsx>{`
        .page {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .page-header {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 64px;
          padding: 12px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
          z-index: 5;
        }

        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .back-button:active {
          background: #f3f4f6;
          color: #2C5F8D;
        }

        .logo-container {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 4px 0;
        }

        .page-title-section {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .breadcrumb-item {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .breadcrumb-separator {
          flex-shrink: 0;
          color: #d1d5db;
        }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .page-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 20px;
          padding-bottom: 100px;
          box-sizing: border-box;
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 12px 16px;
          }

          .breadcrumb {
            font-size: 11px;
          }

          .breadcrumb-item {
            max-width: 100px;
          }

          .page-title {
            font-size: 18px;
          }

          .page-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}