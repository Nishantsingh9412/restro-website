/* eslint-disable react/prop-types */
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
import { useToast } from "../../../../contexts/useToast";

export default function LiveLocationModal({
  isOpen,
  setIsOpen,
  prevURL = null,
  deliveryBoyId = "",
}) {
  const [liveLocationURL, setLiveLocationURL] = useState(prevURL);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const showToast = useToast();

  useEffect(() => {
    // Reset the URL every time the modal opens or the URL changes
    setLiveLocationURL(prevURL);
  }, [isOpen, prevURL]);

  const handleSubmit = () => {
    if (!deliveryBoyId) {
      // toast.error("Something went wrong! Delivery person is not authorized!");
      showToast(
        "Something went wrong! Delivery person is not authorized!",
        "error"
      );
      return;
    }

    // If the URL is unchanged, close the modal without making a request
    if (liveLocationURL.trim() === prevURL?.trim()) {
      setIsOpen(false);
      return;
    }

    // Set loading state and dispatch action
    setIsLoading(true);

    try {
      // Await the dispatched action
      dispatch(
        updateSingleDelBoyAction(deliveryBoyId, {
          liveLocationURL: liveLocationURL.trim(),
        })
      );
      // On success
      // toast.success("Live location updated successfully!");
      showToast("Live location updated successfully!", "success");
      setIsOpen(false); // Close the modal
    } catch (error) {
      // On failure
      console.error("Error updating live location:", error);
      // toast.error("Something went wrong! Unable to update live location.");
      showToast(
        "Something went wrong! Unable to update live location.",
        "error"
      );
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

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
            value={liveLocationURL}
            onChange={(e) => setLiveLocationURL(e.target.value)}
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
            <Icon as={QuestionIcon} color="blue.500" /> How to get live location
            url?
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
              Choose &quot;Share your real-time location&quot; and copy the
              provided URL.
            </ListItem>
            <ListItem>
              <ListIcon as={ChevronRightIcon} color="blue.500" />
              Paste the copied URL in the field above and click
              &quot;Save&quot;.
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            disabled={!liveLocationURL || isLoading}
            onClick={handleSubmit}
            bg={liveLocationURL ? "blue.500" : "gray.300"}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
