import {BaseApiClient, createApiClient} from "../api/client/createApiClient.ts";
import React, {createContext} from "react";
import {createPetApiClient, PetApi} from "../api/client/petApi.ts";
import {createUserApiClient, UserApi} from "../api/client/userApi.ts";
import {createMockPetApiClient} from "../api/client/mockPetApi.ts";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_AP
console.debug(`USE_MOCK_API: ${USE_MOCK_API}`);
// Base url
const apiBaseUrl = "http://localhost:8001";

// API Client
const baseApiClient = createApiClient(apiBaseUrl);

// Interface
interface ApiClients {
    baseApi: BaseApiClient;
    userApi: UserApi;
    petApi: PetApi;
}

let apiClients: ApiClients;
if (USE_MOCK_API === undefined || USE_MOCK_API == "true") {
    // Using mock APIs
    console.log('Using mock API clients');
    // minimal base API client (might not be used in mock mode)
    const mockBaseClient = createApiClient("mock-base-url");
    apiClients = {
        baseApi: mockBaseClient,
        userApi: createUserApiClient(baseApiClient),
        petApi: createMockPetApiClient()
    };
} else {
    // Using real APIs
    console.log('Using real API clients with base URL:', apiBaseUrl);
    // Create the real API client
    const baseApiClient = createApiClient(apiBaseUrl);
    apiClients = {
        baseApi: baseApiClient,
        userApi: createUserApiClient(baseApiClient),
        petApi: createPetApiClient(baseApiClient)
    };
}

// Context
export const ApiClientContext = createContext<ApiClients>(apiClients);

// Provider
export const ApiClientProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <ApiClientContext.Provider value={apiClients}>
            {children}
        </ApiClientContext.Provider>
    )
}
export default ApiClientProvider