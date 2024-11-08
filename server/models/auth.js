// import mongoose from "mongoose";

// // Define the schema for the authentication model
// const authSchema = new mongoose.Schema({
//     // User's name
//     name: { type: String, required: true },
//     // User's email
//     email: { type: String, required: true },
//     // User's password
//     password: { type: String, required: true },
//     // URL to the user's profile picture, with a default value
//     profile_picture: {
//         type: String,
//         default: 'https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png'
//     },
//     // Unique identifier for the user
//     uniqueId: { type: String, required: true },
//     // Role of the user, with possible values and a default value
//     role: { type: String, enum: ['admin', 'employee', 'deliveryBoy'], default: 'admin' }
// }, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// // Export the model based on the schema
// export default mongoose.model('Auth', authSchema);
