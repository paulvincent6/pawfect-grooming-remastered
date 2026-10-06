const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      password,
      confirm_password,
    } = req.body;

    // Check required fields
    if (
      !full_name ||
      !email ||
      !phone ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Check if email already exists
    db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error("Database error:", error);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email is already registered.",
          });
        }

        try {
          // Hash password
          const hashedPassword = await bcrypt.hash(
            password,
            10
          );

          // Create user
          db.query(
            `INSERT INTO users
            (name, email, phone, password_hash)
            VALUES (?, ?, ?, ?)`,
            [
              full_name,
              email,
              phone,
              hashedPassword,
            ],
            (error) => {
              if (error) {
                console.error(
                  "Registration error:",
                  error
                );

                return res.status(500).json({
                  message: "Failed to create account.",
                });
              }

              return res.status(201).json({
                message: "Registration successful!",
              });
            }
          );
        } catch (error) {
          console.error(
            "Password hashing error:",
            error
          );

          return res.status(500).json({
            message: "Server error.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Registration server error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};


// ==========================================
// LOGIN
// ==========================================
const login = (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  // Find user by email
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error("Login database error:", error);

        return res.status(500).json({
          message: "Database error.",
        });
      }

      // User does not exist
      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const user = results[0];

      try {
        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordMatch) {
          return res.status(401).json({
            message: "Invalid email or password.",
          });
        }

        // Create JWT
        const token = jwt.sign(
          {
            id: user.user_id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        // Send login information
        return res.status(200).json({
          message: "Login successful!",

          token,

          user: {
            id: user.user_id,
            full_name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        console.error(
          "Login authentication error:",
          error
        );

        return res.status(500).json({
          message: "Server error.",
        });
      }
    }
  );
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
  register,
  login,
};