import { Box, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import LineChart from "../../../../../components/charts/LineChart";

const PriceLineChartCard = ({ title, stockData }) => {
  // ApexChart config
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: stockData?.map((item) => item.month),
      title: { text: "Month" },
    },
    yaxis: {
      title: { text: "Purchase Price" },
      labels: {
        formatter: (val) => `₹${val}`,
      },
    },
    fill: { opacity: 1 },
    colors: ["#019cff"],
    legend: { position: "top" },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) => `₹${val}`,
      },
    },
  };

  const series = [
    {
      name: "Purchase Price",
      data: stockData?.map((item) => item.purchasePrice), // <-- Use your price field here
    },
  ];

  return (
    <Card w="100%">
      <CardBody>
        <Heading as="h6" size="md" mb={4}>
          {title}
        </Heading>
        {series?.length === 0 ? (
          <Box
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={"200px"}
          >
            <Text fontSize="lg" textAlign="center">
              No Data Available
            </Text>
          </Box>
        ) : (
          <Box h="250px">
            <LineChart chartData={series} chartOptions={options} />
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

PriceLineChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  stockData: PropTypes.array.isRequired,
};

export default PriceLineChartCard;
