import PropTypes from "prop-types";
import { Box, Heading, Card, CardBody } from "@chakra-ui/react";
import PieChart from "../../../../components/charts/PieChart";

const PieCard = ({ title, chartData }) => {
  return (
    <Card width={"100%"}>
      <CardBody>
        <Heading as="h6" size="md" mb={4}>
          {title}
        </Heading>
        <Box>
          <PieChart
            chartData={chartData?.data}
            chartOptions={chartData?.options}
          />
        </Box>
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
