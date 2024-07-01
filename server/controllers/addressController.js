import mongoose from "mongoose";
import Address from "../models/address.js";

export const postAddress = async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            paymentMethod,
            deliveryMethod,
            address,
            address2,
            city,
            state,
            zip,
            noteFromCustomer,
            created_by
        } = req.body;
        if (!name || !phoneNumber || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (!created_by) {
            return res.status(400).json({ success: false, message: "Session expired login again" })
        }
        else {
            const newAddress = await Address.create({
                name,
                phoneNumber,
                paymentMethod,
                deliveryMethod,
                address,
                address2,
                city,
                state,
                zip,
                noteFromCustomer,
                created_by
            });
            if (newAddress) {
                return res.status(201).json({ success: true, message: "Address Added", result: newAddress })
            } else {
                return res.status(500).json({ success: false, message: "Address not added" })
            }
        }
    } catch (err) {
        console.log("Error from Address Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getsingleAddress = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).json({ success: false, message: "Invalid Address ID" })
    try {
        const singleAddress = await Address.findById(_id);
        if (singleAddress) {
            return res.status(200).json({ success: true, message: "Single Address", result: singleAddress })
        } else {
            return res.status(500).json({ success: false, message: "No Address Found" })
        }
    } catch (err) {
        console.log("Error from Address Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateSingleAddress = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).json({ success: false, message: "Invalid Address ID" })

    try {
        const {
            name,
            phoneNumber,
            paymentMethod,
            deliveryMethod,
            address,
            address2,
            city,
            state,
            zip,
            noteFromCustomer
        } = req.body;

        if (!name || !phoneNumber || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const updateSingleAddress = await Address.findOneAndUpdate({ created_by: _id },
            {
                name,
                phoneNumber,
                paymentMethod,
                deliveryMethod,
                address,
                address2,
                city,
                state,
                zip,
                noteFromCustomer
            },
            { new: true })

        if (updateSingleAddress) {
            return res.status(200).json({
                success: true,
                message: "Address Updated",
                result: updateSingleAddress
            })
        }
    } catch (err) {
        console.log("Error from Address Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
