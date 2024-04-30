import axios from "axios";
import type { Endpoints } from "@plentymarkets/shop-api";
import { SdkHttpError } from "@vue-storefront/sdk";
import { AxiosError } from "@vue-storefront/middleware";

export default defineSdkConfig(
  ({ buildModule, middlewareUrl, middlewareModule, getRequestHeaders }) => ({
    plentysystems: buildModule(middlewareModule<Endpoints>, {
      apiUrl: middlewareUrl + "/plentysystems",
      defaultRequestConfig: {
        headers: getRequestHeaders(),
        method: "GET",
      },
      httpClient: async (url, params, config) => {
        try {
          const client = axios.create({
            withCredentials: true,
          });

          const { token } = useCsrfToken();

          client.interceptors.response.use((response) => {
            if (response.headers["x-csrf-token"]) {
              token.value = response.headers["x-csrf-token"];
            }
            return response;
          });

          client.interceptors.request.use((request) => {
            if (token.value) {
              request.headers["x-csrf-token"] = token.value;
            }
            return request;
          });

          const { data } = await client(url, {
            ...config,
            data: params,
          });

          return data;
        } catch (error: any | AxiosError) {
          console.error(error);
          throw new SdkHttpError({
            statusCode: error.response?.status,
            message: error.message,
            cause: error.response.data,
          });
        }
      }
    }),
  })
);
