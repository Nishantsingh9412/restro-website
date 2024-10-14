/* eslint-disable react/prop-types */
import { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";

// SearchModal component definition
import { useState } from "react";

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const initialRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update state on input change
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery); // Trigger search function when clicking "Save"
    onClose(); // Close modal after search
  };

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="1rem">
        <ModalHeader textAlign="center">Allot Delivery Boy</ModalHeader>
        <ModalCloseButton />
        <FormControl>
          <FormLabel>Search</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <CiSearch />
            </InputLeftElement>
            <Input
              ref={initialRef}
              value={searchQuery}
              onChange={handleSearchChange} // Update state on change
              placeholder="Search"
            />
          </InputGroup>
        </FormControl>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSearchSubmit}>
            Search
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
