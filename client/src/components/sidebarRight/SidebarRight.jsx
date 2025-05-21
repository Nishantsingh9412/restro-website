import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Notifications from "./components/Notifications";
import Contacts from "./components/Contacts";

// SidebarRight component definition
const SidebarRight = () => {
  const location = useLocation(); // Get the current location
  const [data] = useState(dummyData); // Initialize state with dummy data

  // Only render the sidebar if the current path is "/admin/dashboards/default"
  if (location.pathname !== "/admin/dashboards/default") {
    return null;
  }

  return (
    <Box
      w="300px"
      minH="100vh"
      bg="var(--primary)"
      color="#fff"
      px="10px"
      py="40px"
      borderLeftRadius="30px"
      display={{ base: "none", xl: "block" }}
    >
      {/* Render Notifications component with data */}
      <Notifications data={data.notifications} />
      {/* Uncomment if needed */}
      {/* <Logs data={data.logs} /> */}
      {/* Render Contacts component with data */}
      <Contacts />
    </Box>
  );
};

export default SidebarRight;

// Dummy data for notifications, logs, and contacts
const dummyData = {
  notifications: [
    {
      title: "You fixed a bug",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(255, 233, 243)",
      },
    },
    {
      title: "New user registered",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(255, 249, 185)",
      },
    },
    {
      title: "You fixed a bug",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(187, 251, 255)",
      },
    },
    {
      title: "Andie Lone subscribed to you",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(202, 224, 251)",
      },
    },
  ],
  logs: [
    {
      title: "Changed the style",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(212, 223, 241)",
      },
    },
    {
      title: "Released a new version",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(0, 240, 146)",
      },
    },
    {
      title: "Submitted a bug",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(192, 247, 250)",
      },
    },
    {
      title: "Modified a data in page x",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(249, 235, 228)",
      },
    },
    {
      title: "Deleted a page in project x",
      time: new Date(),
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(253, 165, 102)",
      },
    },
  ],
  contacts: [
    {
      name: "Natali Craig",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(0, 241, 143)",
      },
    },
    {
      name: "Drew Cano",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(208, 224, 248)",
      },
    },
    {
      name: "Andi Lane",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(195, 249, 249)",
      },
    },
    {
      name: "Koroy Okumus",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(254, 160, 110)",
      },
    },
    {
      name: "Kale Morrisan",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(192, 248, 255)",
      },
    },
    {
      name: "Melody Macy",
      iconDetails: {
        isAvailable: true,
        icon: "",
        bg: "rgb(0, 37, 246)",
      },
    },
  ],
};
