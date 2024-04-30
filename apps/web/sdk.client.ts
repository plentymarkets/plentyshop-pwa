import axios from "axios";
import { SdkHttpError } from '@vue-storefront/sdk';
import { AxiosError } from "@vue-storefront/middleware";

export const httpClient = async (url: any, params: any, config: any) => {
  try {
    console.log("first axios client unit");
    const { token } = useCsrfToken();
    const client = axios.create({
      withCredentials: true,
    });

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
};