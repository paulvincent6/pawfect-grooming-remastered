import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./mypets.css";

function MyPets() {
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [editingPetId, setEditingPetId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    pet_type: "",
    breed: "",
    sex: "",
    birth_day: "",
    notes: "",
  });

  // UPDATE FORM
  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // GET USER'S PETS
  const getPets = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

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

      if (response.ok && Array.isArray(data)) {
        setPets(data);
      } else {
        console.error("Failed to retrieve pets:", data);
      }
    } catch (error) {
      console.error("Failed to retrieve pets:", error);
    }
  };

  // LOAD PETS
  useEffect(() => {
    getPets();
  }, []);

  
const handleEditPet = (pet) => {
  const birthday = pet.birth_day
    ? String(pet.birth_day).slice(0, 10)
    : "";

  setEditingPetId(pet.pet_id);

  setFormData({
    name: pet.name || "",
    pet_type: pet.pet_type || "",
    breed: pet.breed || "",
    sex: pet.sex || "",
    birth_day: birthday,
    notes: pet.notes || "",
  });

  setMessage("");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleCancelEdit = () => {
  setEditingPetId(null);

  setFormData({
    name: "",
    pet_type: "",
    breed: "",
    sex: "",
    birth_day: "",
    notes: "",
  });

  setMessage("");
};


  // ADD PET
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("Please login before saving a pet.");
    return;
  }

  setLoading(true);
  setMessage("");

  const isEditing = editingPetId !== null;

  const url = isEditing
    ? `http://localhost:5000/api/pets/${editingPetId}`
    : "http://localhost:5000/api/pets";

  try {
    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    setMessage(
      data.message ||
        (response.ok
          ? "Pet saved successfully!"
          : "Failed to save pet.")
    );

    if (response.ok) {
      setEditingPetId(null);

      setFormData({
        name: "",
        pet_type: "",
        breed: "",
        sex: "",
        birth_day: "",
        notes: "",
      });

      await getPets();
    }
  } catch (error) {
    console.error("Save pet error:", error);
    setMessage("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
};

  
  // DELETE PET
  const handleDeletePet = async (petId, petName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${petName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before deleting a pet.");
      return;
    }

    setDeletingPetId(petId);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/pets/${petId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setMessage(
        data.message ||
          (response.ok
            ? "Pet deleted successfully!"
            : "Failed to delete pet.")
      );

      if (response.ok) {
        await getPets();
      }
    } catch (error) {
      console.error("Delete pet error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setDeletingPetId(null);
    }
  };


  // FORMAT BIRTHDAY
  const formatBirthday = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "N/A";
    }

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <>
      <Navbar />

      <main className="mypets-page">
        {/* HERO SECTION */}
        <section className="mypets-hero">
          <div className="mypets-hero-circle mypets-circle-left" />
          <div className="mypets-hero-circle mypets-circle-right" />

          <div className="mypets-hero-content">
            <span className="mypets-eyebrow">
              YOUR FURRY FAMILY
            </span>

            <h1>My Pets</h1>

            <p>
              Keep every pet's details in one happy place for
              quicker, more personalized grooming visits.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="mypets-content">
          <div className="mypets-layout">
            {/* LEFT: ADD PET */}
            <div className="mypets-add-card">
              <div className="mypets-card-heading">
                <div>
                  <span className="mypets-section-label mypets-pink">
                    NEW PROFILE
                  </span>
                  <h2>{editingPetId !== null ? "Edit Pet" : "Add a Pet"}</h2>
                </div>

                <div className="mypets-add-icon">
                  +
                </div>
              </div>

              <form
                className="mypets-form"
                onSubmit={handleSubmit}
              >
                {/* PET NAME */}
                <div className="mypets-field">
                  <label htmlFor="pet-name">
                    Pet Name <span>*</span>
                  </label>

                  <input
                    id="pet-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="What do you call your pet?"
                    required
                  />
                </div>

                {/* PET TYPE + SEX */}
                <div className="mypets-form-row">
                  <div className="mypets-field">
                    <label htmlFor="pet-type">
                      Pet Type <span>*</span>
                    </label>

                    <select
                      id="pet-type"
                      name="pet_type"
                      value={formData.pet_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select type
                      </option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                    </select>
                  </div>

                  <div className="mypets-field">
                    <label htmlFor="pet-sex">
                      Sex
                    </label>

                    <select
                      id="pet-sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select sex
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* BREED + BIRTHDAY */}
                <div className="mypets-form-row">
                  <div className="mypets-field">
                    <label htmlFor="pet-breed">
                      Breed
                    </label>

                    <input
                      id="pet-breed"
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      placeholder="e.g. Golden Retriever"
                    />
                  </div>

                  <div className="mypets-field">
                    <label htmlFor="pet-birthday">
                      Birthday
                    </label>

                    <input
                      id="pet-birthday"
                      type="date"
                      name="birth_day"
                      value={formData.birth_day}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* NOTES */}
                <div className="mypets-field">
                  <label htmlFor="pet-notes">
                    Notes
                  </label>

                  <textarea
                    id="pet-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Anything we should know about your pet?"
                    rows="4"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  className="mypets-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingPetId !== null
                    ? "Save Changes"
                    : "+ Add Pet"}
                </button>

                {editingPetId !== null && (
                  <button
                    type="button"
                    className="mypets-cancel-edit-btn"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel Editing
                  </button>
                )}
              </form>

              {message && (
                <p className="mypets-message" role="status">
                  {message}
                </p>
              )}
            </div>

            {/* RIGHT: PET PROFILES */}
            <div className="mypets-profiles">
              <div className="mypets-profiles-header">
                <div>
                  <span className="mypets-section-label mypets-teal">
                    PET PROFILES
                  </span>
                  <h2>Your Pets</h2>
                </div>

                <span className="mypets-count">
                  {pets.length} {pets.length === 1 ? "pet" : "pets"}
                </span>
              </div>

              {pets.length === 0 ? (
                <div className="mypets-empty">
                  <div className="mypets-empty-icon">
                    🐾
                  </div>
                  <h3>No pets yet!</h3>
                  <p>
                    Add your first furry friend using
                    the form on the left.
                  </p>
                </div>
              ) : (
                <div className="mypets-pet-list">
                  {pets.map((pet) => (
                    <article
                      className="mypets-pet-card"
                      key={pet.pet_id}
                    >
                      <div className="mypets-pet-main">
                        <div className="mypets-avatar">
                          {pet.name?.charAt(0).toUpperCase() || "🐾"}
                        </div>

                        <div className="mypets-pet-info">
                          <h3>{pet.name}</h3>
                          <p>
                            {pet.breed || "Unknown breed"}
                            {" · "}
                            {pet.pet_type}
                          </p>
                        </div>
                      </div>

                      <div className="mypets-pet-divider" />

                      <div className="mypets-pet-details">
                        <div>
                          <span>SEX</span>
                          <p>{pet.sex || "N/A"}</p>
                        </div>

                        <div>
                          <span>BIRTHDAY</span>
                          <p>{formatBirthday(pet.birth_day)}</p>
                        </div>
                      </div>

                      {pet.notes && (
                        <div className="mypets-pet-notes">
                          {pet.notes}
                        </div>
                      )}
                      
                      
                      <div className="mypets-pet-actions">
                        <button
                          type="button"
                          className="mypets-edit-btn"
                          onClick={() => handleEditPet(pet)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="mypets-delete-btn"
                          onClick={() => handleDeletePet(pet.pet_id, pet.name)}
                          disabled={deletingPetId === pet.pet_id}
                        >
                          {deletingPetId === pet.pet_id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MyPets;
