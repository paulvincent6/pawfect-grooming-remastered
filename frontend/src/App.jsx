import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyPets from "./pages/MyPets";
import MyAppointments from "./pages/MyAppointments";

// ADMIN
import Dashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import Reviews from "./pages/admin/Review";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/pets" element={<MyPets />} />
        <Route path="/appointments" element={<MyAppointments />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />} />

        <Route path="/admin/appointments" element={<AdminAppointments />} />

        <Route path="/admin/reviews" element={<Reviews />} />

        <Route path="/admin/settings" element={<Settings />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;