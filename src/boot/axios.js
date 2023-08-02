import axios from "axios";

const apiEndpoint = process.env.DEV
  ? process.env.API_ENDPOINT
  : process.env.API_ENDPOINT_PROD;

const api = axios.create({
  baseURL: apiEndpoint,
  setTimeout: 6000,
});

api.interceptors.response.use(
  (response) => {
    if (response?.status === 200 || response.data) {
      const { data } = response;

      return {
        ...data,
        status: 200,
      };
    }

    return response;
  },

  (error) => {
    const { response, message } = error;
    const { data } = response;

    if (message && !response) {
      return Promise.reject(message);
    }

    return Promise.reject(data);
  }
);

export { api };
