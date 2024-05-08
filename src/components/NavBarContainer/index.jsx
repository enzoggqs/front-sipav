import { Flex } from "@chakra-ui/react";

const NavBarContainer = ({ children, ...props }) => {
    return (
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={"3rem"}
        px={8}
        py={5}
        bg={["primary.600", "primary.600", "primary.600", "primary.600"]}
        color={["white", "white", "primary.700", "primary.700"]}
        {...props}
      >
        {children}
      </Flex>
    );
};

export default NavBarContainer