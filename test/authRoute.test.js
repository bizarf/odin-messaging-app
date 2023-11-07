const supertest = require("supertest");
const authRoute = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const express = require("express");
const app = express();
const request = supertest(app);
const session = require("express-session");
const passport = require("passport");
const { expect } = require("chai");
require("dotenv").config();
const {
    connectToDatabase,
    disconnectDatabase,
} = require("../middleware/mongoConfig");
require("../middleware/passportConfig");
const User = require("../models/user");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

describe("auth route tests", () => {
    before(async () => {
        await disconnectDatabase();
        process.env.NODE_ENV = "test";
        await connectToDatabase();

        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Ronald McDonald",
                email: "ronald@mcdonald.com",
                password: "bigmac99",
                confirmPassword: "bigmac99",
            })
            .expect(201);

        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Demo",
                email: process.env.DEMO_USER,
                password: process.env.DEMO_PASSWORD,
                confirmPassword: process.env.DEMO_PASSWORD,
            })
            .expect(201);
    });

    after(async () => {
        await disconnectDatabase();
    });

    it("user fails to login due to not entering any details", async () => {
        await request
            .post("/api/auth/login")
            .send({
                email: "",
                password: "",
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(2);
            });
    });

    it("user fails to login due to not entering an email address", async () => {
        await request
            .post("/api/auth/login")
            .send({
                email: "",
                password: "bigmac99",
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
            });
    });

    it("user fails to login due to not entering a password", async () => {
        await request
            .post("/api/auth/login")
            .send({
                email: "ronald@mcdonald.com",
                password: "",
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
            });
    });

    it("user fails to login due to the email address not being in the database", async () => {
        await request
            .post("/api/auth/login")
            .send({
                email: "hamburgler@mcdonald.com",
                password: "hamhamham25",
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
            });
    });
});

describe("successful log in tests", () => {
    before(async () => {
        await disconnectDatabase();
        process.env.NODE_ENV = "test";
        await connectToDatabase();
    });

    after(async () => {
        await disconnectDatabase();
    });

    it("user successfully logs in", async () => {
        await request
            .post("/api/auth/login")
            .send({
                email: "ronald@mcdonald.com",
                password: "bigmac99",
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.be.a("string");
                expect(res.body.message).to.equal("User logged in");
            });
    });

    it("demo user logs in", async () => {
        await request
            .post("/api/auth/demo-login")
            .expect(200)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.be.a("string");
                expect(res.body.message).to.equal("User logged in");
            });
    });
});

describe("successful log in tests", () => {
    before(async () => {
        await disconnectDatabase();
        process.env.NODE_ENV = "test";
        await connectToDatabase();
    });

    after(async () => {
        await disconnectDatabase();
    });

    it("user logs out", async () => {
        await request
            .post("/api/auth/demo-login")
            .expect(200)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.be.a("string");
                expect(res.body.message).to.equal("User logged in");
            });

        await request
            .get("/api/auth/logout")
            .expect(200)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.be.a("string");
                expect(res.body.message).to.equal("Logged out");
            });
    });
});
