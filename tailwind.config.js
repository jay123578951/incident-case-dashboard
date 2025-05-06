const { colors } = require('./assets/styles/colors');
const tailwindColors = {};

Object.entries(colors).forEach(([colorName, colorShades]) => {
  tailwindColors[colorName] = {};
  Object.entries(colorShades).forEach(([shade, value]) => {
    tailwindColors[colorName][shade] = value;
  });
});

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
      colors: tailwindColors,
      height: {
        'main-content':
          'calc(100vh - var(--header-height) - var(--breadcrumb-height) - var(--footer-height) - var(--container-padding))'
      }
    }
  },
  plugins: []
};
