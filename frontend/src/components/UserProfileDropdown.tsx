import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Settings,
    LogOut,
    HelpCircle,
    MessageSquare,
    Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const UserProfileDropdown = () => {
    const { user, logout, isLogoutLoading } = useAuth();

    if (!user) return null;

    const handleLogout = () => {
        logout();
    };

    // Get initials for avatar fallback
    const getInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    };

    // Check if user is admin
    const isAdmin =
        localStorage.getItem("userType") === "admin" || user.isAdmin;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2 h-auto px-2 py-1"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {getInitials(user.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">
                            {user.username}
                        </span>
                        <Badge variant="outline" className="text-xs h-4 px-1">
                            {user.reputation.toLocaleString()}
                        </Badge>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs text-gray-500">
                            {user.email}
                        </span>
                        <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                                Reputation:
                            </span>
                            <Badge
                                variant="outline"
                                className="text-xs h-4 px-1"
                            >
                                {user.reputation.toLocaleString()}
                            </Badge>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        to="/profile"
                        className="flex items-center cursor-pointer"
                    >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to="/my-questions"
                        className="flex items-center cursor-pointer"
                    >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>My Questions</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        to="/my-answers"
                        className="flex items-center cursor-pointer"
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>My Answers</span>
                    </Link>
                </DropdownMenuItem>

                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center cursor-pointer text-blue-600"
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLogoutLoading}
                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                        {isLogoutLoading ? "Logging out..." : "Log Out"}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
