import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getLowStocksAction,
  getAllStocksAction,
} from "../../../redux/action/stocks";
import LowStockItem from "./components/LowStockCard"; // Import the new LowStockItem component
import { localStorageData } from "../../../utils/constant";

const LowStockCard = () => {
  const dispatch = useDispatch();
  const localData =
    JSON.parse(localStorage.getItem(localStorageData.PROFILE_DATA)) || {};
  const userId = localData?.result?._id;

  // Fetch stock items from Redux state
  const allStockItems = useSelector((state) => state.stocksReducer.stocks);
  const lowStockItems = useSelector((state) => state.stocksReducer.lowStocks);

  useEffect(() => {
    if (userId) {
      dispatch(getAllStocksAction(userId));
      dispatch(getLowStocksAction(userId));
    }
  }, [userId, dispatch]);

  // Helper to check if stock is low
  const isLowStock = (item) => {
    const percentage = (item.availableQuantity / item.lowStockQuantity) * 100;
    return percentage <= 30; // Define your own threshold logic
  };

  return (
    <>
      {/* Low Stock Alert Section */}
      <div style={{ marginTop: "5vw", fontWeight: "bold" }}>
        <h1
          style={{
            marginLeft: "10px",
            fontWeight: "900",
            color: "#3e97cd",
            fontSize: "1.5rem",
          }}
        >
          Low Stocks Alert
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "25px",
            gap: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {lowStockItems.map((item, index) => (
            <LowStockItem key={index} item={item} index={index} isLow={true} />
          ))}
        </div>
      </div>

      {/* Overall Stocks Section */}
      <div style={{ marginTop: "3vw" }}>
        <h1
          style={{
            marginLeft: "10px",
            fontWeight: "900",
            color: "#3e97cd",
            fontSize: "1.5rem",
          }}
        >
          Overall Stocks
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "25px",
            gap: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {allStockItems.map((item, index) => (
            <LowStockItem
              key={index}
              item={item}
              index={index}
              isLow={isLowStock(item)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LowStockCard;
