import mongoose from "mongoose"

const authSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },    
    password : { type: String, required: true },
    profile_picture: 
    {
        type: String,
        default: 'https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png',
        required: false
    },
    uniqueId: { type: String, required: true },
}
, { timestamps: true });

export default mongoose.model('Auth', authSchema)