import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.api
});

export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$axios = axiosInstance;
});

export { axiosInstance };
