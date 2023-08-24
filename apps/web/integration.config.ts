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
      clientId: 'Ab_wQoMAfzuqCrl4gVfYvkNHmBS_s_rQKMafFJrArKJ4GZU8nbSIn53v4Q8ZZfoHR01kxnjkDF4yVLAv',
      merchantId: '999JUBU6WMRWU',
    },
  },
} as IntegrationConfig;
