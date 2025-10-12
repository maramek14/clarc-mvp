import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Page from "./components/Page";

import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import PropertyInformation from "./pages/PropertyInformation";
import PropertyInventoryOverview from "./pages/PropertyInventoryOverview";
import CreatePropertyReport from "./pages/CreatePropertyReport";
import ViewPropertyReport from "./pages/ViewPropertyReport";
import InventoryReports from "./pages/InventoryReports";
import AddRoom from "./pages/AddRoom";
import RoomInventory from "./pages/RoomInventory";
import CreateInventoryList from "./pages/CreateInventoryList";
import ViewInventoryList from "./pages/ViewInventoryList";
import AddPhotos from "./pages/AddPhotos";
import Gallery from "./pages/Gallery";
import AddToGallery from "./pages/AddToGallery";
import PhoneGallery from "./pages/PhoneGallery";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/properties" replace />} />
            <Route
              path="/properties"
              element={<Page title="My Properties"><Properties /></Page>}
            />
            <Route
              path="/add-property"
              element={<Page title="Add New Property"><AddProperty /></Page>}
            />
            <Route
              path="/properties/:id/dashboard"
              element={<Page title="Property Dashboard"><PropertyInventoryOverview /></Page>}
            />
            <Route
              path="/properties/:id/information"
              element={<Page title="Information"><PropertyInformation /></Page>}
            />
            <Route
              path="/properties/:id/inventory"
              element={<Page title="Property Inventory"><PropertyInventoryOverview /></Page>}
            />
            <Route
              path="/properties/:id/inventory/create-report"
              element={<Page title="Create Property Report"><CreatePropertyReport /></Page>}
            />
            <Route
              path="/properties/:id/inventory/reports/:reportId"
              element={<Page title="View Report"><ViewPropertyReport /></Page>}
            />
            <Route
              path="/properties/:id/reports"
              element={<Page title="Inventory Reports"><InventoryReports /></Page>}
            />
            <Route
              path="/properties/:id/add-room"
              element={<Page title="Add New Room"><AddRoom /></Page>}
            />
            {/* NEW COMBINED ROUTE - Room Inventory with tabs for lists & photos */}
            <Route
              path="/properties/:id/rooms/:roomId/inventory"
              element={<Page title="Room Inventory"><RoomInventory /></Page>}
            />
            <Route
              path="/properties/:id/rooms/:roomId/inventory/create"
              element={<Page title="Create Inventory List"><CreateInventoryList /></Page>}
            />
            <Route
              path="/properties/:id/rooms/:roomId/inventory/:listId"
              element={<Page title="Inventory List"><ViewInventoryList /></Page>}
            />
            <Route
              path="/properties/:id/rooms/:roomId/add-photos"
              element={<Page title="Add Photos"><AddPhotos /></Page>}
            />
            <Route
              path="/gallery"
              element={<Page title="Gallery"><Gallery /></Page>}
            />
            <Route
              path="/gallery/add"
              element={<Page title="Add to Gallery"><AddToGallery /></Page>}
            />
            <Route
              path="/phone"
              element={<Page title="Phone Gallery"><PhoneGallery /></Page>}
            />
            <Route
              path="/reports"
              element={<Page title="Reports"><Reports /></Page>}
            />
            <Route
              path="/settings"
              element={<Page title="Settings"><Settings /></Page>}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}