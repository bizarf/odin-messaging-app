const supertest = require("supertest");
const userRoute = require("../routes/userRoute");
const express = require("express");
const app = express();
// const app = require("../app");
const request = supertest(app);
const { expect } = require("chai");
const {
    connectToDatabase,
    disconnectDatabase,
} = require("../middleware/mongoConfig");

app.use(express.json());
app.use("/api/user", userRoute);

describe("user sign up tests", () => {
    before(async () => {
        await disconnectDatabase();
        process.env.NODE_ENV = "test";
        await connectToDatabase();
    });

    after(async () => {
        await disconnectDatabase();
    });

    it("user fails to sign up due to not entering any details", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "",
                email: "",
                password: "",
                confirmPassword: "",
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(4);
            });
    });

    it("user fails to sign up due to one field being empty", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "",
                email: "ronald@mcdonalds.com",
                password: "bigmac99",
                confirmPassword: "bigmac99",
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
            });
    });

    it("user fails to sign up due to password mismatch", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Ronald McDonald",
                email: "ronald@mcdonalds.com",
                password: "bigmac99",
                confirmPassword: "bigmac",
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
            });
    });

    it("user successfully makes an account", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Ronald McDonald",
                email: "ronald@mcdonalds.com",
                password: "bigmac99",
                confirmPassword: "bigmac99",
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(true);
                expect(res.body.message).to.be.a("string");
                expect(res.body.message).to.equal("Sign up was successful");
            });
    });

    it("another user fails to sign up as the display name is already taken", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Ronald McDonald",
                email: "burger@king.com",
                password: "whooper45",
                confirmPassword: "whooper45",
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
                expect(res.body.errors[0].msg).to.equal(
                    "The display name has already been taken"
                );
            });
    });

    it("another user fails to sign up as the email has already been used", async () => {
        await request
            .post("/api/user/sign-up")
            .send({
                displayName: "Burger King",
                email: "ronald@mcdonalds.com",
                password: "whooper45",
                confirmPassword: "whooper45",
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.success).to.be.a("boolean");
                expect(res.body.success).to.equal(false);
                expect(res.body.errors).to.be.an("array");
                expect(res.body.errors.length).to.equal(1);
                expect(res.body.errors[0].msg).to.equal(
                    "The email address has already been used"
                );
            });
    });
});
