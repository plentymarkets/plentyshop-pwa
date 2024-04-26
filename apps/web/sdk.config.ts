import axios from "axios";
import type { Endpoints } from "@plentymarkets/shop-api";
import { SdkHttpError } from "@vue-storefront/sdk";

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
          const { data } = await axios(url, {
            ...config,
            data: params,
            withCredentials: true, // Includes the `Access-Control-Allow-Credentials` response header
          });
  
          return data;
        } catch (error: any) {
          console.log(error);
          throw new SdkHttpError({
            statusCode: error.response?.status || 500,
            message: error.response?.data?.message || error.message,
            cause: error,
          });
        }
      }
    }),
  })
);
