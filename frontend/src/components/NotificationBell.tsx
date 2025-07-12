import { useState } from "react";
import {
    Bell,
    BellRing,
    X,
    CheckCheck,
    Trash2,
    MessageSquare,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
    useNotifications,
    useUnreadNotificationsCount,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead,
    useDeleteNotification,
} from "@/hooks/useNotifications";
import { Notification } from "@/api/notifications";

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: unreadCount } = useUnreadNotificationsCount();
    const { data: notifications, isLoading } = useNotifications(currentPage);
    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const deleteNotificationMutation = useDeleteNotification();

    const handleMarkAsRead = async (notificationId: number) => {
        await markAsReadMutation.mutateAsync(notificationId);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsReadMutation.mutateAsync();
    };

    const handleDeleteNotification = async (notificationId: number) => {
        await deleteNotificationMutation.mutateAsync(notificationId);
    };

    const getNotificationIcon = (notification: Notification) => {
        if (notification.answer) {
            return <MessageSquare className="h-4 w-4 text-blue-500" />;
        }
        return <User className="h-4 w-4 text-green-500" />;
    };

    const getNotificationText = (notification: Notification) => {
        if (notification.answer) {
            if (
                notification.answer.answer_description.includes(
                    `@${notification.user.username}`
                )
            ) {
                return `${notification.mention_by.username} mentioned you in an answer`;
            }
            return `${notification.mention_by.username} answered your question`;
        }

        if (notification.question) {
            return `${notification.mention_by.username} mentioned you in a question`;
        }

        return `${notification.mention_by.username} mentioned you`;
    };

    const getNotificationLink = (notification: Notification) => {
        if (notification.question) {
            return `/questions/${notification.question.id}`;
        }
        return "#";
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    {unreadCount?.unread_count ? (
                        <BellRing className="h-5 w-5" />
                    ) : (
                        <Bell className="h-5 w-5" />
                    )}
                    {unreadCount?.unread_count ? (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount.unread_count > 99
                                ? "99+"
                                : unreadCount.unread_count}
                        </Badge>
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                                Notifications
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                {unreadCount?.unread_count ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        disabled={
                                            markAllAsReadMutation.isPending
                                        }
                                    >
                                        <CheckCheck className="h-4 w-4 mr-1" />
                                        Mark all read
                                    </Button>
                                ) : null}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <ScrollArea className="h-96">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-gray-500">
                                        Loading notifications...
                                    </div>
                                </div>
                            ) : notifications?.results.length ? (
                                <div className="divide-y">
                                    {notifications.results.map(
                                        (notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 transition-colors ${
                                                    !notification.is_read
                                                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {getNotificationIcon(
                                                            notification
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            to={getNotificationLink(
                                                                notification
                                                            )}
                                                            onClick={() => {
                                                                setIsOpen(
                                                                    false
                                                                );
                                                                if (
                                                                    !notification.is_read
                                                                ) {
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    );
                                                                }
                                                            }}
                                                            className="block group"
                                                        >
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                                                {getNotificationText(
                                                                    notification
                                                                )}
                                                            </p>
                                                            {notification.question && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                    "
                                                                    {
                                                                        notification
                                                                            .question
                                                                            .question_title
                                                                    }
                                                                    "
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatTimestamp(
                                                                    notification.timestamp
                                                                )}
                                                            </p>
                                                        </Link>
                                                    </div>
                                                    <div className="flex-shrink-0 flex items-center space-x-1">
                                                        {!notification.is_read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <CheckCheck className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Delete
                                                                        Notification
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete
                                                                        this
                                                                        notification?
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDeleteNotification(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                                        No notifications
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        You'll see notifications here when
                                        someone interacts with your content.
                                    </p>
                                </div>
                            )}
                        </ScrollArea>
                        {notifications?.next && (
                            <div className="p-4 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    className="w-full"
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
