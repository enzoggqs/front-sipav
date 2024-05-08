import React, { useEffect, useState } from 'react'
import { Flex } from "@chakra-ui/layout";
import { Text, Divider, Button, Grid, GridItem, Checkbox, CheckboxGroup, Tooltip } from "@chakra-ui/react";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from '../../components/CustomInput/index.jsx';
import { BiUserCircle, BiNews } from "react-icons/bi";
import { FiMail } from "react-icons/fi";
import { FaTelegram, FaWhatsapp, FaLock, FaCalendar } from "react-icons/fa6";
import useAuth from '../../services/useAuth.jsx';

const Register = () => {
  const navigate = useNavigate();

  const { isAuthenticated, register } = useAuth();
  const isAuth = isAuthenticated;

  const [show, setShow] = useState(false)
  const [step, setStep] = useState(1)

  const handleClick = () => setShow(!show)

  const initialValues = {
    email: "",
    password: "",
    name: "",
    cpf: "",
    birthdate: "",
    telegram: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("E-mail inválido.")
      .required("O campo email é obrigatório."),
    password: Yup.string()
      .required("O campo senha é obrigatório.")
      .min(8, "Senha muito curta."),
    name: Yup.string()
      .required("O campo nome é obrigatório."),
    cpf: Yup.string()
      .required("O campo CPF é obrigatório.")
      .min(11),
    birthdate: Yup.date()
      .required("O campo data de nascimento é obrigatório."),
  });

  const registerHandle = (values) => {
    values.birthdate = new Date(values.birthdate)
    values.phoneNumber = String(values.phoneNumber)
    register(
      values,
      navigate
    );
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  return (
    <>
      <Flex
        backgroundColor="primary.500"
        alignItems="center"
        justifyContent="center"
        h={"100vh"}
        w={"100vw"}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => registerHandle(values)}
        >
          {({ handleSubmit, errors, touched, isValid, dirty }) => (
            <Flex
              as={Form}
              backgroundColor="#F0F1F3"
              width="35%"
              pt={"2rem"}
              borderRadius="30px"
              flexDirection="column"
              alignItems="center"
              boxShadow="dark-lg"
              onSubmit={handleSubmit}
              maxH={"90vh"}
              px="5rem"
            >
              {step == 1 && (
                <>
                  <Text
                    fontSize="3xl"
                    color="primary.600"
                    fontWeight="semibold"
                    pb=".5rem"
                  >
                    SIPAV
                  </Text>
                  <Divider
                    borderColor="primary.600"
                    backgroundColor="primary.600"
                    borderWidth=".2rem"
                    w={"15%"}
                  />
                  <Flex
                    width="100%"
                    height="50%"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    mt="3rem"
                    overflowY="auto"
                    maxH="450px"
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
                      icon={<BiUserCircle size={20} className='custom-icon' />}
                      name="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      height={'54px'}
                      borderWidth=".2rem"
                      borderRadius="30px"
                      touched={touched}
                      errors={errors}
                    />

                    <CustomInput
                      label="E-mail"
                      icon={<FiMail size={20} color='gray.500' className='custom-icon' />}
                      name="email"
                      type="email"
                      placeholder="Digite email para cadastro"
                      height={'54px'}
                      borderWidth=".2rem"
                      borderRadius="30px"
                      touched={touched}
                      errors={errors}
                    />

                    <CustomInput
                      label="CPF"
                      icon={<BiNews size={20} color='gray.500' className='custom-icon' />}
                      name="cpf"
                      type="text"
                      placeholder="Digite CPF para cadastro"
                      height={'54px'}
                      borderWidth=".2rem"
                      borderRadius="30px"
                      touched={touched}
                      errors={errors}
                    />

                    <CustomInput
                      label="Senha"
                      icon={<FaLock size={20} className='custom-icon' color='gray.500' />}
                      name="password"
                      type="password"
                      placeholder="Digite sua senha para cadastro"
                      height={'54px'}
                      borderWidth=".2rem"
                      borderRadius="30px"
                      show={show}
                      handleClick={handleClick}
                      touched={touched}
                      errors={errors}
                    />

                    <CustomInput
                      label="Data de Nascimento"
                      icon={<FaCalendar size={20} className='custom-icon' color='gray.500' />}
                      name="birthdate"
                      type="date"
                      placeholder="Selecione sua data de nascimento"
                      height={'54px'}
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
                    marginTop="1rem"
                    backgroundColor="transparent"
                    color="primary.600"
                    borderColor="primary.600"
                    transition="background-color 0.3s, color 0.3s"
                    _hover={(isValid && dirty) && {
                      backgroundColor: "primary.600",
                      color: "#F0F1F3",
                    }}
                    onClick={() => setStep(2)}
                  >
                    Cadastrar
                  </Button>
                  <Text
                    color="primary.500"
                    mb="2rem"
                    fontSize="sm"
                  >
                    Já possui uma conta? &nbsp;
                    <Text
                      as='u'
                      fontWeight="bold"
                      color="primary.600"
                      cursor="pointer"
                      fontSize="sm"
                      onClick={() => navigate("/login")}
                    >
                      Entre
                    </Text>
                  </Text>
                </>
              )}

              {
                step === 2 && (
                  <Flex
                    px="60px"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {/* <Text
                      fontSize="24px"
                      color="primary.600"
                      fontWeight="semibold"
                      pb=".5rem"
                      position="relative"
                      top="-8rem"
                    >
                      {username}
                    </Text> */}
                    <Text
                      fontSize="xl"
                      color="primary.600"
                      fontWeight="semibold"
                      pb=".5rem"
                    >
                      Gostaria de ser notificado em algum lugar além do e-mail?
                    </Text>
                    <Grid w="100%" templateColumns='1fr 6fr'>
                      <Checkbox borderColor="gray" pt="2rem" colorScheme='gray' />
                      <GridItem>
                        <CustomInput
                          label="Whatsapp"
                          icon={<FaWhatsapp className='custom-icon' color='gray.500' />}
                          name="phoneNumber"
                          type="number"
                          placeholder="Digite seu telefone"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                        />
                      </GridItem>
                      <Checkbox borderColor="gray" pt="2rem" colorScheme='gray' />
                      <GridItem>
                        <CustomInput
                          label="Telegram"
                          icon={<FaTelegram className='custom-icon' color='gray.500' />}
                          name="telegram"
                          type="text"
                          placeholder="Digite seu usuário do Telegram"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                        />
                      </GridItem>
                    </Grid>

                    <Button
                      type="submit"
                      p="1rem"
                      mb="2rem"
                      fontSize="xl"
                      borderRadius="30px"
                      borderWidth=".2rem"
                      isDisabled={!isValid || !dirty}
                      marginTop="1rem"
                      variant="solid"
                      borderColor="primary.600"
                      color="primary.600"
                      backgroundColor="transparent"
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
                        Confirmar
                      </Tooltip>
                    </Button>
                  </Flex>
                )
              }
            </Flex>
          )}
        </Formik>
      </Flex>
    </>
  )
}

export default Register