import Chef from "../../models/employees/chefModel.js";
import mongoose from "mongoose";
import DineInOrder from "../../models/dineInOrder.js";
import TakeAwayOrder from "../../models/takeAwayOrder.js";

// Get chef dashboard data
export const getChefDashboardData = async (req, res) => {
  const id = req.user.id;

  try {
    const chef = await Chef.findById(id);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    const chefId = new mongoose.Types.ObjectId(id);

    // Get current date/time references
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Aggregation for dine-in orders today
    const todayDineInOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        },
      },
      { $group: { _id: "$currentStatus", count: { $sum: 1 } } },
    ]);

    // Aggregation for takeaway orders today
    const todayTakeAwayOrders = await TakeAwayOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        },
      },
      { $group: { _id: "$currentStatus", count: { $sum: 1 } } },
    ]);

    // Aggregation for dine-in orders this month
    const monthlyDineInOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfMonth, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for takeaway orders this month
    const monthlyTakeAwayOrders = await TakeAwayOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfMonth, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for dine-in orders this week
    const weeklyDineInOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfWeek, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for takeaway orders this week
    const weeklyTakeAwayOrders = await TakeAwayOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfWeek, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for dine-in orders this year
    const yearlyDineInOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfYear, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for takeaway orders this year
    const yearlyTakeAwayOrders = await TakeAwayOrder.aggregate([
      {
        $match: {
          assignedChef: chefId,
          createdAt: { $gte: startOfYear, $lt: today },
          currentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for total tips received
    const totalTips = await DineInOrder.aggregate([
      { $match: { assignedChef: chefId, currentStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$tip" } } },
    ]);

    // Aggregation for serving times
    const servingTimes = await DineInOrder.aggregate([
      { $match: { assignedChef: chefId, currentStatus: "Completed" } },
      {
        $project: {
          servingTime: { $subtract: ["$completedAt", "$createdAt"] },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$servingTime" },
          fastest: { $min: "$servingTime" },
          slowest: { $max: "$servingTime" },
        },
      },
    ]);

    const averageServingTime = servingTimes[0]?.average || 0;
    const fastestServingTime = servingTimes[0]?.fastest || 0;
    const slowestServingTime = servingTimes[0]?.slowest || 0;

    // Order count helper function
    const getOrderCounts = (orders) => {
      return orders.reduce((acc, order) => {
        acc[order._id] = order.count;
        return acc;
      }, {});
    };

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      todayOrders: {
        dineIn: getOrderCounts(todayDineInOrders),
        takeAway: getOrderCounts(todayTakeAwayOrders),
      },
      monthlyOrders: {
        dineIn: getOrderCounts(monthlyDineInOrders),
        takeAway: getOrderCounts(monthlyTakeAwayOrders),
      },
      weeklyOrders: {
        dineIn: getOrderCounts(weeklyDineInOrders),
        takeAway: getOrderCounts(weeklyTakeAwayOrders),
      },
      yearlyOrders: {
        dineIn: getOrderCounts(yearlyDineInOrders),
        takeAway: getOrderCounts(yearlyTakeAwayOrders),
      },
      totalTips: totalTips[0]?.total || 0,
      averageServingTime,
      fastestServingTime,
      slowestServingTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Chef Active Orders
export const getChefActiveOrder = async (req, res) => {
  const id = req.user.id;

  try {
    const chef = await Chef.findById(id);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    const chefId = new mongoose.Types.ObjectId(id);

    const activeOrderStatuses = ["Accepted", "Preparing", "Pending", "Ready"];

    const dineInActiveOrder = await DineInOrder.find({
      assignedChef: chefId,
      currentStatus: { $in: activeOrderStatuses },
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    const takeAwayActiveOrder = await TakeAwayOrder.find({
      assignedChef: chefId,
      currentStatus: { $in: activeOrderStatuses },
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Active orders fetched successfully",
      result: { dineInActiveOrder, takeAwayActiveOrder },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Chef All Orders
export const getChefAllOrders = async (req, res) => {
  const id = req.user.id;

  try {
    const chef = await Chef.findById(id);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    // Fetch chef object Id
    const chefId = new mongoose.Types.ObjectId(id);

    const dineInOrders = await DineInOrder.find({
      assignedChef: chefId,
      currentStatus: { $ne: "Cancelled", $ne: "Completed" },
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    const takeAwayOrders = await TakeAwayOrder.find({
      assignedChef: chefId,
      currentStatus: { $ne: "Cancelled", $ne: "Completed" },
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      result: { dineInOrders, takeAwayOrders },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
