import type { PlentyApiEndpoints } from "@plentymarkets/shop-api";

export default defineSdkConfig(
  ({ buildModule, middlewareUrl, middlewareModule, getRequestHeaders }) => ({
    plentysystems: buildModule(middlewareModule<PlentyApiEndpoints>, {
      apiUrl: middlewareUrl + "/plentysystems",
      defaultRequestConfig: {
        headers: getRequestHeaders(),
      },
    }),
  })
);
