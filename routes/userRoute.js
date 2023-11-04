const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// user sign up post route
router.post("/sign-up", userController.user_signup_post);

// user login get
router.get("/login", userController.user_login_get);

// demo user login get
router.get("/demo-login", userController.user_demo_login_get);

module.exports = router;
