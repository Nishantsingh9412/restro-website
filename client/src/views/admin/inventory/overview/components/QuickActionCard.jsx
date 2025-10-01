import PrimaryActionButton from "../../../../../components/UI/PrimaryActionButton";

const QuickActionCard = () => {
  return (
    <div className="!border !border-yellow-300 rounded-lg flex-1 p-3 flex flex-col gap-3">
      {/* Header */}
      <h3 className="!font-semibold">Quick Actions</h3>

      {/* Button Container */}
      <div className="flex flex-wrap md:flex-col gap-2 md:gap-3 flex-1">
        <PrimaryActionButton className="w-[48%] md:w-full md:flex-1 flex justify-center items-center">
          Add New Item
        </PrimaryActionButton>
        <PrimaryActionButton className="w-[48%] md:w-full md:flex-1 flex justify-center items-center">
          Scan Barcode
        </PrimaryActionButton>
        <PrimaryActionButton className="w-[48%] md:w-full md:flex-1 flex justify-center items-center">
          View Reports
        </PrimaryActionButton>
        <PrimaryActionButton className="w-[48%] md:w-full md:flex-1 flex justify-center items-center">
          Waste Entry
        </PrimaryActionButton>
      </div>
    </div>
  );
};

export default QuickActionCard;
