import authDeliv from '../models/authDeliv.js';
// import DeliveryPersonnel from '../models/delivery.js';
import mongoose from 'mongoose';


export const createDeliveryPersonnel = async (req, res) => {
    try {
        const { name, country_code, phone, created_by } = req.body;
        if (!name || !country_code || !phone || !created_by) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        } else {
            const newDelBoy = await authDeliv.create({
                name,
                country_code,
                phone,
                created_by
            });
            if (newDelBoy) {
                return res.status(201).json({ success: true, message: "Delivery Personnel Added", result: newDelBoy })
            } else {
                return res.status(500).json({ success: false, message: "Delivery Personnel not added" })
            }
        }
    } catch (err) {
        console.log("Error from DeliveryPersonnel Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const getDeliveryPersonnels = async (req, res) => {
    const allDelBoyz = await authDeliv.find();
    if (allDelBoyz) {
        return res.status(200).json({ success: true, message: "All Delivery Personnel", result: allDelBoyz })
    } else {
        return res.status(500).json({ success: false, message: "No Delivery Personnel Found" })
    }
}

export const updateDeliveryPersonnel = async (req, res) => {
    const { id: _id } = req.params;
    const { name, country_code, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No Delivery Personnel with that id');
    if (!name || !country_code || !phone)
        return res.status(400).json({ success: false, message: "All fields are required" })

    try {
        const updatedDelBoy = await authDeliv.findByIdAndUpdate((_id), {
            $set: {
                'name': name,
                'country_code': country_code,
                'phone': phone,
            }
        },
            {
                new: true,
                timestamps: { createdAt: false, updatedAt: true }
            });
        if (updatedDelBoy) {
            return res.status(200).json({ success: true, message: "Delivery Personnel Updated", result: updatedDelBoy })
        } else {
            return res.status(500).json({ success: false, message: "Delivery Personnel not updated" })
        }
    } catch (err) {
        console.log("Error from DeliveryPersonnel Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}

export const getDeliveryPersonnelSingle = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No Delivery Personnel with that id');
    try {
        const singleDelBoy = await authDeliv.findById(_id);
        if (singleDelBoy) {
            return res.status(200).json({ success: true, message: "Delivery Personnel", result: singleDelBoy })
        } else {
            return res.status(500).json({ success: false, message: "No Delivery Personnel Found" })
        }
    } catch (err) {
        console.log("Error from DeliveryPersonnel Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const deleteDeliveryPersonnel = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No Delivery Personnel with that id');
    try {
        const delBoyToDelete = await authDeliv.findByIdAndDelete(_id);
        if (delBoyToDelete) {
            return res.status(200).json({success: true,message: "Delivery Personnel Deleted",result: delBoyToDelete})
        } else {
            return res.status(500).json({success: false,message: "Delivery Personnel not deleted"})
        }
    } catch (err) {
        console.log("Error from DeliveryPersonnel Controller : ", err.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

