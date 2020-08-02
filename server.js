const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

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

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
