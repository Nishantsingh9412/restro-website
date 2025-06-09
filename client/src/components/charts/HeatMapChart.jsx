import { Box, SimpleGrid, Button, Flex, Heading } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { COLOR_SCALE } from "../../utils/constant";

// Helper to get number of days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get background color based on usage
const getColor = (usage) => {
  return COLOR_SCALE.find((scale) => usage <= scale.threshold).color;
};

// Helper to format date to local format
const formatDateLocal = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// MonthlyCalendarHeatmap component
const MonthlyCalendarHeatmap = ({ chartData }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
    // Initialize selectedMonth to the first day of the current month
  });

  const daysInMonth = useMemo(() => {
    return getDaysInMonth(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth()
    );
    // Calculate the number of days in the selected month
  }, [selectedMonth]);

  const handlePrevMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
    // Handle navigation to the previous month
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    // Handle navigation to the next month
  };

  const usageMap = useMemo(() => {
    const usageMap = {};
    chartData?.forEach((entry) => {
      usageMap[entry.date] = entry.usage;
    });
    return usageMap;
    // Create a map for quick lookup of usage by date
  }, [chartData]);

  // Render the Box component as the container
  return (
    <Box p={0}>
      {/* Flex container for month navigation */}
      <Flex justify="space-between" align="center" mb={4}>
        <Button onClick={handlePrevMonth}>{"<"}</Button>
        <Heading size="md">
          {selectedMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </Heading>
        <Button onClick={handleNextMonth}>{">"}</Button>
      </Flex>

      {/* SimpleGrid to display days of the month */}
      <SimpleGrid columns={{ base: 5, sm: 7, md: 10, lg: 12 }} spacing={2}>
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dateStr = formatDateLocal(
            new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
          );

          // Get usage for the current day and determine background color
          const usage = usageMap[dateStr] || 0;
          const bg = getColor(usage);

          return (
            <Box
              key={day}
              boxSize="35px"
              bg={bg}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="sm"
              title={`Day ${dateStr}: ${usage} usage`}
              _hover={{ opacity: 0.8 }}
              cursor={"pointer"}
            >
              {day}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
// Prop types for MonthlyCalendarHeatmap
MonthlyCalendarHeatmap.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      usage: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MonthlyCalendarHeatmap;
