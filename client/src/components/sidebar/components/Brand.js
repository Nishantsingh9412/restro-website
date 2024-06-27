import React, { useEffect, useRef } from 'react';

// Chakra imports
import { Box, Button, Flex, Img, useColorModeValue } from '@chakra-ui/react';
import { FaPencil } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
// import { HorizonLogo } from 'components/icons/Icons';
// import { HSeparator } from 'components/separator/Separator';
import { useDispatch, useSelector } from 'react-redux';
import { singleUserDataAction, updateProfilePicAction } from '../../../redux/action/user.js';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const localData = JSON.parse(localStorage.getItem('ProfileData'));
  const userProfileData = useSelector((state) => state?.userReducer?.user);
  const user_id = localData?.result?._id;
  console.log("USERPDATA FORM BRAND.JS \n", userProfileData)

  const handleProfilePicUpdate = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);
      dispatch(updateProfilePicAction(user_id, formData)).then((res) => {
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        console.log(file);
      })
    }
  }

  useEffect(() => {
    dispatch(singleUserDataAction(localData?.result?._id))
  }, [])

  let ImageUrl = 'https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png';
  if (userProfileData?.profile_picture.includes('http')) {
    ImageUrl = userProfileData?.profile_picture;
  } else {
    ImageUrl = `${process.env.REACT_APP_BASE_URL_FOR_APIS}/uploads/${userProfileData?.profile_picture}`;
  }

  return (
    <Flex align="center" direction="column" justifyContent="center" gap="20px">
      <Box >
        <ToastContainer />
        <Img src={ImageUrl} w="100px" h="100px" borderRadius="full" />
        <Box
          display={'flex'}
          justifyContent={'center'}
          style={{ cursor: 'pointer' }}
          onClick={handleProfilePicUpdate}
        >
          <FaPencil />
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*" // Accept only images
        />
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        fontSize={'larger'}
        fontWeight={'500'}
      >
        Membership Id
        <Box
          letterSpacing={'2px'}
        > {userProfileData?.uniqueId} </Box>
      </Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Button bg="var(--primary)" color="#fff">
          Favourites
        </Button>
        <Button bg="var(--primary)" color="#fff">
          Recently
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarBrand;
