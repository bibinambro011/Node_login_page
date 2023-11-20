var express = require("express");
const collection = require("../model/mongodb");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const adminrouter = express();

const nocache = require("nocache");
const data = {
  email: "admin@gmail.com",
  password: 123,
};

adminrouter.use(nocache());
adminrouter.set("views", "./views/admin");
adminrouter.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialise: false,
  })
);

adminrouter.get("/admin", (req, res) => {
  res.render("adminlogin", { tit: "login page" });
});
adminrouter.post("/adminlog", async (req, res) => {
  const users = await collection.find({});
  if (req.body.email == data.email && req.body.password == data.password) {
    req.session.user = req.body.email;
    res.render("home", { users });
  } else {
    res.redirect("/admin");
  }
});
adminrouter.post("/adminsignup", async (req, res) => {
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
      name: "email required",last:"last name necesasry",password:"password requires",first:"first name required",
    });
  } else {
    await collection.insertMany(data);
    const users = await collection.find({});
    res.render("home", { users });
  }
});

adminrouter.get("/admin/delete-user", async (req, res) => {
  try {
    const id = req.query.id;

    await collection.deleteOne({ _id: id });

    res.redirect("/adminhome");
  } catch (err) {
    console.log(err);
  }
});

adminrouter.get("/adminhome", async (req, res) => {
  const users = await collection.find({});

  res.render("home", { users });
});
adminrouter.get("/admin/new-user", (req, res) => {
  res.redirect("/new-usersignup");
});
adminrouter.get("/new-usersignup", (req, res) => {
  res.render("signup");
});
let editid;
adminrouter.get("/admin/edit-user", async (req, res) => {
  const id = req.query.id;
  editid = id;
  const data = await collection.findOne({ _id: id });
  res.render("editpage", { data });
});
adminrouter.post("/editeddetails", async (req, res) => {
  const data = await collection.updateOne(
    { _id: editid },
    {
      $set: {
        email: req.body.email,
        first: req.body.first,
        last: req.body.last,
        password: req.body.password,
      },
    }
  );
  const users = await collection.find({});
  res.render("home", { users });
});
adminrouter.post("/searchuser", async (req, res) => {
  const name = req.body.search;
  const regex = new RegExp(`^${name}`, "i");
  const users = await collection.find({ email: { $regex: regex } }).exec();
  res.render("home", { users });
});
adminrouter.get("/admin/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = adminrouter;
