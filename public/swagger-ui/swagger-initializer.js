window.onload = function () {
  //<editor-fold desc="Changeable Configuration Block">

  const baseUrl = window.location.origin;
  const url =
    new URLSearchParams(window.location.search).get('url') ||
    `${baseUrl}/docs/api-spec.yaml`;

  window.ui = SwaggerUIBundle({
    url: url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout'
  });

  //</editor-fold>
};
