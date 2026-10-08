require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const petRoutes = require("./routes/petRoutes");

const serviceRoutes = require("./routes/serviceRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const settingRoutes = require("./routes/settingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingRoutes);

app.get("/", (req, res) => {
  res.send("Pawfect Grooming API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});