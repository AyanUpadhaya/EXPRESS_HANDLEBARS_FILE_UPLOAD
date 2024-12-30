const { User, Post } = require("../models"); // Adjust path as needed

const multiparty = require("multiparty");

//index or home view
const homeView = async (req, res) => {
  const posts = await Post.find().lean(); // Convert documents to plain objects
  var fullUrl = req.originalUrl;
  res.render("home", {
    title: "Home",
    fullUrl: fullUrl,
    posts: posts,
  });
};

//about
const aboutView = (req, res) => {
  var fullUrl = req.originalUrl;
  res.render("about", {
    title: "About",
    fullUrl: fullUrl,
  });
};

//not found
const notFound = (req, res) => {
  var fullUrl = req.originalUrl;
  res.render("notfound", {
    title: "notfound",
    fullUrl: fullUrl,
  });
};

//upload
const upload = (req, res) => {
  var fullUrl = req.originalUrl;
  res.render("upload", {
    title: "Upload",
    fullUrl: fullUrl,
    year: "2024",
    month: "December",
  });
};

//thank you

const thnakYouView = (req, res) => {
  var fullUrl = req.originalUrl;
  res.render("thankyou", {
    title: "Thank you",
  });
};

//login render view

const login = async (req, res) => {
  var fullUrl = req.originalUrl;

  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate password
      const isMatch = await user.isPasswordValid(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }else{
         // If user is authenticated, set session and redirect
        req.session.user = user;
        return res.status(200).json({ message: "User loggedin successfully!" });
      }

    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }else{
    // Render login page for GET requests
    return res.render("login", {
      title: "Login",
      fullUrl: fullUrl,
    });
  }

  
};

//register render view

const register = async (req, res) => {
  var fullUrl = req.originalUrl;
  if (req.method == "POST") {
    try {
      const { fullName, email, password } = req.body;

      // Validate that all fields are present
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists!" });
      }

      // Create and save a new user
      const user = new User({ fullName, email, password });
      await user.save();

      res.status(200).json({ message: "User registered successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
  res.render("register", {
    title: "Register",
    fullUrl: fullUrl,
  });
};

//api
const extractFileData = (fields, files) => {
  if (!fields.title || !files.userFile) {
    throw new Error("Invalid input data");
  }

  const title = fields.title[0]; // Extract title
  const photoPath = files.userFile[0].path.replace(/\\/g, "/"); // Extract and format path

  return { title, photoUrl: photoPath };
};
const api = {
  sendFilesCommon: (req, res, fields, files) => {
    console.log("Fields: ", fields);
    console.log("Files: ", files);
    res.redirect(303, "/thank-you");
  },
  sendFilesFetch: async (req, res, fields, files) => {
    const result = extractFileData(fields, files);
    const { title, photoUrl } = result;
    console.log(result);
    if (!title || !photoUrl) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const post = new Post(result);
    await post.save();
    res.json({ success: true, post });
  },
};

const processUpload = async (req, res) => {
  const options = {
    autoFiles: true,
    uploadDir: "uploads/",
  };
  const form = new multiparty.Form(options);
  form.parse(req, (err, fields, files) => {
    if (err) return new Error("Error handling in post image");
    api.sendFilesFetch(req, res, fields, files);
  });
};

module.exports = {
  homeView,
  aboutView,
  notFound,
  upload,
  thnakYouView,
  api,
  login,
  register,
  processUpload,
};
