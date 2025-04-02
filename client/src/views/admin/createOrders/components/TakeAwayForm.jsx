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
import { setFormData } from "../../../../redux/action/takeAwayStepperForm";
import { useToast } from "../../../../contexts/useToast";
// TakeAwayForm component definition
const TakeAwayForm = ({ onProceed }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  // Get form data from the Redux store
  const formData = useSelector((state) => state.takeAwayForm);
  // Destructure form data
  const { customerName } = formData;

  // Handle input changes and dispatch action to update form data in the Redux store
  const handleChange = useCallback(
    (field, value) => {
      dispatch(setFormData({ [field]: value }));
    },
    [dispatch]
  );

  // validate the form data
  const validate = () => {
    if (!customerName) {
      showToast("Please enter customer name", "error");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleDineInSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // console.log(formData);
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
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              required={true}
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
          Submit
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
