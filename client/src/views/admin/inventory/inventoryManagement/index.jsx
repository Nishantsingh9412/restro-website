// Import necessary libraries and components
import ViewCode from "./components/ViewCode";
import { IoCart } from "react-icons/io5";
import ItemUseModal from "./components/ItemUseModal";
import BarCodeScanner from "./components/BarCodeScan";
import ItemAddEditModal from "./components/itemModal";
import ViewAnalytics from "./components/ViewAnalytics";
import ActionModeModal from "./components/ActionModeModal";
import { IoMdAdd, IoMdQrScanner } from "react-icons/io";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import { useInventoryActions } from "../../../../hooks/useInventoryActions";
import { PageHeading } from "../../../../components/UI/PageHeading";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import InventoryTableRow from "./components/InventoryTableRow";
import { PageFooter } from "../../../../components/UI/PageFooter";
import InventoryDetailCard from "./components/InventoryDetailCard";
import PageLoader from "../../../../components/UI/Loader";
import { useScreen } from "../../../../hooks/useScreen";

export default function InventoryManagement() {
  const {
    modals,
    loading,
    dropdownRef,
    rowActionId,
    setRowActionId,
    isPermitted,
    barCodeData,
    inventoryItems,
    selectedItem,
    setSelectedItem,
    supplierData,
    handleEditButton,
    handleAddItem,
    handleUseItem,
    handleUpdateItem,
    handleDeleteItem,
    handleAfterScanned,
    handleOnItemModalClose,
    handleGenerateBarCode,
  } = useInventoryActions();

  const isLargeScreen = useScreen();

  const {
    scannerModal,
    itemAddEditModal,
    itemUseModal,
    barCodeModal,
    analyticsModal,
    actionModeModal,
  } = modals;

  // Loader component to show while data is being fetched
  if (loading) {
    return <PageLoader />;
  }

  // Show Forbidden page when not allowed to access
  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  return (
    <>
      {/* BarCode Modal */}
      <canvas id="mycanvas" style={{ display: "none" }}></canvas>
      {/* Heading */}
      <PageHeading title={"Item Management"} />
      {/* Buttons */}
      <div className="flex justify-between items-center mx-3 md:my-4">
        <PrimaryActionButton onClick={scannerModal.onOpen}>
          Open Scanner
          <IoMdQrScanner />
        </PrimaryActionButton>

        <div className="flex gap-1 md:gap-2">
          <PrimaryActionButton onClick={itemAddEditModal.onOpen}>
            Add Item
            <IoMdAdd />
          </PrimaryActionButton>
          <PrimaryActionButton onClick={itemUseModal.onOpen}>
            Use Item
            <IoCart />
          </PrimaryActionButton>
        </div>
      </div>

      {/* Page content */}
      <div className="overflow-x-auto px-2 ">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-7 md:gap-2 xl:gap-6 bg-primary text-white p-2 rounded-t-xl text-center font-semibold xl:text-base lg:text-sm ">
          <div>Item Name</div>
          {/* <div>Unit</div> */}
          <div>Available</div>
          <div>Minimum</div>
          <div>Bar Code No</div>
          <div>Last Updated</div>
          <div>Expiry Date</div>
          <div>Action</div>
        </div>
        {/* Table Rows */}
        {isLargeScreen ? (
          <div className="hidden lg:block">
            {inventoryItems?.map((item, index) => (
              <InventoryTableRow
                key={index}
                item={item}
                index={index}
                dropdownRef={dropdownRef}
                isOpen={rowActionId === index}
                analyticsModal={analyticsModal}
                setRowActionId={setRowActionId}
                rowLength={inventoryItems?.length || 0}
                setSelectedItem={setSelectedItem}
                handleDeleteItem={handleDeleteItem}
                handleEditButton={handleEditButton}
                handleGenerateBarCode={handleGenerateBarCode}
              />
            ))}
          </div>
        ) : (
          <div className="lg:hidden">
            {inventoryItems?.map((item, index) => (
              <InventoryDetailCard
                key={index}
                item={item}
                index={index}
                dropdownRef={dropdownRef}
                isOpen={rowActionId === index}
                analyticsModal={analyticsModal}
                setRowActionId={setRowActionId}
                inventoryItems={inventoryItems}
                setSelectedItem={setSelectedItem}
                handleDeleteItem={handleDeleteItem}
                handleEditButton={handleEditButton}
                handleGenerateBarCode={handleGenerateBarCode}
              />
            ))}
          </div>
        )}
        <PageFooter />

        {itemAddEditModal.isOpen && (
          <ItemAddEditModal
            ref={itemAddEditModal.ref}
            isOpen={itemAddEditModal.isOpen}
            onClose={handleOnItemModalClose}
            onSubmit={selectedItem?._id ? handleUpdateItem : handleAddItem}
            itemData={selectedItem}
            suppliers={supplierData}
          />
        )}
        {scannerModal.isOpen && (
          <BarCodeScanner
            modalRef={scannerModal.ref}
            isOpen={scannerModal.isOpen}
            onClose={scannerModal.onClose}
            onScanned={handleAfterScanned}
          />
        )}
        {actionModeModal.isOpen && (
          <ActionModeModal
            ref={actionModeModal.ref}
            isOpen={actionModeModal.isOpen}
            onClose={() => {
              actionModeModal.onClose();
              setSelectedItem(null);
            }}
            onAddUpdate={() => {
              itemAddEditModal.onOpen();
              actionModeModal.onClose();
            }}
            onUseItem={() => {
              itemUseModal.onOpen();
              actionModeModal.onClose();
            }}
            selectedItemId={selectedItem?._id}
          />
        )}

        {barCodeModal.isOpen && (
          <ViewCode
            ref={barCodeModal.ref}
            isOpen={barCodeModal.isOpen}
            onClose={barCodeModal.onClose}
            barCodeData={barCodeData}
          />
        )}
        {analyticsModal.isOpen && (
          <ViewAnalytics
            ref={analyticsModal.ref}
            isOpen={analyticsModal.isOpen}
            onClose={analyticsModal.onClose}
            itemData={selectedItem}
          />
        )}
        {itemUseModal.isOpen && (
          <ItemUseModal
            ref={itemUseModal.ref}
            isOpen={itemUseModal.isOpen}
            onClose={() => {
              itemUseModal.onClose();
              setSelectedItem(null);
            }}
            onSubmit={handleUseItem}
            itemsList={inventoryItems}
            itemData={selectedItem}
          />
        )}
      </div>
    </>
  );
}
