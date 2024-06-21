import mongoose from "mongoose";
import supplier from "../models/supplier.js"

export const AddSupplier = async (req, res) => {
    try {
        const { name, pic, Items, phone, email, countryCode } = req.body;
        if (!name || !Items ) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        } else {
            const newSupplier = await supplier.create({
                name,
                pic,
                Items,
                countryCode,
                phone,
                email
            })
            if (!newSupplier) {
                return res.status(400).json({ success: false, message: 'error in creating supplier' })
            } else {
                return res.status(200).json({ success: true, message: 'Supplier created successfully', result: newSupplier })
            }
        }
    } catch (error) {
        console.log('Error in AddSupplier', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getSupplier = async (req, res) => {
    try {
        const allSuppliers = await supplier.find({});
        if (allSuppliers) {
            return res.status(200).json({ success: true, message: 'All Suppliers', result: allSuppliers })
        } else {
            return res.status(400).json({ success: false, message: 'No Suppliers Found' })
        }
    } catch (err) {
        console.log('Error in getSupplier', err.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getSingleSupplier = async (req, res) => {
    const { id: _id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ success: false, message: "Invalid Supplier Id" })
        } else {
            const getSingleSupplier = await supplier.findById(_id);
            if (getSingleSupplier) {
                return res.status(200).json({
                    success: true,
                    message: 'Single Supplier',
                    result: getSingleSupplier
                })
            } else {
                return res.status(400).json({ success: false, message: 'No Supplier Found' })
            }
        }
    } catch (error) {
        console.log('Error in getSingleSupplier', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const UpdateSupplier = async (req, res) => {
    const { id: _id } = req.params;
    const { name, pic, Items, phone, email, countryCode } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid Supplier Id" })
    }
    try {
        const updateSupplier = await supplier.findByIdAndUpdate(_id, {
            $set: {
                'name': name,
                'pic': pic,
                'Items': Items,
                'countryCode': countryCode,
                'phone': phone,
                'email': email
            }
        }, { new: true })

        if (updateSupplier) {
            return res.status(200).json({ success: true, message: 'Supplier Updated Successfully', result: updateSupplier })
        } else {
            return res.status(400).json({ success: false, message: 'Error in Updating Supplier' })
        }
    } catch (error) {
        console.log('Error in UpdateSupplier', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }


}

export const deleteSupplier = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: 'Invalid Supplier Id' })
    }
    try {
        const removeSupplier = await supplier.findByIdAndDelete(_id);
        if (removeSupplier) {
            return res.status(200).json({ success: true, message: 'Supplier Deleted Successfully' })
        } else {
            return res.status(400).json({ success: false, message: 'Error in Deleting Supplier' })
        }
    } catch (error) {
        console.log('Error in deleteSupplier', error.message)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
