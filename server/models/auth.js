import mongoose from "mongoose"

const authSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },    
    password : { type: String, required: true },
    profile_picture: { type: String, required: false },
}
, { timestamps: true });

export default mongoose.model('Auth', authSchema)