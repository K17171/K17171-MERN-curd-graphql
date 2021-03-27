var express = require("express");
var mongoose = require("mongoose");
var dobyparser = require("body-parser");
var cors = require("cors");
var path = require("path");
const route = require("./route");
const bodyParser = require("body-parser");

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", route);
app.get("/", (req, res) => {
  res.send("hello");
});

mongoose.connect("mongodb://localhost:27017/my_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("connected",()=>{
    console.log("Database Connected!")
});

const port = 8000;
app.listen(port, () => {
  console.log("Server Start");
});
