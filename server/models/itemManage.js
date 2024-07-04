import mongoose, { Schema } from "mongoose";

const itemManageMentSchema = mongoose.Schema({
    item_name: { type: String, required: true },
    item_unit: { type: String, required: true },
    available_quantity: { type: Number, required: true },
    minimum_quantity: { type: Number, required: true },
    // usage_rate_value: { type: Number, required: true },
    // usage_rate_unit: { type: String, required: true },
    bar_code: { type: String, required: true },
    existing_barcode_no : { type: String, required: false },
    expiry_date : { type: Date, required: false },
    created_by : { type: Schema.Types.ObjectId, ref: 'Auth', required: true }
}, { timestamps: true });


export default mongoose.model('ItemManagement', itemManageMentSchema)