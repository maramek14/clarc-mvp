import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Page from "./components/Page";
import LoadingSplash from "./components/LoadingSplash";


import Properties from "./pages/Properties";
import Activity from "./pages/Activity";
import AddProperty from "./pages/AddProperty";
import PropertyInformation from "./pages/PropertyInformation";
import PropertyDashboard from "./pages/PropertyDashboard";
import CreatePropertyReport from "./pages/CreatePropertyReport";
import ViewPropertyReport from "./pages/ViewPropertyReport";
import InventoryReports from "./pages/InventoryReports";
import AddRoom from "./pages/AddRoom";
import RoomInventory from "./pages/RoomInventory";
import CreateInventoryList from "./pages/CreateInventoryList";
import ViewInventoryList from "./pages/ViewInventoryList";
import AddPhotos from "./pages/AddPhotos";
import PhoneGallery from "./pages/PhoneGallery";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash after 200ms delay
    const showTimer = setTimeout(() => {
      setShowSplash(true);
    }, 1000);

    // Hide splash after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 200ms delay + 5000ms display

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (showSplash) {
    return <LoadingSplash />;
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/properties" replace />} />
            <Route
              path="/properties"
              element={<Page title="My Properties"><Properties /></Page>}
            />
            <Route
              path="/activity"
              element={<Page title="Activity"><Activity /></Page>}
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
              path="/properties/:id/inventory"
              element={<Page title="Property Inventory"><PropertyDashboard /></Page>}
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
            <Route
              path="/profile"
              element={<Page title="Profile"><Profile /></Page>}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}