const db = require("../config/database");

// ==========================================
// ADD PET
// ==========================================
const addPet = (req, res) => {
  const {
    name,
    pet_type,
    breed,
    sex,
    birth_day,
    notes,
  } = req.body;

  const userId = req.user.id;

  if (!name || !pet_type) {
    return res.status(400).json({
      message: "Pet name and pet type are required.",
    });
  }

  db.query(
    `INSERT INTO pets
    (user_id, name, pet_type, breed, sex, birth_day, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      name,
      pet_type,
      breed || null,
      sex || null,
      birth_day || null,
      notes || null,
    ],
    (error, result) => {
      if (error) {
        console.error("Add pet error:", error);

        return res.status(500).json({
          message: "Failed to add pet.",
        });
      }

      return res.status(201).json({
        message: "Pet added successfully!",
        petId: result.insertId,
      });
    }
  );
};


// ==========================================
// GET MY PETS
// ==========================================
const getMyPets = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT *
     FROM pets
     WHERE user_id = ?
     ORDER BY pet_id DESC`,
    [userId],
    (error, results) => {
      if (error) {
        console.error("Get pets error:", error);

        return res.status(500).json({
          message: "Failed to retrieve pets.",
        });
      }

      return res.status(200).json(results);
    }
  );
};


module.exports = {
  addPet,
  getMyPets,
};