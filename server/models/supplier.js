import mongoose from 'mongoose';

const SupplierSchema = mongoose.Schema({
    name: { type: String, required: true },
    Items: { type: Array, required: true },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png',
        required: false
    },
    countryCode: { type: String, required: false },
    phone:{type:String,required:false},
    email:{type:String,required:false},
    location:{type:String,required:false},
}, { timestamps: true });


export default mongoose.model('Supplier', SupplierSchema);