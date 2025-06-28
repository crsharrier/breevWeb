import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

import "vuetify/styles/main.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  defaults: {
    VBtn: {
      variant: "tonal",
      rounded: "xl",
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount("#app");
