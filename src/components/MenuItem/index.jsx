import { Link, Text } from "@chakra-ui/react"
import React from "react"

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
    return (
        <Link href={to}>
        <Text color={"secondary.300"} display="block" {...rest}>
            {children}
        </Text>
        </Link>
    );
};

export default MenuItem