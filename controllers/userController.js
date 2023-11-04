const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const passport = require("passport");

// user sign up post
exports.user_signup_post = [
    body("displayName", "You must enter a display name")
        .trim()
        .escape()
        .notEmpty(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
    }),
];

// user login get
exports.user_login_get = [
    body("email").trim().escape().notEmpty(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
    }),
];

// demo user login get
exports.user_demo_login_get = asyncHandler((req, res, next) => {});

//
