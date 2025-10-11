import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Page from "./components/Page";

import Properties from "./pages/Properties";
import PropertyDashboard from "./pages/PropertyDashboard";
import InventoryReports from "./pages/InventoryReports";
import Rooms from "./pages/Rooms";
import RoomInventory from "./pages/RoomInventory";
import RoomPhotos from "./pages/RoomPhotos";
import AddPhotos from "./pages/AddPhotos";
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
              path="/properties/:id/dashboard"
              element={<Page title="Property Dashboard"><PropertyDashboard /></Page>}
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
              path="/properties/:id/rooms/:roomId/inventory"
              element={<Page title="Room Inventory"><RoomInventory /></Page>}
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
