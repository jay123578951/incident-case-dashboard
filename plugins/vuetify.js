import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import customIcons from '@/utils/custom-icons';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light'
    },
    defaults: {
      VBtn: {
        fontFamily: 'Noto Sans TC'
      },
      VCard: {
        fontFamily: 'Noto Sans TC'
      },
      VTextField: {
        fontFamily: 'Noto Sans TC'
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
        custom: customIcons
      }
    }
  });

  app.vueApp.use(vuetify);
});
