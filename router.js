var express = require("express");
// const nocache = require("nocache");
var router = express.Router();

const nocache = require("nocache");

app = express();

router.use(nocache());

const credential = {
  email: "admin@gmail.com",
  password: "admin123",
};

//login-user
router.post("/login", (req, res) => {
  if (
    req.body.email === credential.email &&
    req.body.password === credential.password
  ) {
    req.session.user = credential;
    res.redirect("/mydashboard");
  } else {
    res.render("base", { logout: "Invalid Email or Password" });
  }
});
router.get("/mydashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: "admin@gmail.com" });
  } else {
    res.render("base");
  }
});

//route for logout

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.render("base", { title: "express", logout: "logout successfull" });
});

module.exports = router;
