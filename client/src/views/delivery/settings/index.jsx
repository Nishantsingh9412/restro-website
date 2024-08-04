import { useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { IoMdLogOut } from "react-icons/io";

export default function DeliverySettings() {
  const [settings, setSettings] = useState({
    online: true,
  });
  const [formData, setFormData] = useState(settings);
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(settings);
  };

  const handleSave = () => {
    setSettings(formData);
    setIsEditing(false);
  };

  const handleLogOut = () => {
    console.log("log out");
  };

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        mt={{ base: "100px", md: "100px", lg: 20 }}
        mb={5}
        alignItems={{md: "center", base: 'flex-start'}}
        direction={{ base: "column", md: "row" }}
        gap={5}
      >
        <Heading fontSize={20}>Settings</Heading>
        {isEditing ? (
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
        )}
      </Flex>
      <Flex
        flexDirection={"column"}
        borderRadius={10}
        bg={"#fff"}
        py={10}
        px={5}
        gap={10}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text>Activity Status:</Text>
          {isEditing ? (
            <select
              style={{
                borderRadius: "5px",
                padding: "10px",
                border: "1px solid #eee",
              }}
              value={formData.online}
              onChange={(e) =>
                setFormData({ ...formData, online: e.target.value === "true" })
              }
            >
              <option value={true}>Online</option>
              <option value={false}>Offline</option>
            </select>
          ) : (
            <Text
              color={settings.online ? "green.400" : "red.400"}
              fontWeight={500}
            >
              {settings.online ? "Online" : "Offline"}
            </Text>
          )}
        </Flex>
        {!isEditing && (
          <Flex
            onClick={handleLogOut}
            justifyContent={"space-between"}
            alignItems={"center"}
            cursor={"pointer"}
          >
            <Text>Log out</Text>
            <IoMdLogOut />
          </Flex>
        )}
      </Flex>
    </>
  );
}
