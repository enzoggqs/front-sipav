import React, { useContext, useEffect, useState } from 'react'
import { Flex, Text, Box } from "@chakra-ui/layout";
import CustomForm from '../../components/CustomForm';
import CustomInput from '../../components/CustomInput';
import * as Yup from "yup";
import { BiUserCircle } from 'react-icons/bi';
import { Formik, Form } from 'formik';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa6';
import { CalendarIcon, EmailIcon } from '@chakra-ui/icons';
import { Button, Image, Spinner } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react'
import { GoArrowLeft } from "react-icons/go";
import useAuth from '../../services/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';

const Profile = () => {
  const { isAuthenticated, update } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("@sipavUser"));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 1 second
    }, 1000);
    if (!userData) {
      navigate("/login")
    }
    async function fetchUserData() {
      try {
        const response = await api.get(`/user/${userData?.id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }

    fetchUserData();

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <Flex
        width="100%"
        h="full"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size='xl' color="white" />
      </Flex>
    )
  }

  const initialValues = {
    id: user.id,
    email: user.email,
    name: user.name,
    telegram: user.telegram || '',
    phoneNumber: user.phoneNumber || '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("E-mail inválido.")
      .required("O campo email é obrigatório."),
    name: Yup.string()
      .required("O campo nome é obrigatório."),
  });

  async function updateHandle(values) {
    values.phoneNumber = String(values.phoneNumber)
    await update(values);
    navigate(0);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => updateHandle(values)}
      >
        {({ handleSubmit, errors, touched, isValid, dirty }) => (
          <Flex
            as={Form}
            backgroundColor="#F0F1F3"
            width={["90%", "80%", "70%", "40%"]}
            pt={"2rem"}
            borderRadius="30px"
            flexDirection="column"
            alignItems="center"
            boxShadow="dark-lg"
            onSubmit={handleSubmit}
            maxH={"70vh"}
          // px={["3rem", "4rem", "5rem", 0]}
          >
            <Flex
              justifyContent="center"
              w="80%"
              alignItems="center"
            >
              <Text
                fontSize={["md", "md", "xl", "xl"]}
                color="primary.600"
                fontWeight="semibold"
                pb=".5rem"
              >
                Dados
              </Text>
            </Flex>
            <Flex
              height="50%"
              width="70%"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              mt={["1rem", "2rem", "2rem", "2rem"]}
              overflowY="auto"
              maxH="400px"
              marginBottom="2rem"
              px={2}
              sx={{
                "&::-webkit-scrollbar": {
                  marginLeft: "1rem",
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#088395",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#0A4D68",
                },
              }}
            >
              <CustomInput
                label="Nome"
                icon={<BiUserCircle className='custom-icon' />}
                name="name"
                type="text"
                placeholder="Digite seu nome completo"
                height={'50px'}
                borderWidth=".2rem"
                borderRadius="30px"
                touched={touched}
                errors={errors}
              />

              <CustomInput
                label="E-mail"
                icon={<EmailIcon color='gray.500' className='custom-icon' />}
                name="email"
                type="email"
                placeholder="Digite email para cadastro"
                height={'50px'}
                borderWidth=".2rem"
                borderRadius="30px"
                touched={touched}
                errors={errors}
                isDisabled
              />

              <CustomInput
                label="Whatsapp"
                icon={<FaWhatsapp className='custom-icon' color='gray.500' />}
                name="phoneNumber"
                type="number"
                placeholder="Digite seu telefone"
                height={'50px'}
                borderWidth=".2rem"
                borderRadius="30px"
                touched={touched}
                errors={errors}
              />

              <CustomInput
                label="Telegram"
                icon={<FaTelegram className='custom-icon' color='gray.500' />}
                name="telegram"
                type="text"
                placeholder="Digite seu usuário do Telegram"
                height={'50px'}
                borderWidth=".2rem"
                borderRadius="30px"
                touched={touched}
                errors={errors}
              />

            </Flex>
            <Button
              type="submit"
              p="1rem"
              mb="2rem"
              fontSize="xl"
              borderRadius="30px"
              borderWidth=".2rem"
              isDisabled={!isValid || !dirty}
              marginTop={["0", "0", "1rem", "1rem"]}
              color="primary.600"
              variant="solid"
              backgroundColor="transparent"
              borderColor="primary.600"
              transition="background-color 0.3s, color 0.3s"
              _hover={(isValid && dirty) && {
                backgroundColor: "primary.600",
                color: "#F0F1F3",
              }}
            >
              <Tooltip
                label="Você precisa alterar alguma informação"
                placement="top"
                hasArrow
                isOpen={dirty ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
              >
                Salvar
              </Tooltip>
            </Button>
          </Flex>
        )}
      </Formik>
    </>
  )
}

export default Profile