import axios from "axios";
import axiosInterceptorsResponse from "../config/AxiosInterceptorsResponse";
import axiosInterceptorsRequest from "../config/AxiosInterceptorsRequest";

const isProduction = process.env.NODE_ENV === 'production';

const baseURL = isProduction ? 'https://back-sipav.vercel.app/' : 'http://localhost:3333/';

const api = axios.create({
  baseURL: baseURL,
});

axiosInterceptorsRequest(api);
axiosInterceptorsResponse(api);

export default api;
