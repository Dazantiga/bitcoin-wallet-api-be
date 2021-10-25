const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", require("./src/routes/auth"));
app.use("/dashboard", require("./src/routes/dashboard"));
app.use("/transactions", require("./src/routes/transactions"));

app.listen(9009, () => {
  console.log("Server running on port 9009");
});
