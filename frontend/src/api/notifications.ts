export interface Notification {
    id: number;
    user: {
        id: number;
        username: string;
        user_email: string;
    };
    question?: {
        id: number;
        question_title: string;
        question_tag: string;
    };
    answer?: {
        id: number;
        answer_description: string;
    };
    mention_by: {
        id: number;
        username: string;
        user_email: string;
    };
    is_read: boolean;
    timestamp: string;
}

export interface NotificationsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
}

export interface UnreadCountResponse {
    unread_count: number;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response
            .json()
            .catch(() => ({ message: "Network error" }));
        throw new Error(
            errorData.message || errorData.error || `HTTP ${response.status}`
        );
    }
    return response.json();
}

// Helper function to get authorization headers
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// API functions for notifications
export const notificationsApi = {
    // Get all notifications with pagination
    getNotifications: async (
        page: number = 1
    ): Promise<NotificationsResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/notifications/?page=${page}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return handleResponse<NotificationsResponse>(response);
    },

    // Get unread notifications count
    getUnreadCount: async (): Promise<UnreadCountResponse> => {
        const response = await fetch(
            `${API_BASE_URL}/notifications/unread-count/`,
            {
                headers: getAuthHeaders(),
            }
        );
        return handleResponse<UnreadCountResponse>(response);
    },

    // Mark a specific notification as read
    markAsRead: async (notificationId: number): Promise<void> => {
        const response = await fetch(
            `${API_BASE_URL}/notifications/${notificationId}/read/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
            }
        );
        await handleResponse<void>(response);
    },

    // Mark all notifications as read
    markAllAsRead: async (): Promise<void> => {
        const response = await fetch(
            `${API_BASE_URL}/notifications/mark-all-read/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
            }
        );
        await handleResponse<void>(response);
    },

    // Delete a notification
    deleteNotification: async (notificationId: number): Promise<void> => {
        const response = await fetch(
            `${API_BASE_URL}/notifications/${notificationId}/delete/`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            }
        );
        await handleResponse<void>(response);
    },
};
