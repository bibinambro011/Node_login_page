var express = require("express");
const collection = require("../model/mongodb");
var router = express();

const nocache = require("nocache");

router.use(nocache());
router.set("views", "./views/user");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/mydashboard");
  } else {
    res.render("base", { tit: "login page" });
  }
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

//login-user
router.post("/login", async (req, res) => {
  const data = await collection.findOne({ email: req.body.email });
  if (data) {
    if (req.body.email === data.email && req.body.password === data.password) {
      req.session.user = data;
      res.redirect("/mydashboard");
    } else {
      res.render("base", { logout: "Invalid Email or Password" });
    }
  } else {
    res.render("base", { logout: "Invalid Email or Password" });
  }
});
router.get("/mydashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user.email });
  } else {
    res.render("base");
  }
});

//router for signup

router.post("/signup", async (req, res) => {
  const data = {
    email: req.body.email,
    first: req.body.first,
    last: req.body.last,
    password: req.body.password,
  };
  const check = await collection.findOne({ email: req.body.email });
  if (check) {
    res.render("signup", { name: "name already exist" });
  } else if (
    req.body.first == "" ||
    req.body.last == "" ||
    req.body.password == ""
  ) {
    res.render("signup", {
      name: "every field is mandatory plz fil all the field",
    });
  } else {
    await collection.insertMany(data);

    res.render("base");
  }
});

//route for logout

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.render("base", { title: "express", logout: "logout successfull" });
});

module.exports = router;
