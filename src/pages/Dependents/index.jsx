import { Button, Flex, Text, Tooltip } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { BiNews, BiSolidEdit, BiSolidTrash, BiUserCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import CustomBox from '../../components/CustomBox'
import * as Yup from "yup";
import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import CustomModal from '../../components/CustomModal'
import CustomInput from '../../components/CustomInput'
import { CalendarIcon } from '@chakra-ui/icons'
import DependentAPI from '../../services/DependentAPI'

const Dependents = () => {
  const initialRef = useRef();
  const finalRef = useRef();
  const [isOpenEditModal, setIsOpenEditModal] = React.useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState(false);
  const [currentEditDependent, setCurrentEditDependent] = React.useState(0);
  const [initialValuesEdit, setInitialValuesEdit] = React.useState(
    {
      name: '',
      cpf: '',
      birthdate: ''
    }
  )

  const {
    getAllDependents, createDependent, updateDependent, deleteDependent
  } = DependentAPI();

  const [user, setUser] = useState(null);
  const userData = JSON.parse(localStorage.getItem("@sipavUser"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getAllDependents(userData.id);

        console.log(currentUser)
        setUser(currentUser.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }

    fetchUserData();
  }, [userData.id]);

  const handleOpenEditModal = (dependent) => {
    setCurrentEditDependent(dependent.id);
    const formattedDate = new Date(dependent.birthdate).toISOString().split('T')[0];
    setInitialValuesEdit({
      name: dependent.name,
      cpf: dependent.cpf,
      birthdate: formattedDate
    })
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenDeleteModal = (dependent) => {
    setCurrentEditDependent(dependent.id);
    setIsOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const navigate = useNavigate();

  const initialValuesAdd = {
    name: '',
    cpf: '',
    birthdate: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("O campo nome é obrigatório."),
    cpf: Yup.string()
      .required("O campo CPF é obrigatório.")
      .min(11),
    birthdate: Yup.date()
      .required("O campo data de nascimento é obrigatório."),
  });

  async function addDependent(data) {
    const createdDependent = {
      ...data,
      isResponsible: false,
      responsible_id: userData.id
    }
    try {
      await createDependent(createdDependent);
      navigate(0);
    } catch (error) {
      console.error('Failed to create dependent:', error.message);
    }
  };

  async function editDependent(data) {
    try {
      await updateDependent(data, currentEditDependent);
      handleCloseEditModal()
      navigate(0);
    } catch (error) {
      setCurrentEditDependent(0)
      console.error('Failed to update product:', error.message);
    }
  };

  async function removeDependent() {
    try {
      await deleteDependent(currentEditDependent);
      handleCloseDeleteModal()
      navigate(0);
    } catch (error) {
      setCurrentEditDependent(0)
      console.error('Failed to delete product:', error.message);
    }
  };

  return (
    <Flex
      backgroundColor="#F0F1F3"
      width="36%"
      pt={"2rem"}
      borderRadius="30px"
      flexDirection="column"
      alignItems="center"
      boxShadow="dark-lg"
    >
      <Flex
        justifyContent="center"
        w="80%"
      >
        <Text
          fontSize="xl"
          color="primary.600"
          fontWeight="semibold"
          pb=".5rem"
        >
          Seus Dependentes
        </Text>
      </Flex>
      <Flex
        height="60%"
        width="80%"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        mt="1rem"
        overflowY="auto"
        maxH="300px"
        // minH="80px"
        marginBottom="2rem"
        borderRadius="1rem"
        px="1rem"
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
        {user?.dependents?.length > 0 ? (user?.dependents?.map((dependent, index) => (
          <CustomBox
            key={index}
            text={dependent.name}
            firstImage={
              <BiSolidEdit
                size={30}
                color='#088395'
                cursor={"pointer"}
                onClick={() => handleOpenEditModal(dependent)}
              />
            }
            secondImage={
              <BiSolidTrash
                size={30}
                color='#088395'
                cursor={"pointer"}
                onClick={() => handleOpenDeleteModal(dependent)}
              />
            }
          />
        ))) : (
          <Flex
            justifyContent="center"
            w="full"
          >
            <Text
              fontSize="md"
              color="secondary.600"
              fontWeight="semibold"
              pb=".5rem"
            >
              Você não possui dependentes
            </Text>
          </Flex>
        )}
      </Flex>
      <Button
        type="submit"
        p="1rem"
        mb="2rem"
        fontSize="md"
        borderRadius="30px"
        borderWidth=".2rem"
        marginTop="1rem"
        borderColor="#E0E0E0"
        color="#F0F1F3"
        variant="solid"
        backgroundColor="primary.600"
        transition="background-color 0.3s, color 0.3s"
        _hover={{
          backgroundColor: "primary.600",
          color: "#F0F1F3",
        }}
        onClick={handleOpenAddModal}
      >
        Adicionar Dependente
      </Button>
      {/* Modal de Edição */}
      <CustomModal
        isOpen={isOpenEditModal}
        onClose={handleCloseEditModal}
        initialRef={initialRef}
        finalRef={finalRef}
      >
        <ModalHeader>
          <Text
            fontSize="2xl"
            color="primary.600"
            fontWeight="semibold"
            pb=".5rem"
          >
            Editar Dependente
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValuesEdit}
            validationSchema={validationSchema}
            onSubmit={(values) => editDependent(values)}
          >
            {({ handleSubmit, errors, touched, isValid, dirty }) => (
              <Flex
                as={Form}
                width="100%"
                onSubmit={handleSubmit}
                flexDirection="column"
                alignItems="center"
              >
                <Flex
                  height="50%"
                  width="70%"
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  mt="1rem"
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
                    icon={<BiUserCircle className='custom-icon' />}
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
                    label="CPF"
                    icon={<BiNews color='gray.500' className='custom-icon' />}
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
                    label="Data de Nascimento"
                    icon={<CalendarIcon className='custom-icon' color='gray.500' />}
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
                  h="3rem"
                  w="10rem"
                  borderRadius="30px"
                  borderColor="primary.600"
                  borderWidth=".2rem"
                  isDisabled={!isValid || !dirty}
                  color="primary.600"
                  variant="solid"
                  marginTop="1rem"
                  backgroundColor="transparent"
                  transition="background-color 0.3s, color 0.3s"
                  _hover={(isValid && dirty) && {
                    backgroundColor: "primary.600",
                    color: "#F0F1F3",
                  }}
                  mb="1rem"
                  fontSize="2xl"
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
        </ModalBody>
      </CustomModal>
      {/* Modal de Adição */}
      <CustomModal
        isOpen={isOpenAddModal}
        onClose={handleCloseAddModal}
        initialRef={initialRef}
        finalRef={finalRef}
      >
        <ModalHeader>
          <Text
            fontSize="2xl"
            color="primary.600"
            fontWeight="semibold"
            pb=".5rem"
          >
            Adicionar Dependente
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValuesAdd}
            validationSchema={validationSchema}
            onSubmit={(values) => addDependent(values)}
          >
            {({ handleSubmit, errors, touched, isValid, dirty }) => (
              <Flex
                as={Form}
                width="100%"
                onSubmit={handleSubmit}
                flexDirection="column"
                alignItems="center"
              >
                <Flex
                  height="50%"
                  width="70%"
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  mt="1rem"
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
                    icon={<BiUserCircle className='custom-icon' />}
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
                    label="CPF"
                    icon={<BiNews color='gray.500' className='custom-icon' />}
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
                    label="Data de Nascimento"
                    icon={<CalendarIcon className='custom-icon' color='gray.500' />}
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
                  h="3rem"
                  w="10rem"
                  borderRadius="30px"
                  borderColor="primary.600"
                  borderWidth=".2rem"
                  isDisabled={!isValid || !dirty}
                  color="primary.600"
                  variant="solid"
                  marginTop="1rem"
                  backgroundColor="transparent"
                  transition="background-color 0.3s, color 0.3s"
                  _hover={(isValid && dirty) && {
                    backgroundColor: "primary.600",
                    color: "#F0F1F3",
                  }}
                  mb="1rem"
                  fontSize="2xl"
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
        </ModalBody>
      </CustomModal>
      <CustomModal
        isOpen={isOpenDeleteModal}
        onClose={handleCloseDeleteModal}
        initialRef={initialRef}
        finalRef={finalRef}
      >
        <ModalBody>
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
          >
            <Text
              fontSize="xl"
              fontWeight="normal"
              pb=".5rem"
            >
              Tem certeza que deseja excluir o dependente?
            </Text>
            <Flex
              width="100%"
              flexDirection="row"
              alignItems="center"
              justifyContent={"center"}
              py={"1rem"}
              gap={"3rem"}
            >
              <Button
                onClick={() => removeDependent()}
              >
                Sim
              </Button>
              <Button
                onClick={() => handleCloseDeleteModal()}
              >
                Não
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </CustomModal>
    </Flex>
  )
}

export default Dependents