import React from "react"
import { Box, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const Logo = (props) => {
  const navigate = useNavigate()
  return (
    <Flex 
      {...props}
    >
      <Text 
        fontSize="3xl"
        color="secondary.300"
        fontWeight="semibold"
        onClick={() => navigate("/")}
        cursor="pointer"
      >
        SIPAV
      </Text>
    </Flex>
  )
}

export default Logo;