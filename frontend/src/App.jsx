import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyPets from "./pages/MyPets";
import MyAppointments from "./pages/MyAppointments";

import Dashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments"; 
import Customers from "./pages/admin/Customers";
import Services from "./pages/admin/Services";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/pets" element={<MyPets />} />
        <Route path="/appointments" element={<MyAppointments />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/services" element={<Services />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;