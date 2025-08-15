import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        otp: {
            type: String
        },
        otpExpired: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;