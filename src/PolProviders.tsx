import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import MUIThemeProvider from "./components/MUIThemeProvider";
import PolAlert from "./components/polComponents/PolAlert";
import { Toaster } from "./components/ui/toaster";
import { AlertProvider } from "./contexts/AlertContext";
import { isDevEnvironment } from "./utilities/devUtils";
import { ReactNode } from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 10 } },
});

interface Props {
  children: ReactNode;
}
export default function PolProviders({ children }: Props) {
  return (
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <MUIThemeProvider>
            <AlertProvider>
              {children}
              {isDevEnvironment() ? <ReactQueryDevtools initialIsOpen={false} /> : null}

              <PolAlert />
              <Toaster />
            </AlertProvider>
          </MUIThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </HelmetProvider>
  );
}
