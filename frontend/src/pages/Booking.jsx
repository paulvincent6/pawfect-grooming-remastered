import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Booking() {
  const navigate = useNavigate();

  // =========================================
  // DATA FROM DATABASE
  // =========================================
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);


  // =========================================
  // BOOKING FORM DATA
  // =========================================
  const [formData, setFormData] = useState({
    pet_id: "",
    service_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const [message, setMessage] = useState("");


  // =========================================
  // GET LOGGED-IN USER TOKEN
  // =========================================
  const token = localStorage.getItem("token");


  // =========================================
  // LOAD USER'S PETS AND AVAILABLE SERVICES
  // =========================================
  useEffect(() => {
    if (!token) {
      setMessage("Please login before booking an appointment.");
      return;
    }


    // -----------------------------------------
    // GET LOGGED-IN USER'S PETS
    // -----------------------------------------
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


    // -----------------------------------------
    // GET ACTIVE GROOMING SERVICES
    // -----------------------------------------
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


  // =========================================
  // UPDATE FORM WHEN USER TYPES OR SELECTS
  // =========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =========================================
  // SUBMIT BOOKING
  // =========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // User must be logged in
    if (!token) {
      setMessage("Please login before booking an appointment.");
      return;
    }

    try {

      // Send appointment information to backend
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

      // Display backend response
      setMessage(data.message);


      // If booking was successful
      if (response.ok) {

        // Clear booking form
        setFormData({
          pet_id: "",
          service_id: "",
          appointment_date: "",
          appointment_time: "",
          notes: "",
        });

        // Redirect to My Appointments
        navigate("/appointments");
      }

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  };


  // =========================================
  // BOOKING PAGE
  // =========================================
  return (
    <>
      <Navbar />

      <main>
        <h1>Book Appointment</h1>

        <form onSubmit={handleSubmit}>


          {/* ===================================
              PET SELECTION
              =================================== */}
          <div>
            <label>Pet</label>
            <br />

            <select
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


          {/* =========================================
                  SERVICE SELECTION
              ========================================= */}
              <div>
                <label>Service</label>
                <br />

                <select
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


          {/* ===================================
              APPOINTMENT DATE
              =================================== */}
          <div>
            <label>Appointment Date</label>
            <br />

            <input
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
          </div>


          {/* ==========================================
                  APPOINTMENT TIME
                  Available every hour during working hours
              ========================================== */}
              <div>
                <label>Appointment Time</label>
                <br />

                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Appointment Time</option>

                  <option value="09:00:00">9:00 AM</option>
                  <option value="10:00:00">10:00 AM</option>
                  <option value="11:00:00">11:00 AM</option>
                  <option value="12:00:00">12:00 PM</option>
                  <option value="13:00:00">1:00 PM</option>
                  <option value="14:00:00">2:00 PM</option>
                  <option value="15:00:00">3:00 PM</option>
                  <option value="16:00:00">4:00 PM</option>
                  <option value="17:00:00">5:00 PM</option>
                </select>
              </div>


          {/* ===================================
              OPTIONAL NOTES
              =================================== */}
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

          <br />


          {/* ===================================
              SUBMIT BOOKING
              =================================== */}
          <button type="submit">
            Book Appointment
          </button>

        </form>


        {/* DISPLAY SUCCESS OR ERROR MESSAGE */}
        {message && <p>{message}</p>}


        {/* WARN USER IF THEY HAVE NO PETS */}
        {pets.length === 0 && token && (
          <p>
            You don't have any pets yet. Add a pet before booking.
          </p>
        )}

      </main>
    </>
  );
}

export default Booking;