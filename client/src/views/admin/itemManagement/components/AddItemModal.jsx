import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
    Select
} from '@chakra-ui/react';


const AddItemModal = ({
    isOpen,
    onClose,
    overlay,
    itemName,
    setItemName,
    unit,
    setUnit,
    unitValue,
    setUnitValue,
    available,
    setAvailable,
    minimum,
    setMinimum,
    // usageRateValue,
    // setUsageRateValue,
    // usageRateUnit,
    // setUsageRateUnit,
    // lastReplenished,
    // setLastReplenished,
    expiryDate,
    setExpiryDate,
    existingBarcodeNo,
    setExistingBarcodeNo,
    handleSubmit,
    handleAutoAddVals
}) => {
    return (
        <div>
            <>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent
                        background={'#D8EFFE'}
                        border='5px solid #fff'
                    >
                        <ModalHeader
                            textAlign='center'
                        >
                            Add Item
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Button onClick={handleAutoAddVals} >
                                +
                            </Button>
                            <Box
                                maxW="sm"
                                m="auto"
                                p="4"
                                borderRadius="lg"
                            >
                                <form onSubmit={handleSubmit}>
                                    <FormControl id="itemName" isRequired>
                                        <FormLabel>Item Name</FormLabel>
                                        <Input
                                            type="text"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        mb={'0'}
                                    >
                                        Unit Per Piece
                                    </FormLabel>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >

                                        <FormControl id="unitValue" isRequired >
                                            <FormLabel>Value</FormLabel>
                                            <Input
                                                type="number"
                                                step={'any'}
                                                value={unitValue}
                                                onChange={
                                                    (e) =>
                                                        setUnitValue(parseInt(e.target.value))
                                                }
                                            />
                                        </FormControl>

                                        <FormControl
                                            id="unit"
                                            isRequired
                                        >
                                            <FormLabel>Unit</FormLabel>
                                            {/* <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} /> */}
                                            <Select
                                                placeholder="Select Unit"
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                            >
                                                <option value="Grams">Grams</option>
                                                <option value="KG">KG</option>
                                                <option value="Litre">Litre</option>
                                                {/* <option value="Piece">Piece</option> */}
                                                <option value="Gallon">Gallon</option>
                                                <option value="Dozen">Dozen</option>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <FormControl id="available" isRequired>
                                        <FormLabel>Available</FormLabel>
                                        <Input
                                            type="number"
                                            step={'any'}
                                            value={available}
                                            onChange={(e) =>
                                                setAvailable(parseInt(e.target.value))
                                            }
                                        />
                                    </FormControl>

                                    <FormControl id="lowstock" isRequired>
                                        <FormLabel>low Stock</FormLabel>
                                        <Input
                                            type="number"
                                            step={'any'}
                                            value={minimum}
                                            onChange={
                                                (e) =>
                                                    setMinimum(parseInt(e.target.value))
                                            }
                                        />
                                    </FormControl>
                                    {/* <FormControl id="usageRate" isRequired>
                    <FormLabel>Usage Rate</FormLabel>
                    <Flex>
                      <Input
                        flex="1"
                        mr="2"
                        type="number"
                        step={'any'}
                        value={usageRateValue}
                        onChange={(e) => setUsageRateValue(Number(e.target.value))}
                        placeholder="Value"
                      />
                      <Select
                        flex="1"
                        ml="2"
                        placeholder="Select Unit"
                        value={usageRateUnit}
                        onChange={(e) => setUsageRateUnit(e.target.value)}
                      >
                        <option value="Grams">Grams</option>
                        <option value="KG">KG</option>
                        <option value="Litre">Litre</option>
                        <option value="Piece">Piece</option>
                        <option value="Gallon">Gallon</option>
                        <option value="Dozen">Dozen</option>
                      </Select>
                    </Flex>
                  </FormControl> */}

                                    {/* <FormControl id="lastReplenished" isRequired>
                    <FormLabel>Replenished:</FormLabel>
                    <Input
                      type="date"
                      value={lastReplenished}
                      onChange={(e) => setLastReplenished(e.target.value)}
                    />
                  </FormControl> */}
                                    <FormControl id="expiryDate">
                                        <FormLabel>
                                            Expiry Date
                                        </FormLabel>
                                        <Input
                                            type="date"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl id="existingBarcodeNo" >
                                        <FormLabel>Barcode No</FormLabel>
                                        <Input
                                            type="text"
                                            value={existingBarcodeNo}
                                            onChange={(e) => setExistingBarcodeNo(e.target.value)}
                                        />
                                    </FormControl>
                                    <Button
                                        mt="4"
                                        colorScheme='cyan'
                                        color='#fff'
                                        type="submit"
                                    >
                                        Add Item
                                    </Button>
                                </form>
                            </Box>
                            {/* Form End */}

                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme='gray'
                                onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    )
}

export default AddItemModal
