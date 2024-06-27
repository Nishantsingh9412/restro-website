import React, { useEffect, useState } from 'react'
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
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
} from '@chakra-ui/react'

import { clearSelectedSupplierAction, getSingleSupplierAction } from '../../../../redux/action/supplier.js'


const ViewSupplier = (props) => {
    const SelectedItemId = props.selectedId;
    const isOpen = props.isOpen;
    const onOpen = props.onOpen;
    const onClose = props.onClose;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSingleSupplierAction(SelectedItemId))
    }, [SelectedItemId, isOpen])

    const selectedSupplier = useSelector(state => state.supplierReducer.seletectedSupplier);
    console.log(selectedSupplier);

    const OverlayOne = () => (
        <ModalOverlay
        // bg='blackAlpha.800'
        // backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    const [overlay, setOverlay] = useState(<OverlayOne />)

    useEffect(() => {
        console.log("Selected Supplier ID: ", SelectedItemId)
    }, [])

    return (
        <div>
            <>
                <Modal isCentered isOpen={isOpen} onClose={() => {
                    onClose();
                    dispatch(clearSelectedSupplierAction());
                }}>
                    {overlay}

                    <ModalContent
                        maxW='45rem'
                        background={'#F3F2EE'}
                        color={'#ee7213'}
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
                            <Text> Last Updated : {selectedSupplier?.updatedAt?.split('T')[0]}  </Text>
                            {
                                selectedSupplier?.email &&
                                <Text
                                    marginTop={2}
                                    display={'flex'}
                                    gap='5px'
                                    alignItems={'center'}
                                >
                                    <IoMail
                                        size={'20'}
                                    /> {selectedSupplier?.email}
                                </Text>
                            }
                            {
                                selectedSupplier?.phone &&
                                <Text
                                    marginTop={2}
                                    display={'flex'}
                                    gap='5px'
                                    alignItems={'center'}
                                >
                                    <FaPhoneAlt /> +{selectedSupplier?.countryCode} - {selectedSupplier?.phone}
                                </Text>
                            }
                             {
                                selectedSupplier?.location &&
                                <Text
                                    marginTop={2}
                                    display={'flex'}
                                    gap='5px'
                                    alignItems={'center'}
                                >
                                    <IoLocation 
                                        size={'20'}
                                    /> {selectedSupplier?.location} 
                                </Text>
                            }
                            <h1
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    marginTop: '20px'
                                }}
                            >
                                Items
                            </h1>
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
                                            background={'#fff'}
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
