import {BaseApiClient, createApiClient} from "../api/client/createApiClient.ts";
import React, {createContext} from "react";
import {createPetApiClient, PetApi} from "../api/client/petApi.ts";
import {createUserApiClient, UserApi} from "../api/client/userApi.ts";

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
const apiClients: ApiClients = {
    baseApi: baseApiClient,
    userApi: createUserApiClient(baseApiClient),
    petApi: createPetApiClient(baseApiClient)
};

// Context
export const ApiClientContext = createContext<ApiClients>(apiClients);

// Provider
export const ApiClientProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <ApiClientContext.Provider value={apiClients}>
            {children}
        </ApiClientContext.Provider>
    )
}
export default ApiClientProvider