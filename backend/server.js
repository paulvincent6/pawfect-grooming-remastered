require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const petRoutes = require("./routes/petRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/pets", petRoutes);

app.get("/", (req, res) => {
  res.send("Pawfect Grooming API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});