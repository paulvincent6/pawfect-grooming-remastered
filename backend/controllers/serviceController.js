const db = require("../config/database");

// GET ALL ACTIVE SERVICES
const getServices = (req, res) => {
  db.query(
    `SELECT service_id, name, description, price, duration
     FROM services
     WHERE status = 'active'
     ORDER BY name ASC`,
    (error, results) => {
      if (error) {
        console.error("Get services error:", error);

        return res.status(500).json({
          message: "Failed to retrieve services.",
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports = {
  getServices,
};