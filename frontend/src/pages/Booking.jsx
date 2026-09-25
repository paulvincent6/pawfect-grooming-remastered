import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Booking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "",
    service: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before booking an appointment.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // Send JWT to backend
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setFormData({
          pet_name: "",
          pet_type: "",
          service: "",
          appointment_date: "",
          appointment_time: "",
          notes: "",
        });

        // Go to My Appointments
        navigate("/appointments");
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <h1>Book Appointment</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Pet Name</label>
            <br />

            <input
              type="text"
              name="pet_name"
              value={formData.pet_name}
              onChange={handleChange}
              placeholder="Enter pet name"
            />
          </div>

          <div>
            <label>Pet Type</label>
            <br />

            <select
              name="pet_type"
              value={formData.pet_type}
              onChange={handleChange}
            >
              <option value="">Select Pet Type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>

          <div>
            <label>Service</label>
            <br />

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Select Service</option>
              <option value="Bath">Bath</option>
              <option value="Full Groom">Full Groom</option>
              <option value="Nail Trim">Nail Trim</option>
            </select>
          </div>

          <div>
            <label>Appointment Date</label>
            <br />

            <input
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Appointment Time</label>
            <br />

            <input
              type="time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Notes (Optional)</label>
            <br />

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special instructions"
            />
          </div>

          <button type="submit">
            Book Appointment
          </button>
        </form>

        {message && <p>{message}</p>}
      </main>
    </>
  );
}

export default Booking;