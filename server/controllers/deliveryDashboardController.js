import authDeliv from "../models/authDeliv.js";
import Delivery from "../models/delivery.js";

import mongoose from "mongoose";

export const getDeliveryDashboardData = async (req, res) => {
  try {
    const { delId } = req.params;
    console.log(delId);

    if (!mongoose.Types.ObjectId.isValid(delId))
      return res.status(404).send("Delivery boy not found");

    const allCompleted = await Delivery.find({
      assignedTo: delId,
      currentStatus: "Completed",
    });

    const todayAssignedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const todayCompletedDeliveries = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Completed",
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
      currentStatus: "Completed",
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
      currentStatus: "Completed",
      completedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const totalDeliveryCompletedPastweek = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Completed",
      completedAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
    });

    const pastWeekPerDay = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          currentStatus: "Completed",
          completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
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
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    const totalDeliveryCompletedPastWeekPerDay = fillMissingDays(
      pastWeekPerDay,
      7
    );

    const pastMonthPerDay = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          currentStatus: "Completed",
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
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
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    const totalDeliveryCompletedPastMonthPerDay = fillMissingDays(
      pastMonthPerDay,
      30
    );

    const pastYearPerMonth = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          currentStatus: "Completed",
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const totalDeliveryCompletedPastYearPerMonth =
      fillMissingMonths(pastYearPerMonth);

    const totalDeliveryCompletedPastMonth = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Completed",
      completedAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
    });

    const totalDeliveryCompletedPastYear = await Delivery.countDocuments({
      assignedTo: delId,
      currentStatus: "Completed",
      completedAt: { $gte: new Date(new Date() - 365 * 24 * 60 * 60 * 1000) },
    });

    const averageTimeTaken = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          staus: "Completed",
        },
      },
      { $group: { _id: null, estimatedTime: { $avg: "$estimatedTime" } } },
    ]);

    const longestTimeTaken = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Completed",
      estimatedTime: { $gt: 0 },
    })
      .sort({ estimatedTime: -1 })
      .select("estimatedTime");

    const smallestTimeTaken = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Completed",
      estimatedTime: { $gt: 0 },
    })
      .sort({ estimatedTime: 1 })
      .select("estimatedTime");

    const averageDeliveryDistance = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          currentStatus: "Completed",
        },
      },
      { $group: { _id: null, distance: { $avg: "$distance" } } },
    ]);

    const longestDeliveryDistance = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Completed",
      distance: { $gt: 0 },
    })
      .sort({ distance: -1 })
      .select("distance");

    const shortestDeliveryDistance = await Delivery.findOne({
      assignedTo: delId,
      currentStatus: "Completed",
      distance: { $gt: 0 },
    })
      .sort({ distance: 1 })
      .select("distance");

    const matchedTemp = await Delivery.aggregate([
      {
        $match: {
          assignedTo: delId,
          // currentStatus: "Completed",
          // createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
    ]);

    const anotherTemp = await Delivery.find({
      assignedTo: delId,
      currentStatus: "Completed",
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    console.log(
      "last week",
      pastWeekPerDay,
      anotherTemp.map((item) => item.completedAt)
    );
    if (false)
      console.log({
        "Today Assigned": todayAssignedDeliveries,
        "Today Completed": todayCompletedDeliveries,
        "Today Available": todayAvailableDeliveries,
        "Today Active": todayActiveDeliveries,
        "Total Assigned": totalAssignedDeliveries,
        "Total Completed": totalCompletedDeliveries,
        "Total Available": totalAvailableDeliveries,
        "Total Active": totalActiveDeliveries,
        "Total Completed Today": totalDeliveriesCompletedToday,
        "Total Completed Past Week": totalDeliveryCompletedPastweek,
        "Total Completed Past Month": totalDeliveryCompletedPastMonth,
        "Total Completed Past Year": totalDeliveryCompletedPastYear,
        "Total Completed Past Week Per Day":
          totalDeliveryCompletedPastWeekPerDay,
        "Total Completed Past Month Per Day":
          totalDeliveryCompletedPastMonthPerDay,
        "Total Completed Past Year Per Month":
          totalDeliveryCompletedPastYearPerMonth,
        "Average Time Taken":
          allCompleted.length > 0
            ? allCompleted.reduce(
                (sum, delivery) => sum + delivery.estimatedTime,
                0
              ) / allCompleted.length
            : 0,
        "Longest Time Taken": longestTimeTaken?.estimatedTime || 0,
        "Shortest Time Taken": smallestTimeTaken?.estimatedTime || 0,
        "Average Delivery Distance":
          allCompleted.length > 0
            ? allCompleted.reduce(
                (sum, delivery) => sum + delivery.distance,
                0
              ) / allCompleted.length
            : 0,
        "Longest Delivery Distance": longestDeliveryDistance?.distance || 0,
        "Shortest Delivery Distance": shortestDeliveryDistance?.distance || 0,
      });

    if (res)
      res.status(200).json({
        success: true,
        additional: {
          distances: allCompleted.map((del) => del.distance),
          times: allCompleted.map((del) => del.estimatedTime),
        },
        isUndefined: {
          averageTimeTaken,
          smallestTimeTaken,
          longestTimeTaken,
          averageDeliveryDistance,
          longestDeliveryDistance,
          shortestDeliveryDistance,
        },
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
    if (res)
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

getDeliveryDashboardData({ params: { delId: "668925f9b9e4798fc9ed3a87" } });
