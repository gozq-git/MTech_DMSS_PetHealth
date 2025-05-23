import {BaseApiClient, createApiClient} from "../api/client/createApiClient.ts";
import React, {createContext} from "react";
import {createPetApiClient, PetApi} from "../api/client/petApi.ts";
import {createUserApiClient, UserApi} from "../api/client/userApi.ts";
import {createMockPetApiClient} from "../api/client/mockPetApi.ts";
import { createAppointmentsApiClient, AppointmentsApi } from "../api/client/appointmentsApi.ts";
import { createAvailabilitiesApiClient, AvailabilitiesApi } from "../api/client/availabilitiesApi.ts";
import { createFeesApiClient, FeesApi } from "../api/client/feesApi.ts";
import {createNotificationApiClient, NotificationApi} from "../api/client/notificationApi.ts";
import {createPaymentApiClient, PaymentApi} from "../api/client/paymentApi.ts";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API
console.debug(`USE_MOCK_API: ${USE_MOCK_API}`);
// Base url
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001"
console.log(`API BASE URL: ${apiBaseUrl}`)

// API Client
const baseApiClient = createApiClient(apiBaseUrl);

// Interface
interface ApiClients {
    baseApi: BaseApiClient;
    userApi: UserApi;
    petApi: PetApi;
    appointmentsApi: AppointmentsApi;
    availabilitiesApi: AvailabilitiesApi;
    feesApi: FeesApi;
    notificationApi: NotificationApi;
    paymentApi: PaymentApi;
}

let apiClients: ApiClients;
if (USE_MOCK_API == "true") {
    // Using mock APIs
    console.log('Using mock API clients');
    // minimal base API client (might not be used in mock mode)
    const mockBaseClient = createApiClient("mock-base-url");
    apiClients = {
        baseApi: mockBaseClient,
        userApi: createUserApiClient(baseApiClient),
        petApi: createMockPetApiClient(),
        appointmentsApi: createAppointmentsApiClient(baseApiClient),
        availabilitiesApi: createAvailabilitiesApiClient(baseApiClient),
        feesApi: createFeesApiClient(baseApiClient),
        notificationApi: createNotificationApiClient(baseApiClient),
        paymentApi: createPaymentApiClient(baseApiClient)
    };
} else {
    // Using real APIs
    console.log('Using real API clients with base URL:', apiBaseUrl);
    // Create the real API client
    const baseApiClient = createApiClient(apiBaseUrl);
    apiClients = {
        baseApi: baseApiClient,
        userApi: createUserApiClient(baseApiClient),
        petApi: createPetApiClient(baseApiClient),
        appointmentsApi: createAppointmentsApiClient(baseApiClient),
        availabilitiesApi: createAvailabilitiesApiClient(baseApiClient),
        feesApi: createFeesApiClient(baseApiClient),
        notificationApi: createNotificationApiClient(baseApiClient),
        paymentApi: createPaymentApiClient(baseApiClient)
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