import mongoose, { Schema } from "mongoose";

const itemManageMentSchema = mongoose.Schema({
    item_name: { type: String, required: true },
    item_unit: { type: String, required: true },
    available_quantity: { type: Number, required: true },
    minimum_quantity: { type: Number, required: true },
    usage_rate_value: { type: Number, required: true },
    usage_rate_unit: { type: String, required: true },
    bar_code: { type: String, required: true },
}, { timestamps: true });


export default mongoose.model('ItemManagement', itemManageMentSchema)