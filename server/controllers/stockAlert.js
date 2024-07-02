import mongoose from "mongoose";
import ItemManagement from "../models/itemManage.js";

export const getLowStockItems = async (req, res) => {
    try {
        const lowStockItems = await ItemManagement
            .find(
                {
                    $expr: {
                        $gte:
                            ["$minimum_quantity", {
                                $multiply:
                                    [0.7, "$available_quantity"]
                            }]
                    }
                }
            );
        // { $multiply: [ "$price", "$quantity" ] } } }
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
    try {
        const allStockItems = await ItemManagement.find({});
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