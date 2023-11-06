const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// user login get
router.get("/login", authController.user_login_get);

// demo user login get
router.get("/demo-login", authController.user_demo_login_get);

// logout get
router.get("/logout", authController.user_logout_get);

module.exports = router;
