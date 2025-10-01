import { useEffect, useState } from "react";
import { getAdminDashboardData, getSupplierContacts } from "../api";
import { useToast } from "../contexts/useToast";

export function useDashboard() {
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stockData: {},
    salesData: {},
    suppliers: {},
    orderData: {},
    stockData2: [
      {
        month: "Jan",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Feb",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Mar",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Apr",
        purchase: 0,
        usage: 0,
      },
      {
        month: "May",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Jun",
        purchase: 433,
        usage: 288,
      },
      {
        month: "Jul",
        purchase: 0,
        usage: 120,
      },
      {
        month: "Aug",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Sep",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Oct",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Nov",
        purchase: 0,
        usage: 0,
      },
      {
        month: "Dec",
        purchase: 0,
        usage: 0,
      },
    ],
  });

  const fetchDashboardData = async () => {
    try {
      const res = await getAdminDashboardData();
      if (res.status === 200) {
        const {
          totalStocksQuantity = 0,
          lowStocksQuantity = 0,
          expiredItems = [],
        } = res.data.result;
        setDashboardData((prev) => ({
          ...prev,
          stockData: {
            totalStocksQuantity,
            lowStocksQuantity,
            expiredItems,
          },
        }));
      }
    } catch (error) {
      showToast(
        error.message || "An error occurred while fetching employees",
        "error"
      );
    }
  };
  const fetchSuppliersData = async () => {
    try {
      const res = await getSupplierContacts();
      if (res?.status === 200 && Array.isArray(res?.data?.result)) {
        setDashboardData((prev) => ({
          ...prev,
          suppliers: res.data.result,
        }));
        console.log(res.data.result);
      } else {
        showToast(res?.data?.message || "Failed to fetch suppliers.");
      }
    } catch (err) {
      showToast("Error while fetching suppliers.");
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchSuppliersData()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    dashboardData,
  };
}
