import ItemCard from "./components/ItemCard";
import ShowItemModal from "./components/ItemModal";
import CheckoutSummary from "./components/CheckoutSummary";
import CartBox from "./components/CartBox";
import GuestsCartBox from "./components/GuestsCartBox";
import { orderMethods, orderTypes } from "../../../../utils/constant";
import { Input } from "../../../../components/common/InputField";
import { SelectField } from "../../../../components/common/SelectField";
import PageLoader from "../../../../components/UI/Loader";
import { useOrderMenuLogic } from "../../../../hooks/useOrderMenuLogic";

const OrderMenu = () => {
  const {
    loading,
    itemModal,
    checkoutModal,
    allItemsData,
    selectedItem,
    searchTerm,
    filter,
    filteredMenu,
    orderMethod,
    orderType,
    handleAddToCart,
    handleShowItem,
    handleCloseModal,
    setSearchTerm,
    setFilter,
  } = useOrderMenuLogic();

  if (loading) {
    return <PageLoader />;
  }

  if (!allItemsData || Object.keys(allItemsData).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-teal-600">No items available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap mx-3 mt-3 gap-6 justify-between !bg-white">
      {/* Show Item Modal */}
      {itemModal.isOpen && (
        <ShowItemModal
          ref={itemModal.ref}
          isOpen={itemModal.isOpen}
          onClose={handleCloseModal}
          item={selectedItem}
          handleAddToCart={handleAddToCart}
        />
      )}
      {/* Checkout Component */}
      {checkoutModal.isOpen && (
        <CheckoutSummary
          ref={checkoutModal.ref}
          isOpen={checkoutModal.isOpen}
          onClose={checkoutModal.onClose}
        />
      )}
      {/* Left: Menu List */}
      <div className="flex-1 min-w-[300px]">
        <div className="flex mb-3 gap-2 items-center">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Search Items"
          />

          <SelectField
            id="type"
            label="All"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            options={Object.keys(allItemsData).map((category) => ({
              value: category.toLowerCase(),
              label: category,
            }))}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 !border rounded-xl shadow !border-blue-300 py-6 px-5 bg-white">
          {filteredMenu.map((result, index) => (
            <ItemCard
              key={index}
              item={result}
              handleShowItem={handleShowItem}
            />
          ))}
        </div>
      </div>
      {/*  Right: Cart */}
      <div className="min-w-[320px] max-w-[400px] w-full ">
        {orderMethod === orderMethods.INDIVIDUAL &&
        orderType === orderTypes.DINE_IN ? (
          <GuestsCartBox handleOnProceed={checkoutModal.onOpen} />
        ) : (
          <CartBox handleOnProceed={checkoutModal.onOpen} />
        )}
      </div>
    </div>
  );
};

export default OrderMenu;
