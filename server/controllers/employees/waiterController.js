import mongoose from "mongoose";
import Waiter from "../../models/employees/waiterModel.js";
import DineInOrder from "../../models/dineInOrder.js";

// Get waiter dashboard data
export const getWaiterDashboardData = async (req, res) => {
  const id = req.user.id;

  try {
    const waiter = await Waiter.findById(id);
    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }
    const waiterId = new mongoose.Types.ObjectId(id);

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

    // Aggregation for orders today
    const todayOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedWaiter: waiterId,
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        },
      },
      { $group: { _id: "$currentStatus", count: { $sum: 1 } } },
    ]);

    // Aggregation for orders this month
    const monthlyOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedWaiter: waiterId,
          createdAt: { $gte: startOfMonth, $lt: today },
          currentStatus: "Assigned",
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for orders this week
    const weeklyOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedWaiter: waiterId,
          createdAt: { $gte: startOfWeek, $lt: today },
          currentStatus: "Assigned",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregation for orders this year
    const yearlyOrders = await DineInOrder.aggregate([
      {
        $match: {
          assignedWaiter: waiterId,
          createdAt: { $gte: startOfYear, $lt: today },
          currentStatus: "Assigned",
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(todayOrders, monthlyOrders, weeklyOrders, yearlyOrders);

    // Aggregation for total tips received
    const totalTips = await DineInOrder.aggregate([
      { $match: { assignedWaiter: waiterId, currentStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$tip" } } },
    ]);

    // Aggregation for serving times
    const servingTimes = await DineInOrder.aggregate([
      { $match: { assignedWaiter: waiterId, currentStatus: "Completed" } },
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
      todayOrders: getOrderCounts(todayOrders),
      monthlyOrders: getOrderCounts(monthlyOrders),
      weeklyOrders: getOrderCounts(weeklyOrders),
      yearlyOrders: getOrderCounts(yearlyOrders),
      totalTips: totalTips[0]?.total || 0,
      averageServingTime,
      fastestServingTime,
      slowestServingTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Waiter Active Orders
export const getWaiterActiveOrder = async (req, res) => {
  const id = req.user.id;

  try {
    const waiter = await Waiter.findById(id);
    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }
    // Fetch waiter object Id
    const waiterId = new mongoose.Types.ObjectId(id);

    const activeOrder = await DineInOrder.find({
      assignedWaiter: waiterId,
      currentStatus: {
        $in: ["Accepted", "Assigned To Chef", "Preparing", "Ready"],
      },
    })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Active orders fetched successfully",
      result: activeOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Waiter All Orders
export const getWaiterAllOrders = async (req, res) => {
  const id = req.user.id;

  try {
    const waiter = await Waiter.findById(id);
    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }
    // Fetch waiter object Id
    const waiterId = new mongoose.Types.ObjectId(id);

    const allOrders = await DineInOrder.find({
      assignedWaiter: waiterId,
      currentStatus: { $in: ["Assigned", "Cancelled"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      result: allOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
