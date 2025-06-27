import { useEffect, useState } from "react";
import { getStockSummary } from "../api";
import { useToast } from "../contexts/useToast";

export function useInventoryStock() {
  const showToast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [allStockItems, setAllStockItem] = useState([]);

  useEffect(() => {
    const fetchStockSummary = async () => {
      setLoading(true);
      try {
        const res = await getStockSummary();
        if (res?.status === 200 && res?.data?.result) {
          setAllStockItem(res.data.result.allStockItems || []);
        } else {
          setAllStockItem([]);
          showToast(
            res?.data?.message || "Failed to fetch stock summary.",
            "error"
          );
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setAllStockItem([]);
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
  };
}
