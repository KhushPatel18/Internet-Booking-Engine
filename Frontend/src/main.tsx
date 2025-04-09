import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import * as Sentry from "@sentry/react";
import { enableMapSet } from "immer";
import { msalConfig } from "../Config.ts";
import { PublicClientApplication } from "@azure/msal-browser";
enableMapSet();

Sentry.init({
   dsn: "https://607114d040897a668a85d23f938f4c8f@o4506863310602240.ingest.us.sentry.io/4506863320825856",
   integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
         maskAllText: false,
         blockAllMedia: false,
      }),
   ],
   // Performance Monitoring
   tracesSampleRate: 1.0, //  Capture 100% of the transactions
   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
   tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
   // Session Replay
   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
      <App instance={msalInstance} />
   </Provider>
);
