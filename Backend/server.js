const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();

//CORS
app.use(cors());

//INIT Middleware
app.use(morgan("dev"));
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api", require("./routes/api/auth"));
app.use("/api/channels", require("./routes/api/channels"));
app.use("/api/posts", require("./routes/api/posts"));

app.get("/", (req, res) => {
  res.send("API Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
