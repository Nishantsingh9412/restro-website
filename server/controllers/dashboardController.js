import ItemManagement from "../models/inventoryItem.js";
import Supplier from "../models/supplier.js";

// Centralized error handler
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(error);
  res.status(500).json({ success: false, message, error });
};

// ---------------- Helper Functions ----------------

const fetchTotalStocks = async () => {
  const [totalStock] = await ItemManagement.aggregate([
    { $group: { _id: null, totalQuantity: { $sum: "$available_quantity" } } },
  ]);
  return totalStock?.totalQuantity || 0;
};

const fetchLowStocksCount = async () => {
  return await ItemManagement.countDocuments({
    $expr: {
      $lt: ["$minimum_quantity", { $multiply: [0.7, "$available_quantity"] }],
    },
  });
};

const fetchExpiredItems = async () => {
  const items = await ItemManagement.find(
    { expiry_date: { $lt: new Date() } },
    "name expiry_date"
  );
  return {
    total: items.length,
    items,
  };
};

const fetchSuppliersByLocation = async () => {
  const locationCounts = await Supplier.aggregate([
    { $match: { location: { $ne: "" } } },
    { $group: { _id: "$location", count: { $sum: 1 } } },
  ]);

  if (!locationCounts.length) return [];

  const total = locationCounts.reduce((sum, loc) => sum + loc.count, 0);

  let result = locationCounts.map(({ _id, count }) => ({
    location: _id,
    percentage: ((count / total) * 100).toFixed(1) + "%",
  }));

  if (result.length > 3) {
    const others = result
      .slice(3)
      .reduce((sum, loc) => sum + parseFloat(loc.percentage), 0)
      .toFixed(1);
    result = [
      ...result.slice(0, 3),
      { location: "Others", percentage: others + "%" },
    ];
  }

  return result;
};

const fetchSupplierContactInfo = async (id) => {
  return await Supplier.find(
    { phone: { $ne: "" }, created_by: id },
    "name phone pic"
  ).sort({
    createdAt: -1,
  });
};

// ---------------- Controllers ----------------

export const getAdminDashboardDataController = async (req, res) => {
  try {
    const [
      totalStocksQuantity,
      lowStocksQuantity,
      expiredItems,
      suppliersByLocation,
    ] = await Promise.all([
      fetchTotalStocks(),
      fetchLowStocksCount(),
      fetchExpiredItems(),
      fetchSuppliersByLocation(),
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard Data",
      result: {
        totalStocksQuantity,
        lowStocksQuantity,
        expiredItems,
        suppliersByLocation,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getContactOfSupplierController = async (req, res) => {
  const id = req.user.id;
  try {
    const result = await fetchSupplierContactInfo(id);
    if (!result.length) {
      return res
        .status(404)
        .json({ success: false, message: "No contact information available" });
    }
    res.status(200).json({ success: true, message: "Total Contacts", result });
  } catch (error) {
    handleError(res, error);
  }
};
