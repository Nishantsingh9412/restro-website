import { useEffect, useState } from "react";
import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import LiveLocationModal from "./components/LiveLocationModal";
import { useSelector } from "react-redux";
import { localStorageData } from "../../../utils/constant";

export default function DeliverySettings() {
  const localData = JSON.parse(
    localStorage.getItem(localStorageData.PROFILE_DATA)
  );
  const singleUserData = useSelector((state) => state.userReducer?.data);

  const [settings, setSettings] = useState(singleUserData);
  const [utils, setUtils] = useState({
    isEditing: false,
    isLiveLocationModal: false,
  });

  useEffect(() => {
    setSettings(singleUserData);
  }, [singleUserData]);

  const updateUtils = (newUtils) =>
    setUtils((prev) => ({ ...prev, ...newUtils }));

  return (
    <>
      <LiveLocationModal
        isOpen={utils.isLiveLocationModal}
        setIsOpen={(bool) => updateUtils({ isLiveLocationModal: bool })}
        prevURL={settings?.liveLocationURL}
        deliveryBoyId={
          singleUserData?._id || localData?._id || localData?.result?._id
        }
      />
      <Flex
        justifyContent="space-between"
        mt={{ base: "100px", md: "100px", lg: 20 }}
        mb={5}
        alignItems={{ md: "center", base: "flex-start" }}
        direction={{ base: "column", md: "row" }}
        gap={5}
      >
        <Heading fontSize={20}>Settings</Heading>
      </Flex>
      <Flex
        flexDirection="column"
        borderRadius={10}
        bg="#fff"
        py={10}
        px={5}
        gap={10}
      >
        <Flex flexDirection="column" gap={2}>
          <Text fontWeight={600}>Live Location URL</Text>
          {settings?.liveLocationURL ? (
            <Flex alignItems="center" gap={5}>
              <Link
                color="blue"
                target="_blank"
                href={settings?.liveLocationURL}
              >
                Click here
              </Link>
              <Button
                size="small"
                w="fit-content"
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
              w="fit-content"
              p={3}
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
