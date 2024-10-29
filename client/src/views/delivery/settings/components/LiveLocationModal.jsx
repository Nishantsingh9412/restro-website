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
import { ChevronRightIcon, InfoIcon, QuestionIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { updateSingleDelBoyAction } from "../../../../redux/action/delboy";
import { toast } from "react-toastify";

export default function LiveLocationModal({
  isOpen,
  setIsOpen,
  prevURL = null,
  deliveryBoyId = "",
}) {
  const [formData, setFormData] = useState({
    liveLocationURL: prevURL,
  });

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log("Form data:", formData);
    if (deliveryBoyId) {
      if (formData.liveLocationURL?.trim() === prevURL?.trim())
        return setIsOpen(false);
      else {
        dispatch(
          updateSingleDelBoyAction(
            deliveryBoyId,
            {
              liveLocationURL: formData.liveLocationURL?.trim(),
            },
            () => {
              toast.success("Live location updated successfully!");
              setIsOpen(false);
            },
            () => {
              toast.error("Something went wrong!");
            }
          )
        );
      }
    } else
      toast.error("Something went wrong! Delivery person is not authorized!");
  };

  useEffect(() => {
    setFormData({
      liveLocationURL: prevURL,
    });
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered={true}>
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
              display={"flex"}
              alignItems={"center"}
              gap={2}
              mt={4}
              fontWeight={500}
              color={"gray"}
              fontSize={14}
            >
              <Icon as={QuestionIcon} color="blue.500" /> How to get live
              location url?
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
                Select "Location sharing" from the menu.
              </ListItem>
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="blue.500" />
                Choose "Share your real-time location" and copy the provided
                URL.
              </ListItem>
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="blue.500" />
                Paste the copied URL in the field above and click "Save".
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
              pointerEvents={formData.liveLocationURL ? "auto" : "none"}
              bg={formData.liveLocationURL ? "blue.500" : "gray.300"}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
