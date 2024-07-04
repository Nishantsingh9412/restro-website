import ItemManagement from "../models/itemManage.js";
import supplier from "../models/supplier.js";

export const totalStocksController = async (req, res) => {
    try {
        const totalStocks = await ItemManagement.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$available_quantity" }
                }
            }
        ]);
        const totalQuantity = totalStocks.length > 0 ? totalStocks[0].totalQuantity : 0;
        res.status(200).json({
            success: true,
            message: "Total Stocks",
            result: totalQuantity
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const lowStocksCount = async (req, res) => {
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
        res.status(200).json({
            success: true,
            message: "Low Stocks",
            result: lowStockItems.length
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// export const expiryAlert = async (req, res) => {
//     try {
//         // Get the current date
//         const today = new Date();
//         // Normalize today's date to only include the date part
//         const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//         console.log('Current Date:', normalizedToday);
//         // Fetch items with expiry dates less than the current date (normalized)
//         const expiryItems = await ItemManagement.find({
//             expiry_date: { $lt: normalizedToday }
//         });

//         console.log('Current Date:', normalizedToday.toISOString().split('T')[0]); // Format date for readability
//         console.log('Expired Items:', expiryItems);

//         // Respond with success and the number of expired items
//         res.status(200).json({
//             success: true,
//             message: 'Expired Items',
//             result: expiryItems.length,
//             data: expiryItems // Optionally include data for debugging
//         });
//     } catch (error) {
//         console.error('Error fetching expired items:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'Internal Server Error',
//             error: error.message // Optionally include error message for debugging
//         });
//     }
// };

export const getExpiredItemsController = async (req, res) => {
    try {
        const expiryItems = await ItemManagement.find({ expiry_date: { $lt: new Date() } });
        const totalExpiredIems = {
            total: expiryItems.length,
            items: expiryItems
        }
        res.status(200).json({ success: true, message: "Expired Items", result: totalExpiredIems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getSupplierByLocationController = async (req, res) => {
    try {
        const locationCounts = await supplier.aggregate([
            {
                $match: {
                    "location": { $ne: "" } // Exclude documents where location is an empty string
                }
            },
            {
                $group: {
                    _id: "$location", // Grouping by location
                    count: { $sum: 1 } // Counting suppliers in each location
                }
            }
        ]);

        // console.log('Location Counts:', locationCounts);
        const totalSuppliers = locationCounts.reduce((acc, curr) => acc + curr.count, 0);
        let locationPercentages = locationCounts.map(location => ({
            location: location._id,
            percentage: ((location.count / totalSuppliers) * 100) // Calculate raw percentage
        }));
        locationPercentages.sort((a, b) => b.percentage - a.percentage); // Sort by percentage in descending order

        // Keep top 3 locations as is and merge the rest into "Others"
        if (locationPercentages.length > 3) {
            const topLocations = locationPercentages.slice(0, 3).map(location => ({
                location: location.location,
                percentage: parseFloat(location.percentage).toFixed(1) + '%' // Ensure it's a number before formatting
            }));
            const othersPercentage = locationPercentages.slice(3)
                .reduce((acc, curr) => acc + curr.percentage, 0);
            topLocations.push({
                location: "Others",
                percentage: parseFloat(othersPercentage).toFixed(1) + '%' // Ensure it's a number before formatting
            });
            locationPercentages = topLocations;
        } else {
            // If there are 3 or less locations, just format their percentages
            locationPercentages = locationPercentages.map(location => ({
                ...location,
                percentage: parseFloat(location.percentage).toFixed(1) + '%' // Ensure it's a number before formatting
            }));
        }

        res.status(200).json({ success: true, message: "Top Suppliers by Location", result: locationPercentages });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const contactInfo = async (req, res) => {
    try {
        const contactInfo = await supplier.find({ phone: { $ne: "" } }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Total Contacts",
            result: contactInfo
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export const searchContacts = async (req, res) => {
    const { nameSearched } = req.query;
    const searchedContact = await supplier.find({
        name: { $regex: nameSearched, $options: 'i' },
        phone: { $nin: [null, ""] }
    });
    console.log(searchedContact);
    return res.status(200).json({
        success: true,
        message: "Searched Contacts",
        result: searchedContact
    });
}