import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik'
import { CalendarIcon } from '@chakra-ui/icons'
import { Box, Spinner, Button, Divider, Flex, HStack, ListItem, ModalBody, Select, StackDivider, Text, Tooltip, UnorderedList, VStack } from '@chakra-ui/react';
import DiseaseAPI from '../../services/DiseaseApi';
import VaccinationAPI from '../../services/VaccinationAPI';
import CustomModal from '../../components/CustomModal';
import * as Yup from "yup";
import CustomInput from '../../components/CustomInput';
import api from '../../services/Api';

const Disease = () => {
  const initialRef = useRef();
  const finalRef = useRef();
  const navigate = useNavigate();
  const { diseaseId, userId } = useParams();
  const { createVaccination } = VaccinationAPI();

  const userData = JSON.parse(localStorage.getItem("@sipavUser"));

  const initialValuesAdd = {
    date: ''
  };

  const validationSchema = Yup.object({
    date: Yup.string()
      .required("O campo data é obrigatório."),
  });

  const { getDiseaseAndVaccine } = DiseaseAPI();

  const [currentDisease, setCurrentDisease] = useState();
  const [currentVaccine, setCurrentVaccine] = useState([]);
  const [user, setUser] = useState([])
  const [currentUser, setCurrentUser] = useState();
  const [currentVaccination, setCurrentVaccination] = useState();
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [loading, setLoading] = useState(true);
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);
  const [isOpenHistoryModal, setIsOpenHistoryModal] = React.useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false); // Set loading to false after 1 second
    }, 1000);

    const fetchDisease = async () => {
      try {
        const response = await getDiseaseAndVaccine(diseaseId, userId);
        setCurrentDisease(response.data.disease);
        setCurrentVaccine(response.data.vaccine);
        setCurrentVaccination(response.data.vaccination);
      } catch (error) {
        console.error('Error fetching disease:', error);
      }
    };

    async function fetchResponsibleData() {
      try {
        const response = await api.get(`/user/${userData.id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }

    async function fetchCurrentUserData() {
      try {
        const response = await api.get(`/user/${userId}`);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }

    fetchDisease();
    fetchResponsibleData();
    fetchCurrentUserData()

    return () => clearTimeout(timeoutId);
  }, [selectedUserId])

  async function addVaccination(data) {
    const vaccination = {
      ...data,
      vaccineId: Number(currentVaccine[0].id),
      userId: Number(selectedUserId)
    }

    try {
      await createVaccination(vaccination);
      navigate(0);
    } catch (error) {
      console.error('Failed to create vaccination:', error.message);
    }
  };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;

    setLoading(true)
    setSelectedUserId(selectedUserId);

    if (user?.id === Number(selectedUserId)) {
      setCurrentUser(user);
      navigate(`/disease/${diseaseId}/user/${user.id}`);
      return;
    }

    const selectedDependent = user?.dependents?.find(dependent => dependent.id === Number(selectedUserId));
    if (selectedDependent) {
      setCurrentUser(selectedDependent);
      navigate(`/disease/${diseaseId}/user/${selectedDependent.id}`);
    } else {
      console.log("Usuário não encontrado");
    }
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenHistoryModal = () => {
    setIsOpenHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setIsOpenHistoryModal(false);
  };

  const isVaccineUpToDate = () => {
    // Verificar se o usuário foi vacinado alguma vez
    if (currentVaccination.length > 0) {
      // Se a vacina tem apenas uma dose, marcar como "Vacina em dia"
      if (currentVaccine[0]?.doses_required === currentVaccination.length) {
        return true;
      } else {
        // Se a vacina tem múltiplas doses, verificar a última dose tomada
        const lastVaccinationDate = new Date(currentVaccination[0]?.date);
        const monthsBetweenDoses = parseInt(currentVaccine[0]?.months_between_doses);
        const currentDate = new Date();

        // Calcular a data da próxima dose permitida
        const nextAllowedDate = new Date(lastVaccinationDate.setMonth(lastVaccinationDate.getMonth() + monthsBetweenDoses));

        // Se a data atual for menor ou igual à próxima dose permitida, a vacina está em dia
        return currentDate <= nextAllowedDate;
      }
    } else {
      // Se o usuário nunca foi vacinado, não está com a vacina em dia
      return false;
    }
  };

  const getLastVaccinationDate = () => {
    if (currentVaccination.length > 0) {
      // Encontrar a data mais recente entre as doses tomadas
      const lastVaccination = currentVaccination.reduce((acc, cur) => {
        const curDate = new Date(cur.date);
        return curDate > new Date(acc.date) ? cur : acc;
      });

      return new Date(lastVaccination.date).toLocaleDateString();
    } else {
      return "Nunca foi vacinado";
    }
  };

  if (loading) {
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

  return (
    <Flex
      width="100%"
      h="full"
      flexDir="column"
      alignItems="center"
    >
      <Text
        fontSize="3xl"
        color="secondary.400"
        fontWeight="semibold"
      >
        {currentDisease?.name}
      </Text>
      <Select
        fontSize="md"
        color="primary.600"
        fontWeight="semibold"
        width="20%"
        borderColor="primary.600"
        my="2rem"
        onChange={handleUserChange}
        value={selectedUserId || ''}
        bg="#F0F1F3"
      >
        <option value={user?.id}>{user.name}</option>
        {user?.dependents?.map((dependent, index) => (
          <option key={index} value={dependent?.id}>{dependent?.name}</option>
        ))}
      </Select>
      <HStack
        justifyContent="center"
        width="100%"
        px="10%"
        gap="6rem"
        alignItems="flex-start"
      >
        <Flex width="100%" justifyContent="center">
          <Flex
            backgroundColor="#F0F1F3"
            py={"2rem"}
            borderRadius="30px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            boxShadow="dark-lg"
            px="3rem"
            width="100%"
          >
            <Text
              fontSize="xl"
              color="secondary.400"
              fontWeight="semibold"
              mb="2rem"
            >
              {currentVaccine[0]?.length ? currentVaccine[0]?.name : "Doença sem vacina"}
            </Text>
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              width="100%"
            >
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Número de doses:
                </Text>
                <Text fontSize="md" flex="1">
                  {currentVaccine.length ? currentVaccine[0]?.doses_required : "indefinido"}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Intervalo entre doses:
                </Text>
                <Text
                  fontSize="md"
                  flex="1"
                  overflowX="auto"
                  maxH="100px"
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
                  {currentVaccine.length ? (
                    <>
                      {currentVaccine[0]?.months_between_doses}{" "}
                      {currentVaccine[0]?.months_between_doses > 1 ? "meses" : "mês"}
                    </>
                  ) : (
                    "Indefinido"
                  )}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left"
                  width="150px"
                >
                  Contra indicações:
                </Text>
                {currentVaccine?.length ? (
                  <Box flex="1">
                    <UnorderedList>
                      {currentVaccine[0]?.contraindications.map((contraindication, index) => (
                        <ListItem
                          key={index}
                        >
                          <Text
                            fontSize="md"
                            flex="1"
                            overflowY="auto"
                            // maxH="150px"
                            key={index}
                            sx={{
                              alignSelf: 'start', // Adicione esta linha para alinhar os textos ao início do contêiner
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
                            {contraindication}
                          </Text>
                        </ListItem>
                      )
                      )}
                    </UnorderedList>
                  </Box>
                ) : (
                  <Text
                    fontSize="md"
                    flex="1"
                    overflowX="auto"
                    maxH="100px"
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
                  >Indefinido</Text>
                )}
              </Flex>
            </VStack>
            <Divider my="1.5rem" />
            <Text
              fontSize="xl"
              color="secondary.400"
              fontWeight="semibold"
              mb="2rem"
            >
              Sua situação
            </Text>
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              width="100%"
            >
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left"
                  width="150px"
                >
                  Vacina em dia:
                </Text>
                <Text fontSize="md" flex="1">
                  {isVaccineUpToDate() ? 'Sim' : 'Não'}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Última dose tomada:
                </Text>
                <Text fontSize="md" flex="1">
                  {getLastVaccinationDate()}
                </Text>
              </Flex>
              <Flex alignItems="center" width="100%" justifyContent="space-around" gap="1rem">
                <Button
                  type="submit"
                  p="1rem"
                  mb="2rem"
                  fontSize="xl"
                  borderRadius="30px"
                  borderWidth=".2rem"
                  marginTop="1rem"
                  variant="solid"
                  borderColor="primary.600"
                  color="primary.600"
                  backgroundColor="transparent"
                  transition="background-color 0.3s, color 0.3s"
                  _hover={(currentVaccination?.length > 0) && {
                    backgroundColor: "primary.600",
                    color: "#F0F1F3",
                  }}
                  onClick={handleOpenHistoryModal}
                  isDisabled={!currentVaccination?.length > 0}
                >
                  <Tooltip
                    label="Não há vacina cadastrada"
                    placement="top"
                    hasArrow
                    isOpen={currentVaccination?.length > 0 ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
                  >
                    Ver histórico da vacina
                  </Tooltip>
                </Button>
                <Button
                  type="submit"
                  p="1rem"
                  mb="2rem"
                  fontSize="xl"
                  borderRadius="30px"
                  borderWidth=".2rem"
                  marginTop="1rem"
                  variant="solid"
                  borderColor="primary.600"
                  color="primary.600"
                  backgroundColor="transparent"
                  transition="background-color 0.3s, color 0.3s"
                  _hover={(currentVaccine?.length > 0) && {
                    backgroundColor: "primary.600",
                    color: "#F0F1F3",
                  }}
                  onClick={handleOpenAddModal}
                  isDisabled={!currentVaccine?.length > 0}
                >
                  <Tooltip
                    label="Não existe vacina para esta doença"
                    placement="top"
                    hasArrow
                    isOpen={currentVaccination?.length > 0 ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
                  >
                    Atualizar vacina
                  </Tooltip>
                </Button>

              </Flex>

            </VStack>
          </Flex>
        </Flex>
        <Flex width="100%" justifyContent="center">
          <Flex
            backgroundColor="#F0F1F3"
            py={"2rem"}
            borderRadius="30px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            boxShadow="dark-lg"
            px="3rem"
            width="100%"
          >
            <Text
              fontSize="xl"
              color="secondary.400"
              fontWeight="semibold"
              mb="2rem"
            >
              A doença
            </Text>
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              width="100%"
            >
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Informações:
                </Text>
                <Text
                  fontSize="md"
                  flex="1"
                  maxH="150px"
                  overflowY="auto"
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
                  {currentDisease?.disease_info}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Sintomas:
                </Text>
                <Box flex="1">
                  <UnorderedList>
                    {currentDisease?.symptoms.map((symptom, index) => (
                      <ListItem
                        key={index}
                      >
                        <Text
                          fontSize="md"
                          flex="1"
                          overflowY="auto"
                          // maxH="150px"
                          key={index}
                          sx={{
                            alignSelf: 'start', // Adicione esta linha para alinhar os textos ao início do contêiner
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
                          {symptom}
                        </Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize="md"
                  color="secondary.500"
                  fontWeight="semibold"
                  mr="1rem"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                  overflowY="auto"
                  maxH="150px"
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
                  Tratamento:
                </Text>
                <Text fontSize="md" flex="1">
                  {currentDisease?.treatment}
                </Text>
              </Flex>
            </VStack>
          </Flex>
        </Flex>

      </HStack>
      {(currentVaccination.length && currentVaccine.length) && (<>
        <CustomModal
          isOpen={isOpenAddModal}
          onClose={handleCloseAddModal}
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
                fontSize="2xl"
                fontWeight="black"
                pb=".5rem"
                pt="2rem"
                color="secondary.400"
              >
                Sua Situação:
              </Text>
              <VStack
                spacing={4}
                align='stretch'
                width="100%"
                paddingY="2rem"
                paddingX="2rem"
              >
                <Flex alignItems="flex-start">
                  <Formik
                    initialValues={initialValuesAdd}
                    validationSchema={validationSchema}
                    onSubmit={(values) => addVaccination(values)}
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
                          width="100%"
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
                            label="Data da Vacina"
                            icon={<CalendarIcon className='custom-icon' color='gray.500' />}
                            name="date"
                            type="date"
                            placeholder="Selecione a data da vacina"
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
                          w="100%"
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
                          fontSize="xl"
                        >
                          Adicionar vacina a {currentUser?.name}
                        </Button>
                      </Flex>
                    )
                    }
                  </Formik>
                </Flex>
              </VStack>
            </Flex>
          </ModalBody>
        </CustomModal>
        <CustomModal
          isOpen={isOpenHistoryModal}
          onClose={handleCloseHistoryModal}
          initialRef={initialRef}
          finalRef={finalRef}
        >
          <ModalBody>
            <Flex
              width="100%"
              flexDirection="column"
              alignItems="center"
              px="1rem"
            >
              <Text
                fontSize="2xl"
                fontWeight="black"
                pb=".5rem"
                pt="2rem"
                color="secondary.400"
              >
                Histórico de {currentVaccine[0]?.name} de {currentUser?.name}:
              </Text>
              <VStack
                spacing={4}
                align='stretch'
                width="100%"
                paddingY="2rem"
                paddingX="2rem"
              >
                {currentVaccination?.map((vaccination, index) => (
                  <Flex key={index} alignItems="center" justifyContent="flex-start">
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="secondary.500"
                    >
                      - {new Date(vaccination.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </Flex>

                ))}

              </VStack>
            </Flex>
          </ModalBody>
        </CustomModal>
      </>
      )}
    </Flex>
  );
}

export default Disease;