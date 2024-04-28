import mongoose from 'mongoose'
import QRItemManagement from '../models/qrItems.js'

export const searchItemsQR = async (req, res) => {
    const { itemQrData } = req.params;
    if (!itemQrData) {
        return res.status(400).json({ success: false, message: "QR Code is required" })
    } else {
        try {
            // const searchItem = await QRItemManagement.findOne({ qr_code: itemQrData });
            const searchItem = await QRItemManagement.findOneAndUpdate(
                { qr_code: itemQrData },
                { $inc: { item_count: 1 } },
                { new: true });
            if (!searchItem) {
                
                return res.status(404).json({ success: false, message: "QR Item not found" })
            } else {
                return res.status(200).json({ success: true, result: searchItem })
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export const addQRItem = async (req, res) => {
    const {
        item_name,
        item_unit,
        item_count,
        qr_code,
        available_quantity,
        minimum_quantity,
        usage_rate_value,
        usage_rate_unit,
        Last_Replenished
    } = req.body

    if (!item_name ||
        !item_unit ||
        !qr_code ||
        !item_count ||
        !available_quantity ||
        !minimum_quantity ||
        !usage_rate_value ||
        !usage_rate_unit ||
        !Last_Replenished) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    } else {
        try {
            const newQRItem = await QRItemManagement.create({
                item_name,
                item_unit,
                item_count,
                qr_code,
                available_quantity,
                minimum_quantity,
                usage_rate_value,
                usage_rate_unit,
                Last_Replenished
            })
            if (!newQRItem) {
                return res.status(400).json({ success: false, message: "QR Item could not be created" })
            } else {
                return res.status(201).json({
                    success: true,
                    message: "QR Item created successfully",
                    result: newQRItem
                })
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export const getSingleQRItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid QR Item ID" })
    }
    try {
        const qrItem = await QRItemManagement.findById(_id);
        if (!qrItem) {
            return res.status(404).json({ success: false, message: "QR Item not found" })
        } else {
            return res.status(200).json({ success: true, result: qrItem })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getAllQRItems = async (req, res) => {
    try {
        const getAllQRItems = await QRItemManagement.find({});
        if (!getAllQRItems) {
            return res.status(400).json({ success: false, message: "No QR Items found" })
        } else {
            return res.status(200).json({ success: true, result: getAllQRItems })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const updateQrItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid QR Item ID" })
    }
    const { item_name,
        item_unit,
        item_count,
        qr_code,
        available_quantity,
        minimum_quantity,
        usage_rate_value,
        usage_rate_unit,
        Last_Replenished } = req.body

    try {
        const updateQrItem = await QRItemManagement.findByIdAndUpdate((_id), {
            $set: {
                'item_name': item_name,
                'item_unit': item_unit,
                'item_count': item_count,
                'qr_code': qr_code,
                'available_quantity': available_quantity,
                'minimum_quantity': minimum_quantity,
                'usage_rate_value': usage_rate_value,
                'usage_rate_unit': usage_rate_unit,
                'Last_Replenished': Last_Replenished
            }
        }, { new: true });
        if (!updateQrItem) {
            return res.status(400).json({ success: false, message: "QR Item could not be updated" })
        } else {
            return res.status(200).json({
                success: true,
                message: "QR Item updated successfully",
                result: updateQrItem
            })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const deleteQRItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid QR Item ID" })
    }
    try {
        const deleteQrItem = await QRItemManagement.findByIdAndRemove(id);
        if (!deleteQrItem) {
            return res.status(400).json({ success: false, message: "QR Item could not be deleted" })
        } else {
            return res.status(200).json({
                success: true,
                message: "QR Item deleted successfully",
                result: deleteQrItem
            })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const deleteAllQRItems = async (req, res) => {
    try {
        const deleteAllItems = await QRItemManagement.deleteMany({});
        if (!deleteAllItems) {
            return res.status(400).json({ success: false, message: "QR Items could not be deleted" })
        } else {
            return res.status(200).json({ success: true, message: "QR Items deleted successfully" })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
