interface IntegrationConfig {
  payment?: {
    paypal?: {
      paymentId: number;
      clientId: string;
      merchantId: string;
    };
  };
}

export default {
  payment: {
    paypal: {
      paymentId: 6001,
      clientId: 'AW6yq0sv_F3N_ADx892v7dZe_sW97-Ndh1S-PvR8IdpscLgZuqevJnQqUnvo4FeeNtJ-CJyU3-eLffJj',
      merchantId: 'G3B6KHDK6UFM2',
    },
  },
} as IntegrationConfig;
