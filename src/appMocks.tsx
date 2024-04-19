// test-utils.tsx
import React, { ReactElement } from "react";
import { render, RenderOptions, within } from "@testing-library/react";
import { AuthContextProvider } from "./sdkSetup/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertProvider } from "./contexts/AlertContext";
import PolAlert from "./components/polComponents/PolAlert";
import { createTheme, ThemeProvider } from "@mui/material";
import { vi } from "vitest";
import { Entity } from "./sdk/contracts/Entity";
import { AuthService, LocalStorageService, RequestResponse } from "./sdk";
import { ObjectSyncedResponse } from "./sdk/models/ObjectSyncedResponse";
import { AnyRequestResponse } from "./sdk/models/RequestResponse";
import { EntityService } from "./sdk/services/EntityService";
import diContainer, { tryAddToContainer } from "./sdk/sdkconfig/SdkSetup";
import { getEntityTypeFromId } from "./sdk/sdkconfig/EntityTypeId";
import { getService } from "./sdk/services/serviceProvider";
import adminUser from "./adminTestUser.json";

function mockGetEntityService<T extends Entity>(entityType: new (...args: any[]) => T): EntityService<T> {
  const key = entityType.name;
  tryAddToContainer(EntityService<T>, key);

  const service = diContainer.get<EntityService<T>>(key);
  service.setBasePath(entityType);

  vi.spyOn(service, "upsertAsync").mockReturnValue(Promise.resolve(new RequestResponse<ObjectSyncedResponse>()));
  vi.spyOn(service, "insertAsync").mockReturnValue(Promise.resolve(new RequestResponse<ObjectSyncedResponse>()));
  vi.spyOn(service, "deleteAsync").mockReturnValue(Promise.resolve(new AnyRequestResponse()));
  return service;
}

vi.mock("./sdk/services/getEntityService", () => ({
  getEntityService: mockGetEntityService,
  getAnyService: (entityTypeId: string) => diContainer.get(getEntityTypeFromId(entityTypeId).name),
}));

// vi.mock("./sdk/utils/devUtils", () => ({
//   isDev: () => true,
// }));

export async function useAdminUser() {
  const localStorage = getService(LocalStorageService);
  localStorage.setItem("authentication", adminUser);
  await getService(AuthService).initAsync();
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
});

const theme = createTheme({
  palette: {},
  typography: {},
  components: {},
});
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContextProvider>
      <ChakraProvider>
        <React.StrictMode>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <AlertProvider>
                {children}
                <PolAlert />
              </AlertProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </React.StrictMode>
      </ChakraProvider>
    </AuthContextProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) => {
  const dom = render(ui, { wrapper: AllTheProviders, ...options });

  const getDropdownByTestId = async (testId: string) => {
    const container = await dom.getByTestId(testId);
    const dropdown = within(container).getByRole("combobox") as HTMLInputElement;

    const element = container.querySelector(`.input-focus-visible__single-value`) as HTMLElement;
    const text = element ? element.textContent : null;

    return { dropdown, value: text };
  };

  return { ...dom, getDropdownByTestId };
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
