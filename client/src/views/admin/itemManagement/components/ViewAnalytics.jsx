// import React, { useEffect, useState } from 'react'
// import {
//     Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     ModalBody,
//     ModalCloseButton,
//     Button
// } from '@chakra-ui/react'

// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from 'recharts';
// import { useDispatch, useSelector } from 'react-redux';
// import { GetSingleItemAction } from '../../../../redux/action/Items.js';

// const ViewAnalytics = (props) => {

//     const isOpen = props.isOpen;
//     const onClose = props.onClose;
//     const AnalyticsSelectedId = props.AnalyticsSelectedId;
//     const dispatch = useDispatch();
//     // const onOpen = props.onOpen;
//     // const barCodeData = props.barCodeData;
//     // const barcodeDataUrl = props.barcodeDataUrl;
//     console.log(" This is analytics selected ID ", AnalyticsSelectedId);

//     // const [data, setData] = useState([]);

//     // Dummy data fetching function - replace with actual data fetching logic
//     useEffect(() => {
//         const fetchData = () => {
//             const dynamicData = [
//                 { x: 'A', y: 12 },
//                 { x: 'B', y: 18 },
//                 { x: 'C', y: 8 },
//                 { x: 'D', y: 15 },
//                 { x: 'E', y: 10 },
//             ];
//             setData(dynamicData);
//         };
//         fetchData();
//     }, []);


//     useEffect(() => {
//         dispatch(GetSingleItemAction(AnalyticsSelectedId))
//             .finally(() => {
//                 // setLoadingEditModal(false);
//             });

//     }, [AnalyticsSelectedId])

//     const SelectedItemData = useSelector((state) => state.itemsReducer.selectedItem);
//     console.log(30, "SelectedItemData: \n", SelectedItemData)


//     return (
//         <div>
//             <Modal isOpen={isOpen} onClose={onClose}>
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader> Hello Motto </ModalHeader>
//                     <ModalCloseButton />
//                     <ModalBody>
//                         <ResponsiveContainer width="100%" height={400}>
//                             <LineChart
//                                 width={500}
//                                 height={300}
//                                 data={data}
//                                 margin={{
//                                     top: 5, right: 30, left: 20, bottom: 5,
//                                 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="x" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </ModalBody>

//                     <ModalFooter>
//                         <Button colorScheme='blue' mr={3} onClick={onClose}>
//                             Close
//                         </Button>
//                         <Button variant='ghost'>Secondary Action</Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </div >
//     )
// }

// export default ViewAnalytics



import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
} from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { format, addMonths } from 'date-fns';
import { GetSingleItemAction } from '../../../../redux/action/Items.js';

const ViewAnalytics = ({ isOpen, onClose, AnalyticsSelectedId }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (AnalyticsSelectedId) {
            dispatch(GetSingleItemAction(AnalyticsSelectedId));
        }
    }, [AnalyticsSelectedId, dispatch]);

    const SelectedItemData = useSelector((state) => state.itemsReducer.selectedItem);
    // console.log("SelectedItemData: \n", SelectedItemData);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (SelectedItemData) {
            // Assuming you want to show data for the next 12 months from the creation date
            const creationDate = new Date(SelectedItemData.createdAt);
            const monthsData = Array.from({ length: 12 }, (_, i) => {
                const monthDate = addMonths(creationDate, i);
                return {
                    month: format(monthDate, 'MMMM'),
                    available_quantity: SelectedItemData.available_quantity
                };
            });

            setData(monthsData);
        }
    }, [SelectedItemData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent maxW="80vw" maxH="85vh" >
                <ModalHeader
                    display={'flex'}
                    justifyContent={'center'}
                > {SelectedItemData?.item_name} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="available_quantity" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="cyan" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    {/* <Button variant="ghost">Secondary Action</Button> */}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewAnalytics;
