import StockSummaryCard from "./components/StockCard";
import PageLoader from "../../../../components/UI/Loader";
import { useInventoryStock } from "../../../../hooks/useInventoryStock";
import { PageHeading } from "../../../../components/UI/PageHeading";

const StockSummary = () => {
  const { allStockItems, isLoading } = useInventoryStock();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Heading */}
      <PageHeading title={"Stock Summary"} />

      {/* Page Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mx-2 my-4">
        {allStockItems?.map((item, index) => (
          <StockSummaryCard key={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default StockSummary;
