import ItemManagement from "../models/itemManage.js";
import Supplier from "../models/supplier.js";

// Centralized error handler function
const handleError = (res, error, message = "Internal Server Error") => {
  res.status(500).json({ success: false, message, error });
};

// Controller to get total stocks
export const totalStocksController = async (req, res) => {
  try {
    // Aggregate total available quantity from all items
    const [totalStock] = await ItemManagement.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$available_quantity" } } },
    ]);

    // Set totalQuantity to 0 if no stock data
    const totalQuantity = totalStock?.totalQuantity || 0;

    res.status(200).json({
      success: true,
      message: "Total Stocks",
      result: totalQuantity,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to get count of low stock items
export const lowStocksCount = async (req, res) => {
  try {
    // Count items where available quantity is 70% or below the minimum required quantity
    const lowStockCount = await ItemManagement.countDocuments({
      $expr: {
        $lt: ["$minimum_quantity", { $multiply: [0.7, "$available_quantity"] }],
      },
    });

    res.status(200).json({
      success: true,
      message: "Low Stocks",
      result: lowStockCount,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to get expired items
export const getExpiredItemsController = async (req, res) => {
  try {
    // Find items where expiry date is less than the current date
    const expiryItems = await ItemManagement.find(
      { expiry_date: { $lt: new Date() } },
      "name expiry_date" // Select only necessary fields
    );

    res.status(200).json({
      success: true,
      message: "Expired Items",
      result: {
        total: expiryItems.length,
        items: expiryItems,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to get suppliers by location
export const getSupplierByLocationController = async (req, res) => {
  try {
    // Group suppliers by location and count occurrences
    const locationCounts = await Supplier.aggregate([
      { $match: { location: { $ne: "" } } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);

    if (!locationCounts.length) {
      return res.status(404).json({
        success: false,
        message: "No suppliers found by location",
      });
    }

    const totalSuppliers = locationCounts.reduce(
      (acc, { count }) => acc + count,
      0
    );

    // Calculate percentage for each location
    let locationPercentages = locationCounts.map(({ _id, count }) => ({
      location: _id,
      percentage: ((count / totalSuppliers) * 100).toFixed(1) + "%",
    }));

    // Handle 'Others' case for locations beyond the top 3
    if (locationPercentages.length > 3) {
      const othersPercentage = locationPercentages
        .slice(3)
        .reduce((acc, { percentage }) => acc + parseFloat(percentage), 0)
        .toFixed(1);
      locationPercentages = [
        ...locationPercentages.slice(0, 3),
        { location: "Others", percentage: othersPercentage + "%" },
      ];
    }

    res.status(200).json({
      success: true,
      message: "Top Suppliers by Location",
      result: locationPercentages,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to get contact information of suppliers
export const contactInfo = async (req, res) => {
  try {
    // Find suppliers with non-empty phone numbers and sort by creation date
    const contactInfo = await Supplier.find(
      { phone: { $ne: "" } },
      "name phone pic" // Select only necessary fields
    ).sort({ createdAt: -1 });

    if (!contactInfo.length) {
      return res.status(404).json({
        success: false,
        message: "No contact information available",
      });
    }

    res.status(200).json({
      success: true,
      message: "Total Contacts",
      result: contactInfo,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to search contacts by name
export const searchContacts = async (req, res) => {
  try {
    const { nameSearched } = req.query;
    //TODO - Uncomment the below code to validate the nameSearched query parameter
    // if (!nameSearched?.trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Name is required for searching",
    //   });
    // }

    // Search for contacts by name using a case-insensitive regex
    const searchedContact = await Supplier.find(
      {
        name: { $regex: nameSearched, $options: "i" },
        phone: { $nin: [null, ""] },
      },
      "name phone" // Select only necessary fields
    );

    if (!searchedContact.length) {
      return res.status(404).json({
        success: false,
        message: "No contacts found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Searched Contacts",
      result: searchedContact,
    });
  } catch (error) {
    handleError(res, error);
  }
};
