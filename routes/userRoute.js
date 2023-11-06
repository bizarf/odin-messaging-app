const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// user sign up post route
router.post("/sign-up", userController.user_signup_post);

module.exports = router;
