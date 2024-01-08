const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog")



// storage for multer/ saving file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/"));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });
router.get("/addnew", (req, resp) => {
    return resp.render("addBlog", {
        user: req.user,
    });
});

router.get("/:id", async (req, resp) => {
    const blog = await Blog.findById(req.params.id);
    return resp.render('blog', {
        user: req.user,
        blog,
    })
})

router.post("/", upload.single("coverImage"), async (req, resp) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `uploads/${req.file.filename}`,

    });
    return resp.redirect(`/blog/${blog._id}`);
});

module.exports = router;
