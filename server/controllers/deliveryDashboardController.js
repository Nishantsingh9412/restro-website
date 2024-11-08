import Delivery from "../models/delivery.js";
import mongoose from "mongoose";

// Controller function to get delivery dashboard data
// export const getDeliveryDashboardData = async (req, res) => {
//   try {
//     const { delId } = req.params;

//     // Validate delivery boy ID
//     if (!mongoose.Types.ObjectId.isValid(delId)) {
//       return res.status(404).send("Delivery boy not found");
//     }

//     // Get today's start date and other date ranges
//     const todayStart = new Date().setHours(0, 0, 0, 0);
//     const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const lastYear = new Date(
//       new Date().setFullYear(new Date().getFullYear() - 1)
//     );

//     // Define common query for deliveries assigned to the user
//     const deliveryQuery = { assignedTo: delId };

//     // Fetch necessary delivery data using Promise.all for parallel execution
//     const [
//       allCompleted,
//       todayAssignedDeliveries,
//       todayCompletedDeliveries,
//       todayAvailableDeliveries,
//       totalAssignedDeliveries,
//       totalCompletedDeliveries,
//       totalAvailableDeliveries,
//       totalDeliveriesCompletedToday,
//       totalDeliveryCompletedPastMonth,
//       totalDeliveryCompletedPastYear,
//       longestTimeTaken,
//       smallestTimeTaken,
//       longestDeliveryDistance,
//       shortestDeliveryDistance,
//     ] = await Promise.all([
//       Delivery.find({ ...deliveryQuery, currentStatus: "Completed" }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         createdAt: { $gte: todayStart },
//       }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         createdAt: { $gte: todayStart },
//       }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         currentStatus: "Available",
//         createdAt: { $gte: todayStart },
//       }),
//       Delivery.countDocuments(deliveryQuery),
//       Delivery.countDocuments({ ...deliveryQuery, currentStatus: "Completed" }),
//       Delivery.countDocuments({ ...deliveryQuery, currentStatus: "Available" }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         completedAt: { $gte: todayStart },
//       }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         completedAt: { $gte: thirtyDaysAgo },
//       }),
//       Delivery.countDocuments({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         completedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
//       }),
//       Delivery.findOne({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         estimatedTime: { $gt: 0 },
//       })
//         .sort({ estimatedTime: -1 })
//         .select("estimatedTime"),
//       Delivery.findOne({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         estimatedTime: { $gt: 0 },
//       })
//         .sort({ estimatedTime: 1 })
//         .select("estimatedTime"),
//       Delivery.findOne({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         distance: { $gt: 0 },
//       })
//         .sort({ distance: -1 })
//         .select("distance"),
//       Delivery.findOne({
//         ...deliveryQuery,
//         currentStatus: "Completed",
//         distance: { $gt: 0 },
//       })
//         .sort({ distance: 1 })
//         .select("distance"),
//     ]);

//     // Calculate active deliveries for today and in total
//     const todayActiveDeliveries =
//       todayAssignedDeliveries -
//       todayCompletedDeliveries -
//       todayAvailableDeliveries;
//     const totalActiveDeliveries =
//       totalAssignedDeliveries -
//       totalCompletedDeliveries -
//       totalAvailableDeliveries;

//     // Helper function to group deliveries by day, month
//     const groupByDate = (deliveries, days, dateField) => {
//       const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
//       return deliveries
//         .filter((delivery) => new Date(delivery[dateField]) >= pastDate)
//         .reduce((acc, delivery) => {
//           const completedAt = new Date(delivery[dateField]);
//           const year = completedAt.getFullYear();
//           const month = completedAt.getMonth() + 1;
//           const day = completedAt.getDate();
//           const key = `${year}-${month}-${day}`;

//           acc[key] = acc[key] || { _id: { year, month, day }, count: 0 };
//           acc[key].count++;

//           return acc;
//         }, {});
//     };

//     // Group deliveries by day for the past week and month
//     const totalDeliveryCompletedPastWeekPerDay = fillMissingDays(
//       Object.values(groupByDate(allCompleted, 7, "completedAt")),
//       7
//     );

//     const totalDeliveryCompletedPastMonthPerDay = fillMissingDays(
//       Object.values(groupByDate(allCompleted, 30, "completedAt")),
//       30
//     );

//     // Group deliveries by month for the past year
//     const totalDeliveryCompletedPastYearPerMonth = fillMissingMonths(
//       Object.values(groupByDate(allCompleted, 365, "completedAt"))
//     );

//     // Calculate averages for time taken and delivery distance
//     const averageTimeTaken =
//       allCompleted.length > 0
//         ? allCompleted.reduce(
//             (sum, delivery) => sum + delivery.estimatedTime,
//             0
//           ) / allCompleted.length
//         : 0;

//     const averageDeliveryDistance =
//       allCompleted.length > 0
//         ? allCompleted.reduce((sum, delivery) => sum + delivery.distance, 0) /
//           allCompleted.length
//         : 0;

//     // Send the response with all calculated data
//     res.status(200).json({
//       success: true,
//       result: {
//         todayAssignedDeliveries,
//         todayCompletedDeliveries,
//         todayAvailableDeliveries,
//         todayActiveDeliveries,
//         totalAssignedDeliveries,
//         totalCompletedDeliveries,
//         totalAvailableDeliveries,
//         totalActiveDeliveries,
//         totalDeliveriesCompletedToday,
//         totalDeliveryCompletedPastMonth,
//         totalDeliveryCompletedPastYear,
//         totalDeliveryCompletedPastWeekPerDay,
//         totalDeliveryCompletedPastMonthPerDay,
//         totalDeliveryCompletedPastYearPerMonth,
//         averageTimeTaken,
//         longestTimeTaken: longestTimeTaken?.estimatedTime || 0,
//         smallestTimeTaken: smallestTimeTaken?.estimatedTime || 0,
//         averageDeliveryDistance,
//         longestDeliveryDistance: longestDeliveryDistance?.distance || 0,
//         shortestDeliveryDistance: shortestDeliveryDistance?.distance || 0,
//       },
//     });
//   } catch (err) {
//     console.error(
//       "Error from getDeliveryDashboardData Controller: ",
//       err.message
//     );
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };
export const getDeliveryDashboardData = async (req, res) => {
  try {
    const { delId } = req.params;

    // Validate delivery boy ID
    if (!mongoose.Types.ObjectId.isValid(delId)) {
      return res.status(404).send("Delivery boy not found");
    }

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const lastYear = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    );

    // Use aggregation to collect all the data in one go
    const [deliveryStats] = await Delivery.aggregate([
      {
        $match: { assignedTo: new mongoose.Types.ObjectId(delId) },
      },
      {
        $facet: {
          todayStats: [
            { $match: { createdAt: { $gte: todayStart } } },
            {
              $group: {
                _id: null,
                todayAssigned: { $sum: 1 },
                todayCompleted: {
                  $sum: {
                    $cond: [{ $eq: ["$currentStatus", "Completed"] }, 1, 0],
                  },
                },
                todayAvailable: {
                  $sum: {
                    $cond: [{ $eq: ["$currentStatus", "Available"] }, 1, 0],
                  },
                },
              },
            },
          ],
          totalStats: [
            {
              $group: {
                _id: null,
                totalAssigned: { $sum: 1 },
                totalCompleted: {
                  $sum: {
                    $cond: [{ $eq: ["$currentStatus", "Completed"] }, 1, 0],
                  },
                },
                totalAvailable: {
                  $sum: {
                    $cond: [{ $eq: ["$currentStatus", "Available"] }, 1, 0],
                  },
                },
              },
            },
          ],
          deliveryTimes: [
            { $match: { currentStatus: "Completed" } },
            {
              $group: {
                _id: null,
                longestTime: { $max: "$estimatedTime" },
                shortestTime: { $min: "$estimatedTime" },
                averageTime: { $avg: "$estimatedTime" },
              },
            },
          ],
          deliveryDistances: [
            { $match: { currentStatus: "Completed" } },
            {
              $group: {
                _id: null,
                longestDistance: { $max: "$distance" },
                shortestDistance: { $min: "$distance" },
                averageDistance: { $avg: "$distance" },
              },
            },
          ],
          pastWeekDeliveries: [
            { $match: { completedAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: {
                  year: { $year: "$completedAt" },
                  month: { $month: "$completedAt" },
                  day: { $dayOfMonth: "$completedAt" },
                },
                count: { $sum: 1 },
              },
            },
          ],
          pastMonthDeliveries: [
            { $match: { completedAt: { $gte: thirtyDaysAgo } } },
            {
              $group: {
                _id: {
                  year: { $year: "$completedAt" },
                  month: { $month: "$completedAt" },
                  day: { $dayOfMonth: "$completedAt" },
                },
                count: { $sum: 1 },
              },
            },
          ],
          pastYearDeliveries: [
            { $match: { completedAt: { $gte: lastYear } } },
            {
              $group: {
                _id: {
                  year: { $year: "$completedAt" },
                  month: { $month: "$completedAt" },
                },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const todayStats = deliveryStats.todayStats[0] || {};
    const totalStats = deliveryStats.totalStats[0] || {};
    const deliveryTimes = deliveryStats.deliveryTimes[0] || {};
    const deliveryDistances = deliveryStats.deliveryDistances[0] || {};

    res.status(200).json({
      success: true,
      result: {
        todayAssignedDeliveries: todayStats.todayAssigned || 0,
        todayCompletedDeliveries: todayStats.todayCompleted || 0,
        todayAvailableDeliveries: todayStats.todayAvailable || 0,
        todayActiveDeliveries:
          (todayStats.todayAssigned || 0) -
          (todayStats.todayCompleted || 0) -
          (todayStats.todayAvailable || 0),
        totalAssignedDeliveries: totalStats.totalAssigned || 0,
        totalCompletedDeliveries: totalStats.totalCompleted || 0,
        totalAvailableDeliveries: totalStats.totalAvailable || 0,
        totalActiveDeliveries:
          (totalStats.totalAssigned || 0) -
          (totalStats.totalCompleted || 0) -
          (totalStats.totalAvailable || 0),
        totalDeliveryCompletedPastWeekPerDay: deliveryStats.pastWeekDeliveries,
        totalDeliveryCompletedPastMonthPerDay:
          deliveryStats.pastMonthDeliveries,
        totalDeliveryCompletedPastYearPerMonth:
          deliveryStats.pastYearDeliveries,
        averageTimeTaken: deliveryTimes.averageTime || 0,
        longestTimeTaken: deliveryTimes.longestTime || 0,
        shortestTimeTaken: deliveryTimes.shortestTime || 0,
        averageDeliveryDistance: deliveryDistances.averageDistance || 0,
        longestDeliveryDistance: deliveryDistances.longestDistance || 0,
        shortestDeliveryDistance: deliveryDistances.shortestDistance || 0,
      },
    });
  } catch (err) {
    console.error(
      "Error from getDeliveryDashboardData Controller: ",
      err.message
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Helper function to fill missing days in the data
const fillMissingDays = (data, days) => {
  const result = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();

    const found = data.find(
      (item) =>
        item._id.year === year &&
        item._id.month === month &&
        item._id.day === day
    );

    result.push(found ? found.count : 0);
  }

  return result.reverse(); // Reverse to make the order from past to present
};

// Helper function to fill missing months in the data
const fillMissingMonths = (data) => {
  const result = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.setMonth(now.getMonth() - i));
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based

    const found = data.find(
      (item) => item._id.year === year && item._id.month === month
    );

    result.push(found ? found.count : 0);
  }

  return result.reverse(); // Reverse to make the order from past to present
};

// Uncomment the following line to test the function with a sample delivery boy ID
// getDeliveryDashboardData({ params: { delId: "668925f9b9e4798fc9ed3a87" } });
