import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text, Spinner, ModalBody, Button, VStack, Tooltip as Tooltip2, HStack, Input, FormLabel, Tag, TagLabel, TagCloseButton, InputGroup, InputLeftElement, Select } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GoArrowRight } from 'react-icons/go'
import DiseaseAPI from '../../services/DiseaseAPI.jsx';
import CustomBox from '../../components/CustomBox/index.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomModal from '../../components/CustomModal/index.jsx';
import * as Yup from "yup";
import CustomInput from '../../components/CustomInput/index.jsx';
import { BiNews } from 'react-icons/bi';
import VaccinationAPI from '../../services/VaccinationAPI.jsx';

const Home = () => {
  const initialRef = useRef();
  const finalRef = useRef();
  const [diseases, setDiseases] = useState([])
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [diseaseAction, setDiseaseAction] = React.useState('Adicionar');
  const [vaccinationData, setVaccinationData] = useState(null);
  const [isOpenAddDiseaseModal, setIsOpenAddDiseaseModal] = useState(false);
  const [isOpenAddVaccineModal, setIsOpenAddVaccineModal] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [contraindicationInput, setContraindicationInput] = useState("");
  const [contraindications, setContraindications] = useState([]);
  const [disabledMonthsBetweenDoses, setDisabledMonthsBetweenDoses] = useState(false);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);

  const { isAuthenticated } = useAuth();
  const { getAllDiseases, getDiseaseVaccinationPercentage, createDisease, getDiseaseById, editDisease, deleteDisease } = DiseaseAPI();
  const { getAllVaccines, createVaccine } = VaccinationAPI();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("@sipavUser"));

  const [initialValuesDisease, setInitialValuesDisease] = useState({
    name: '',
    disease_info: '',
    symptoms: [],
    treatment: ''
  })

  const diseaseValidationSchema = Yup.object({
    name: Yup.string().required("O campo nome é obrigatório."),
    disease_info: Yup.string().required("O campo informações é obrigatório."),
    symptoms: Yup.array().required("O campo sintomas é obrigatório."),
    treatment: Yup.string().required("O campo tratamento é obrigatório."),
  });

  const handleAddSymptom = () => {
    if (symptomInput.trim() !== "") {
      setSymptoms([...symptoms, symptomInput]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  async function addDisease(values) {
    const createdDisease = { ...values, symptoms };
    try {
      await createDisease(createdDisease);
      navigate(0);
    } catch (error) {
      console.error('Failed to create disease:', error.message);
    }
  };

  async function updateDisease(id, values) {
    const editedDisease = { ...values, symptoms };
    try {
      await editDisease(id, editedDisease);
      navigate(0);
    } catch (error) {
      console.error('Failed to edit disease:', error.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diseasesData = await getAllDiseases();
        setDiseases(diseasesData.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, []);

  if (!diseases || !user) {
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

  const submitDisease = async (data) => {
    if (diseaseAction === "Adicionar") {
      await addDisease(data);
    } else if (diseaseAction === "Editar") {
      await updateDisease(selectedDiseaseId, data); // Use o selectedDiseaseId aqui
    }
  };

  const sortedDiseases = diseases?.sort((a, b) => a.name.localeCompare(b.name));

  const handleOpenAddDiseaseModal = () => {
    setDiseaseAction("Adicionar")
    setInitialValuesDisease({
      name: '',
      disease_info: '',
      symptoms: [],
      treatment: ''
    })
    setIsOpenAddDiseaseModal(true);
  };

  const handleCloseAddDiseaseModal = () => {
    setIsOpenAddDiseaseModal(false);
    setSymptomInput("");
    setSymptoms([]);
  };

  const handleDiseaseInfo = (diseaseId) => {
    if (user?.type === "REGULAR") {
      navigate(`/disease/${diseaseId}/user/${user?.id}`)
    } else {
      handleEditDisease(diseaseId);
    }
  }

  const handleEditDisease = async (disease) => {
    const diseaseData = await getDiseaseById(disease);

    setSymptomInput("");
    const diseaseSymptoms = diseaseData?.data?.symptoms || [];

    setInitialValuesDisease({
      name: diseaseData?.data?.name,
      disease_info: diseaseData?.data?.disease_info,
      symptoms: diseaseSymptoms,
      treatment: diseaseData?.data?.treatment,
    });

    setSymptoms(diseaseSymptoms);

    setSelectedDiseaseId(diseaseData?.data?.id);

    setDiseaseAction("Editar");
    setIsOpenAddDiseaseModal(true);
  };

  const handleDeleteDisease = async () => {
    await deleteDisease(selectedDiseaseId);
    navigate(0);
  }

  return (
    <Flex
      backgroundColor="#F0F1F3"
      width={["90%", "80%", "70%", "40%"]}
      pt={"2rem"}
      mt={"2rem"}
      borderRadius="30px"
      flexDirection="column"
      alignItems="center"
      boxShadow="dark-lg"
      height={["100%", "100%", "100%", "100%"]}
      maxHeight={["70vh", "70vh", "70vh", "70vh"]}
      pb="2rem"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        w="80%"
        flexDir="column"
      >
        <Text
          fontSize="xl"
          color="primary.600"
          fontWeight="semibold"
        >
          {user?.type === "REGULAR" ? 'Minhas Vacinas' : 'Lista de Doenças'}
        </Text>
      </Flex>
      <Flex
        height="100%"
        width="80%"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        mt="1rem"
        overflowY="auto"
        maxH="60vh"
        minH="100px"
        marginBottom="2rem"
        borderRadius="1rem"
        px="1rem"
        py="1rem"
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
        {sortedDiseases?.map((disease) => (
          <CustomBox
            key={disease?.id}
            text={disease?.name}
            firstImage={
              <GoArrowRight
                size={30}
                color='#088395'
                cursor={"pointer"}
                onClick={() => handleDiseaseInfo(disease.id)}
              />
            }
          >
          </CustomBox>
        ))}
      </Flex>
      {(user?.type === "ADMIN") && (
        <Flex gap={[0, 2, 2, 2]}>
          <Button
            type="submit"
            p="1rem"
            mb={["0rem, 2rem, 2rem, 2rem"]}
            variant="solid"
            borderRadius="30px"
            borderColor="primary.600"
            borderWidth=".2rem"
            color="primary.600"
            backgroundColor="transparent" // Defina a cor de fundo desejada
            transition="background-color 0.3s, color 0.3s" // Adicione uma transição suave
            _hover={{
              backgroundColor: "primary.600",
              color: "#F0F1F3",
            }}
            fontSize="md"
            marginTop="1rem"
            onClick={handleOpenAddDiseaseModal}
          >
            Adicionar Doença
          </Button>
        </Flex>
      )}

      <CustomModal
        isOpen={isOpenAddDiseaseModal}
        onClose={handleCloseAddDiseaseModal}
        initialRef={initialRef}
        finalRef={finalRef}
      >
        <ModalBody>
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            pb="2rem"
          >
            <Text
              fontSize={["md", "xl", "xl", "2xl"]}
              fontWeight="black"
              pb=".5rem"
              pt="2rem"
              color="secondary.400"
            >
              {diseaseAction} Doença
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
                  initialValues={initialValuesDisease}
                  validationSchema={diseaseValidationSchema}
                  onSubmit={(values) => {
                    submitDisease({ ...values, symptoms })
                    handleCloseAddDiseaseModal(); // Fecha o modal após a ação
                  }}
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
                          label="Nome"
                          icon={<BiNews className='custom-icon' />}
                          name="name"
                          type="text"
                          placeholder="Digite o nome da doença"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="name-input"
                        />

                        <CustomInput
                          label="Informações"
                          icon={<BiNews color='gray.500' className='custom-icon' />}
                          name="disease_info"
                          type="text"
                          placeholder="Digite as informações da doença"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="disease-input"
                        />

                        <FormLabel
                          fontSize={["sm", "md", "md", "md"]}
                          color="primary.600"
                          mt={[".1rem", ".4rem", ".5rem", ".5rem"]}
                          fontWeight="medium"
                        >
                          Sintomas
                        </FormLabel>
                        <HStack spacing={2} width="100%">
                          <InputGroup>
                            <InputLeftElement ml=".5rem" h="full" pointerEvents="none">
                              <BiNews color='gray.500' className='custom-icon' />
                            </InputLeftElement>
                            <Input
                              placeholder="Digite o sintoma"
                              value={symptomInput}
                              onChange={(e) => setSymptomInput(e.target.value)}
                              borderWidth=".2rem"
                              borderRadius="30px"
                            />
                          </InputGroup>
                          <Button
                            onClick={handleAddSymptom}
                            borderRadius="30px"
                            borderColor="primary.600"
                            borderWidth=".2rem"
                            color="primary.600"
                            variant="solid"
                            backgroundColor="transparent"
                            transition="background-color 0.3s, color 0.3s"
                            _hover={{
                              backgroundColor: "primary.600",
                              color: "#F0F1F3",
                            }}
                          >Adicionar</Button>
                        </HStack>
                        <Flex mt={2} flexWrap="wrap">
                          {symptoms.map((symptom, index) => (
                            <Tag
                              size="md"
                              key={symptom}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="teal"
                              m={1}
                            >
                              <TagLabel>{symptom}</TagLabel>
                              <TagCloseButton onClick={() => handleRemoveSymptom(index)} />
                            </Tag>
                          ))}
                        </Flex>

                        <CustomInput
                          label="Tratamento"
                          icon={<BiNews color='gray.500' className='custom-icon' />}
                          name="treatment"
                          type="text"
                          placeholder="Digite o tratamento da doença"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="treatment-input"
                        />
                      </Flex>
                      <Flex gap={2}>
                        <Button
                          onClick={handleDeleteDisease}
                          h="3rem"
                          w="10rem"
                          borderRadius="30px"
                          borderColor="red"
                          borderWidth=".2rem"
                          color="red"
                          variant="solid"
                          marginTop="1rem"
                          backgroundColor="transparent"
                          transition="background-color 0.3s, color 0.3s"
                          _hover={(isValid && dirty) && {
                            backgroundColor: "red",
                            color: "white",
                          }}
                          fontSize={["md", "xl", "xl", "xl"]}
                        >
                            Remover
                        </Button>
                        <Button
                          type="submit"
                          h="3rem"
                          w="10rem"
                          borderRadius="30px"
                          borderColor="primary.600"
                          borderWidth=".2rem"
                          color="primary.600"
                          variant="solid"
                          marginTop="1rem"
                          backgroundColor="transparent"
                          transition="background-color 0.3s, color 0.3s"
                          _hover={(isValid && dirty) && {
                            backgroundColor: "primary.600",
                            color: "#F0F1F3",
                          }}
                          isDisabled={!isValid || !dirty}
                          fontSize={["md", "xl", "xl", "xl"]}
                        >
                          <Tooltip2
                            label="Você precisa alterar alguma informação"
                            placement="top"
                            hasArrow
                            isOpen={dirty ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
                          >
                            {diseaseAction}
                          </Tooltip2>
                        </Button>
                      </Flex>
                    </Flex>
                  )}
                </Formik>
              </Flex>
            </VStack>
          </Flex>
        </ModalBody >
      </CustomModal >
    </Flex >
  )
}

export default Home