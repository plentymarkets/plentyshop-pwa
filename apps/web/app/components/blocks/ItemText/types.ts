import type { Product } from '@plentymarkets/shop-api';

export type ItemTextProps = {
    name?: string;
    type?: string;
    content?: ItemTextContent;
    configuration?: object;
    index?: number;
    meta: {
        uuid: string;
    };
};

export type ItemTextContent = {
    title: string,
    displayAsCollapsable: boolean,
    initiallyCollapsed: boolean,
    layout: {
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
    };
};

export type ItemTextFormProps = {
    uuid?: string;
};
