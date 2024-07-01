import mongoose from "mongoose";
import completeOrder from "../models/completeOrder.js";

export const createCompleteOrder = async (req, res) => {
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
            orderItems,
            TotalPrice,
            created_by
        } = req.body;
        if (!name || !phoneNumber || !address || !TotalPrice) {
            return res.status(401).json({ success: false, message: "All fields are required" })
        }
        if (!created_by) {
            return res.status(401).json({ success: false, message: "Session expired login again" })
        }

        else {
            const formattedOrderItems = orderItems.map(item => ({
                // item: new mongoose.Types.ObjectId(item._id),
                item : new mongoose.Types.ObjectId(item._id),
                quantity: item.quantity,
                total: item.priceVal * item.quantity
            }));
            const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
            const newCompleteOrder = await completeOrder.create({
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
                orderItems: formattedOrderItems,
                TotalPrice,
                created_by,
                orderId
            });
            if (newCompleteOrder) {
                return res.status(201).json({ success: true, message: "Order Added", result: newCompleteOrder })
            } else {
                return res.status(500).json({ success: false, message: "Order not added" })
            }
        }
    } catch (err) {
        console.log("Error from Order Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getCompleteOrders = async (req, res) => {
    try {
        const completeOrders = await completeOrder.find({});
        return res.status(200).json({ success: true, message: "All Orders", result: completeOrders })
    } catch (err) {
        console.log("Error from Order Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getCompleteOrderById = async (req, res) => {

    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ success: false, message: "No Order found" })
    }
    try {
        const completeOrderSingle = await completeOrder.findById(_id);
        if (completeOrderSingle) {
            return res.status(200).json({ success: true, message: "Order", result: completeOrderSingle })
        } else {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
    } catch (err) {
        console.log("Error from Order Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateCompleteOrder = async (req, res) => {
    const { id: _id } = req.params;
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
        orderItems,
        TotalPrice,
        created_by } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ success: false, message: "No Order found" })
    }
    try {
        const updatedOrder = await completeOrder.findByIdAndUpdate({ _id }, {
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
            orderItems,
            TotalPrice,
            created_by
        }, { new: true });
        if (updatedOrder) {
            return res.status(200).json({ success: true, message: "Order Updated", result: updatedOrder });
        } else {
            return res.status(404).json({ success: false, message: "Order not updated" });
        }
    } catch (err) {
        console.log("Error from Order Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteCompleteOrder = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ success: false, message: "No Order found" })
    }
    try {
        const deletedOrder = await completeOrder.findByIdAndDelete(_id);
        if (deletedOrder) {
            return res.status(200).json({ success: true, message: "Order Deleted", result: deletedOrder });
        } else {
            return res.status(404).json({ success: false, message: "Order not deleted" });
        }
    } catch (err) {
        console.log("Error from Order Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

