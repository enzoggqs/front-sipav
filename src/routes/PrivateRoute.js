import { Navigate, useLocation } from "react-router-dom";
import Auth from "../services/Auth";
import PathRoutes from "./PathRoutes";

const PrivateRoute = ({ children }) => {
  const isAuth = Auth.isAuth();

  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to={PathRoutes.LOGIN}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  return children;
};

export default PrivateRoute;
