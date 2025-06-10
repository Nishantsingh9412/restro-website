// SupplierCard.jsx
import {
  Box,
  Flex,
  Text,
  Stack,
  Image,
  Button,
  Badge,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Portal,
} from "@chakra-ui/react";
import { RxDotsVertical } from "react-icons/rx";
import PropTypes from "prop-types";

const SupplierCard = ({ supplier, onView, onEdit, onDelete, index }) => {
  return (
    <Box
      width="270px"
      bg="white"
      boxShadow="lg"
      borderRadius="lg"
      overflow="hidden"
      m={3}
      transition="all 0.3s ease"
      _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg={index % 2 === 0 ? "blue.50" : "green.50"}
        borderBottomWidth="1px"
        borderColor="gray.200"
      >
        <Box>
          <Text fontWeight="bold" fontSize="lg" color="gray.700">
            {supplier.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Updated on {supplier.updatedAt.split("T")[0]}
          </Text>
        </Box>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={supplier.pic}
          alt={supplier.name}
        />
      </Flex>
      <Flex justifyContent="space-between">
        <Box p={4}>
          <Stack spacing={2}>
            {supplier.items.slice(0, 3).map((item, i) => (
              <Text key={i} fontSize="sm" color="gray.600" as="li">
                {item}
              </Text>
            ))}
            {supplier.items.length > 3 && (
              <Badge colorScheme="blue" fontSize="0.8em" p={1}>
                +{supplier.items.length - 3} more items
              </Badge>
            )}
          </Stack>
          <Button
            mt={3}
            size="sm"
            variant="solid"
            colorScheme="blue"
            onClick={() => onView(supplier._id)}
          >
            View Details
          </Button>
        </Box>

        <Box position="relative" textAlign="right" p={4}>
          <Menu>
            <MenuButton>
              <RxDotsVertical />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem onClick={() => onEdit(supplier._id)}>Edit</MenuItem>
                <MenuItem onClick={() => onDelete(supplier._id)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};
SupplierCard.propTypes = {
  supplier: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    pic: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default SupplierCard;
