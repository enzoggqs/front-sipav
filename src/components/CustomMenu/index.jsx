import React, { useState } from 'react'
import { 
    Flex, 
    Button, 
    Box, 
    Text,
    Divider,
    Image,
} from '@chakra-ui/react'
import menu from '../../assets/menu.png'
import { useNavigate } from "react-router-dom";
import useAuth from '../../services/useAuth.jsx';

const CustomMenu = ({ onClose }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { signOut } = useAuth();

  const navigate = useNavigate();

  const toggleMenuState = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <Image 
        onClick={toggleMenuState} 
        src={menu} 
        alt='Hamburger menu' 
        pos="absolute" 
        top="5%" 
        right="5%"
        cursor={"pointer"}
        w={'3rem'}
      />
      {isMenuOpen && (
        <Flex
          backgroundColor="#05BFDB"
          alignItems="center"
          justifyContent="space-evenly"
          flexDirection="column"
          h={"10rem"}
          w={"7.5rem"}
          pos="absolute" 
          top="6rem" 
          right="5%"
          borderRadius="20px"
        >
            <Flex
              onClick={() => navigate("/account")}
              cursor={"pointer"}
              w="90%"
              h="30%"
              justifyContent="center"
              alignItems="center"
            >
              <Text 
                fontWeight='soso' 
                fontSize='sm' 
                color="#F0F1F3" 
              >
                Perfil
              </Text>
            </Flex>
            <Divider opacity={'inherit'} borderColor={'#F3F4F6'} borderWidth={".08rem"} w="60%"/>
            <Flex 
              onClick={onClose}
              cursor={"pointer"}
              w="90%"
              h="30%"
              justifyContent="center"
              alignItems="center"
            >
              <Text 
                fontWeight='soso' 
                fontSize='sm' 
                color="#F0F1F3" 
              > 
                Informações
              </Text>
            </Flex>
            <Divider opacity={'unset'} borderColor={'#F3F4F6'} borderWidth={".08rem"} w="60%"/>
            <Flex 
              onClick={() => {signOut();}}
              cursor={"pointer"}
              w="90%"
              h="30%"
              justifyContent="center"
              alignItems="center"
            >
              <Text 
                fontWeight='soso' 
                fontSize='sm' 
                color="#F0F1F3" 
              > 
                Sair
              </Text>
            </Flex>
        </Flex>
      )}
    </>
  )
}

export default CustomMenu