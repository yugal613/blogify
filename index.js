//importing module
const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require('./models/blog');



const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = package.env.PORT || 8000;
mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(e => { console.log("mongodb connected") });

// to set ejs as a enjine for html
app.set("view engine", "ejs");
app.set("Views", path.resolve("./views"));


//handling data of body form response
//via middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));



app.get("/", async (req, resp) => {
    const allblogs = await Blog.find({});
    resp.render("home", {
        user: req.user,
        blogs: allblogs,
    });
});

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

//listening on port 
app.listen(PORT, () => console.log(`Server Started at port:${PORT}`)); 