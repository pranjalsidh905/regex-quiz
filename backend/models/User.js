// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    quizScores: [
      {
        quiz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "quiz",
        },
        score: Number,
        // You can add more fields related to quiz results here if needed
      },
    ],
  },
  { timestamps: true }
);

// Hash the user's password before saving it to the database
// userSchema.pre("save", async function (next) {
//   const user = this;

//   // Only hash the password if it has been modified or is new
//   if (!user.isModified("password")) return next();

//   try {
//     // Generate a salt
//     const salt = await bcrypt.genSalt(10);

//     // Hash the password using the salt
//     const hashedPassword = await bcrypt.hash(user.password, salt);

//     // Replace the plain password with the hashed one
//     user.password = hashedPassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      isAdmin: this.isAdmin,
    },
    "Pranjalsidh123",
    { expiresIn: "7d" } // Adjust the expiration time as needed
  );
};
const User = mongoose.model("User", userSchema);

module.exports = User;
