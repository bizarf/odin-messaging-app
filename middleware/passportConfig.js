const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// user model
const User = require("../models/user");

// passport localstrategy
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        // password input matches the one in the database
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                });
            } catch (err) {
                done(err);
            }
        }
    )
);

// this function determines what information is stored in the session. for here, the user's id will be stored
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// this retrieves user data from session by running a database lookup
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
