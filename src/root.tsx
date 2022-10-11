import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

export default component$(() => {
  useStyles$(`
  html,
  body {
    height: 100%;
  }

  @font-face {
    font-family: "Antwerp";
    src: local("Serif"), url("/fonts/Antwerp-Regular.woff") format("woff");
    font-display: swap;
  }
  
  @font-face {
    font-family: "Antwerp";
    font-weight: bold;
    src: local("Serif"), url("/fonts/Antwerp-Bold.woff") format("woff");
    font-display: swap;
  }
  
  * {
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: "Antwerp";
    line-height: 1.6em;
    font-size: 1.25em;
  }

  a:link,
  a:visited {
    color: #000000;
  }

  .one-page {
    height: 100vh;
  }
  `);

  return (
    <QwikCity>
      <head>
        <meta charSet="utf-8" />
        <RouterHead />
      </head>
      <body lang="en" class="one-page">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  );
});
