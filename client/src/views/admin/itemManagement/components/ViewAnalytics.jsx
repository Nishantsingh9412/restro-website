import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { getSingleItemReports } from "../../../../api";
import StockBarChartCard from "../../inventoryDashboard/components/StockBarCard";
import HeatMapCard from "../../inventoryDashboard/components/HeatMapCard";
import PriceLineChartCard from "../../inventoryDashboard/components/PriceChartCard";

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

  const renderChartSection = () => {
    if (loading) {
      return (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      );
    }

    const { monthlyStockData, monthlyPurchasePrice, dailyUsage } = reportData;
    const hasData =
      monthlyStockData.length ||
      monthlyPurchasePrice.length ||
      dailyUsage.length;

    if (!hasData) {
      return (
        <Text textAlign="center" color="gray.500" mt={4}>
          No analytics data available.
        </Text>
      );
    }

    return (
      <Flex direction="column" gap={4} w="100%">
        {/* Price Chart */}
        <Box w="100%">
          <PriceLineChartCard
            title="Price Analytics"
            stockData={monthlyPurchasePrice}
          />
        </Box>

        {/* Stock & Usage */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          justify="space-between"
          w="100%"
        >
          <Box flex="1">
            <StockBarChartCard
              title="Stock Analytics"
              stockData={monthlyStockData}
            />
          </Box>
          <Box flex="1">
            <HeatMapCard title="Usage Analytics" chartData={dailyUsage} />
          </Box>
        </Flex>
      </Flex>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxW={{ base: "95vw", md: "85vw" }} maxH="90vh">
        <ModalHeader textAlign="center" fontSize={{ base: "lg", md: "2xl" }}>
          {itemData?.itemName || "Item Analytics"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px={{ base: 4, md: 8 }} py={6}>
          {renderChartSection()}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose} px={6}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
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
