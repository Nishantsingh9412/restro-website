import mongoose from "mongoose";
import ItemManagement from "../models/itemManage.js";

export const getLowStockItems = async (req, res) => {

    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: "Invalid User Id" })

    try {
        const lowStockItems = await ItemManagement
            .find(
                {
                    $and: [
                        {
                            $expr: {
                                $gte: [
                                    "$minimum_quantity",
                                    { $multiply: [0.7, "$available_quantity"] }
                                ]
                            }
                        },
                        { created_by: _id }
                    ]
                }
            );
        return res.status(200).json({
            success: true,
            message: "Low Stock Items",
            result: lowStockItems
        })
    } catch (error) {
        console.log("Error from ItemManagement Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getallStockItems = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).json({ success: false, message: "Invalid User Id" })
    try {
        const allStockItems = await ItemManagement.find({ created_by: _id })
        return res.status(200).json({
            success: true,
            message: "All Stock Items",
            result: allStockItems
        })
    } catch (error) {
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}