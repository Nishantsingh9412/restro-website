import { useEffect, useState } from "react";
import { Button, Flex, Heading, Input, Link, Text } from "@chakra-ui/react";
import { IoMdLogOut } from "react-icons/io";
import LiveLocationModal from "./components/LiveLocationModal";
import { useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";

export default function DeliverySettings() {
  const localData = JSON.parse(localStorage.getItem("ProfileData"));
  const singleUserData = useSelector((state) => state.delBoyReducer.delBoyUser);

  const [settings, setSettings] = useState(singleUserData);
  const [utils, setUtils] = useState({
    isEditing: false,
    isLiveLocationModal: false,
  });
  const updateUtils = (newUtils) =>
    setUtils((prev) => ({ ...prev, ...newUtils }));

  useEffect(() => {
    setSettings(singleUserData);
  }, [singleUserData]);

  return (
    <>
      <LiveLocationModal
        isOpen={utils.isLiveLocationModal}
        setIsOpen={(bool) => updateUtils({ isLiveLocationModal: bool })}
        prevURL={settings.liveLocationURL}
        deliveryBoyId={
          singleUserData?._id || localData?._id || localData?.result?._id
        }
      />
      <Flex
        justifyContent={"space-between"}
        mt={{ base: "100px", md: "100px", lg: 20 }}
        mb={5}
        alignItems={{ md: "center", base: "flex-start" }}
        direction={{ base: "column", md: "row" }}
        gap={5}
      >
        <Heading fontSize={20}>Settings</Heading>
        {/* {isEditing ? (
          <Flex gap={5} alignSelf={"flex-end"}>
            <Button colorScheme="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSave}>
              Save Changes
            </Button>
          </Flex>
        ) : (
          <Button onClick={() => setIsEditing(true)} alignSelf={"flex-end"}>
            Edit
          </Button>
        )} */}
      </Flex>
      <Flex
        flexDirection={"column"}
        borderRadius={10}
        bg={"#fff"}
        py={10}
        px={5}
        gap={10}
      >
        <Flex flexDirection={"column"} gap={2}>
          <Text fontWeight={600}>Live Location URL</Text>
          {settings?.liveLocationURL ? (
            <Flex alignItems={"center"} gap={5}>
              <Link
                color="blue"
                target="_blank"
                href={settings?.liveLocationURL}
              >
                Click here
              </Link>
              <Button
                size="small"
                w={"fit-content"}
                p={2}
                colorScheme="blue"
                leftIcon={<MdEdit />}
                onClick={() => updateUtils({ isLiveLocationModal: true })}
              >
                Edit
              </Button>
            </Flex>
          ) : (
            <Button
              size="small"
              w={"fit-content"}
              p={2}
              colorScheme="blue"
              onClick={() => updateUtils({ isLiveLocationModal: true })}
            >
              Share Live Location
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}