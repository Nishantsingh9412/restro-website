import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LuSoup } from 'react-icons/lu'
import { RxDotsVertical, RxPencil1 } from "react-icons/rx";
import {
    Box,
    Circle,
    Container,
    Flex,
    Button,
    useDisclosure,
    Stack,
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
import { DeleteSupplierAction , GetAllSuppliersAction } from '../../../../redux/action/supplier.js';


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


    const handleEditSupplier = (e,id) => {
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
    
    
      const handleDeleteSupplier = (e,id) => {
        e.preventDefault();
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            handleConfirmDeleteSupplier(id);
          }
        });
      }

    return (
        <div>
            <h1>Supplier Management</h1>
            <h3
                style={{ marginLeft: '10px', fontWeight: '900' }}
            > Low Stocks Alert  </h3>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: '10px',
                    marginLeft: '10px',
                }}
            >
                {allSuppliers.map((supplier, index) => (
                    <Box
                        key={index}
                        minWidth={'300px'}
                        marginLeft={'25px'}
                        marginTop={'25px'}
                        maxW={'300px'}
                        bg={'pink.100'}
                        borderRadius={'3xl'}
                        padding={'20px'}
                    >
                        <>
                            <Flex justifyContent="space-between">
                                <Box>
                                    <h4 style={{ fontWeight: '600' }}>{supplier.name}</h4>
                                    <Text color='gray.500'>Last Updated {supplier.updatedAt.split('T')[0]} </Text>
                                </Box>
                                <Box justifyContent={'end'}>
                                    <Image
                                        borderRadius='full'
                                        boxSize='50px'
                                        src={supplier.pic}
                                        alt='Dan Abramov'
                                    />
                                </Box>
                            </Flex>
                            <Box>
                                <ol style={{
                                    marginLeft: '15px',
                                    marginTop: '5px',
                                    fontWeight: '500'
                                }}>
                                    {supplier.Items.slice(0, 3).map((singleItem, index) => (
                                        <li key={index}> {singleItem} </li>
                                    ))}
                                    <button
                                        style={{
                                            marginLeft: '0',
                                            marginTop: '10px',
                                            color: 'teal',
                                            border: 'none',
                                        }}
                                        onClick={
                                            () => {
                                                onOpen()
                                                setSelectedId(supplier._id)
                                            }
                                        }
                                    >
                                        More Details...
                                    </button>
                                    <>
                                        <Menu>
                                            <MenuButton
                                                style={{ marginLeft: '7rem' }}
                                            >
                                                <RxDotsVertical />
                                            </MenuButton>
                                            <Portal>
                                                <MenuList
                                                    style={{ minWidth: '7rem' }}
                                                >
                                                    <MenuItem
                                                        onClick={(e) => 
                                                            handleEditSupplier(e,supplier._id)
                                                        }
                                                    > Edit </MenuItem>
                                                    <MenuItem
                                                        onClick={(e) => 
                                                            handleDeleteSupplier(e,supplier._id)
                                                        }
                                                    > Delete </MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </>
                                </ol>
                            </Box>

                        </>
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
