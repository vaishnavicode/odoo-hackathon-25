import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    notificationsApi,
    NotificationsResponse,
    UnreadCountResponse,
} from "@/api/notifications";
import { queryKeys } from "@/api/queryKeys";
import { toast } from "sonner";

// Hook for getting notifications with pagination
export const useNotifications = (page: number = 1) => {
    return useQuery<NotificationsResponse>({
        queryKey: queryKeys.notifications.list(page),
        queryFn: () => notificationsApi.getNotifications(page),
        staleTime: 30000, // 30 seconds
    });
};

// Hook for getting unread notifications count
export const useUnreadNotificationsCount = () => {
    return useQuery<UnreadCountResponse>({
        queryKey: queryKeys.notifications.unreadCount,
        queryFn: notificationsApi.getUnreadCount,
        staleTime: 10000, // 10 seconds
        refetchInterval: 30000, // Refetch every 30 seconds
    });
};

// Hook for marking a notification as read
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsApi.markAsRead,
        onSuccess: () => {
            // Invalidate notifications list and unread count
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.unreadCount,
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to mark notification as read");
        },
    });
};

// Hook for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: () => {
            // Invalidate notifications list and unread count
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.unreadCount,
            });
            toast.success("All notifications marked as read");
        },
        onError: (error: Error) => {
            toast.error(
                error.message || "Failed to mark all notifications as read"
            );
        },
    });
};

// Hook for deleting a notification
export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationsApi.deleteNotification,
        onSuccess: () => {
            // Invalidate notifications list and unread count
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.notifications.unreadCount,
            });
            toast.success("Notification deleted");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete notification");
        },
    });
};
