import React, { useEffect } from 'react'
import bwipjs from 'bwip-js' // Assuming you have installed bwip-js
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from "@chakra-ui/react";

const ViewCode = (props) => {

    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const onOpen = props.onOpen;
    const barCodeData = props.barCodeData;
    const barcodeDataUrl = props.barcodeDataUrl;
    // console.log(barCodeData)
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                            {barCodeData?.item_name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        marginTop={'10px'}
                    >
                        <img src={barcodeDataUrl} alt="Barcode" />
                        {/* <p>{barCodeData}</p> */}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


export default ViewCode