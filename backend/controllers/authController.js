const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { full_name, email, phone, password, confirm_password } = req.body;

    // Check required fields
    if (!full_name || !email || !phone || !password || !confirm_password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check passwords
    if (password !== confirm_password) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Check if email already exists
    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email is already registered.",
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.query(
          `INSERT INTO users
          (full_name, email, phone, password)
          VALUES (?, ?, ?, ?)`,
          [full_name, email, phone, hashedPassword],
          (error) => {
            if (error) {
              return res.status(500).json({
                message: "Failed to create account.",
              });
            }

            res.status(201).json({
              message: "Registration successful!",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.json({
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};

module.exports = {
  register,
  login,
};