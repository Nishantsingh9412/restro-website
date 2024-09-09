import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LuSoup } from 'react-icons/lu'
import { RxDotsVertical, RxPencil1 } from "react-icons/rx";
import {
    Box,
    Flex,
    useDisclosure,
    Text,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
} from '@chakra-ui/react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ViewSupplier from './ViewSupplier'
import EditSupplier from './EditSupplier';
import { DeleteSupplierAction, GetAllSuppliersAction } from '../../../../redux/action/supplier.js';


const SupplierCards = (props) => {

    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenEdit,
        onOpen: onOpenEdit,
        onClose: onCloseEdit
    } = useDisclosure()


    const allSuppliers = props.data;
    const selectedSupplier = props.selectedSupplier;

    console.log(allSuppliers)
    console.log("selectedSupplier \n");
    console.log(selectedSupplier)


    const handleEditSupplier = (e, id) => {
        e.preventDefault();
        setSelectedId(id)
        onOpenEdit();
    }

    const handleConfirmDeleteSupplier = (deleteId) => {
        const deleteItemPromise = dispatch(DeleteSupplierAction(deleteId)).then((res) => {
            if (res.success) {
                dispatch(GetAllSuppliersAction());
                return res.message;
            } else {
                throw new Error('Error Deleting Item')
            }
        })
        toast.promise(
            deleteItemPromise,
            {
                pending: 'Deleting Item...',
                success: 'Item Deleted Successfully',
                error: 'Error in Deleting Item'
            }
        );
    }


    const handleDeleteSupplier = (e, id) => {
        e.preventDefault();
        const style = document.createElement('style');
        style.innerHTML = `
        .swal-bg {
            background-color: #F3F2EE !important;
        }
        .swal-border {
            border: 5px solid #fff !important;
        }`;
        document.head.appendChild(style);

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: 'swal-bg swal-border'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmDeleteSupplier(id);
            }
        });
    }

    return (
        <div>
            <h3
                style={{
                    marginLeft: '10px',
                    fontWeight: '900',
                    marginTop: '80px',
                    color: '#049CFD',
                    fontSize: '1.5rem', // Scaled font size for responsiveness
                    textAlign: 'left', // Default alignment
                }}
            >
                List Of All Suppliers
            </h3>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between', // Ensure spacing between items
                    padding: '10px',
                    marginLeft: '10px',
                }}
            >
                {allSuppliers.map((supplier, index) => (
                    <Box
                        key={index}
                        minWidth={'320px'}
                        margin={'15px'}
                        maxW={'300px'}
                        bg={'#f3f2ee'}
                        boxShadow={'2px 2px 5px #b39b9b'}
                        border={'5px solid #fff'}
                        borderRadius={'3xl'}
                        fontWeight={'bold'}
                        padding={'20px'}
                        color={index & 1 ? '#ee2d4f' : '#ee7213'}
                        display="flex"
                        flexDirection="column" // Make the box a flex container with column direction
                    >
                        <Flex justifyContent="space-between">
                            <Box>
                                <h4 style={{ fontWeight: '600', fontSize: '1rem' }}>{supplier.name}</h4>
                                <Text fontSize={'0.9rem'}>
                                    Last Updated {supplier.updatedAt.split('T')[0]}
                                </Text>
                            </Box>
                            <Box justifyContent={'end'}>
                                <Image
                                    borderRadius="full"
                                    boxSize="60px"
                                    src={supplier.pic}
                                    alt={supplier.name}
                                />
                            </Box>
                        </Flex>

                        <Box flex="1"> {/* Take up remaining space */}
                            <ol
                                style={{
                                    marginLeft: '15px',
                                    marginTop: '5px',
                                    fontWeight: '900',
                                }}
                            >
                                {supplier.Items.slice(0, 3).map((singleItem, index) => (
                                    <li key={index}>{singleItem}</li>
                                ))}
                            </ol>
                        </Box>

                        <Box marginTop="auto"> {/* Push this box to the bottom */}
                            <div className='flex'>
                                <button
                                    style={{
                                        marginLeft: '0',
                                        marginTop: '10px',
                                        fontWeight: 'bold',
                                        color: index & 1 ? '#ee2d4f' : '#ee7213',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        onOpen();
                                        setSelectedId(supplier._id);
                                    }}
                                >
                                    More Details...
                                </button>
                                <Menu>
                                    <MenuButton style={{ marginLeft: '1rem' }}>
                                        <RxDotsVertical />
                                    </MenuButton>
                                    <Portal>
                                        <MenuList
                                            style={{ minWidth: '7rem' }}
                                            background={'rgb(243, 242, 238)'}
                                            color={index & 1 ? '#ee2d4f' : '#ee7213'}
                                        >
                                            <MenuItem onClick={(e) => handleEditSupplier(e, supplier._id)}>
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={(e) => handleDeleteSupplier(e, supplier._id)}>
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Portal>
                                </Menu>
                            </div>
                        </Box>
                    </Box>
                ))}
            </div>

            {/* View Modal Starts */}
            <ViewSupplier
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                selectedId={selectedId}
            />
            {/* View Modal Ends */}

            {/* Edit Modal Starts */}
            <EditSupplier
                isOpen={isOpenEdit}
                onOpen={onOpenEdit}
                onClose={onCloseEdit}
                selectedId={selectedId}
            />
            {/* Edit Modal Ends */}
        </div>
    )
}

export default SupplierCards
