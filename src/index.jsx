import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import themeVariables from "./config/Theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/userContext";
import { DiseasesProvider } from "./context/diseasesContext";

const theme = extendTheme(themeVariables);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <DiseasesProvider>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </ChakraProvider>
    </DiseasesProvider>
  </React.StrictMode>
);
