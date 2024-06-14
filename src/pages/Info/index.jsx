import { Flex, Text, Heading, UnorderedList, ListItem, Box, Link } from '@chakra-ui/react'
import React from 'react'

const Info = () => {
  return (
    <Flex mt="2rem" width={"80%"} flexDirection={"column"} alignItems={"center"} justifyContent="center" p={4}>
      <Heading fontSize={"3xl"} color={"secondary.300"} fontWeight={"bold"} mb={5}>
        SIPAV: Sistema de Informação para o Acompanhamento Vacinal
      </Heading>
      <Text fontSize={"xl"} color={"secondary.300"} mb={4}>
        O SIPAV, Sistema de Controle e Lembrete de Vacinas, é uma aplicação desenvolvida com o propósito de facilitar o controle e o acompanhamento das vacinas necessárias para a população, além de fornecer lembretes úteis para garantir que as doses sejam tomadas conforme o calendário recomendado.
      </Text>

      <Text fontSize={"xl"} color={"secondary.300"} mb={4}>
        Este sistema foi concebido como parte de um projeto de estudo, especificamente como trabalho de conclusão de curso (TCC). Ele visa explorar e aplicar conhecimentos relacionados ao desenvolvimento de aplicativos web, bem como abordar questões relevantes para a saúde pública, como a importância da vacinação regular.
      </Text>

      <Text fontSize={"xl"} color={"secondary.300"} mb={4}>
        O SIPAV oferece diversas funcionalidades, incluindo:
      </Text>

      <UnorderedList fontSize={"xl"} color={"secondary.300"} mb={4}>
        <ListItem>Controle de Vacinas: Permite que os usuários registrem as vacinas já tomadas, mantendo um histórico detalhado de imunizações.</ListItem>
        <ListItem>Calendário de Vacinação: Apresenta um calendário com as datas recomendadas para cada vacina, ajudando os usuários a manterem-se atualizados em relação às doses necessárias.</ListItem>
        <ListItem>Lembretes Personalizados: Envia lembretes personalizados para os usuários, alertando sobre a proximidade das datas de vacinação e garantindo que não haja esquecimentos.</ListItem>
        <ListItem>Informações sobre Vacinas: Oferece informações detalhadas sobre cada vacina, incluindo sua finalidade, efeitos colaterais possíveis e outras recomendações relevantes.</ListItem>
      </UnorderedList>

      <Text fontSize={"xl"} color={"secondary.300"} mb={4}>
        É importante ressaltar que o SIPAV é uma ferramenta educativa e de estudo, desenvolvida com o intuito de contribuir para uma melhor compreensão sobre a importância da vacinação e para promover a saúde pública de forma geral. Embora seja uma aplicação fictícia, seu desenvolvimento e utilização podem fornecer insights valiosos sobre o desenvolvimento de soluções tecnológicas para questões de saúde.
      </Text>

      <Box mt={16} textAlign="center" pb={4}>
        <Text fontWeight={"bold"} fontSize={"xl"} color="secondary.300">Projeto desenvolvido pela <Link bg={"secondary.300"} href="https://www.unb.br/" isExternal color="primary.500" >Universidade de Brasília</Link></Text>
      </Box>
    </Flex>
  )
}

export default Info
