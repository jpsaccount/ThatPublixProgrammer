import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import MUIThemeProvider from "./components/MUIThemeProvider";
import FlowbiteWrapper from "./components/layouts/flowbite-wrapper";
import PolAlert from "./components/polComponents/PolAlert";
import { Toaster } from "./components/ui/toaster";
import { AlertProvider } from "./contexts/AlertContext";
import { NavContextProvider } from "./contexts/NavContext";
import { isDevEnvironment } from "./sdk/utils/devUtils";
import { AuthContextProvider } from "./sdkSetup/AuthContext";
import { ReactNode } from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 10 } },
});

interface Props {
  children: ReactNode;
}
export default function PolProviders({ children }: Props) {
  return (
    <NavContextProvider>
      <HelmetProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <FlowbiteWrapper>
                <MUIThemeProvider>
                  <AlertProvider>
                    {children}
                    {isDevEnvironment() ? <ReactQueryDevtools initialIsOpen={false} /> : null}

                    <PolAlert />
                    <Toaster />
                  </AlertProvider>
                </MUIThemeProvider>
              </FlowbiteWrapper>
            </AuthContextProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </NavContextProvider>
  );
}
