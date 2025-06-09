import { useEffect, useMemo, useState } from "react";
import { getInventoryDashboardData } from "../api";

export default function useInventoryDashBoard() {
  const [dashboardData, setDashboardData] = useState({
    inventoryItems: [],
    expiredCount: 0,
    lowStockCount: 0,
    upcomingExpiry: 0,
    charts: {
      dailyUsage: [],
      monthlyStockData: [],
      monthlyPurchasePrice: [],
    },
    tableData: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await getInventoryDashboardData();
      if (response?.status === 200 && response?.data?.result) {
        const {
          inventoryItems = [],
          expiredCount = 0,
          lowStockCount = 0,
          upcomingExpiry = 0,
          charts = {},
          recentActions = [],
        } = response.data.result;

        setDashboardData({
          inventoryItems,
          expiredCount,
          lowStockCount,
          upcomingExpiry,
          charts: {
            dailyUsage: charts?.dailyUsage || [],
            monthlyStockData: charts?.monthlyStockData || [],
            monthlyPurchasePrice: charts?.monthlyPurchasePrice || [],
          },
          tableData: recentActions,
        });
      } else {
        console.warn("Unexpected API response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { inventoryItems, expiredCount, lowStockCount, upcomingExpiry } =
    dashboardData;

  const { allStockCount } = useMemo(() => {
    return inventoryItems.reduce(
      (acc, { availableQuantity }) => {
        acc.allStockCount += availableQuantity;
        return acc;
      },
      { allStockCount: 0 }
    );
  }, [inventoryItems]);

  const transformedChartData = inventoryItems.reduce(
    (acc, item) => {
      acc.data.push(item?.availableQuantity);
      acc.options.labels.push(item?.itemName);
      return acc;
    },
    { data: [], options: { labels: [] } }
  );

  return {
    isLoading,
    allStockCount,
    expiredCount,
    lowStockCount,
    upcomingExpiry,
    transformedChartData,
    charts: dashboardData.charts,
    tableData: dashboardData.tableData,
  };
}
