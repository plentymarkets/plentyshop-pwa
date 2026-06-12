enum AnalyticsEventName {
  tocOpened = 'tocOpened',
  tocCreateBlock = 'tocCreateBlock',
  contentCreateBlock = 'contentCreateBlock',
  headerContainerEditBlock = 'headerContainerEditBlock',
  addItemToBasket = 'addItemToBasket',
  openingCheckout = 'openingCheckout',
  paypalExpressFlow = 'paypalExpressFlow',
  guestLoginPage = 'guestLoginPage',
}

export const useLogEvent = () => {
  const logToCOpened = () => {
    usePlentyLogs({
      name: AnalyticsEventName.tocOpened,
      loggableType: 'toc',
      loggableId: '',
      payload: {},
    });
  };

  const logToCCreateBlock = () => {
    usePlentyLogs({
      name: AnalyticsEventName.tocCreateBlock,
      loggableType: 'toc',
      loggableId: '',
      payload: {},
    });
  };

  const logContentCreateBlock = () => {
    usePlentyLogs({
      name: AnalyticsEventName.contentCreateBlock,
      loggableType: 'content',
      loggableId: '',
      payload: {},
    });
  };

  const logHeaderContainerEditBlock = () => {
    usePlentyLogs({
      name: AnalyticsEventName.headerContainerEditBlock,
      loggableType: 'headerContainer',
      loggableId: '',
      payload: {},
    });
  };

  const logAddItemToBasket = () => {
    usePlentyLogs({
      name: AnalyticsEventName.addItemToBasket,
      loggableId: '',
      loggableType: '',
      payload: {},
    });
  };

  const logOpeningCheckout = () => {
    usePlentyLogs({
      name: AnalyticsEventName.openingCheckout,
      loggableType: '',
      loggableId: '',
      payload: {},
    });
  };

  const logPayPalExpressFlow = () => {
    usePlentyLogs({
      name: AnalyticsEventName.paypalExpressFlow,
      loggableType: '',
      loggableId: '',
      payload: {},
    });
  };

  const logOpenGuestLoginPage = () => {
    usePlentyLogs({
      name: AnalyticsEventName.guestLoginPage,
      loggableType: '',
      loggableId: '',
      payload: {},
    });
  };

  return {
    logToCOpened,
    logToCCreateBlock,
    logContentCreateBlock,
    logHeaderContainerEditBlock,
    logAddItemToBasket,
    logOpeningCheckout,
    logPayPalExpressFlow,
    logOpenGuestLoginPage,
  };
};
