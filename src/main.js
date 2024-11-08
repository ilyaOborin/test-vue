import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@/assets/styles/main.scss";

const app = createApp(App);
app.use(router);
app.use(store)
app.mount('#app');
