const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get('/signin', (req, resp) => {
    return resp.render("signin");
});


router.get('/signup', (req, resp) => {
    return resp.render("signup");
})



//signin route
router.post("/signin", async (req, resp) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchpasswordandgeneratetoken(email, password);
        console.log("token is : ", token);
        return resp.cookie("token",token).redirect("/");
    } catch (error) {
        return resp.render('signin', {
            error: "Incorrect Email or password"
        })
    }
})


router.get('/logout',(req,resp)=>{
    resp.clearCookie("token").redirect("/");
})

//signup route
router.post("/signup", async (req, resp) => {
    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);
    await User.create({
        fullname, email, password
    });
    return resp.redirect("/");
});


module.exports = router;