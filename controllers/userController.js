const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

// user sign up post
exports.user_signup_post = [
    // validate the req.body.displayName
    body("displayName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must enter a display name")
        // check if the display name has been taken or is in use
        .custom(async (value, { req, res }) => {
            const userExists = await User.findOne({
                displayName: value,
            }).exec();
            if (userExists) {
                throw new Error("The display name has already been taken");
            }
        }),
    // validate req.body.email
    body("email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must enter a username")
        // check if the email has already been used to register an account
        .custom(async (value, { req, res }) => {
            const userExists = await User.findOne({
                email: value,
            }).exec();
            if (userExists) {
                throw new Error("The email address has already been used");
            }
        }),
    // validate req.body.password
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must enter a password")
        .isLength({ min: 8 })
        .withMessage("Your password must be at least 8 characters long"),
    // validate req.body.confirmPassword
    body("confirmPassword")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must confirm the password")
        .isLength({ min: 8 })
        .withMessage("Your password must be at least 8 characters long")
        // custom validator to compare the password and confirm password fields
        .custom(async (value, { req, res }) => {
            await req.body.password;
            if (req.body.password != value) {
                throw new Error("The passwords do not match");
            }
        }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                throw new Error(err);
            } else {
                const user = new User({
                    displayName: req.body.displayName,
                    email: req.body.email,
                    password: hashedPassword,
                });

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        errors: errors.array({ onlyFirstError: true }),
                    });
                } else {
                    await user.save();
                    return res.status(201).json({
                        success: true,
                        message: "Sign up was successful",
                    });
                }
            }
        });
    }),
];
