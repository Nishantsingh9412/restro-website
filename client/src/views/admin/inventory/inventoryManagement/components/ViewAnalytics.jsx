import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../components/UI/Modal";
import StockBarChartCard from "../../overview/components/StockBarCard";
import HeatMapCard from "../../overview/components/HeatMapCard";
import PriceLineChartCard from "../../overview/components/PriceChartCard";
import { getSingleItemReports } from "../../../../../api";
import PageLoader from "../../../../../components/UI/Loader";

const ViewAnalytics = ({ isOpen, onClose, itemData }) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    monthlyStockData: [],
    monthlyPurchasePrice: [],
    dailyUsage: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!itemData?._id) return;
      setLoading(true);
      try {
        const res = await getSingleItemReports(itemData._id);
        const {
          monthlyStockData = [],
          monthlyPurchasePrice = [],
          dailyUsage = [],
        } = res?.data?.result ?? {};
        setReportData({ monthlyStockData, monthlyPurchasePrice, dailyUsage });
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemData]);

  const { monthlyStockData, monthlyPurchasePrice, dailyUsage } = reportData;
  const hasData =
    monthlyStockData.length || monthlyPurchasePrice.length || dailyUsage.length;

  if (loading) {
    return <PageLoader />;
  }

  if (!hasData) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No analytics data available.
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[90vw]"
      innerClassName="px-4 py-6 md:max-h-[90vh]"
      title={itemData?.itemName}
    >
      <div className="flex flex-col md:flex-col gap-4 w-full">
        {/* Price Chart */}
        <div className="w-full hidden md:block">
          <PriceLineChartCard
            title="Price Analytics"
            stockData={monthlyPurchasePrice}
          />
        </div>
        {/* Stock & Usage */}
        <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
          <div className="flex-1">
            <StockBarChartCard
              title="Stock Analytics"
              stockData={monthlyStockData}
            />
          </div>
          <div className="flex-1">
            <HeatMapCard title="Usage Analytics" chartData={dailyUsage} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

ViewAnalytics.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.shape({
    _id: PropTypes.string,
    itemName: PropTypes.string,
  }),
};

export default ViewAnalytics;
