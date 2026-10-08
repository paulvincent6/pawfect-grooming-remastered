
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();

  // DATABASE DATA
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);

  // BOOKING FORM
  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // LOAD PETS AND SERVICES
  useEffect(() => {
    if (!token) {
      setMessage("Please login before booking an appointment.");
      return;
    }

    fetch("http://localhost:5000/api/pets/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPets(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load pets:", error);
      });

    fetch("http://localhost:5000/api/services")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load services:", error);
      });
  }, [token]);

  // UPDATE FORM
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT BOOKING
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login before booking an appointment.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setFormData({
          pet_id: "",
          service_id: "",
          appointment_date: "",
          appointment_time: "",
          notes: "",
        });

        navigate("/appointments");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="booking-page">
        {/* TEAL HEADER */}
        <section className="booking-hero">
          <h1>Book an Appointment</h1>
          <p>Quick, easy, and your pet will thank you</p>
        </section>

        {/* BOOKING FORM */}
        <section className="booking-content">
          <div className="booking-form-container">
            <h2>Schedule Your Pet's Grooming</h2>

            <form
              className="booking-form"
              onSubmit={handleSubmit}
            >
              {/* PET SELECTION */}
              <div>
                <label htmlFor="booking-pet">
                  Your Pet
                </label>

                <select
                  id="booking-pet"
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your Pet</option>

                  {pets.map((pet) => (
                    <option
                      key={pet.pet_id}
                      value={pet.pet_id}
                    >
                      {pet.name} - {pet.pet_type}
                    </option>
                  ))}
                </select>
              </div>

              {/* SERVICE SELECTION */}
              <div>
                <label htmlFor="booking-service">
                  Grooming Service
                </label>

                <select
                  id="booking-service"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service</option>

                  {services.map((service) => (
                    <option
                      key={service.service_id}
                      value={service.service_id}
                    >
                      {service.name} - ₱{service.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* APPOINTMENT DATE */}
              <div>
                <label htmlFor="booking-date">
                  Appointment Date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* APPOINTMENT TIME */}
              <div>
                <label htmlFor="booking-time">
                  Appointment Time
                </label>

                <select
                  id="booking-time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Appointment Time
                  </option>

                  <option value="09:00:00">
                    9:00 AM
                  </option>

                  <option value="10:00:00">
                    10:00 AM
                  </option>

                  <option value="11:00:00">
                    11:00 AM
                  </option>

                  <option value="12:00:00">
                    12:00 PM
                  </option>

                  <option value="13:00:00">
                    1:00 PM
                  </option>

                  <option value="14:00:00">
                    2:00 PM
                  </option>

                  <option value="15:00:00">
                    3:00 PM
                  </option>

                  <option value="16:00:00">
                    4:00 PM
                  </option>

                  <option value="17:00:00">
                    5:00 PM
                  </option>
                </select>
              </div>

              {/* OPTIONAL NOTES */}
              <div>
                <label htmlFor="booking-notes">
                  Notes (Optional)
                </label>

                <textarea
                  id="booking-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for your pet..."
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !token || pets.length === 0}
              >
                {loading
                  ? "Booking Appointment..."
                  : "Book Appointment"}
              </button>
            </form>

            {/* MESSAGES */}
            {message && (
              <p className="booking-notice" role="status">
                {message}
              </p>
            )}

            {/* NO PETS WARNING */}
            {pets.length === 0 && token && (
              <p className="booking-notice">
                You don't have any pets yet.
                Add a pet before booking.
              </p>
            )}
          </div>
        </section>
        
      </main>

      <Footer />
    </>

    
  );


}

export default Booking;
