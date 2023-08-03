const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const route = require("./app/routers/index.router");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();
var cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = 5000;

route(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
