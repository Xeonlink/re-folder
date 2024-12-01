import "./assets/main.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;
const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
  <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>,
);
