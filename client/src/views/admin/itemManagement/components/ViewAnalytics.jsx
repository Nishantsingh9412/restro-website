/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { format, addMonths } from "date-fns";
import { GetSingleItemAction } from "../../../../redux/action/Items.js";

const ViewAnalytics = ({ isOpen, onClose, AnalyticsSelectedId }) => {
  const dispatch = useDispatch();

  // Fetch the selected item's data when the component is mounted or AnalyticsSelectedId changes
  useEffect(() => {
    if (AnalyticsSelectedId) {
      dispatch(GetSingleItemAction(AnalyticsSelectedId));
    }
  }, [AnalyticsSelectedId, dispatch]);

  // Fetch selected item data from Redux store
  const SelectedItemData = useSelector(
    (state) => state.itemsReducer.selectedItem
  );

  // State for chart data
  const [data, setData] = useState([]);

  // Update chart data based on the selected item
  useEffect(() => {
    if (SelectedItemData) {
      // Assuming we want to show stock data for the next 12 months from the creation date
      const creationDate = new Date(SelectedItemData.createdAt);
      const monthsData = Array.from({ length: 12 }, (_, i) => {
        const monthDate = addMonths(creationDate, i);
        return {
          month: format(monthDate, "MMMM"), // Format month name
          available_quantity: SelectedItemData.available_quantity, // Use the available quantity from the item
        };
      });

      // Set the dynamic chart data
      setData(monthsData);
    }
  }, [SelectedItemData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="80vw" maxH="85vh">
        <ModalHeader display={"flex"} justifyContent={"center"}>
          {SelectedItemData?.item_name || "Item Analytics"}{" "}
          {/* Display item name or fallback */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={data} // Chart data
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /> {/* X-axis showing months */}
              <YAxis />
              <Tooltip /> {/* Tooltip to show data on hover */}
              <Legend /> {/* Legend to indicate the chart data */}
              <Line
                type="monotone"
                dataKey="available_quantity" // Line represents available stock quantity
                stroke="#8884d8"
                activeDot={{ r: 8 }} // Customize active dot on the line
              />
            </LineChart>
          </ResponsiveContainer>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="cyan" mr={3} onClick={onClose}>
            Close
          </Button>
          {/* You can add more actions here if needed */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewAnalytics;
