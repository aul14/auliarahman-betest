import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    accountId: { type: String, unique: true, required: true },
    lastLoginDateTime: { type: Date },
    userId: { type: String }
});

accountSchema.index({ lastLoginDateTime: 1 });

const Account = mongoose.model('Account', accountSchema);
export default Account;
