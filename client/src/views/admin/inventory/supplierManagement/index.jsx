import ViewSupplier from "./components/ViewSupplier";
import AddEditSupplier from "./components/SupplierModal";
import SupplierCard from "./components/SupplierCard";
import { Dialog_Boxes } from "../../../../utils/constant";
import { useSupplierActions } from "../../../../hooks/useSupplierActions";
import PageLoader from "../../../../components/UI/Loader";
import { PageHeading } from "../../../../components/UI/PageHeading";
import PrimaryActionButton from "../../../../components/UI/PrimaryActionButton";
import { IoAdd } from "react-icons/io5";

export default function SupplierManagement() {
  const {
    isLoading,
    suppliers,
    handleDelete,
    handleEdit,
    handleSubmit,
    selectedSupplier,
    handleView,
    handleModalClose,
    modals,
  } = useSupplierActions();

  const { supplierViewModal, supplierAddEditModal } = modals;

  if (!suppliers) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Page Heading */}
      <PageHeading title={"Item Suppliers"} />

      {/* Page Content */}
      <div className="my-4">
        <PrimaryActionButton
          className="w-30 md:w-46 justify-between"
          onClick={() => supplierAddEditModal.onOpen()}
        >
          Add Supplier
          <IoAdd className="text-sm md:text-lg text-white" />
        </PrimaryActionButton>

        {/* Suppliers Cards */}
        <div className="my-4 mx-2 ">
          {suppliers && suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <SupplierCard
                key={supplier._id}
                supplier={supplier}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={(id) =>
                  Dialog_Boxes.showDeleteConfirmation(() => handleDelete(id))
                }
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-4xl font-semibold">
              <p>No suppliers available.</p>
            </div>
          )}
        </div>
      </div>
      {selectedSupplier && (
        <ViewSupplier
          modalRef={supplierViewModal.ref}
          isOpen={supplierViewModal.isOpen}
          onClose={handleModalClose}
          supplierData={selectedSupplier}
        />
      )}
      {supplierAddEditModal.isOpen && (
        <AddEditSupplier
          modalRef={supplierAddEditModal.ref}
          isOpen={supplierAddEditModal.isOpen}
          onClose={handleModalClose}
          selectedSupplierData={selectedSupplier}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
