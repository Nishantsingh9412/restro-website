import { Box, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import ColumnChart from "../../../../components/charts/BarChart";
import PropTypes from "prop-types";

const StockBarChartCard = ({ stockData }) => {
  // ApexChart config
  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: stockData?.map((item) => item.month),
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Stock Quantity",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#00E396", "#FEB019"], // Green for Purchase, Yellow for Usage
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} units`,
      },
    },
  };

  const series = [
    {
      name: "Purchase",
      data: stockData?.map((item) => item.purchase),
    },
    {
      name: "Usage",
      data: stockData?.map((item) => item.usage),
    },
  ];

  return (
    <Card w="100%">
      <CardBody>
        <Heading as="h6" size="md">
          Monthly Stock In & Out
        </Heading>
        {stockData?.length === 0 ? (
          <Box
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={"80%"}
          >
            <Text fontSize="lg" textAlign="center">
              No Data Available
            </Text>
          </Box>
        ) : (
          <Box h="250px">
            <ColumnChart chartData={series} chartOptions={options} />
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

StockBarChartCard.propTypes = {
  stockData: PropTypes.array.isRequired,
};

export default StockBarChartCard;
