const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  //now we are hashing the password using salt
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    default: '/images/user.jpg',
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  }
}, { timestamps: true });

//now we are trying to hash the function

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified("password"))
    return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password).digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();

})
//checking the password which has been entered by the user 

userSchema.static("matchPasswordAndGnerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedhash = createHmac("sha256", salt).update(password).digest("hex");
  if (hashedPassword !== userProvidedhash) {
    throw new Error("Incorrect password");
  }
  const token = createTokenForUser(user);
  return token;
});


const User = model('user', userSchema);
module.exports = User;