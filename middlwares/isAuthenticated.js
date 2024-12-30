const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // User is logged in
    next();
  } else {
    // Redirect to login if not authenticated
    res.redirect("/login");
  }
};


module.exports = isAuthenticated;