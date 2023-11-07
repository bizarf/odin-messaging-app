const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// user login get
router.post("/login", authController.user_login_post);

// demo user login get
router.post("/demo-login", authController.user_demo_login_post);

// logout get
router.get("/logout", authController.user_logout_get);

module.exports = router;
