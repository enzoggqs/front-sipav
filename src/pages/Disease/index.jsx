import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik'
import { CalendarIcon } from '@chakra-ui/icons'
import { Box, Spinner, Button, Divider, Flex, Stack, ListItem, ModalBody, Select, StackDivider, Text, Tooltip, UnorderedList, VStack } from '@chakra-ui/react';
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
  const [currentDisease, setCurrentDisease] = useState();
  const [currentVaccine, setCurrentVaccine] = useState([]);
  const [user, setUser] = useState([])
  const [currentUser, setCurrentUser] = useState();
  const [currentVaccination, setCurrentVaccination] = useState();
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [loading, setLoading] = useState(true);
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);
  const [isOpenHistoryModal, setIsOpenHistoryModal] = React.useState(false);

  const initialValuesAdd = {
    date: ''
  };
  const validationSchema = Yup.object({
    date: Yup.string()
      .required("O campo data é obrigatório."),
  });

  const { getDiseaseAndVaccine } = DiseaseAPI();

    useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 1000);

    if (!userData) {
      navigate('/login');
      return;
    }

    fetchInitialData();

    return () => clearTimeout(timeoutId);
  }, [selectedUserId]);

  const fetchInitialData = async () => {
    await Promise.all([fetchDisease(), fetchResponsibleData(), fetchCurrentUserData()]);
  };

  const fetchDisease = async () => {
    try {
      const response = await getDiseaseAndVaccine(diseaseId, userId);
      setCurrentDisease(response?.data?.disease);
      setCurrentVaccine(response?.data?.vaccine);
      setCurrentVaccination(response?.data?.vaccination);
    } catch (error) {
      console.error('Error fetching disease:', error);
    }
  };

  const fetchResponsibleData = async () => {
    try {
      const response = await api.get(`/user/${userData.id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const fetchCurrentUserData = async () => {
    try {
      const response = await api.get(`/user/${userId}`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const addVaccination = async (data) => {
    const vaccination = {
      ...data,
      vaccineId: Number(currentVaccine[0].id),
      userId: Number(selectedUserId),
    };

    try {
      await createVaccination(vaccination);
      navigate(0);
    } catch (error) {
      console.error('Failed to create vaccination:', error.message);
    }
  };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setLoading(true);
    setSelectedUserId(selectedUserId);

    if (user?.id === Number(selectedUserId)) {
      setCurrentUser(user);
      navigate(`/disease/${diseaseId}/user/${user.id}`);
      return;
    }

    const selectedDependent = user?.dependents?.find((dependent) => dependent.id === Number(selectedUserId));
    if (selectedDependent) {
      setCurrentUser(selectedDependent);
      navigate(`/disease/${diseaseId}/user/${selectedDependent.id}`);
    } else {
      console.log('Usuário não encontrado');
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
    if (currentVaccination?.length, currentVaccine[0]?.doses_required) {
      // Se a vacina tem apenas uma dose, marcar como "Vacina em dia"
      if (Number(currentVaccine[0]?.doses_required) === currentVaccination?.length) {
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
    if (currentVaccination?.length > 0) {
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

  const renderIntervalBetweenDoses = () => {
    if (currentVaccine?.length > 0) {
      const monthsBetweenDoses = currentVaccine[0]?.months_between_doses.trim();
  
      if (monthsBetweenDoses !== "") {
        if (monthsBetweenDoses >= 12) {
          const years = monthsBetweenDoses / 12;
          return `${years} ${years > 1 ? "anos" : "ano"}`;
        } else {
          return `${monthsBetweenDoses} ${monthsBetweenDoses > 1 ? "meses" : "mês"}`;
        }
      } else {
        return "-";
      }
    } else {
      return "Indefinido";
    }
  };

  const renderLoading = () => (
    <Flex width="100%" h="full" flexDir="column" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="white" />
    </Flex>
  );

  return loading ? renderLoading() : (
    <Flex
      width="100%"
      h="full"
      flexDir="column"
      alignItems="center"
    >
      <Text
        fontSize={["2xl", "2xl", "3xl", "3xl"]}
        color="secondary.400"
        fontWeight="semibold"
        mb="2rem"
      >
        {currentDisease?.name}
      </Text>
      {userData.type === "REGULAR" && (
        <Flex mb="2rem" alignItems={"center"} justifyContent={"center"} width={"100%"}>
          <Text
            fontSize={["md", "md", "xl", "xl"]}
            color="secondary.400"
            fontWeight="semibold"
          >
            Dados de: &nbsp;
          </Text>
          <Select
            fontSize={["xs", "sm", "md", "md"]}
            color="primary.600"
            fontWeight="semibold"
            width={["50%", "20%", "20%", "20%"]}
            borderColor="primary.600"
            onChange={handleUserChange}
            value={selectedUserId || ''}
            bg="#F0F1F3"
          >
            <option fontSize={["xs", "sm", "md", "md"]} value={user?.id}>{user.name}</option>
            {user?.dependents?.map((dependent, index) => (
              <option key={index} value={dependent?.id}>{dependent?.name}</option>
            ))}
          </Select>

        </Flex>

      )}
      <Stack
        justifyContent="center"
        width="100%"
        px="10%"
        gap="6rem"
        alignItems="flex-start"
        direction={['column', 'column', 'column', 'row']}
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
              fontSize={["md", "md", "xl", "xl"]}
              color="secondary.400"
              fontWeight="semibold"
              mb="2rem"
            >
              {currentVaccine.length ? currentVaccine[0]?.name : "Doença sem vacina"}
            </Text>
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              width="100%"
            >
              <Flex alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={[".5rem", ".5rem", "1rem", "1rem"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Número de doses:
                </Text>
                <Text fontSize={["xs", "sm", "md", "md"]} flex="1">
                  {currentVaccine?.length ? currentVaccine[0]?.doses_required : "indefinido"}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={[".5rem", ".5rem", "1rem", "1rem"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  textAlign="left" // Alinhe o rótulo fixo à direita
                  width="150px"
                >
                  Intervalo entre doses:
                </Text>
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  flex="1"
                  overflowX="auto"
                  maxH={"100px"}
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
                  {renderIntervalBetweenDoses()}
                </Text>
              </Flex>
              <Flex alignItems="flex-start" flexDir={["column", "column", "row", "row"]}>
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  mr={["0", "0", "1rem", "1rem"]}
                  pb={[".5rem", ".5rem", "0", "0"]}
                  textAlign="left"
                  width="150px"
                >
                  Contra indicações:
                </Text>
                {currentVaccine?.length ? (
                  <Box flex="1" >
                    <UnorderedList>
                      {currentVaccine[0]?.contraindications.map((contraindication, index) => (
                        <ListItem
                          key={index}
                        >
                          <Text
                            fontSize={["xs", "sm", "md", "md"]}
                            flex="1"
                            overflowY="auto"
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
                    fontSize={["xs", "sm", "md", "md"]}
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
            {userData.type === "REGULAR" &&
              (
                <Text
                  fontSize={["md", "md", "xl", "xl"]}
                  color="secondary.400"
                  fontWeight="semibold"
                  mb="2rem"
                >
                  Sua situação
                </Text>
              )
            }
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
              width="100%"
            >
              <Flex alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={[".5rem", ".5rem", "1rem", "1rem"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  textAlign="left"
                  width="150px"
                >
                  Vacina em dia:
                </Text>
                <Text fontSize={["xs", "sm", "md", "md"]} flex="1" >
                  {isVaccineUpToDate() ? 'Sim' : 'Não'}
                </Text>
              </Flex>
              <Flex alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  mr={[".5rem", ".5rem", "1rem", "1rem"]}
                  textAlign="left"
                  width="150px"
                >
                  Última dose tomada:
                </Text>
                <Text fontSize={["xs", "sm", "md", "md"]} flex="1">
                  {getLastVaccinationDate()}
                </Text>
              </Flex>
              <Flex flexDir={["column", "column", "row", "row"]} alignItems="center" width="100%" justifyContent="space-around" gap="1rem">
                <Button
                  type="submit"
                  p="1rem"
                  mb={["0", "0", "2rem", "2rem"]}
                  fontSize={["md", "xl", "xl", "xl"]}
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
                  mb={["0", "0", "2rem", "2rem"]}
                  fontSize={["md", "xl", "xl", "xl"]}
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
                    isOpen={currentVaccine?.length > 0 ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
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
            mb="3rem"
            width="100%"
          >
            <Text
              fontSize={["md", "md", "xl", "xl"]}
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
              <Flex flexDir={["column", "column", "row", "row"]} alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={["0", "0", "1rem", "1rem"]}
                  pb={[".5rem", ".5rem", "0", "0"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  textAlign="left"
                  width="150px"
                >
                  Informações:
                </Text>
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
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
              <Flex flexDir={["column", "column", "row", "row"]} alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={["0", "0", "1rem", "1rem"]}
                  pb={[".5rem", ".5rem", "0", "0"]}
                  color="secondary.500"
                  fontWeight="semibold"
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
                          fontSize={["xs", "sm", "md", "md"]}
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
              <Flex flexDir={["column", "column", "row", "row"]} alignItems="flex-start">
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
                  mr={["0", "0", "1rem", "1rem"]}
                  pb={[".5rem", ".5rem", "0", "0"]}
                  color="secondary.500"
                  fontWeight="semibold"
                  textAlign="left"
                  width="150px"
                >
                  Tratamento:
                </Text>
                <Text
                  fontSize={["xs", "sm", "md", "md"]}
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
                  {currentDisease?.treatment}
                </Text>
              </Flex>
            </VStack>
          </Flex>
        </Flex>

      </Stack>
      {currentVaccine?.length && (<>
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
                fontSize={["xl", "md", "xl", "2xl"]}
                fontWeight="black"
                pb=".5rem"
                pt="2rem"
                color="secondary.400"
              >
                Adicionar Vacina
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
                          w={["80%", "100%", "100%", "100%"]}
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
                          mb={["0", "0", "2rem", "2rem"]}
                          fontSize={["md", "xl", "xl", "xl"]}
                        >
                          Adicionar vacina a {currentUser && currentUser.name ? currentUser.name.split(" ")[0] : ""}
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
              width="90%"
              flexDirection="column"
              alignItems="center"
              px="1rem"
            >
              <Text
                fontSize={["md", "xl", "xl", "2xl"]}
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
                      fontSize={["sm", "md", "xl", "xl"]}
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