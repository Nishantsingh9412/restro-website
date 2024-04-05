import mongoose from "mongoose";
import ItemManagement from "../models/itemManage.js";

export const addItem = async (req, res) => {
    try {
        const {
            item_name,
            item_unit,
            available_quantity,
            minimum_quantity,
            usage_rate_value,
            usage_rate_unit,
            Last_Replenished,
        } = req.body;

        if (!item_name ||
            !item_unit ||
            !available_quantity ||
            !minimum_quantity ||
            !usage_rate_value ||
            !usage_rate_unit ||
            !Last_Replenished
        ) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        } else {
            const newItem = await ItemManagement.create({
                item_name,
                item_unit,
                available_quantity,
                minimum_quantity,
                usage_rate_value,
                usage_rate_unit,
                Last_Replenished,
            });
            if (newItem) {
                return res.status(201).json({ success: true, message: "Item Added", result: newItem })
            } else {
                return res.status(500).json({ success: false, message: "Item not added" })
            }
        }
    }
    catch (error) {
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getAllItems = async (req, res) => {
    const allItemsData = await ItemManagement.find();
    if (allItemsData) {
        return res.status(200).json({ success: true, message: "All Items", result: allItemsData })
    } else {
        return res.status(500).json({ success: false, message: "No Items Found" })
    }
}

export const getItemById = async (req, res) => {
    const { id: _id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid Item Id" })
        } else {
            const singleItemData = await ItemManagement.findById(_id);
            if (singleItemData) {
                return res.status(200).json({ success: true, message: "Single Item", result: singleItemData })
            } else {
                return res.status(500).json({ success: false, message: "No Item Found" })
            }
        }
    }catch(error){
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const updateItem = async (req, res) => {
    const { id: _id } = req.params;
    const {
        item_name,
        item_unit,
        available_quantity,
        minimum_quantity,
        usage_rate_value,
        usage_rate_unit,
        Last_Replenished,
    } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).json({ success: false, message: "Invalid Item Id" })
    }
    
    try{
        const updateSingleItem = await ItemManagement.findByIdAndUpdate((_id),{
            $set:{
                'item_name': item_name,
                'item_unit': item_unit,
                'available_quantity': available_quantity,
                'minimum_quantity': minimum_quantity,
                'usage_rate_value': usage_rate_value,
                'usage_rate_unit': usage_rate_unit,
                'Last_Replenished': Last_Replenished,
            }
        },{new: true});

        if(updateSingleItem){
            return res.status(200).json({ success: true, message: "Item Updated", result: updateSingleItem })
        }else{
            return res.status(500).json({ success: false, message: "Error Updating Item" })
        }

    }catch(error){
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteItem = async (req, res) => {
    const { id: _id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).json({ success: false, message: "Invalid Item Id" })
    }
    try{
        const deleteSingleItem = await ItemManagement.findByIdAndDelete(_id);
        if(deleteSingleItem){
            return res.status(200).json({ success: true, message: "Item Deleted" })
        }else{
            return res.status(500).json({ success: false, message: "Error Deleting Item" })
        }
    }catch(error){
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const DeletAllItems = async (req, res) => {
    try{
        const deleteAllItems = await ItemManagement.deleteMany();
        if(deleteAllItems){
            return res.status(200).json({ success: true, message: "All Items Deleted" })
        }else{
            return res.status(500).json({ success: false, message: "Error Deleting Items" })
        }
    }catch(error){
        console.log("Error from ItemManagemnt Controller : ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}