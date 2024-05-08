import { AspectRatio, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import UbsData from '../../../data/ubs_gama.json';

const HealthCenter = () => {
    const [currentLocation, setCurrentLocation] = useState(
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1917.7236324294286!2d-48.045677391497!3d-15.990215986733128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2a8c49ce3677%3A0x447f05b6f05fa281!2sUnB%20-%20Campus%20Gama!5e0!3m2!1spt-BR!2sbr!4v1714679752438!5m2!1spt-BR!2sbr"
    );

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    return (
        <Flex
            width="100%"
            h="full"
            flexDir="column"
            alignItems="center"
            w="full"
        >
            <Text
                fontSize="3xl"
                color="secondary.400"
                fontWeight="semibold"
                onClick={() => navigate("/")}
                mb="2rem"
            >
                Lista de postos de saúde na região
            </Text>
            <VStack
                px="1rem"
                mb="3rem"
                overflowY="auto"
                maxH="150px"
                sx={{
                  "&::-webkit-scrollbar": {
                    marginLeft: "1rem",
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#0A4D68",
                  },
                }}
            >
            {UbsData.ubs.map((ubs, index) => (
                <Button 
                    key={index} 
                    onClick={() => handleLocationChange(ubs.location)}
                    color="secondary.500"
                    p="1rem"
                    mb="1rem"
                    fontSize="xl"
                    borderRadius="30px"
                    borderWidth=".2rem"
                >
                    {ubs.name}
                </Button>
            ))}
            </VStack>
            <AspectRatio w="80%" ratio={16 / 9}>
                <div style={{ width: '100%', height: '100%', borderRadius: '30px' }}>
                    <iframe
                        src={currentLocation}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Mapa"
                    />
                </div>
            </AspectRatio>
        </Flex>
    )

}

export default HealthCenter