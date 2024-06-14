import React, { useEffect, useRef, useState } from 'react'
import {
  Flex,
  Text,
  Select,
  Spinner,
  ModalBody
} from '@chakra-ui/react'
import { GoArrowRight } from 'react-icons/go'
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DiseaseAPI from '../../services/DiseaseApi.jsx';
import CustomBox from '../../components/CustomBox/index.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import { useAuth } from '../../context/AuthContext.jsx';
import CustomModal from '../../components/CustomModal/index.jsx';

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Home = () => {
  const initialRef = useRef();
  const finalRef = useRef();
  const [diseases, setDiseases] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [vaccinationData, setVaccinationData] = useState(null);

  const { isAuthenticated, userType } = useAuth();
  const { getAllDiseases, getDiseaseVaccinationPercentage } = DiseaseAPI();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("@sipavUser"));

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
      } finally {
        setIsLoading(false); // Set loading to false after data fetching
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
    if (user?.type === 0) {
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
          {user?.type === 0 ? 'Minhas Vacinas' : 'Situação de Vacinação dos Usuários'}
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
        {sortedDiseases?.map((disease, index) => (
          <CustomBox
            key={index}
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
      </CustomModal >
    </Flex >
  )
}

export default Home