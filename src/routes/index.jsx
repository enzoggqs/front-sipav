import { Routes, Route } from "react-router-dom";
import PathRoutes from "./PathRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { Flex } from "@chakra-ui/react";
import Dependents from "../pages/Dependents";
import Disease from "../pages/Disease";
import Header from "../components/Header";
import HealthCenter from "../pages/HealthCenter";

const RoutesComponent = () => {
  return (
      <Routes>
          <Route exect path={PathRoutes.REGISTER} element={<Register />} />
          <Route exect path={PathRoutes.LOGIN} element={<Login />} />
          <Route exect path={PathRoutes.HOME} 
            element={
              <Flex
                flexDirection="column"
                backgroundColor="primary.500"
                alignItems="center"
                h={"100%"}
                minH={"100vh"}
                w={"100%"}
              >
                <Header /> 
                <Home /> 
              </Flex>
            }
          />
          <Route exect path={PathRoutes.PROFILE} 
            element={
              <Flex
                flexDirection="column"
                backgroundColor="primary.500"
                alignItems="center"
                h={"100%"}
                minH={"100vh"}
                w={"100%"}
              >
                <Header />
                <Profile /> 
              </Flex>
            } 
          />
          <Route exect path={PathRoutes.DEPENDENTS} 
            element={
              <Flex
                flexDirection="column"
                backgroundColor="primary.500"
                alignItems="center"
                h={"100%"}
                w={"100%"}
                minH={"100vh"}
              >
                <Header />
                <Dependents />
              </Flex>
              } 
          />
          <Route exect path={PathRoutes.DISEASE} 
            element={
              <Flex
                flexDirection="column"
                backgroundColor="primary.500"
                alignItems="center"
                h={"100%"}
                w={"100%"}
                minH={"100vh"}
              >
                <Header />
                <Disease />
              </Flex>
            } 
          />
          <Route exect path={PathRoutes.HEALTHCENTERS} 
            element={
              <Flex
                flexDirection="column"
                backgroundColor="primary.500"
                alignItems="center"
                h={"100%"}
                w={"100%"}
                minH={"100vh"}
              >
                <Header />
                <HealthCenter />
              </Flex>
            } 
          />
      </Routes>
  )
}

export default RoutesComponent