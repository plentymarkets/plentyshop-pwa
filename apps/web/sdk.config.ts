import axios from "axios";
import type { Endpoints } from "@plentymarkets/shop-api";
import { SdkHttpError } from "@vue-storefront/sdk";
import { AxiosError } from "@vue-storefront/middleware";

export default defineSdkConfig(
  ({ buildModule, middlewareUrl, middlewareModule, getRequestHeaders }) => ({
    plentysystems: buildModule(middlewareModule<Endpoints>, {
      apiUrl: middlewareUrl + "/plentysystems",
      defaultRequestConfig: {
        headers:  getRequestHeaders(),
        method: "GET",
      },
      httpClient: async (url, params, config) => {
        try {
          const client = axios.create({
            withCredentials: true,
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
