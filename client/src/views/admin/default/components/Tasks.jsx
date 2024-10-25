// Chakra imports
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/card/Card.jsx";
import Menu from "../../../../components/menu/MainMenu";
import IconBox from "../../../../components/icons/IconBox";

// Assets
import { MdCheckBox, MdDragIndicator } from "react-icons/md";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  const tasks = [
    { id: 1, label: "Landing Page Design", completed: false },
    { id: 2, label: "Dashboard Builder", completed: true },
    { id: 3, label: "Mobile App Design", completed: true },
    { id: 4, label: "Illustrations", completed: false },
    { id: 5, label: "Promotional LP", completed: true },
  ];

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex alignItems="center" w="100%" mb="30px">
        <IconBox
          me="12px"
          w="38px"
          h="38px"
          bg={boxBg}
          icon={<Icon as={MdCheckBox} color={brandColor} w="24px" h="24px" />}
        />
        <Text color={textColor} fontSize="lg" fontWeight="700">
          Tasks
        </Text>
        <Menu ms="auto" />
      </Flex>
      <Box px="11px">
        {tasks.map((task) => (
          <Flex key={task.id} mb="20px" align="center">
            <Checkbox
              me="16px"
              colorScheme="brandScheme"
              defaultChecked={task.completed}
            />
            <Text
              fontWeight="bold"
              color={textColor}
              fontSize="md"
              textAlign="start"
            >
              {task.label}
            </Text>
            <Icon
              ms="auto"
              as={MdDragIndicator}
              color="secondaryGray.600"
              w="24px"
              h="24px"
            />
          </Flex>
        ))}
      </Box>
    </Card>
  );
}
