import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { RequestHandler } from "express";

// Define an interface for the User model
interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema ({
    fullName: {
        type: String,
        required: true,
        trim: true,
        // Only chars, and spaces
        match: [/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Ensures no duplicate emails
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password for login
userSchema.methods.matchPassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
};

// Export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;