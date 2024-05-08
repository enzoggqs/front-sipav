export default function AxiosInterceptorsRequest(api, token) {
  api.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("@sipavAccessToken");

      if (token) {
        config.headers = {
          Authorization: `Token ${token}`,
        };
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
}
