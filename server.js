const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (request, response) => {
  response.send({
    message: "Welcome Bitcoin api with node. Api version 1.0.0",
  });
});

app.use("/auth", require("./src/routes/auth"));
app.use("/dashboard", require("./src/routes/dashboard"));
app.use("/transactions", require("./src/routes/transactions"));

module.exports = app;
