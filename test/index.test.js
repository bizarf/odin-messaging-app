const supertest = require("supertest");
const index = require("../routes/index");
const welcome = require("../routes/welcomeRoute");
const express = require("express");
const app = express();
const request = supertest(app);
app.use(express.json());
app.use("/", index);
app.use("/api", welcome);

describe("index route tests", () => {
    it("/ redirects to /api", (done) => {
        request
            .get("/")
            .expect("Content-Type", "text/plain; charset=utf-8")
            .expect("Location", "/api")
            .expect(302, done);
    });

    it("returns welcome message", (done) => {
        request
            .get("/api")
            .expect("Content-Type", /json/)
            .expect({ message: "Welcome to the API" })
            .expect(200, done);
    });
});
