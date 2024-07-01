import mongoose from 'mongoose';
import OrderdItems from '../models/orderModel.js';

export const AddOrderItem = async (req, res) => {
    try {
        const { orderName, priceVal, priceUnit, pic, description, isFavorite, isDrink } = req.body;
        if (!orderName || !priceVal || !priceUnit) {
            return res.status(400).json({ success: false, message: "Please provide all the required fields" })
        } else {
            const newOrderItem = await OrderdItems.create({
                orderName,
                priceVal,
                priceUnit,
                pic,
                description,
                isFavorite,
                isDrink
            })
            if (!newOrderItem) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to add Order Items"
                })
            } else {
                return res.status(201).json({
                    success: true,
                    message: "Added Order Items",
                    result: newOrderItem
                })
            }
        }
    } catch (err) {
        console.log("Error from AddOrderItem Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getSingleOrderItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid Order Item ID" })
    }
    try {
        const GetSingleOrderItemByID = await OrderdItems.findById(_id);
        if (!GetSingleOrderItemByID) {
            return res.status(400).json({ success: false, message: "Failed to get Order Item" })
        } else {
            return res.status(200).json({ success: true, message: "Single Order Item", result: GetSingleOrderItemByID })
        }
    } catch (err) {
        console.log("Error from GetSingleOrderItem Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getAllOrderItems = async (req, res) => {
    try {
        const allOrderItems = await OrderdItems.find({ isDrink: { $ne: true } }).sort({ isFavorite: -1, orderName: 1 })
        // const allOrderItems = await OrderdItems.find({ isFavourite: -1, orderName: 1 });
        if (!allOrderItems) {
            return res.status(400).json({ success: false, message: "Failed to get Order Items" })
        } else {
            return res.status(200).json({ success: true, message: "All Order Items", result: allOrderItems })
        }
    } catch (err) {
        console.log("Error from getAllOrderItems Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getDrinksOnly = async (req, res) => {
    try {
        const getDrinks = await OrderdItems.find({ isDrink: true }).sort({isFavorite: -1, orderName: 1 })
        if (!getDrinks) {
            return res.status(400).json({ success: false, message: "Failed to get Drinks" })
        } else {
            return res.status(200).json({ success: true, message: "All Drinks", result: getDrinks })
        }
    } catch (err) {
        console.log("Error from getDrinksOnly Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateOrderItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid Order Item ID" })
    }
    try {
        const { orderName, priceVal, priceUnit, pic, description, isFavorite, isDrink } = req.body;
        const updateOrderSingleItem = await OrderdItems.findByIdAndUpdate(_id,
            {
                $set: {
                    'orderName': orderName,
                    'priceVal': priceVal,
                    'priceUnit': priceUnit,
                    'pic': pic,
                    'description': description,
                    'isFavorite': isFavorite,
                    'isDrink': isDrink
                }
            },
            { new: true });

        if (!updateOrderSingleItem) {
            return res.status(400).json({ success: false, message: "Failed to update Order Item" })
        } else {
            {
                return res.status(200).json({
                    success: true,
                    message: "Updated Order Item",
                    result: updateOrderSingleItem
                })
            }
        }
    } catch (err) {
        console.log("Error from updateOrderItem Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteOrderItem = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid Order Item ID" })
    }
    try {
        const deleteSingleOrderItem = await OrderdItems.findByIdAndDelete(_id);
        if (!deleteSingleOrderItem) {
            return res.status(400).json({ success: false, message: "Failed to delete Order Item" })
        } else {
            return res.status(200).json({ success: true, message: "Deleted Order Item" })
        }
    } catch (err) {
        console.log("Error from deleteOrderItem Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const searchOrderItems = async (req, res) => {
    try {
        const { orderName } = req.query;
        const searchOrderItem = await OrderdItems.find({ orderName: { $regex: orderName, $options: 'i' } });
        if (!searchOrderItem) {
            return res.status(400).json({ success: false, message: "Failed to search Order Items" })
        } else {
            return res.status(200).json({ success: true, message: "Searched Order Items", result: searchOrderItem })
        }
    } catch (err) {
        console.log("Error from searchOrderItems Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const searchDrinksOnly = async (req, res) => {
    try {
        const { orderName } = req.query;
        const searchDrinks = await OrderdItems.find({ orderName: { $regex: orderName, $options: 'i' }, isDrink: true });
        if (!searchDrinks) {
            return res.status(400).json({ success: false, message: "Failed to search Drinks" })
        } else {
            return res.status(200).json({ success: true, message: "Searched Drinks", result: searchDrinks })
        }
    } catch (err) {
        console.log("Error from searchDrinksOnly Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
