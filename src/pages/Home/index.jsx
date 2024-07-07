import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text, Spinner, ModalBody, Button, VStack, Tooltip as Tooltip2, HStack, Input, FormLabel, Tag, TagLabel, TagCloseButton, InputGroup, InputLeftElement, Select } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GoArrowRight } from 'react-icons/go'
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DiseaseAPI from '../../services/DiseaseApi.jsx';
import CustomBox from '../../components/CustomBox/index.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomModal from '../../components/CustomModal/index.jsx';
import * as Yup from "yup";
import CustomInput from '../../components/CustomInput/index.jsx';
import { BiNews } from 'react-icons/bi';
import VaccinationAPI from '../../services/VaccinationAPI.jsx';

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Home = () => {
  const initialRef = useRef();
  const finalRef = useRef();
  const [diseases, setDiseases] = useState([])
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [vaccinationData, setVaccinationData] = useState(null);
  const [isOpenAddDiseaseModal, setIsOpenAddDiseaseModal] = useState(false);
  const [isOpenAddVaccineModal, setIsOpenAddVaccineModal] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [contraindicationInput, setContraindicationInput] = useState("");
  const [contraindications, setContraindications] = useState([]);
  const [disabledMonthsBetweenDoses, setDisabledMonthsBetweenDoses] = useState(false);
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const { isAuthenticated } = useAuth();
  const { getAllDiseases, getDiseaseVaccinationPercentage, createDisease } = DiseaseAPI();
  const { getAllVaccines, createVaccine } = VaccinationAPI();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("@sipavUser"));

  const initialValuesDisease = {
    name: '',
    disease_info: '',
    symptoms: [],
    treatment: ''
  };

  const initialValuesVaccine = {
    name: '',
    doses_required: '',
    months_between_doses: '',
    contraindications: [],
    diseases: []
  };

  const diseaseValidationSchema = Yup.object({
    name: Yup.string().required("O campo nome é obrigatório."),
    disease_info: Yup.string().required("O campo informações é obrigatório."),
    symptoms: Yup.array().required("O campo sintomas é obrigatório."),
    treatment: Yup.string().required("O campo tratamento é obrigatório."),
  });

  const vaccineValidationSchema = Yup.object({
    name: Yup.string().required("O campo nome é obrigatório."),
    doses_required: Yup.number().required("O campo número de doses é obrigatório."),
    months_between_doses: Yup.number().optional(),
    diseases: Yup.array().required("O campo doenças é obrigatório."),
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

  const handleAddContraindication = () => {
    console.log([...contraindications, contraindicationInput])
    if (contraindicationInput.trim() !== "") {
      setContraindications([...contraindications, contraindicationInput]);
      setContraindicationInput("");
    }
  };

  const handleRemoveContraindication = (index) => {
    setContraindications(contraindications.filter((_, i) => i !== index));
  };

  const handleDiseaseSelect = (disease) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
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

  async function addVaccine(values) {
    const createdVaccine = {
      name: values.name,
      months_between_doses: String(values.months_between_doses),
      doses_required: String(values.doses_required),
      diseases: selectedDiseases.map(disease => disease.id),
      contraindications: contraindications
    }
    try {
      console.log(createdVaccine)
      await createVaccine(createdVaccine);
      navigate(0);
    } catch (error) {
      console.error('Failed to create disease:', error.message);
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

  const sortedDiseases = diseases?.sort((a, b) => a.name.localeCompare(b.name));

  const handleOpenAddDiseaseModal = () => {
    setIsOpenAddDiseaseModal(true);
  };

  const handleCloseAddDiseaseModal = () => {
    setIsOpenAddDiseaseModal(false);
    setSymptomInput("");
    setSymptoms([]);
  };

  const handleOpenAddVaccineModal = () => {
    setIsOpenAddVaccineModal(true);
  };

  const handleCloseAddVaccineModal = () => {
    setIsOpenAddVaccineModal(false);
    setContraindicationInput("");
    setContraindications([]);
    setSelectedDiseases([]);
  };

  const handleOpenModal = async (diseaseId) => {
    try {
      const response = await getDiseaseVaccinationPercentage(diseaseId, user.type);
      setVaccinationData(response.data);
      setIsOpenModal(true);
    } catch (error) {
      console.error('Erro ao buscar dados de vacinação:', error);
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setVaccinationData(null);
  };

  const handleDiseaseInfo = (diseaseId) => {
    if (user?.type === "REGULAR") {
      navigate(`/disease/${diseaseId}/user/${user?.id}`)
    } else {
      handleOpenModal(diseaseId);
    }
  }

  const renderChart = () => {
    if (!vaccinationData) return null;

    const data = {
      labels: ['Vacinados', 'Não Vacinados'],
      datasets: [
        {
          data: [vaccinationData.percentage, 100 - vaccinationData.percentage],
          backgroundColor: ['#135D66', '#CA3433'],
          hoverBackgroundColor: ['#135D66', '#CA3433'],
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          formatter: (value, context) => {
            return `${value.toFixed(2)}%`;
          },
          color: '#fff',
          font: {
            weight: 'bold',
          },
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

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
          {user?.type === "REGULAR" ? 'Minhas Vacinas' : 'Situação de Vacinação dos Usuários'}
        </Text>
        {/* <Select
          fontSize="md"
          color="primary.600"
          fontWeight="semibold"
          width="50%"
          borderColor="primary.600"
          mt="1rem"
          onChange={handleUserChange}
          value={currentUser?.id}
        >
          <option value={user?.id}>{user?.name}</option>
          {user?.dependents?.map((dependent, index) => (
            <option key={index} value={dependent?.id}>{dependent?.name}</option>
          ))}
        </Select> */}
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
        <Flex gap={[0, 2, 2, 2]} flexDir={["column", "row", "row", "row"]}>
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
            onClick={handleOpenAddVaccineModal}
          >
            Adicionar Vacina
          </Button>
        </Flex>
      )}
      <CustomModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        initialRef={initialRef}
        finalRef={finalRef}
      >
        <ModalBody>
          <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            px="1rem"
            pb="2rem"
          >
            <Text
              fontSize={["md", "xl", "xl", "2xl"]}
              fontWeight="black"
              pb=".5rem"
              pt="2rem"
              color="secondary.400"
            >
              Porcentagem de usuários vacinados contra
            </Text>
            {renderChart()}
          </Flex>
        </ModalBody>
      </CustomModal>
      <CustomModal
        isOpen={isOpenAddDiseaseModal}
        onClose={() => handleCloseAddDiseaseModal()}
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
              Adicionar Doença
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
                  onSubmit={(values) => addDisease(values)}
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
                        mb="1rem"
                        fontSize={["md", "xl", "xl", "xl"]}
                      >
                        <Tooltip2
                          label="Você precisa alterar alguma informação"
                          placement="top"
                          hasArrow
                          isOpen={dirty ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
                        >
                          Adicionar
                        </Tooltip2>
                      </Button>
                    </Flex>
                  )}
                </Formik>
              </Flex>
            </VStack>
          </Flex>
        </ModalBody >
      </CustomModal >
      <CustomModal
        isOpen={isOpenAddVaccineModal}
        onClose={() => handleCloseAddVaccineModal()}
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
                  initialValues={initialValuesVaccine}
                  validationSchema={vaccineValidationSchema}
                  onSubmit={(values) => addVaccine(values)}
                >
                  {({ handleSubmit, errors, touched, isValid, dirty, values, handleChange, setFieldValue }) => (
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
                          placeholder="Digite o nome da vacina"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="name-input"
                        />

                        <CustomInput
                          label="Número de doses"
                          icon={<BiNews color='gray.500' className='custom-icon' />}
                          name="doses_required"
                          type="number"
                          placeholder="Digite o número de doses da vacina"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="disease-input"
                          onChange={(e) => {
                            handleChange(e);
                            if (e.target.value === "1") {
                              setFieldValue('months_between_doses', "");
                              setDisabledMonthsBetweenDoses(true);
                            } else {
                              setDisabledMonthsBetweenDoses(false);
                            }
                          }}
                        />

                        <CustomInput
                          label="Meses entre as doses"
                          icon={<BiNews color='gray.500' className='custom-icon' />}
                          name="months_between_doses"
                          type="number"
                          placeholder="Digite o número de meses entre as doses"
                          height={'54px'}
                          borderWidth=".2rem"
                          borderRadius="30px"
                          touched={touched}
                          errors={errors}
                          data-testid="disease-input"
                          disabled={disabledMonthsBetweenDoses}
                        />

                        <FormLabel
                          fontSize={["sm", "md", "md", "md"]}
                          color="primary.600"
                          mt={[".1rem", ".4rem", ".5rem", ".5rem"]}
                          fontWeight="medium"
                        >
                          Contraindicações
                        </FormLabel>
                        <HStack spacing={2} width="100%">
                          <InputGroup>
                            <InputLeftElement ml=".5rem" h="full" pointerEvents="none">
                              <BiNews color='gray.500' className='custom-icon' />
                            </InputLeftElement>
                            <Input
                              placeholder="Digite a contraindicação"
                              value={contraindicationInput}
                              onChange={(e) => setContraindicationInput(e.target.value)}
                              borderWidth=".2rem"
                              borderRadius="30px"
                            />
                          </InputGroup>
                          <Button
                            onClick={handleAddContraindication}
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
                          {contraindications.map((contraindication, index) => (
                            <Tag
                              size="md"
                              key={contraindication}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="teal"
                              m={1}
                            >
                              <TagLabel>{contraindication}</TagLabel>
                              <TagCloseButton onClick={() => handleRemoveContraindication(index)} />
                            </Tag>
                          ))}
                        </Flex>

                        <FormLabel
                          fontSize={["sm", "md", "md", "md"]}
                          color="primary.600"
                          mt={[".1rem", ".4rem", ".5rem", ".5rem"]}
                          fontWeight="medium"
                        >
                          Doenças associadas
                        </FormLabel>
                        <Flex wrap="wrap">
                          {sortedDiseases.map((disease) => (
                            <Tag
                              key={disease.id}
                              size="md"
                              borderRadius="full"
                              variant={selectedDiseases.includes(disease) ? "solid" : "outline"}
                              colorScheme={selectedDiseases.includes(disease) ? "teal" : "gray"}
                              m={1}
                              onClick={() => handleDiseaseSelect(disease)}
                              cursor="pointer"
                            >
                              <TagLabel>{disease.name}</TagLabel>
                            </Tag>
                          ))}
                        </Flex>

                      </Flex>
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
                        isDisabled={!isValid || !dirty || !(selectedDiseases.length > 0)}
                        mb="1rem"
                        fontSize={["md", "xl", "xl", "xl"]}
                      >
                        <Tooltip2
                          label="Você precisa alterar alguma informação"
                          placement="top"
                          hasArrow
                          isOpen={dirty ? false : undefined} // Oculta o tooltip se o botão estiver "dirty"
                        >
                          Adicionar
                        </Tooltip2>
                      </Button>
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