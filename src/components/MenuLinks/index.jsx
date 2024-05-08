import { Box, Button, Stack } from "@chakra-ui/react";
import MenuItem from "../MenuItem";
import useAuth from "../../services/useAuth";

const MenuLinks = ({ isOpen }) => {
    const { signOut, isAuthenticated } = useAuth();

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
          {isAuthenticated && (
            <>
              <MenuItem to="/account">Perfil</MenuItem>
              <MenuItem to="/dependents">Dependentes</MenuItem>
            </>
          )}
          <MenuItem to="/health-centers">Mapa de Postos de Saúde </MenuItem>
          <MenuItem to="/">Informações </MenuItem>
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => signOut()}
                size="sm"
                rounded="md"
                color={["secondary.600", "secondary.600", "white", "white"]}
                bg={["white", "white", "#CA3433", "#CA3433"]}
                _hover={{
                  bg: ["secondary.500", "secondary.500", "secondary.500", "#960019"]
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