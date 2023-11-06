const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const passport = require("passport");

// user login get
exports.user_login_get = [
    body("email").trim().escape().notEmpty(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
    }),
];

// demo user login get
exports.user_demo_login_get = asyncHandler((req, res, next) => {});

// passport logout get
exports.user_logout_get = asyncHandler((req, res, next) => {});
