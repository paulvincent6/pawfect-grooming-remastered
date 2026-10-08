const db = require("../config/database");

// GET SETTINGS
const getSettings = (req, res) => {
  db.query(
    "SELECT * FROM settings LIMIT 1",
    (error, results) => {
      if (error) {
        console.error("Get settings error:", error);

        return res.status(500).json({
          message: "Failed to retrieve settings.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Settings not found.",
        });
      }

      return res.status(200).json(results[0]);
    }
  );
};


// UPDATE CONTACT INFORMATION
const updateSettings = (req, res) => {
  const {
    business_phone,
    email,
    address,
  } = req.body;

  if (!business_phone || !email || !address) {
    return res.status(400).json({
      message: "Please complete all contact information.",
    });
  }

  db.query(
    `UPDATE settings
     SET business_phone = ?,
         email = ?,
         address = ?
     WHERE setting_id = 1`,
    [
      business_phone,
      email,
      address,
    ],
    (error, result) => {
      if (error) {
        console.error("Update settings error:", error);

        return res.status(500).json({
          message: "Failed to update settings.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Settings not found.",
        });
      }

      return res.status(200).json({
        message: "Settings updated successfully!",
      });
    }
  );
};


module.exports = {
  getSettings,
  updateSettings,
};