enum AnalyticsEventName {
  tocOpened = 'tocOpened',
  tocCreateBlock = 'tocCreateBlock',
  contentCreateBlock = 'contentCreateBlock',
  headerContainerEditBlock = 'headerContainerEditBlock',
}

export const useLogEvent = () => {
  const logToCOpened = () => {
    usePlentyAnalytics({
      name: AnalyticsEventName.tocOpened,
      loggableType: 'toc',
      loggableId: '',
      payload: {},
    });
  };

  const logToCCreateBlock = () => {
    usePlentyAnalytics({
      name: AnalyticsEventName.tocCreateBlock,
      loggableType: 'toc',
      loggableId: '',
      payload: {},
    });
  };

  const logContentCreateBlock = () => {
    usePlentyAnalytics({
      name: AnalyticsEventName.contentCreateBlock,
      loggableType: 'content',
      loggableId: '',
      payload: {},
    });
  };

  const logHeaderContainerEditBlock = () => {
    usePlentyAnalytics({
      name: AnalyticsEventName.headerContainerEditBlock,
      loggableType: 'headerContainer',
      loggableId: '',
      payload: {},
    });
  };

  return {
    logToCOpened,
    logToCCreateBlock,
    logContentCreateBlock,
    logHeaderContainerEditBlock,
  };
};
