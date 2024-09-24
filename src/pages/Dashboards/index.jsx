import { Flex, Text, Select, Spinner, SimpleGrid, Grid, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import VaccinationAPI from '../../services/VaccinationAPI';
import DiseaseAPI from '../../services/DiseaseAPI';

// Registro das escalas e elementos que o gráfico vai usar
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboards = () => {
    const [vaccinationAgeDistributionData, setVaccinationAgeDistributionData] = useState(null);
    const [vaccinationData, setVaccinationData] = useState(null);
    const [monthlyVaccinationData, setMonthlyVaccinationData] = useState(null);
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [years, setYears] = useState([]);  // Lista de anos com vacinação
    const [selectedYear, setSelectedYear] = useState('');

    const user = JSON.parse(localStorage.getItem("@sipavUser"));

    const { getVaccinationDistribution, getMonthlyVaccinationDistribution } = VaccinationAPI();
    const { getAllDiseases, getDiseaseVaccinationPercentage } = DiseaseAPI();

    const sortedDiseases = diseases?.sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const diseasesData = await getAllDiseases();
                setDiseases(diseasesData.data);
            } catch (error) {
                console.error("Erro ao buscar doenças:", error);
            }
        };

        fetchDiseases();
    }, []);

    useEffect(() => {
        const fetchMonthlyVaccinationData = async () => {
            try {
                const data = await getMonthlyVaccinationDistribution();
                setMonthlyVaccinationData(data);
            } catch (error) {
                console.error("Erro ao buscar dados de vacinação mensal:", error);
            }
        };

        fetchMonthlyVaccinationData();
    }, []);

    useEffect(() => {
        const fetchVaccinationData = async () => {
            try {
                const diseaseId = selectedDisease || null;
                const data = await getVaccinationDistribution(diseaseId);
                if (selectedDisease != "") {
                    const response = await getDiseaseVaccinationPercentage(diseaseId, user.type);
                    setVaccinationData({ ...response.data, diseaseName: sortedDiseases.find(disease => disease.id == diseaseId).name });
                }
                const responseMonths = await getMonthlyVaccinationDistribution();
                console.log(responseMonths)
                // setMonthlyVaccinationData(responseMonths)
                setVaccinationAgeDistributionData(data);
            } catch (error) {
                console.error("Erro ao buscar dados de vacinação:", error);
            }
        };

        fetchVaccinationData();
    }, [selectedDisease]);

    const renderAgeChart = () => {
        if (!vaccinationAgeDistributionData) return null;

        const data = {
            labels: Object.keys(vaccinationAgeDistributionData),
            datasets: [
                {
                    label: 'Número de Usuários Vacinados',
                    data: Object.values(vaccinationAgeDistributionData),
                    backgroundColor: '#135D66',
                    borderColor: 'secondary.400',
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
            },
        };

        return <Bar data={data} options={options} />;
    };

    const renderPercentChart = () => {
        if (!vaccinationData || !vaccinationData.percentage) return "Carregando";

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
            },
        };

        return <Pie data={data} options={options} />;
    };

    const renderMonthlyVaccinationChart = () => {
        if (!monthlyVaccinationData) return null;

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const data = {
            labels: monthlyVaccinationData.map(item => item.month), // Meses
            datasets: [
                {
                    label: 'Número de Vacinações por Mês',
                    data: monthlyVaccinationData.map(item => item.count), // Contagem de vacinas
                    backgroundColor: '#135D66',
                    borderColor: 'secondary.400',
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
            },
        };

        return <Bar data={data} options={options} />;
    };

    const handleDiseaseChange = (event) => {
        setSelectedDisease(event.target.value);
    };

    return (
        <Flex flexDirection="column" alignItems="center" width="100%" px="1rem" pb="2rem">
            <Select
                value={selectedDisease}
                onChange={handleDiseaseChange}
                fontSize="md"
                color="secondary.00"
                fontWeight="semibold"
                mb="1rem"
                maxWidth="400px"
                borderColor="primary.600"
                bg="white"
                mt="1rem"
                px="2rem"
            >
                <option value="">
                    Todas as doenças
                </option>
                {sortedDiseases?.map((disease) => (
                    <option key={disease?.id} value={disease?.id}>
                        {disease?.name}
                    </option>
                ))}
            </Select>
            <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap="3rem"
                width="100%"
                px="2rem"
            >
                <Box>
                    <Text
                        fontSize={["md", "xl", "xl", "2xl"]}
                        fontWeight="black"
                        pb=".5rem"
                        pt="2rem"
                        color="secondary.400"
                    >
                        Distribuição de vacinação por faixa etária
                    </Text>
                    <Flex
                        backgroundColor="white"
                        borderRadius="lg"
                        boxShadow="lg"
                        p="1rem"
                    >
                        {vaccinationAgeDistributionData ? renderAgeChart() : (
                            <Flex justifyContent="center" alignItems="center" width="50%">
                                <Spinner size="xl" />
                            </Flex>
                        )}
                    </Flex>

                </Box>
                <Box>

                    <Text
                        fontSize={["md", "xl", "xl", "2xl"]}
                        fontWeight="black"
                        pb=".5rem"
                        pt="2rem"
                        color="secondary.400"
                    >
                        Porcentagem de usuários vacinados por doença
                    </Text>
                    <Flex
                        backgroundColor="white"
                        borderRadius="lg"
                        boxShadow="lg"
                        p="1rem"
                    >
                        {selectedDisease !== "" ? vaccinationData ? renderPercentChart() : (
                            <Flex justifyContent="center" alignItems="center" width="50%">
                                <Spinner size="xl" />
                            </Flex>
                        ) : ("Seleciona uma doença")}
                    </Flex>
                </Box>
                <Box>
                    <Text
                        fontSize={["md", "xl", "xl", "2xl"]}
                        fontWeight="black"
                        pb=".5rem"
                        pt="2rem"
                        color="secondary.400"
                    >
                        Vacinações Mensais
                    </Text>
                    <Flex
                        backgroundColor="white"
                        borderRadius="lg"
                        boxShadow="lg"
                        p="1rem"
                    >
                        {monthlyVaccinationData ? renderMonthlyVaccinationChart() : (
                            <Flex justifyContent="center" alignItems="center" width="100%" height="300px">
                                <Spinner size="xl" />
                            </Flex>
                        )}
                    </Flex>
                </Box>
            </Grid>
        </Flex>
    );
};

export default Dashboards;
