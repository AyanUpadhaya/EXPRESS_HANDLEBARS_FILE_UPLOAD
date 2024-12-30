require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const urls = require("./routes/urls");
const port = process.env.PORT || 5000;

const app = express();
// Set up session middleware
app.use(
  session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  })
);

//app config
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//handlebars setting

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index",
    layoutDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    helpers: {
      matchRequestUri(sentUrl, fullUrl) {
        return sentUrl === fullUrl;
      },
    },
  })
);
// set user value globally accessible
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // If no user, set to null
  next();
});
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(urls);
app.use((error, req, res, next) => res.status(500).render("500"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server is running on port:${port}`);
    });
  })
  .catch((err) => {
    console.log("Falied to connect database ", err);
    process.exit(1);
  });
