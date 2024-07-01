import mongoose from 'mongoose';

const OrderdItemsSchema = mongoose.Schema({
    orderName: { type: String, required: true },
    priceVal: { type: Number, required: true },
    priceUnit: { type: String, required: true },
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/dezifvepx/image/upload/v1712836597/restro-website/salad.png',
        required: false
    },
    description: { type: String, required: false },
    isFavorite: { type: Boolean, default: false },
    isDrink: { type: Boolean, default: false },
}
, { timestamps: true }
)

export default mongoose.model('OrderdItems', OrderdItemsSchema)