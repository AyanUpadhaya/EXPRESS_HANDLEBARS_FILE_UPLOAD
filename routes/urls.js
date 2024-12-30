const router = require("express").Router();
const multiparty = require("multiparty");
// const multer = require("multer");
// const fileUpload = multer({ dest: "uploads/" });
const {
  aboutView,
  homeView,
  notFound,
  upload,
  thnakYouView,
  api,
  login,
  register,
  processUpload,
} = require("../controllers/viewControllers");
const isAuthenticated = require("../middlwares/isAuthenticated");

router.get("/", homeView);
router.get("/about", aboutView);
router.get("/thank-you", thnakYouView);
router.get("/login", login);

router.route("/login").get(login).post(login);
router.route("/register").get(register).post(register);
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get("/upload", isAuthenticated, upload);
router.get("*", notFound);

//uploads processing routes

router.post("/api/upload/:year/:month", (req, res) => {
  const options = {
    autoFiles: true,
    uploadDir: "uploads/",
  };
  const form = new multiparty.Form(options);
  form.parse(req, (err, fields, files) => {
    if (err) return new Error("Error handling in post image");
    api.sendFilesCommon(req, res, fields, files);
  });
});
router.post("/api/sendfilesfetch", processUpload);



module.exports = router;
