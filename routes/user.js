const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//signup router
router
  .route("/signup")
  .get(userController.signupForm)
  .post(wrapAsync(userController.signup));

//login router
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.postLogin)
  );

router.get("/logout", userController.logout);

module.exports = router;
