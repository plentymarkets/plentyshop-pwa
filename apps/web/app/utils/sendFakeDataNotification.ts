export const sendFakeDataNotification = () => {
  const { send } = useNotification();
  send({
    type: 'warning',
    message:
      'Example Data in Edit Mode: Fields without product data are shown with example data for editing purposes. To view only real data, please click the preview link.',
  });
};
