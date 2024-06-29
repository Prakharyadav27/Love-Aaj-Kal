const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./model/member");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const reportModel = require("./model/report");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", async (req, res) => {
  let users = await userModel.find();

  res.render("home", { users });
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  bcrypt.compare(password, user.password, async (err, result) => {
    if (err || !result) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    let token = jwt.sign({ id: user._id, email: user.email }, "secret key");
    res.cookie("token", token);

    let users = await userModel.find();

    res.render("home", { users });
  });
});

app.post("/register", async (req, res) => {
  let { name, email, username, password } = req.body;

  let existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }

      let user = await userModel.create({
        name,
        email,
        username,
        consent: true,
        password: hash,
      });

      let token = jwt.sign({ id: user._id, email: user.email }, "secret key");
      res.cookie("token", token);
      res.render("userprofile", { user });
    });
  });
});

app.get("/userprofile", isLoggedIn, (req, res) => {
  res.render("userprofile", { user: req.user });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.post("/update", isLoggedIn, async (req, res) => {
  let { location, bio, age, DOB, education, job, height, photo, preference } =
    req.body;
  let user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      location,
      bio,
      age,
      DOB,
      education,
      job,
      height,
      photo,
      preference,
    },
    { new: true }
  );

  let users = await userModel.find();

  res.render("home", { users });
});

app.post("/like/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.likes.push(req.user._id);
  await user.save();
  let users = await userModel.find();

  res.render("home", { users });
});

function isLoggedIn(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "secret key", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  });
}

app.get("/report/:id", async function (req, res) {
  let user = await userModel.findById(req.params.id);
  // console.log(user);
  res.render("report", { user });
});

app.post("/report", async function (req, res) {
  let { reporter, reportermail, culprit, issue } = req.body;
  console.log(req.body);
  // console.log(culprit + " " + issue);
  let report = await reportModel.create({
    reporter,
    reportermail,
    email: culprit,
    issue,
  });
  res
    .status(200)
    .send(" Thank you for reporting the issue. We will look into it.");
});

app.get("/view/:id", function (req, res) {
  let user = userModel.findById(req.params.id);
  res.render("view", { user });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
