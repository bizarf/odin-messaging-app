const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bycrpt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();

// user login get
exports.user_login_post = [
    body("email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must enter an email"),
    // .custom(async (value, { req, res }) => {
    //     const userExists = await User.findOne({ email: value }).exec();

    //     if (!userExists) {
    //         throw new Error("The email does not exist");
    //     }
    // }),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("You must enter a password")
        .isLength({ min: 8 })
        .withMessage("Your password must be at least 8 characters long"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({
                success: false,
                errors: errors.array({ onlyFirstError: true }),
            });
        } else {
            passport.authenticate("local", (err, user, info) => {
                if (err || !user) {
                    return res.status(401).json({
                        success: false,
                        errors: [{ msg: info.message }],
                    });
                } else {
                    req.login(user, (err) => {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.json({
                                success: true,
                                message: "User logged in",
                            });
                        }
                    });
                }
            })(req, res, next);
        }
    }),
];

// demo user login get
exports.user_demo_login_post = asyncHandler((req, res, next) => {
    req.body.email = process.env.DEMO_USER;
    req.body.password = process.env.DEMO_PASSWORD;

    passport.authenticate("local", (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                errors: [{ msg: info.message }],
            });
        } else {
            req.login(user, (err) => {
                if (err) {
                    return res.send(err);
                } else {
                    return res.json({
                        success: true,
                        message: "User logged in",
                    });
                }
            });
        }
    })(req, res, next);
});

// passport logout get
exports.user_logout_get = asyncHandler((req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            return res.json({ success: true, message: "Logged out" });
        }
    });
});
