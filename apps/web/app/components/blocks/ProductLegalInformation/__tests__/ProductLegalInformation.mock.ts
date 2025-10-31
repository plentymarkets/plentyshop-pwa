import type { ProductLegalInformationProps } from '../types';

export const productLegalInformationBlockUuid = '45454545-4545-4455-8455-454545454545';

export const productLegalInformationBlock: ProductLegalInformationProps = {
  name: 'ProductLegalInformation',
  type: 'content',
  meta: { uuid: productLegalInformationBlockUuid },
  content: {
    text: {
      title: 'Item legal details',
      linkText: 'EU Responsible Person - click for details',
    },
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
