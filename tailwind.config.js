const colors = require('./assets/styles/colors');

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: colors, // 使用自定義顏色系統
      textColor: {
        DEFAULT: '#1C202E' // 全局預設文字顏色
      },
      height: {
        'main-content':
          'calc(100vh - var(--header-height) - var(--breadcrumb-height) - var(--footer-height) - var(--container-padding))'
      }
    }
  },
  plugins: []
};
