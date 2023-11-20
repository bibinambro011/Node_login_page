const express = require("express");
// const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require("./allRouters/router");
const adminrouter = require("./allRouters/adminrouter");

const PORT = 9000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
//load static assets
app.use("/static", express.static("./public"));
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialise: false,
  })
);
app.use("/", router);
app.use("/", adminrouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
