import React, { useEffect, useState } from 'react'
import { Image } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Flex,
    Box,
    useDisclosure,
} from '@chakra-ui/react'

import { getSingleSupplierAction } from '../../../../redux/action/supplier.js'




const ViewSupplier = (props) => {
    const SelectedItemId = props.selectedId;
    const isOpen = props.isOpen;
    const onOpen = props.onOpen;
    const onClose = props.onClose;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSingleSupplierAction(SelectedItemId))
    }, [SelectedItemId])

    const selectedSupplier = useSelector(state => state.supplierReducer.seletectedSupplier);
    console.log(selectedSupplier);

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.800'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    const [overlay, setOverlay] = useState(<OverlayOne />)

    useEffect(() => {
        console.log("Selected Supplier ID: ", SelectedItemId)
    }, [])

    return (
        <div>
            <>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent
                        maxW='45rem'
                    >
                        <ModalHeader>
                            <Flex>
                                <Image
                                    marginRight={2}
                                    borderRadius='full'
                                    boxSize='50px'
                                    src={selectedSupplier?.pic}
                                    alt='Dan Abramov'
                                />
                                <Text
                                    marginTop={2}
                                >
                                    {selectedSupplier?.name}
                                </Text>
                            </Flex>

                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* <Text>  Hello </Text> */}
                            {/* <Text>Custom backdrop filters!</Text> */}

                            <Text> Last Updated : {selectedSupplier?.updatedAt?.split('T')[0]}  </Text>
                            <h1
                                style={
                                    {
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        marginBottom: '10px'
                                    }
                                }
                            >Items</h1>
                            <ol style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'start'
                            }}>
                                {selectedSupplier?.Items?.map((item, index) => {
                                    return (
                                        <Box
                                            marginLeft={'1vw'}
                                            marginTop={'1vw'}
                                            borderRadius={'20px'}
                                            padding={'6px'}
                                            border={'1px solid #ddd'}
                                            background={'#a4ee9f99'}
                                        >
                                            {item}
                                        </Box>
                                    )
                                })}
                            </ol>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </div>
    )
}

export default ViewSupplier