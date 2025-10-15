require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const router = require("./Routes/index");

app.use(express.json());
app.use(cors());

// routes
app.use("/api", router);

app.listen(PORT, (req, res) => {
    console.log(`Your awesome server is running on port ${PORT}`);
});

// Mongoose 8: strictQuery is true by default, useNewUrlParser and useUnifiedTopology are no longer needed
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to your amazing database!");
    })
    .catch((error) => {
        console.log("MongoDB error: ", error.message);
    });
