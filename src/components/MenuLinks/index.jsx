import { Box, Button, Stack } from "@chakra-ui/react";
import MenuItem from "../MenuItem";
import { useAuth } from "../../context/AuthContext";

const MenuLinks = ({ isOpen }) => {
    const { signOut, isAuthenticated, userType } = useAuth();

    return (
      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          {(isAuthenticated && (userType === 0)) && (
            <>
              <MenuItem to="/">Vacinas</MenuItem>
              <MenuItem to="/account">Perfil</MenuItem>
              <MenuItem to="/dependents">Dependentes</MenuItem>
            </>
          )}
          <MenuItem to="/health-centers">Mapa de Postos de Saúde </MenuItem>
          <MenuItem to="/info">Informações </MenuItem>
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => signOut()}
                size="sm"
                rounded="md"
                color={["secondary.300", "secondary.300", "white", "white"]}
                bg={["#CA3433", "#CA3433", "#CA3433", "#CA3433"]}
                _hover={{
                  bg: ["#960019", "#960019", "#960019", "#960019"]
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <MenuItem to="/register" isLast>
              <Button
                size="sm"
                rounded="md"
                color={["secondary.600", "secondary.600", "white", "white"]}
                bg={["white", "white", "secondary.500", "secondary.500"]}
                _hover={{
                  bg: ["secondary.500", "secondary.500", "secondary.500", "primary.600"]
                }}
              >
                Criar conta
              </Button>
            </MenuItem>
          )}
        </Stack>
      </Box>
    );
};

export default MenuLinks