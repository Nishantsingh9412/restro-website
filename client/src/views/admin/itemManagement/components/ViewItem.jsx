import React, { useEffect } from 'react'
import { FaEye } from "react-icons/fa6"
import {
    Table,
    Tbody,
    Tr,
    Td,
    Text,
    Box,
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';

import { GetSingleItemAction } from '../../../../redux/action/Items.js';


const ViewItem = (props) => {

    const ItemId = props.EyeIconSelectedId;
    const isOpen = props.isOpen;
    const onClose = props.onClose;

    // const { isOpen, onOpen, onClose } = useDisclosure()
    // const [overlay, setOverlay] = useState(<OverlayOne />)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetSingleItemAction(ItemId));
    }, [ItemId, isOpen])

    const SelectedItemData = useSelector((state) => state.itemsReducer.selectedItem);
    console.log(30, "SelectedItemData: \n", SelectedItemData)

    return (
        <div>
            <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
                {props.overlay}
                <ModalContent>
                    <ModalHeader>
                        <Box
                            display="flex"
                            justifyContent="center"
                            gap="1rem"
                            flexDirection="row-reverse"
                            alignItems={'center'}
                        >
                            <Text>View Item</Text>
                            <FaEye />
                        </Box>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody fontFamily={'math'} alignItems={'center'}>
                        <Table variant="simple" size="md">
                            <Tbody>
                                <Tr>
                                    <Td fontWeight={'bold'}>Item Name : </Td>
                                    <Td>{SelectedItemData?.item_name}</Td>
                                </Tr>
                                <Tr>
                                    <Td fontWeight={'bold'}>Item Unit:</Td>
                                    <Td>{SelectedItemData?.item_unit}</Td>
                                </Tr>
                                <Tr>
                                    <Td fontWeight={'bold'}>Available Quantity:</Td>
                                    <Td>{SelectedItemData?.available_quantity}</Td>
                                </Tr>
                                <Tr>
                                    <Td fontWeight={'bold'}>Minimum Quantity:</Td>
                                    <Td>{SelectedItemData?.minimum_quantity}</Td>
                                </Tr>
                                {/* <Tr>
                                    <Td fontWeight={'bold'}>Usage Rate:</Td>
                                    <Td>{SelectedItemData?.usage_rate_value} {SelectedItemData?.usage_rate_unit}</Td>
                                </Tr> */}
                                {
                                    SelectedItemData?.usage_rate_value &&
                                    <Tr>
                                        <Td fontWeight={'bold'}>Barcode No:</Td>
                                        <Td>{SelectedItemData?.existing_barcode_no} </Td>
                                    </Tr>
                                }
                                {
                                    SelectedItemData?.expiry_date &&
                                    <Tr>
                                        <Td fontWeight={'bold'}>Expiry Date:</Td>
                                        <Td>{SelectedItemData?.expiry_date.split('T')[0]} </Td>
                                    </Tr>}
                                <Tr>
                                    <Td fontWeight={'bold'}>Last Replenished:</Td>
                                    <Td>{SelectedItemData?.updatedAt.split('T')[0]}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            bg={'#029CFF'}
                            color={'white'}
                            _hover={{
                                bg: "#40BFF8",
                                color: "white"
                            }}
                            onClick={props.onClose}
                        >Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    )
}

export default ViewItem