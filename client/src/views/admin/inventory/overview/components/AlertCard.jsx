import PropTypes from "prop-types";
import { Box, Heading, Text, Card, CardBody, Stack } from "@chakra-ui/react";

const AlertCard = ({ lowStock, expired, upcomingExpiry }) => {
  return (
    <Card width={"100%"}>
      <CardBody>
        <Heading as="h3" size="md" mb={4}>
          Inventory Alerts
        </Heading>
        <Stack spacing={5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="sm" color="gray.500">
              Low Stock
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {lowStock ?? "-"}
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="sm" color="gray.500">
              Expired
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {expired ?? "-"}
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="sm" color="gray.500">
              Upcoming Expiry(7 days)
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {upcomingExpiry ?? "-"}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
AlertCard.propTypes = {
  lowStock: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  expired: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  upcomingExpiry: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AlertCard;
