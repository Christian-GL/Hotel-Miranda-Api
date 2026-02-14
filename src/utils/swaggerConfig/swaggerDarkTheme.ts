
export const swaggerDarkTheme = `
  /* Asegurar que html y body ocupen el 100% del alto de la pantalla */
  html, body {
    height: 100% !important;
    margin: 0;
    padding: 0;
  }

  /* Fondo de color #2e2e2e en todo el documento */
  body {
    background-color: #2e2e2e !important;
  }

  /* Asegurar que la zona de swagger-ui también tenga el fondo #2e2e2e */
  .swagger-ui {
    background-color: #2e2e2e !important;
  }

  .swagger-ui .topbar {
    background-color: #333 !important;
  }
  .swagger-ui .topbar .swagger-ui-wrap .title {
    color: #FFFFFF !important; /* Título principal de Swagger en blanco */
  }
  .swagger-ui .info {
    background-color: #444 !important;
  }
  .swagger-ui .info .title {
    color: #FFFFFF !important; /* Título principal (Documentación de la API) en blanco */
  }
  .swagger-ui .info .version {
    color: #FFFFFF !important; /* Versión en blanco */
  }
  .swagger-ui .scheme-container {
    background-color: #3d3d3d !important;
  }
  .swagger-ui .opblock-tag {
    background-color: #3b3b3b !important;
    color: #FFFFFF !important; /* Tags en blanco */
  }
  .swagger-ui .opblock-summary {
    background-color: #3b3b3b !important;
    color: #FFFFFF !important; /* Summary de las operaciones en blanco */
  }
  .swagger-ui .opblock-summary-description {
    color: #FFFFFF !important; /* Descripción de las operaciones en blanco */
  }
  .swagger-ui .opblock-summary-method {
    color: #FFFFFF !important; /* Métodos de las operaciones (GET, POST, etc.) en blanco */
  }
  .swagger-ui .opblock-summary-path {
    color: #FFFFFF !important; /* Rutas de las operaciones en blanco */
  }
  .swagger-ui .opblock-summary {
    color: #FFFFFF !important; /* Todos los textos de los summaries de las operaciones en blanco */
  }
  .swagger-ui .opblock-body {
    background-color: #3e3e3e !important;
  }
  .swagger-ui .response {
    background-color: #333 !important;
  }
  .swagger-ui .response-title {
    color: #FFFFFF !important; /* Títulos de respuestas en blanco */
  }
  .swagger-ui .response-description {
    color: #FFFFFF !important; /* Descripción de respuestas en blanco */
  }
  .swagger-ui .model {
    background-color: #444 !important;
    color: #FFFFFF !important; /* Modelos en blanco */
  }
  .swagger-ui .model-box {
    background-color: #444 !important;
  }
  .swagger-ui .parameters-col_description {
    color: #FFFFFF !important; /* Descripción de los parámetros en blanco */
  }
  .swagger-ui .parameters-col_name {
    color: #FFFFFF !important; /* Nombres de los parámetros en blanco */
  }
  .swagger-ui .parameters-col_example {
    color: #FFFFFF !important; /* Ejemplos de parámetros en blanco */
  }
  .swagger-ui .parameters-col_default {
    color: #FFFFFF !important; /* Valores por defecto de parámetros en blanco */
  }
  .swagger-ui .tags-box {
    color: #FFFFFF !important; /* Los tags de cada bloque (por ejemplo, 'Bookings', 'Users', etc.) en blanco */
  }
  .swagger-ui .tag {
    color: #FFFFFF !important; /* Tags de cada operación en blanco */
  }
  .swagger-ui .opblock-summary-path {
    color: #FFFFFF !important; /* Rutas de las operaciones en blanco */
  }
  .swagger-ui .opblock-summary-method {
    color: #FFFFFF !important; /* Métodos de las operaciones en blanco */
  }
  .swagger-ui .swagger-ui .opblock-summary-description {
    color: #FFFFFF !important; /* Descripción de cada bloque principal (tags) en blanco */
  }
  .swagger-ui .swagger-ui .info__title {
    color: #FFFFFF !important; /* Título de la API en blanco */
  }
  .swagger-ui .swagger-ui .opblock-summary-summary {
    color: #FFFFFF !important; /* Todos los textos dentro de los summary en blanco */
  }
  .swagger-ui .swagger-ui .swagger-ui .opblock-summary-description {
    color: #FFFFFF !important; /* Descripciones de las rutas en blanco */
  }
  /* Añadido para cambiar el color de los textos dentro de renderedMarkdown */
  .swagger-ui .renderedMarkdown {
    color: #FFFFFF !important; /* Todos los textos con la clase renderedMarkdown en blanco */
  }
  /* Nuevas clases añadidas para cambiar el color de texto a blanco */
  .swagger-ui .opblock-description-wrapper {
    color: #FFFFFF !important; /* Descripción de los bloques (operation blocks) en blanco */
  }
  .swagger-ui .col_header {
    color: #FFFFFF !important; /* Encabezados de las columnas en blanco */
  }
  .swagger-ui .response-col_status {
    color: #FFFFFF !important; /* Estado de las respuestas (como 200, 400, etc.) en blanco */
  }
  .swagger-ui .response-col_description {
    color: #FFFFFF !important; /* Descripción de las respuestas en blanco */
  }
  .swagger-ui .response-control-media-type__title {
    color: #FFFFFF !important; /* Títulos de los controles de tipo de medio en blanco */
  }
  .swagger-ui .tablinks {
    color: #FFFFFF !important; /* Enlaces de las pestañas en blanco */
  }
  /* Añadido para cambiar el color de los textos dentro de opblock-description-wrapper p */
  .swagger-ui .opblock-description-wrapper p {
    color: #FFFFFF !important; /* Todos los párrafos dentro de opblock-description-wrapper en blanco */
  }
  /* Nueva clase añadida para cambiar el color de los textos dentro de response-col_links */
  .swagger-ui .response-col_links {
    color: #FFFFFF !important; /* Textos dentro de los enlaces de respuestas en blanco */
  }
  /* Nueva clase añadida para cambiar el color de los textos dentro de .responses-inner h5 */
  .swagger-ui .responses-inner h5 {
    color: #B0B0B0 !important; /* Títulos h5 dentro de las respuestas en gris claro */
  }
  /* Nueva clase añadida para cambiar el color de los textos dentro de .responses-inner h4 */
  .swagger-ui .responses-inner h4 {
    color: #B0B0B0 !important; /* Títulos h4 dentro de las respuestas en gris claro */
  }
`