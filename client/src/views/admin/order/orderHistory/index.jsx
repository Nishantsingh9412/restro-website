import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage.jsx";
import AllotPersonnelModal from "./components/AllotOrderModal.jsx";
import AllotDeliveryModal from "./components/AllotDeliveryModal.jsx";
import { PageHeading } from "../../../../components/UI/PageHeading.jsx";
import PageLoader from "../../../../components/UI/Loader.jsx";
import { Input } from "../../../../components/common/InputField.jsx";
import { useOrderHistoryLogic } from "../../../../hooks/useOrderHistory.js";

const OrderHistory = () => {
  const {
    loading,
    isPermitted,
    startDate,
    endDate,
    searchQuery,
    activeTabIndex,
    selectedOrderId,
    selectedRole,
    isPersonnelModalOpen,
    personnelModalRef,
    closePersonnelModal,
    isDeliveryModalOpen,
    deliveryModalRef,
    closeDeliveryModal,
    setStartDate,
    setEndDate,
    setSearchQuery,
    setActiveTabIndex,
    handleAllotOrder,
    handlePersonnelSubmit,
    handleDeliverySubmit,
    filterOrders,
    getSelectedOrderType,
    showToast,
  } = useOrderHistoryLogic();

  if (loading) {
    return <PageLoader />;
  }
  // Show Forbidden page when not allowed to access
  if (!isPermitted) return <ForbiddenPage isPermitted={isPermitted} />;

  return (
    <>
      {/* Modals */}
      {isPersonnelModalOpen && (
        <AllotPersonnelModal
          ref={personnelModalRef}
          isOpen={isPersonnelModalOpen}
          onClose={closePersonnelModal}
          onSubmit={handlePersonnelSubmit}
          personnelType={selectedRole}
        />
      )}
      {isDeliveryModalOpen && (
        <AllotDeliveryModal
          ref={deliveryModalRef}
          isOpen={isDeliveryModalOpen}
          onClose={closeDeliveryModal}
          onSubmit={handleDeliverySubmit}
          orderId={selectedOrderId}
        />
      )}
      {/* Page Heading */}
      <PageHeading title="Order History" />
      {/* Main Content */}
      <div className="my-4 md:my-8 px-2">
        {/* Tabs + Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {["Delivery", "Dine-In", "TakeAway"].map((tab, idx) => (
              <button
                key={tab}
                className={`!px-4 !py-2 rounded-lg font-medium text-sm md:text-base transition shadow ${
                  activeTabIndex === idx
                    ? "!bg-primary !text-white"
                    : "!bg-white !border !border-primary !text-primary"
                }`}
                onClick={() => setActiveTabIndex(idx)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters: Date + Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-start lg:justify-end w-full lg:w-auto">
            {/* Date Picker */}
            <div className="flex items-center gap-2 w-full px-10 sm:p-0 sm:w-auto justify-evenly">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (endDate && date > endDate) {
                    setEndDate(null);
                  }
                  setStartDate(date);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                isClearable
                dateFormat="dd/MM/yyyy"
                customInput={<TailwindDateInput />}
              />
              <span className="font-medium">—</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  if (!date) setEndDate(null);
                  else if (startDate && date < startDate) {
                    showToast(
                      "End date cannot be earlier than start date",
                      "error"
                    );
                    return;
                  }
                  setEndDate(date);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                isClearable
                dateFormat="dd/MM/yyyy"
                customInput={<TailwindDateInput />}
              />
            </div>

            {/* Search */}
            <div className="w-full sm:w-auto flex-grow">
              <Input
                type="text"
                label="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Tab Panels */}
        {(() => {
          const { orderData, component: ComponentToRender } =
            getSelectedOrderType();
          const filteredOrders = filterOrders(orderData);
          return (
            <div>
              <div className="mt-4 px-2">
                {filteredOrders?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
                    {filteredOrders.map((order) => (
                      <ComponentToRender
                        key={order._id}
                        orderData={order}
                        handleAllotOrder={(role) =>
                          handleAllotOrder(order?.orderId, role)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center mt-4 font-semibold text-gray-500">
                    No Orders
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
};

// Tailwind styled custom input for react-datepicker
const TailwindDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className={`!border !border-gray-300 rounded-md !px-2 !py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary min-w-[120px] text-left ${
      !value ? "!text-gray-400 italic" : "text-black"
    }`}
  >
    {value || placeholder}
  </button>
));

TailwindDateInput.displayName = "TailwindDateInput";

TailwindDateInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
};

export default OrderHistory;
