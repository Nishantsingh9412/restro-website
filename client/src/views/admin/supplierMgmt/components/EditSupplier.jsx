import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import { UpdateSupplierAction, getSingleSupplierAction } from '../../../../redux/action/supplier';

const EditSupplier = (props) => {


  const dispatch = useDispatch();
  const [supplierNameEdit, setSupplierNameEdit] = useState('');
  const [supplierItemsEdit, setSupplierItemsEdit] = useState([]);
  const [supplierPicEdit, setSupplierPicEdit] = useState('');
  const [loading, setLoading] = useState(false);

  const SelectedItemId = props.selectedId;
  const isOpen = props.isOpen;
  const onOpen = props.onOpen;
  const onClose = props.onClose;

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.800'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )

  const [overlay, setOverlay] = useState(<OverlayOne />)

  const postSupplierImageEdit = (pics) => {
    console.log("This is Image Data \n")
    console.log(pics);
    setLoading(true);
    if (pics === undefined) {
      toast.error("Please upload a picture")
      setLoading(false);
      return;
    }
    if (pics.type !== 'image/jpeg' && pics.type !== 'image/png') {
      toast.error('Invalid image format');
      setLoading(false);
      return;
    }
    if (pics.size > 2000000) {
      setLoading(false);
      return toast.error('Image size should be less than 2 MB ')
    }

    const data = new FormData();
    data.append('file', pics);
    data.append('upload_preset', 'restro-website');
    data.append('cloud_name', 'dezifvepx');
    fetch('https://api.cloudinary.com/v1_1/dezifvepx/image/upload', {
      method: 'post',
      body: data
    }).then(res => res.json()).then(data => {
      setSupplierPicEdit(data.url.toString());
      console.log(data);
      // setPicLogoUploaded(true);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
      return toast.error('Error Uploading Image to server')
    })
  }


  useEffect(() => {
    dispatch(getSingleSupplierAction(SelectedItemId))
  }, [SelectedItemId])

  const selectedSupplierData = useSelector(state => state.supplierReducer.seletectedSupplier);
  console.log("This is Selected Supplier \n");
  console.log(selectedSupplierData)

  useEffect(() => {
    if (selectedSupplierData) {
      setSupplierNameEdit(selectedSupplierData?.name);
      setSupplierItemsEdit(selectedSupplierData?.Items);
      setSupplierPicEdit(selectedSupplierData?.pic);
    }
  }, [selectedSupplierData])


  const handleEditSupplier = (e) => {
    e.preventDefault();
    const id = selectedSupplierData._id;

    const editedSupplierData = {
      name: supplierNameEdit,
      Items: supplierItemsEdit,
      pic: supplierPicEdit
    }

    

    const updatedSupplier =  dispatch(UpdateSupplierAction(id,editedSupplierData)).then((res) => {
      if (res.success) {
        onClose();
        return res.message;
      } else {
        throw new Error('Error in Updating Supplier')
      }
    })

    toast.promise(updatedSupplier,
      {
        pending: 'Updating Supplier...',
        success: 'Supplier Updated Successfully',
        error: 'Error in Updating Supplier'
      }
    );
    console.log("this is edited data \n")
    console.log(editedSupplierData)
  }


  return (
    <div>
      {/* <Button
        onClick={() => {
          setOverlay(<OverlayOne />)
          onOpen()
        }}
      >
        Use Overlay one
      </Button> */}
      <>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>Select Supplier</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box maxW="sm" m="auto" p="4" borderWidth="1px" borderRadius="lg" background={'whiteAlpha.100'}>
                <form onSubmit={handleEditSupplier}>
                  <FormControl id="suppliername" isRequired>
                    <FormLabel>Supplier Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setSupplierNameEdit(e.target.value)}
                      value={supplierNameEdit}
                    />
                  </FormControl>

                  <FormControl id="items" isRequired>
                    <FormLabel>Items  (separate by comma) </FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setSupplierItemsEdit(e.target.value.split(','))}
                      value={supplierItemsEdit.map((item) => item)}
                      placeholder={"Tomato,Cauliflower,Brinjal"}
                    />
                  </FormControl>

                  <FormControl id="pic" >
                    <FormLabel>Upload Picture</FormLabel>
                    <Input type="file" accept='image/*' onChange={(e) => postSupplierImageEdit(e.target.files[0])} />
                  </FormControl>

                  <Button
                    mt="4"
                    colorScheme="blue"
                    type="submit"
                    isLoading={loading}
                  >
                    Update Supplier
                  </Button>
                </form>
              </Box>
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

export default EditSupplier
