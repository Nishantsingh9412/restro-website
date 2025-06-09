import { useEffect, useState } from "react";
import { getStockSummary } from "../api";
import { useToast } from "../contexts/useToast";

export function useInventoryStock() {
  const showToast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [allStockItems, setAllStockItem] = useState([]);
  const [lowStockItems, setLowStockItem] = useState([]);

  useEffect(() => {
    const fetchStockSummary = async () => {
      setLoading(true);
      try {
        const res = await getStockSummary();
        if (res?.status === 200 && res?.data?.result) {
          setAllStockItem(res.data.result.allStockItems || []);
          setLowStockItem(res.data.result.lowStockItems || []);
        } else {
          setAllStockItem([]);
          setLowStockItem([]);
          showToast(
            res?.data?.message || "Failed to fetch stock summary.",
            "error"
          );
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setAllStockItem([]);
        setLowStockItem([]);
        showToast("Error while fetching stock summary.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStockSummary();
  }, [showToast]);

  return {
    isLoading,
    allStockItems,
    lowStockItems,
  };
}
