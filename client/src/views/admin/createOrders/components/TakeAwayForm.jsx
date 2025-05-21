import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTakeAwayInfo } from "../../../../redux/action/customerInfo";
import { useToast } from "../../../../contexts/useToast";
// TakeAwayForm component definition1

const TakeAwayForm = ({ onProceed }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  // Get form data from the Redux store
  const formData = useSelector((state) => state.customerInfo.takeAway);
  const { customerName } = formData;

  // Handle input changes and dispatch action to update form data in the Redux store
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(setTakeAwayInfo({ [name]: value }));
    },
    [dispatch]
  );

  // validate the form data
  const validate = () => {
    if (!customerName || customerName.trim().length < 3) {
      showToast("Please enter customer name with at least 3 chars", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleDineInSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onProceed();
  };

  return (
    <form onSubmit={handleDineInSubmit}>
      <Box mt={2}>
        <SimpleGrid spacing={4}>
          {/* Customer Name Input */}
          <FormControl id="customerName" mb={4} isRequired>
            <FormLabel>Customer Name</FormLabel>
            <Input
              type="text"
              name="customerName"
              placeholder="Enter customer name"
              value={customerName}
              onChange={handleChange}
              required={true}
              maxLength={50}
              minLength={3}
            />
          </FormControl>
        </SimpleGrid>

        {/* Submit Button */}
        <Button
          bg={"#029CFF"}
          color={"white"}
          _hover={{ bg: "blue.600" }}
          type="submit"
          my={2}
          width={"100%"}
        >
          Proceed To Menu
        </Button>
      </Box>
    </form>
  );
};

// Prop types for TakeAwayForm component
TakeAwayForm.propTypes = {
  onProceed: PropTypes.func.isRequired,
};
export default TakeAwayForm;
