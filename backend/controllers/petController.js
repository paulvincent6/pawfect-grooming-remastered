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


 // ==========================================
 // DELETE PET - CUSTOMER
 // ==========================================
 const deletePet = (req, res) => {
   const petId = req.params.id;
   const userId = req.user.id;

   if (!/^[1-9]\d*$/.test(String(petId))) {
     return res.status(400).json({
       message: "Invalid pet ID.",
     });
   }

   // Verify that the pet belongs to this customer
   db.query(
     "SELECT pet_id FROM pets WHERE pet_id = ? AND user_id = ?",
     [petId, userId],
     (checkError, petResults) => {
       if (checkError) {
         console.error("Check pet error:", checkError);
         return res.status(500).json({
           message: "Failed to verify pet.",
         });
       }

       if (petResults.length === 0) {
         return res.status(404).json({
           message: "Pet not found.",
         });
       }

       // Preserve appointment history
       db.query(
         "SELECT appointment_id FROM appointments WHERE pet_id = ? LIMIT 1",
         [petId],
         (appointmentError, appointmentResults) => {
           if (appointmentError) {
             console.error("Check pet appointments error:", appointmentError);
             return res.status(500).json({
               message: "Failed to verify pet appointments.",
             });
           }

           if (appointmentResults.length > 0) {
             return res.status(409).json({
               message:
                 "This pet cannot be deleted because it has appointment history.",
             });
           }

           // Delete only a pet owned by the logged-in customer
           db.query(
             "DELETE FROM pets WHERE pet_id = ? AND user_id = ?",
             [petId, userId],
             (deleteError, result) => {
               if (deleteError) {
                 console.error("Delete pet error:", deleteError);

                 if (deleteError.code === "ER_ROW_IS_REFERENCED_2") {
                   return res.status(409).json({
                     message:
                       "This pet is linked to existing records and cannot be deleted.",
                   });
                 }

                 return res.status(500).json({
                   message: "Failed to delete pet.",
                 });
               }

               if (result.affectedRows === 0) {
                 return res.status(404).json({
                   message: "Pet not found.",
                 });
               }

               return res.status(200).json({
                 message: "Pet deleted successfully!",
               });
             }
           );
         }
       );
     }
   );
 };

 // ==========================================
 // UPDATE PET - CUSTOMER
 // ==========================================
 const updatePet = (req, res) => {
   const petId = req.params.id;
   const userId = req.user.id;

   const {
     name,
     pet_type,
     breed,
     sex,
     birth_day,
     notes,
   } = req.body;

   if (!/^[1-9]\d*$/.test(String(petId))) {
     return res.status(400).json({
       message: "Invalid pet ID.",
     });
   }

   if (
     typeof name !== "string" ||
     !name.trim() ||
     !["Dog", "Cat"].includes(pet_type)
   ) {
     return res.status(400).json({
       message: "Valid pet name and pet type are required.",
     });
   }

   if (sex && !["Male", "Female"].includes(sex)) {
     return res.status(400).json({
       message: "Invalid pet sex.",
     });
   }

   db.query(
     `UPDATE pets
      SET name = ?,
          pet_type = ?,
          breed = ?,
          sex = ?,
          birth_day = ?,
          notes = ?
      WHERE pet_id = ? AND user_id = ?`,
     [
       name.trim(),
       pet_type,
       breed || null,
       sex || null,
       birth_day || null,
       notes || null,
       petId,
       userId,
     ],
     (error, result) => {
       if (error) {
         console.error("Update pet error:", error);

         return res.status(500).json({
           message: "Failed to update pet.",
         });
       }

       if (result.affectedRows === 0) {
         return res.status(404).json({
           message: "Pet not found.",
         });
       }

       return res.status(200).json({
         message: "Pet updated successfully!",
       });
     }
   );
 };

 



module.exports = {
  addPet,
  getMyPets,
  deletePet,
  updatePet,
};