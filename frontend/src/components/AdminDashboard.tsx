import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdmin";
import { useAllUsers } from "@/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, BarChart3, MessageSquare } from "lucide-react";
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
import { toast } from "sonner";

export const AdminDashboard: React.FC = () => {
    const { deleteUser, isDeletingUser } = useAdminAuth();
    const { data: users = [], isLoading, error } = useAllUsers();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleDeleteUser = (userId: number) => {
        deleteUser(userId);
        setSelectedUserId(null);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">Loading admin dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-red-600">
                    Error loading dashboard: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Badge variant="secondary" className="text-sm">
                    Admin Panel
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active platform users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">
                            System status
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Moderated</div>
                        <p className="text-xs text-muted-foreground">
                            Content management
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Users Management */}
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No users found
                            </p>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{user.username}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {user.user_email}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">User</Badge>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedUserId(user.id)}
                                                    disabled={isDeletingUser}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete User
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete the user "{user.username}"? 
                                                        This action cannot be undone and will remove all their data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setSelectedUserId(null)}>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete User
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
