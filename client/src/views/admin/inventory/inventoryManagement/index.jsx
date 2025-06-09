// Import necessary libraries and components
import {
  Box,
  Button,
  IconButton,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import ViewCode from "./components/ViewCode";
import { IoMdAdd, IoMdAnalytics } from "react-icons/io";
import { Dialog_Boxes } from "../../../../utils/constant";
import ItemUseModal from "./components/ItemUseModal";
import BarCodeScanner from "./components/BarCodeScan";
import ViewAnalytics from "./components/ViewAnalytics";
import BarCodePrinter from "./components/BarCodePrinter";
import ItemAddEditModal from "./components/itemModal";
import ForbiddenPage from "../../../../components/forbiddenPage/ForbiddenPage";
import { IoMdQrScanner, IoMdTrash } from "react-icons/io";
import { IoCart, IoEllipsisVerticalSharp, IoPencil } from "react-icons/io5";
import { useInventoryActions } from "../../../../hooks/useInventoryActions";
import { MdBarcodeReader } from "react-icons/md";
import ActionModeModal from "./components/ActionModeModal";

export default function InventoryManagement() {
  const {
    modals,
    loading,
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

  const {
    scannerModal,
    itemAddEditModal,
    itemUseModal,
    barCodeModal,
    analyticsModal,
    actionModeModal,
  } = modals;

  if (!isPermitted) {
    return <ForbiddenPage isPermitted={isPermitted} />;
  }

  // Loader component to show while data is being fetched
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="var(--primary)" />
      </Flex>
    );
  }

  return (
    <Box overflowX="auto">
      {/* Canvas for view barcode */}
      <canvas id="mycanvas" style={{ display: "none" }}></canvas>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          mt={4}
          gap={{ base: 2, md: 0 }}
        >
          <Button
            leftIcon={<IoMdQrScanner />}
            colorScheme="teal"
            variant="solid"
            p={4}
            onClick={scannerModal.onOpen}
            w={{ base: "100%", md: "auto" }}
            mb={{ base: 2, md: 0 }}
          >
            Open Scanner
          </Button>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 2 }}
            w={{ base: "100%", md: "auto" }}
          >
            <Button
              leftIcon={<IoMdAdd />}
              colorScheme="teal"
              variant="solid"
              p={4}
              onClick={itemAddEditModal.onOpen}
              w={{ base: "100%", md: "auto" }}
              mb={{ base: 2, md: 0 }}
            >
              Add Item
            </Button>
            <Button
              leftIcon={<IoCart />}
              colorScheme="teal"
              variant="solid"
              p={4}
              onClick={itemUseModal.onOpen}
              w={{ base: "100%", md: "auto" }}
            >
              Use Item
            </Button>
          </Flex>
        </Flex>

        <Box overflowX="auto">
          {/* Table Header */}
          <Box display={{ base: "none", lg: "block" }} mt="10px">
            <Grid
              templateColumns="repeat(8, 1fr)"
              gap={6}
              bg="gray.100"
              p={2}
              borderRadius="md"
              textAlign="center"
              fontWeight="bold"
              fontSize="md"
              className="tableHeader"
            >
              <GridItem>Item Name</GridItem>
              <GridItem>Unit</GridItem>
              <GridItem>Available</GridItem>
              <GridItem>Minimum</GridItem>
              <GridItem>BarCode No.</GridItem>
              <GridItem>Last Replenished</GridItem>
              <GridItem>Expiry Date</GridItem>
              <GridItem>Actions</GridItem>
            </Grid>

            {/* Table Rows */}
            {inventoryItems?.map((item, index) => (
              <Grid
                templateColumns="repeat(8, 1fr)"
                gap={2}
                my={1}
                key={index}
                bg={index % 2 === 0 ? "white" : "gray.50"}
                py={2}
                borderRadius="md"
                alignItems="center"
                className="tableRow"
                textAlign="center"
                fontWeight={500}
              >
                <GridItem mx={1}>
                  {item.itemName && item.itemName.length > 18
                    ? `${item.itemName.substring(0, 18)}...`
                    : item.itemName || "-"}
                </GridItem>
                <GridItem>{item.itemUnit || "-"}</GridItem>
                <GridItem>{item.availableQuantity ?? "-"}</GridItem>
                <GridItem>{item.lowStockQuantity ?? "-"}</GridItem>
                <GridItem>
                  <BarCodePrinter barCodeValue={item?.barCode} /> <br />
                  {item.barCode || "--"}
                </GridItem>
                <GridItem>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString("en-GB")
                    : "--"}
                </GridItem>
                <GridItem>
                  {item.expiryDate
                    ? new Date(item.expiryDate).toLocaleDateString("en-GB")
                    : "--"}
                </GridItem>
                <GridItem>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<IoEllipsisVerticalSharp />}
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<IoPencil />}
                        onClick={() => handleEditButton(item)}
                      >
                        Edit Item
                      </MenuItem>
                      <MenuItem
                        icon={<IoMdTrash />}
                        onClick={() =>
                          Dialog_Boxes.showDeleteConfirmation(() =>
                            handleDeleteItem(item._id)
                          )
                        }
                      >
                        Delete Item
                      </MenuItem>
                      <MenuItem
                        icon={<MdBarcodeReader />}
                        onClick={() => handleGenerateBarCode(item)}
                      >
                        Generate BarCode
                      </MenuItem>
                      <MenuItem
                        icon={<IoMdAnalytics />}
                        onClick={() => {
                          analyticsModal.onOpen();
                          setSelectedItem(item);
                        }}
                      >
                        View Analytics
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </GridItem>
              </Grid>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Mobile View */}
      <Box display={{ base: "block", lg: "none" }} mt="10px">
        {inventoryItems?.map((item, index) => (
          <Box
            key={index}
            mb={4}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
          >
            <Box>
              <strong>Item Name:</strong>{" "}
              {item.itemName && item.itemName.length > 18
                ? `${item.itemName.substring(0, 18)}...`
                : item.itemName || "-"}
            </Box>
            <Box>
              <strong>Unit:</strong> {item.itemUnit || "-"}
            </Box>
            <Box>
              <strong>Available:</strong> {item.availableQuantity ?? "-"}
            </Box>
            <Box>
              <strong>Minimum:</strong> {item.lowStockQuantity ?? "-"}
            </Box>
            <Box>
              <strong>BarCode No.:</strong> {item.barCode || "--"}
            </Box>
            <Box>
              <strong>Last Replenished:</strong>{" "}
              {item.updatedAt
                ? new Date(item.updatedAt).toLocaleDateString("en-GB")
                : "--"}
            </Box>
            <Box>
              <strong>Expiry Date:</strong>{" "}
              {item.expiryDate
                ? new Date(item.expiryDate).toLocaleDateString("en-GB")
                : "--"}
            </Box>

            <Box mt={2}>
              <Flex justifyContent="center">
                <IconButton
                  aria-label="Delete Item"
                  colorScheme="red"
                  size="md"
                  icon={<IoMdTrash />}
                  onClick={() =>
                    Dialog_Boxes.showDeleteConfirmation(() =>
                      handleDeleteItem(item._id)
                    )
                  }
                  mr={2}
                />
                <IconButton
                  aria-label="Edit Item"
                  colorScheme="yellow"
                  size="md"
                  icon={<IoPencil />}
                  onClick={() => handleEditButton(item)}
                  mr={2}
                />
                <IconButton
                  aria-label="Generate BarCode"
                  colorScheme="blue"
                  size="md"
                  icon={<MdBarcodeReader />}
                  onClick={() => handleGenerateBarCode(item)}
                  mr={2}
                />
                <IconButton
                  aria-label="Analytics"
                  colorScheme="teal"
                  size="md"
                  icon={<IoMdAnalytics />}
                  onClick={() => {
                    analyticsModal.onOpen();
                    setSelectedItem(item);
                  }}
                  mr={2}
                />
                <BarCodePrinter barCodeValue={item?.barCode} isMobile={true} />
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
      {/* </Box> */}

      {itemAddEditModal.isOpen && (
        <ItemAddEditModal
          isOpen={itemAddEditModal.isOpen}
          onClose={handleOnItemModalClose}
          onSubmit={selectedItem?._id ? handleUpdateItem : handleAddItem}
          itemData={selectedItem}
          suppliers={supplierData}
        />
      )}
      {scannerModal.isOpen && (
        <BarCodeScanner
          isOpen={scannerModal.isOpen}
          onClose={scannerModal.onClose}
          onScanned={handleAfterScanned}
        />
      )}
      {actionModeModal.isOpen && (
        <ActionModeModal
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
          isOpen={barCodeModal.isOpen}
          onClose={barCodeModal.onClose}
          barCodeData={barCodeData}
        />
      )}
      {analyticsModal.isOpen && (
        <ViewAnalytics
          isOpen={analyticsModal.isOpen}
          onClose={analyticsModal.onClose}
          itemData={selectedItem}
        />
      )}
      {itemUseModal.isOpen && (
        <ItemUseModal
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
    </Box>
  );
}
