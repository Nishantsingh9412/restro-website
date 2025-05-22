import PropTypes from "prop-types";
import { Box, Heading, Card, CardBody, Text } from "@chakra-ui/react";
import MonthlyCalendarHeatmap from "../../../../components/charts/HeatMapChart";

const HeatMapCard = ({ title, chartData }) => {
  return (
    <Card width={"100%"} minHeight={"250px"}>
      <CardBody>
        <Heading as="h6" size="md" mb={4}>
          {title}
        </Heading>
        {chartData?.length === 0 ? (
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
          <Box>
            <MonthlyCalendarHeatmap chartData={chartData} />
          </Box>
        )}
      </CardBody>
    </Card>
  );
};
HeatMapCard.propTypes = {
  title: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default HeatMapCard;
