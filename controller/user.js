const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            else {
                req.flash("success", `${username} , Welcome to Stayz`);
                let redirectUrl = "/listings"
                res.redirect(redirectUrl);
            }
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req, res) => {
    res.render("users/signin.ejs");
}


module.exports.postLogin = async (req, res) => {
    req.flash("success", "Welcome back to Stayz !");

    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Logged out successfully ");
            res.redirect("/listings");
        }
    });
}