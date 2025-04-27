import {BaseApiClient} from "./createApiClient.ts";

type NotificationApiResponse = {
    success: boolean;
    message: string;
};

type SendNotificationMessage = {
    to: string;
    subject: string;
    message: string;
    engines: string[];
}

type BroadcastMessage = {
    recipients: string[];
    subject: string;
    message: string;
    engines: string[];
}

export interface NotificationApi {
    sendNotification: (message: SendNotificationMessage) => Promise<NotificationApiResponse>;
    broadcast: (broadcastMessage: BroadcastMessage) => Promise<NotificationApiResponse>;
}

export const createNotificationApiClient = (baseClient: BaseApiClient): NotificationApi => {
    return {
        sendNotification: async (notificationMessage) => {
            try {
                return await baseClient.post<NotificationApiResponse>(`/api/notifications/sendNotification`, notificationMessage)
            } catch (error) {
                console.error(`Error sending notification:`, error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred while sending notification',
                }
            }
        },
        broadcast: async (broadcastMessage): Promise<NotificationApiResponse> => {
            try {
                return await baseClient.post<NotificationApiResponse>(`/api/notifications/broadcast`, broadcastMessage);
            } catch (error) {
                console.error(`Error broadcasting message:`, error);
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred while sending broadcast',
                }
            }
        },

    };
};