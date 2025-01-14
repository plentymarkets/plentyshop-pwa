import { reactive } from 'vue';

export const routeStore = reactive({
  route: null,
  setRoute(newRoute: any) {
    this.route = newRoute;
  },
});
