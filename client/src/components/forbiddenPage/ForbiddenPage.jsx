import PropTypes from "prop-types";
import { Center, Box, Heading, Text, Icon } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";

import { motion } from "framer-motion";

const ForbiddenPage = ({ isPermitted }) => {
    if (!isPermitted) {
        return (
            <Center height="70vh" position="relative" overflow="hidden">
                {/* Background blur effect */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    backdropFilter="blur(10px)"
                    zIndex={-1}
                ></Box>

                {/* Content */}
                <motion.div
                    initial={{ x: "100vw" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100vw" }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    <Box textAlign="center" color="white" zIndex={1} p={4}>
                        <Icon as={FaLock} boxSize="80px" color="red.500" mb={4} />
                        <Heading as="h1" size="2xl" mb={2} color="red.300">
                            403 Forbidden
                        </Heading>
                        <Text fontSize="lg" color="red.200">
                            You do not have permission to access this page. <br />
                            Please contact the administrator for assistance.
                        </Text>
                    </Box>
                </motion.div>
            </Center>
        );
    }
    return null; // If permitted, don't render the component
};

ForbiddenPage.propTypes = {
    isPermitted: PropTypes.bool.isRequired,
};

export default ForbiddenPage;
