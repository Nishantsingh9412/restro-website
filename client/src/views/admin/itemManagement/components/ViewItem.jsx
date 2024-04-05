import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';

import { GetSingleItemAction } from '../../../../redux/action/Items.js';


const ViewItem = (props) => {

    const ItemId = props.EyeIconSelectedId;
    // const { isOpen, onOpen, onClose } = useDisclosure()
    // const [overlay, setOverlay] = useState(<OverlayOne />)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetSingleItemAction(ItemId));
    }, [ItemId])

    const SelectedItemData = useSelector((state) => state.itemsReducer.selectedItem);
    console.log(30, "SelectedItemData: \n", SelectedItemData)

    return (
        <div>
            <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
                {props.overlay}
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text> Item Name: {SelectedItemData?.item_name} </Text>
                        <Text> Item Unit: {SelectedItemData?.item_unit} </Text>
                        <Text> Available Quantity: {SelectedItemData?.available_quantity} </Text>
                        <Text> Minimum Quantity : {SelectedItemData?.minimum_quantity} </Text>
                        <Text> Usage Rate : {SelectedItemData?.usage_rate_value} {SelectedItemData?.usage_rate_unit} </Text>
                        <Text> Last Replenished: {SelectedItemData?.Last_Replenished.split('T')[0]} </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={props.onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
 
        </div>
    )
}

export default ViewItem