import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Page from "./components/Page";

import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import PropertyDashboard from "./pages/PropertyDashboard";
import PropertyInformation from "./pages/PropertyInformation";
import PropertyInventoryOverview from "./pages/PropertyInventoryOverview";
import CreatePropertyReport from "./pages/CreatePropertyReport";
import ViewPropertyReport from "./pages/ViewPropertyReport";
import InventoryReports from "./pages/InventoryReports";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import RoomDashboard from "./pages/RoomDashboard";
import RoomInventoryLists from "./pages/RoomInventoryLists";
import CreateInventoryList from "./pages/CreateInventoryList";
import ViewInventoryList from "./pages/ViewInventoryList";
import RoomPhotos from "./pages/RoomPhotos";
import AddPhotos from "./pages/AddPhotos";
import Gallery from "./pages/Gallery";
import AddToGallery from "./pages/AddToGallery";
import PhoneGallery from "./pages/PhoneGallery";
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
              element={<Page title="Property Dashboard"><PropertyDashboard /></Page>}
            />
            <Route
              path="/properties/:id/information"
              element={<Page title="Information"><PropertyInformation /></Page>}
            />
            <Route
              path="/properties/:id/reports"
              element={<Page title="Inventory Reports"><InventoryReports /></Page>}
            />
            <Route
              path="/properties/:id/rooms"
              element={<Page title="Rooms"><Rooms /></Page>}
            />
            <Route
              path="/properties/:id/add-room"
              element={<Page title="Add New Room"><AddRoom /></Page>}
            />
            <Route
              path="/properties/:id/rooms/:roomId/dashboard"
              element={<Page title="Room Dashboard"><RoomDashboard /></Page>}
            />
            <Route
              path="/properties/:id/rooms/:roomId/inventory"
              element={<Page title="Inventory Lists"><RoomInventoryLists /></Page>}
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
              path="/properties/:id/rooms/:roomId/photos"
              element={<Page title="Room Photos"><RoomPhotos /></Page>}
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
              path="/settings"
              element={<Page title="Settings"><Settings /></Page>}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}