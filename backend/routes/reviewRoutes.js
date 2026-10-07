const express = require("express");

const {
  getAllReviews,
  createReview,
} = require("../controllers/reviewController");

const authenticateToken = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// CREATE REVIEW - CUSTOMER
router.post(
  "/",
  authenticateToken,
  createReview
);


// GET ALL REVIEWS
router.get(
  "/",
  authenticateToken,
  getAllReviews
);


module.exports = router;