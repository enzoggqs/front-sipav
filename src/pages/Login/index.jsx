import React, { useEffect, useState } from 'react';
import { Flex, Text, Divider, Button } from "@chakra-ui/react";
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CustomInput from '../../components/CustomInput/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("E-mail inválido.")
      .required("O campo email é obrigatório."),
    password: Yup.string()
      .required("O campo senha é obrigatório.")
      .min(8, "Senha muito curta."),
  });

  const loginHandle = (values) => {
    signIn(values.email, values.password, navigate);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={loginHandle}
    >
      {({ handleSubmit, errors, touched, isValid, dirty }) => (
        <Flex
          backgroundColor="primary.500"
          alignItems="center"
          justifyContent="center"
          h={"100vh"}
          w={"100vw"}
        >
          <Flex
            as={Form}
            backgroundColor="#F0F1F3"
            width={["90%", "80%", "70%", "40%"]}
            pt={"2rem"}
            borderRadius="30px"
            flexDirection="column"
            alignItems="center"
            boxShadow="dark-lg"
            px={["3rem", "4rem", "5rem", "5rem"]}
            data-testid="valid-form"
          >
            <Text
              fontSize={["2xl", "3xl", "3xl", "3xl"]}
              color="primary.600"
              fontWeight="semibold"
              pb={[".2rem", ".3rem", ".5rem", ".5rem"]}
            >
              SIPAV
            </Text>
            <Divider
              borderColor="primary.600"
              backgroundColor="primary.600"
              borderWidth={[".1rem", ".2rem", ".2rem", ".2rem"]}
              w={"15%"}
            />
            <Flex
              height="50%"
              width="100%"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              mt={["2rem", "2rem", "3rem", "3rem"]}
            >
              <CustomInput
                label="E-mail"
                icon={<EmailIcon color='gray.500' />}
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                height={'54px'}
                borderWidth=".2rem"
                borderRadius="30px"
                touched={touched}
                errors={errors}
              />

              <CustomInput
                label="Senha"
                icon={<LockIcon color='gray.500' />}
                name="password"
                type="password"
                placeholder="Digite sua senha"
                height={'54px'}
                borderWidth=".2rem"
                borderRadius="30px"
                show={show}
                handleClick={handleClick}
                touched={touched}
                errors={errors}
              />
            </Flex>
            <Button
              data-testid="login-button"
              type="submit"
              isDisabled={!isValid || !dirty}
              marginTop="1rem"
              p="1rem"
              variant="solid"
              borderRadius="30px"
              borderColor="primary.600"
              borderWidth=".2rem"
              color="primary.600"
              backgroundColor="transparent"
              transition="background-color 0.3s, color 0.3s"
              _hover={(isValid && dirty) && {
                backgroundColor: "primary.600",
                color: "#F0F1F3",
              }}
              mb="2rem"
              fontSize={["md", "xl", "xl", "xl"]}
            >
              Login
            </Button>
            <Text
              color="primary.500"
              mb="2rem"
              fontSize="sm"
            >
              Não tem uma conta? &nbsp;
              <Text
                as='u'
                fontWeight="bold"
                color="primary.600"
                cursor="pointer"
                fontSize="sm"
                onClick={() => navigate("/register")}
              >
                Cadastre-se
              </Text>
            </Text>
          </Flex>
        </Flex>
      )}
    </Formik>
  );
};

export default Login;
