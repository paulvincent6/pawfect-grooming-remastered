import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyPets() {
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    pet_type: "",
    breed: "",
    sex: "",
    birth_day: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPets = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/pets/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPets(data);
      }
    } catch (error) {
      console.error("Failed to retrieve pets:", error);
    }
  };

  useEffect(() => {
    getPets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/pets",
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
          name: "",
          pet_type: "",
          breed: "",
          sex: "",
          birth_day: "",
          notes: "",
        });

        getPets();
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <h1>My Pets</h1>

        <h2>Add Pet</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Pet Name</label>
            <br />

            <input
              type="text"
              name="name"
              value={formData.name}
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
            <label>Breed</label>
            <br />

            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Enter breed"
            />
          </div>

          <div>
            <label>Sex</label>
            <br />

            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label>Birthday</label>
            <br />

            <input
              type="date"
              name="birth_day"
              value={formData.birth_day}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Notes</label>
            <br />

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes about your pet"
            />
          </div>

          <button type="submit">
            Add Pet
          </button>
        </form>

        {message && <p>{message}</p>}

        <hr />

        <h2>Your Pets</h2>

        {pets.length === 0 ? (
          <p>You have no pets added yet.</p>
        ) : (
          pets.map((pet) => (
            <div key={pet.pet_id}>
              <h3>{pet.name}</h3>

              <p>Type: {pet.pet_type}</p>
              <p>Breed: {pet.breed || "N/A"}</p>
              <p>Sex: {pet.sex || "N/A"}</p>

              <hr />
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default MyPets;