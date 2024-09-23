import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Doughnut, Pie } from 'react-chartjs-2';

const Dashboards = () => {
    const [vaccinationData, setVaccinationData] = useState(null);

    const renderAgeGroupChart = (ageGroupData) => {
        const data = {
            labels: ['0-12', '13-18', '19-35', '36-60', '61+'],
            datasets: [
                {
                    label: 'Número de Vacinações',
                    data: [
                        ageGroupData['0-12'],
                        ageGroupData['13-18'],
                        ageGroupData['19-35'],
                        ageGroupData['36-60'],
                        ageGroupData['61+'],
                    ],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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

        return <Doughnut data={data} options={options} />;
    };

    const renderChart = () => {
        if (!vaccinationData) return null;
        console.log(vaccinationData)

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
        <Flex>
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
                    Porcentagem de usuários vacinados contra {vaccinationData?.diseaseName}
                </Text>
                {renderChart()}
            </Flex>
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
                    Porcentagem de usuários vacinados contra {vaccinationData?.diseaseName}
                </Text>
                {renderChart()}
            </Flex>
        </Flex>
    )
}

export default Dashboards