const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('crypto');
const {createTokenforUser,validateToken} = require('../Services/authentication');
const { render } = require("ejs");

// schema/table for mongo DB
const userSchema = new Schema(
    {
        fullname: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        salt: {
            type: String
        }
        ,
        password: {
            type: String,
            require: true,
            unique: true
        },
        profileImage: {
            type: String,
            default: "/images/default.png"
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        }
    }, { timestamps: true }
);


userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;

    //this is used to generate a random 16 character and stored in salt
    const salt = randomBytes(16).toString();

    //used to hash the passoird using creatmac 
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
});


//_______________________________________________________________________________________________________________
// to match user id and password!
// we created a virtual functon on mongoDB
// using static()
//which takes two arguments static("function_name","function_returning_creds")
userSchema.static("matchpasswordandgeneratetoken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found");

    //trying to find the match password 
    const salt = user.salt;
    const hashedPassword = user.password;
    const userprovidedhash = createHmac('sha256', salt).update(password).digest('hex');

    if (hashedPassword !== userprovidedhash) throw new Error("Incorrect password");
    const token = createTokenforUser(user);
    return token;

})


//creating model
const User = model('user', userSchema);

module.exports = User;