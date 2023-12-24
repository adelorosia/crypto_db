import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profile_photo: {
      type: String,
      default:
        "https://res.cloudinary.com/ddruqkbvb/image/upload/v1702504687/ujzsldxkoup07e6el2x1.webp",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.isPasswordMatched=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model("User", userSchema);
export default User;
