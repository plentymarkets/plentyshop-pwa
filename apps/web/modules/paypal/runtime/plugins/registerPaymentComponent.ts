export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { addComponent, addReInitializeComponent } = useDynamicPaymentButtons();

    const addComponents = () => {
      addComponent({
        componentName: 'PayPalButtons',
        key: 'plentyPayPal',
      });
      addReInitializeComponent({
        componentName: 'PayPalButtons',
        key: 'plentyPayPal',
      });
    };

    addComponents();
  },
});
