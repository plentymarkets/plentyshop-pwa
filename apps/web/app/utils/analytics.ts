export const AnalyticsEventName = {
    tocOpened: 'tocOpened',
    tocCreateBlock: 'tocCreateBlock',
    contentCreateBlock: 'contentCreateBlock',
}

export const trackToCOpened = () => {
    usePlentyAnalytics({
        name: AnalyticsEventName.tocOpened,
        loggableType: 'toc',
        loggableId: '',
        payload: {}
    })
}

export const trackToCCreateBlock = () => {
    usePlentyAnalytics({
        name: AnalyticsEventName.tocCreateBlock,
        loggableType: 'toc',
        loggableId: '',
        payload: {}
    })
}

export const trackContentCreateBlock = () => {
    usePlentyAnalytics({
        name: AnalyticsEventName.contentCreateBlock,
        loggableType: 'content',
        loggableId: '',
        payload: {}
    })
}
