import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    Bell,
    User,
    Settings,
    Trash2,
    Save,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile, useDeleteAccount } from "@/hooks/useInteractions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { toast } from "sonner";

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const updateProfileMutation = useUpdateProfile();
    const deleteAccountMutation = useDeleteAccount();

    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.email.trim()) {
            toast.error("Username and email are required");
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                username: formData.username,
                user_email: formData.email,
            });
            setIsEditing(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccountMutation.mutateAsync();
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isAuthenticated || !user) {
        return (
            <ProtectedRoute>
                <div />
            </ProtectedRoute>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="text-2xl font-bold text-blue-600"
                            >
                                StackIt
                            </Link>
                        </div>

                        {/* Desktop User Actions */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    3
                                </span>
                            </div>
                            <UserProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.username}
                            </h1>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                    {user.reputation} reputation
                                </Badge>
                                <Badge variant="secondary">Member</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Tabs */}
                <Tabs defaultValue="settings" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="settings">
                            Account Settings
                        </TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="preferences">
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    {/* Account Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Account Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Profile Information
                                    </h3>
                                    {isEditing ? (
                                        <form
                                            onSubmit={handleUpdateProfile}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <Label htmlFor="username">
                                                    Username
                                                </Label>
                                                <Input
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your username"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        updateProfileMutation.isPending
                                                    }
                                                >
                                                    {updateProfileMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            username:
                                                                user?.username ||
                                                                "",
                                                            email:
                                                                user?.email ||
                                                                "",
                                                        });
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Username</Label>
                                                <p className="text-gray-900 font-medium">
                                                    {user.username}
                                                </p>
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <p className="text-gray-900 font-medium">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            >
                                                Edit Profile
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Danger Zone */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4 text-red-600">
                                        Danger Zone
                                    </h3>
                                    <Card className="border-red-200">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        Delete Account
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Permanently delete your
                                                        account and all
                                                        associated data. This
                                                        action cannot be undone.
                                                    </p>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Account
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you
                                                                absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete your
                                                                account and
                                                                remove all your
                                                                data from our
                                                                servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={
                                                                    handleDeleteAccount
                                                                }
                                                                className="bg-red-600 hover:bg-red-700"
                                                                disabled={
                                                                    deleteAccountMutation.isPending
                                                                }
                                                            >
                                                                {deleteAccountMutation.isPending ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    "Delete Account"
                                                                )}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Activity tracking coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Preferences settings coming soon...
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default UserProfile;
