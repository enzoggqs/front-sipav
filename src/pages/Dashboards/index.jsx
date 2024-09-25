import { Flex, Text, Select, Spinner, SimpleGrid, Grid, Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import VaccinationAPI from '../../services/VaccinationAPI';
import DiseaseAPI from '../../services/DiseaseAPI';

// Registro das escalas e elementos que o gráfico vai usar
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboards = () => {
    const [vaccinationAgeDistributionData, setVaccinationAgeDistributionData] = useState(null);
    const [vaccinationData, setVaccinationData] = useState(null);
    const [monthlyVaccinationData, setMonthlyVaccinationData] = useState(null);
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    const user = JSON.parse(localStorage.getItem("@sipavUser"));

    const { getVaccinationDistribution, getMonthlyVaccinationDistribution, getAllVaccinations } = VaccinationAPI();
    const { getAllDiseases, getDiseaseVaccinationPercentage } = DiseaseAPI();

    const sortedDiseases = diseases?.sort((a, b) => a.name.localeCompare(b.name));

    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const barChartRef2 = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const diseasesData = await getAllDiseases();
                setDiseases(diseasesData.data);
            } catch (error) {
                console.error("Erro ao buscar doenças:", error);
            }
        };

        const fetchYears = async () => {
            try {
                const allVaccinationsData = await getAllVaccinations();
                const vaccinationYears = allVaccinationsData.data.map(vaccine =>
                    new Date(vaccine.date).getFullYear()
                );
                const uniqueYears = [...new Set(vaccinationYears)];

                // Definir os anos no estado
                setYears(uniqueYears);

            } catch (error) {
                console.error("Erro ao buscar vacinações:", error);
            }
        }

        fetchDiseases();
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchMonthlyVaccinationData = async () => {
            try {
                const yearNumber = selectedYear || null;
                const data = await getMonthlyVaccinationDistribution(yearNumber);
                setMonthlyVaccinationData(data);
            } catch (error) {
                console.error("Erro ao buscar dados de vacinação mensal:", error);
            }
        };

        fetchMonthlyVaccinationData();
    }, [selectedYear]);

    useEffect(() => {
        const fetchVaccinationData = async () => {
            try {
                const diseaseId = selectedDisease || null;
                const data = await getVaccinationDistribution(diseaseId);
                if (selectedDisease != "") {
                    const response = await getDiseaseVaccinationPercentage(diseaseId, user.type);
                    setVaccinationData({ ...response.data, diseaseName: sortedDiseases.find(disease => disease.id == diseaseId).name });
                }
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
            responsive: true,
            maintainAspectRatio: false,
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

        return <Bar ref={barChartRef} data={data} options={options} />;
    };

    const renderPercentChart = () => {
        if (!vaccinationData) return "Carregando";
        if (!vaccinationData.percentage) return "Doença sem dados";

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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#333333', // Mudar a cor do texto da legenda
                        font: {
                            size: 14, // Tamanho da fonte
                        },
                    },
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white', // Cor do título do tooltip
                    bodyColor: 'white',  // Cor do corpo do tooltip
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

        return <Pie ref={pieChartRef} data={data} options={options} />;
    };

    const renderMonthlyVaccinationChart = () => {
        if (!monthlyVaccinationData) return null;

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const data = {
            labels: monthlyVaccinationData.map(item => months[item.month - 1]), // Meses
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
            responsive: true,
            maintainAspectRatio: false,
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

        return <Bar ref={barChartRef2} data={data} options={options} />;
    };

    const handleDiseaseChange = (event) => {
        setSelectedDisease(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <Flex flexDirection="column" alignItems="center" width="100%" px="3rem" pb="2rem">
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
                px=".3rem"
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
                <Box gridColumn="1 / -1"> {/* Essa linha fará o box ocupar todas as colunas */}
                    <Flex alignItems="center" pb={"0.5rem"}>
                        <Text
                            fontSize={["md", "xl", "xl", "2xl"]}
                            fontWeight="black"
                            color="secondary.400"
                        >
                            Vacinações Mensais
                        </Text>
                        <Select
                            value={selectedYear}
                            onChange={handleYearChange}
                            fontSize="md"
                            color="secondary.00"
                            fontWeight="semibold"
                            maxWidth="200px"
                            borderColor="primary.600"
                            bg="white"
                            px=".3rem"
                            mx=".3rem"
                        >
                            <option value="">
                                Todos os anos
                            </option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </Select>
                    </Flex>
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
