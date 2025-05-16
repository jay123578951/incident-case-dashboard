import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { colors } from '~/assets/styles/colors';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import customIcons from '@/utils/custom-icons';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            'primary-1': colors.primary[1],
            'primary-2': colors.primary[2],
            'primary-3': colors.primary[3],
            'primary-4': colors.primary[4],
            'primary-5': colors.primary[5],
            'primary-6': colors.primary[6],
            'primary-7': colors.primary[7],
            'primary-8': colors.primary[8],
            'primary-9': colors.primary[9],
            'primary-10': colors.primary[10],
            'primary-11': colors.primary[11],
            'primary-12': colors.primary[12],
            'primary-13': colors.primary[13],
            'primary-14': colors.primary[14],

            'teal-1': colors.teal[1],
            'teal-2': colors.teal[2],
            'teal-3': colors.teal[3],
            'teal-4': colors.teal[4],
            'teal-5': colors.teal[5],
            'teal-6': colors.teal[6],
            'teal-7': colors.teal[7],
            'teal-8': colors.teal[8],
            'teal-9': colors.teal[9],
            'teal-10': colors.teal[10],
            'teal-11': colors.teal[11],
            'teal-12': colors.teal[12],
            'teal-13': colors.teal[13],
            'teal-14': colors.teal[14],

            'danger-1': colors.danger[1],
            'danger-2': colors.danger[2],
            'danger-3': colors.danger[3],
            'danger-4': colors.danger[4],
            'danger-5': colors.danger[5],
            'danger-6': colors.danger[6],
            'danger-7': colors.danger[7],
            'danger-8': colors.danger[8],
            'danger-9': colors.danger[9],
            'danger-10': colors.danger[10],
            'danger-11': colors.danger[11],
            'danger-12': colors.danger[12],
            'danger-13': colors.danger[13],
            'danger-14': colors.danger[14],

            'gray-1': colors.gray[1],
            'gray-2': colors.gray[2],
            'gray-3': colors.gray[3],
            'gray-4': colors.gray[4],
            'gray-5': colors.gray[5],
            'gray-6': colors.gray[6],
            'gray-7': colors.gray[7],
            'gray-8': colors.gray[8],
            'gray-9': colors.gray[9],
            'gray-10': colors.gray[10],
            'gray-11': colors.gray[11],
            'gray-12': colors.gray[12],
            'gray-13': colors.gray[13],
            'gray-14': colors.gray[14]
          }
        }
      }
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
