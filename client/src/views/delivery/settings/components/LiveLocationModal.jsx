import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  List,
  ListItem,
  ListIcon,
  Text,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { ChevronRightIcon, QuestionIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { updateSingleDelBoyAction } from "../../../../redux/action/delboy";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function LiveLocationModal({
  isOpen,
  setIsOpen,
  prevURL = null,
  deliveryBoyId = "",
}) {
  const [formData, setFormData] = useState({
    liveLocationURL: prevURL,
  });

  const dispatch = useDispatch();

  // Handle input change
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form data:", formData);
    if (!deliveryBoyId) {
      toast.error("Something went wrong! Delivery person is not authorized!");
      return;
    }

    if (formData.liveLocationURL?.trim() === prevURL?.trim()) {
      setIsOpen(false);
      return;
    }

    dispatch(
      updateSingleDelBoyAction(
        deliveryBoyId,
        { liveLocationURL: formData.liveLocationURL?.trim() },
        () => {
          toast.success("Live location updated successfully!");
          setIsOpen(false);
        },
        () => {
          toast.error("Something went wrong!");
        }
      )
    );
  };

  // Update form data when modal is opened or prevURL changes
  useEffect(() => {
    setFormData({ liveLocationURL: prevURL });
  }, [isOpen, prevURL]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Live Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="url"
            name="liveLocationURL"
            placeholder="Enter URL"
            value={formData.liveLocationURL}
            onChange={handleInputChange}
          />

          <Text
            display="flex"
            alignItems="center"
            gap={2}
            mt={4}
            fontWeight={500}
            color="gray"
            fontSize={14}
          >
            <Icon as={QuestionIcon} color="blue.500" /> How to get live location url?
          </Text>
          <Divider mb={1} />
          <List fontSize={14}>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Open Google Maps on your mobile device.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Tap on your profile picture or initials in the top right corner.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Select &quot;Location sharing&quot; from the menu.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Choose &quot;Share your real-time location&quot; and copy the provided URL.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Paste the copied URL in the field above and click &quot;Save&quot;.
            </ListItem>
          </List>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            disabled={!formData.liveLocationURL}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

LiveLocationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  prevURL: PropTypes.string,
  deliveryBoyId: PropTypes.string,
};
