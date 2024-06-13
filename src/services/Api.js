import axios from "axios";

const isProduction = process.env.NODE_ENV === 'production';

const baseURL = isProduction ? 'https://back-sipav.vercel.app/' : 'http://localhost:3333/';

const api = axios.create({
  baseURL: baseURL,
});

export default api;
