import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const userInfoSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    accountNumber: { type: String, unique: true, required: true },
    emailAddress: { type: String, required: true },
    registrationNumber: { type: String, unique: true, required: true }
});

userInfoSchema.plugin(uniqueValidator, { message: '{PATH} sudah tersedia.' });

userInfoSchema.index({ accountNumber: 1 });
userInfoSchema.index({ registrationNumber: 1 });

export default mongoose.model('UserInfo', userInfoSchema);