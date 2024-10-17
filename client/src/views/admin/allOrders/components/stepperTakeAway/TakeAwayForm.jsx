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
import { toast } from "react-toastify";
import { setFormData } from "../../../../../redux/action/takeAwayStepperForm";
// TakeAwayForm component definition
const TakeAwayForm = ({ goToNextStep }) => {
  const dispatch = useDispatch();

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
      toast.error("Please enter customer name");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleDineInSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // console.log(formData);
    goToNextStep();
  };

  return (
    <form onSubmit={handleDineInSubmit}>
      <Box mt={10}>
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
        <Button colorScheme="cyan" type="submit" mt={4}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

// Prop types for TakeAwayForm component
TakeAwayForm.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
};
export default TakeAwayForm;
