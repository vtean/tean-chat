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
mongoose
    .set("strictQuery", true)
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to your amazing database!");
    })
    .catch((error) => {
        console.log("MongoDB error: ", error.message);
    });
