import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authDelivSchema = new Schema({
    name: { type: String, required: true },
    country_code: { type: String, required: true },
    phone: { type: String, required: true },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    }
}, { timestamps: true });

export default model('AuthDeliv', authDelivSchema);