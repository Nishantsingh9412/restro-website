import Delivery from "../models/delivery.js";
import mongoose from "mongoose";

export const getDeliveryDashboardData = async (req, res) => {
  try {
    const { id: delId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(delId))
      return res.status(404).send("Delivery boy not found");

    const allCompleted = await Delivery.find({
      assignedTo: delId,
      currentStatus: "Delivered",
    });

    const todayAssignedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const todayCompletedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const todayAvailableDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Available",
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const todayActiveDeliveries =
      todayAssignedDeliveries -
      todayCompletedDeliveries -
      todayAvailableDeliveries;
    const totalAssignedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
    });
    const totalCompletedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
    });
    const totalAvailableDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Available",
    });
    const totalActiveDeliveries =
      totalAssignedDeliveries -
      totalCompletedDeliveries -
      totalAvailableDeliveries;
    const totalDeliveriesCompletedToday = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
      completedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const totalDeliveryCompletedPastweek = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
      completedAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Manually group by year, month, and day
    const PastWeekGroupedByDay = allCompleted
      .filter((delivery) => new Date(delivery.completedAt) >= sevenDaysAgo)
      .reduce((acc, delivery) => {
        const completedAt = new Date(delivery.completedAt);
        const year = completedAt.getFullYear();
        const month = completedAt.getMonth() + 1; // Months are 0-indexed in JavaScript
        const day = completedAt.getDate();

        // Create a unique key for year, month, day
        const key = `${year}-${month}-${day}`;

        // If the key already exists, increment the count
        if (acc[key]) {
          acc[key].count++;
        } else {
          acc[key] = {
            _id: { year, month, day },
            count: 1,
          };
        }

        return acc;
      }, {});

    // Use the provided function to fill missing days and get the result
    const totalDeliveryCompletedPastWeekPerDay = fillMissingDays(
      Object.values(PastWeekGroupedByDay),
      7
    );

    // Group by year, month, and day
    const groupedByDayForMonth = allCompleted
      .filter(
        (delivery) =>
          new Date(delivery.completedAt) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      .reduce((acc, delivery) => {
        const completedAt = new Date(delivery.completedAt);
        const year = completedAt.getFullYear();
        const month = completedAt.getMonth() + 1; // JavaScript months are 0-indexed
        const day = completedAt.getDate();

        const key = `${year}-${month}-${day}`;

        if (acc[key]) {
          acc[key].count++;
        } else {
          acc[key] = {
            _id: { year, month, day },
            count: 1,
          };
        }

        return acc;
      }, {});

    const totalDeliveryCompletedPastMonthPerDay = fillMissingDays(
      Object.values(groupedByDayForMonth),
      30
    );

    // Group by year and month
    const groupedByMonthForYear = allCompleted
      .filter(
        (delivery) =>
          new Date(delivery.completedAt) >=
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      )
      .reduce((acc, delivery) => {
        const completedAt = new Date(delivery.completedAt);
        const year = completedAt.getFullYear();
        const month = completedAt.getMonth() + 1; // JavaScript months are 0-indexed

        const key = `${year}-${month}`;

        if (acc[key]) {
          acc[key].count++;
        } else {
          acc[key] = {
            _id: { year, month },
            count: 1,
          };
        }

        return acc;
      }, {});

    const totalDeliveryCompletedPastYearPerMonth = fillMissingMonths(
      Object.values(groupedByMonthForYear)
    );

    const totalDeliveryCompletedPastMonth = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
      completedAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
    });

    const totalDeliveryCompletedPastYear = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Delivered",
      completedAt: { $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000) },
    });

    const longestTimeTaken = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Delivered",
      estimatedTime: { $gt: 0 },
    })
      .sort({ estimatedTime: -1 })
      .select("estimatedTime");

    const smallestTimeTaken = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Delivered",
      estimatedTime: { $gt: 0 },
    })
      .sort({ estimatedTime: 1 })
      .select("estimatedTime");

    const longestDeliveryDistance = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Delivered",
      distance: { $gt: 0 },
    })
      .sort({ distance: -1 })
      .select("distance");

    const shortestDeliveryDistance = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Delivered",
      distance: { $gt: 0 },
    })
      .sort({ distance: 1 })
      .select("distance");

    res.status(200).json({
      success: true,
      result: {
        todayAssignedDeliveries,
        todayCompletedDeliveries,
        todayAvailableDeliveries,
        todayActiveDeliveries,
        totalAssignedDeliveries,
        totalCompletedDeliveries,
        totalAvailableDeliveries,
        totalActiveDeliveries,
        totalDeliveriesCompletedToday,
        totalDeliveryCompletedPastweek,
        totalDeliveryCompletedPastMonth,
        totalDeliveryCompletedPastYear,
        totalDeliveryCompletedPastWeekPerDay,
        totalDeliveryCompletedPastMonthPerDay,
        totalDeliveryCompletedPastYearPerMonth,
        averageTimeTaken:
          allCompleted.length > 0
            ? allCompleted.reduce(
                (sum, delivery) => sum + delivery.estimatedTime,
                0
              ) / allCompleted.length
            : 0,
        longestTimeTaken: longestTimeTaken?.estimatedTime || 0,
        smallestTimeTaken: smallestTimeTaken?.estimatedTime || 0,
        averageDeliveryDistance:
          allCompleted.length > 0
            ? allCompleted.reduce(
                (sum, delivery) => sum + delivery.distance,
                0
              ) / allCompleted.length
            : 0,
        longestDeliveryDistance: longestDeliveryDistance?.distance || 0,
        shortestDeliveryDistance: shortestDeliveryDistance?.distance || 0,
      },
    });
  } catch (err) {
    console.log(
      "Error from getDeliveryDashboardData Controller : ",
      err.message
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

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

// getDeliveryDashboardData({ params: { delId: "668925f9b9e4798fc9ed3a87" } });
