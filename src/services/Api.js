import axios from "axios";
import axiosInterceptorsResponse from "../config/AxiosInterceptorsResponse";
import axiosInterceptorsRequest from "../config/AxiosInterceptorsRequest";

const api = axios.create({
  baseURL: "http://localhost:3333/",
});

axiosInterceptorsRequest(api);
axiosInterceptorsResponse(api);

export default api;
