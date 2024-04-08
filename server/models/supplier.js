import mongoose from 'mongoose';


const SupplierSchema = mongoose.Schema({
    name: { type: String, required: true },
    Items: { type: Array, required: true },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png',
        required: false
    },
}, { timestamps: true });


export default mongoose.model('Supplier', SupplierSchema);