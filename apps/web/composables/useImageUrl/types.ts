

export type GetWebpUrl = (url: string | undefined) => string


export interface UseImageUrl {
    getWebpUrl: GetWebpUrl
}


export type UseImageUrlReturn = () => UseImageUrl;
