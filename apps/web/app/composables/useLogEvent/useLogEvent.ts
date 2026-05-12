enum AnalyticsEventName {
  tocOpened = 'tocOpened',
  tocCreateBlock = 'tocCreateBlock',
  contentCreateBlock = 'contentCreateBlock',
  headerContainerEditBlock = 'headerContainerEditBlock',
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

  return {
    logToCOpened,
    logToCCreateBlock,
    logContentCreateBlock,
    logHeaderContainerEditBlock,
  };
};
