import "reflect-metadata";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import PolProviders from "./PolProviders";
import ErrorBoundary from "./views/ErrorBoundary";

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

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <PolProviders>
          <RouterProvider router={router} />
        </PolProviders>
      </ErrorBoundary>
    </StrictMode>,
  );
}
