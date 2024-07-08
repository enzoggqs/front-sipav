import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text, Spinner, ModalBody, Button, VStack, Tooltip as Tooltip2, HStack, Input, FormLabel, Tag, TagLabel, TagCloseButton, InputGroup, InputLeftElement, Select, Box, UnorderedList, ListItem } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { GoArrowRight } from 'react-icons/go'
import DiseaseAPI from '../../services/DiseaseApi.jsx';
import CustomBox from '../../components/CustomBox/index.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomModal from '../../components/CustomModal/index.jsx';
import * as Yup from "yup";
import CustomInput from '../../components/CustomInput/index.jsx';
import { BiNews } from 'react-icons/bi';
import VaccinationAPI from '../../services/VaccinationAPI.jsx';

const Vaccines = () => {
    const initialRef = useRef();
    const finalRef = useRef();
    const [vaccines, setVaccines] = useState([])
    const [diseases, setDiseases] = useState([])
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    const [vaccineData, setVaccineData] = useState(null);
    const [isOpenAddVaccineModal, setIsOpenAddVaccineModal] = useState(false);
    const [contraindicationInput, setContraindicationInput] = useState("");
    const [contraindications, setContraindications] = useState([]);
    const [disabledMonthsBetweenDoses, setDisabledMonthsBetweenDoses] = useState(false);
    const [selectedDiseases, setSelectedDiseases] = useState([]);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem("@sipavUser"));

    const { getAllDiseases } = DiseaseAPI();
    const { getAllVaccines, createVaccine } = VaccinationAPI();

    const initialValuesVaccine = {
        name: '',
        doses_required: '',
        months_between_doses: '',
        contraindications: [],
        diseases: []
    };

    const vaccineValidationSchema = Yup.object({
        name: Yup.string().required("O campo nome é obrigatório."),
        doses_required: Yup.number().required("O campo número de doses é obrigatório."),
        months_between_doses: Yup.number().optional(),
        diseases: Yup.array().required("O campo doenças é obrigatório."),
    });

    const handleAddContraindication = () => {
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

    async function addVaccine(values) {
        const createdVaccine = {
            name: values.name,
            months_between_doses: String(values.months_between_doses),
            doses_required: String(values.doses_required),
            diseases: selectedDiseases.map(disease => disease.id),
            contraindications: contraindications
        }
        try {
            await createVaccine(createdVaccine);
            navigate(0);
        } catch (error) {
            console.error('Failed to create disease:', error.message);
        }
    };

    useEffect(() => {
        if (!userData) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vaccinesData = await getAllVaccines();
                setVaccines(vaccinesData.data);
                const diseasesData = await getAllDiseases();
                setDiseases(diseasesData.data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchData();
    }, []);

    const sortedVaccines = vaccines?.sort((a, b) => a.name.localeCompare(b.name));

    const sortedDiseases = diseases?.sort((a, b) => a.name.localeCompare(b.name));

    const handleOpenModal = async (vaccineId) => {
        const currentVaccineData = vaccines.find(vaccine => vaccine.id === vaccineId)
        setVaccineData(currentVaccineData)
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setVaccineData(null);
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
                    Lista de vacinas
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
                {sortedVaccines?.map((vaccine) => (
                    <CustomBox
                        key={vaccine?.id}
                        text={vaccine?.name}
                        firstImage={
                            <GoArrowRight
                                size={30}
                                color='#088395'
                                cursor={"pointer"}
                                onClick={() => handleOpenModal(vaccine?.id)}
                            />
                        }
                    >
                    </CustomBox>
                ))}
            </Flex>
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
                            Dados da vacina {vaccineData?.name}
                        </Text>
                        {vaccineData && (
                            <Box width="100%">
                                <Text><strong>Número de doses:</strong> {vaccineData.doses_required}</Text>
                                <Text><strong>Meses entre as doses:</strong> {vaccineData.months_between_doses || '-'}</Text>
                                <Text><strong>Contraindicações:</strong></Text>
                                <UnorderedList>
                                    {vaccineData.contraindications.map((contraindication, index) => (
                                        <ListItem key={index}>{contraindication}</ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        )}
                    </Flex>
                </ModalBody>
            </CustomModal>
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
        </Flex>
    )
}

export default Vaccines