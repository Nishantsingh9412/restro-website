import PropTypes from "prop-types";
import { Box, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import PieChart from "../../../../../components/charts/PieChart";

const PieCard = ({ title, chartData }) => {
  return (
    <Card width={{ base: "100%", md: "80%" }}>
      <CardBody>
        <Heading as="h6" size="md" mb={4} textAlign="center">
          {title}
        </Heading>
        {chartData?.data?.length === 0 ? (
          <Box
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80%"
          >
            <Text fontSize="lg" textAlign="center">
              No Data Available
            </Text>
          </Box>
        ) : (
          <Box>
            <PieChart
              chartData={chartData?.data}
              chartOptions={chartData?.options}
            />
          </Box>
        )}
      </CardBody>
    </Card>
  );
};
PieCard.propTypes = {
  title: PropTypes.string.isRequired,
  chartData: PropTypes.shape({
    data: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
  }).isRequired,
};

export default PieCard;
