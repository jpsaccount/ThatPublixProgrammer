import "reflect-metadata";
import "@sdk/index";
import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { setup } from "@sdk/.";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import PolProviders from "./PolProviders";
import { useAuth } from "./customHooks/auth";
import ErrorBoundary from "./views/ErrorBoundary";
import { isIphone, isPwaLaunched } from "./utilities/deviceUtils";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

setup();

let notchClass = "";
if (isIphone()) {
  if (isPwaLaunched()) {
    notchClass = `
    .notch-safe {
      padding-bottom: 20px;
    }`;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <PolProviders>
          <style>{notchClass}</style>
          <PolRouterProvider />
        </PolProviders>
      </ErrorBoundary>
    </StrictMode>,
  );
}

function PolRouterProvider() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}
