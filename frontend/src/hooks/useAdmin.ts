import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
import { LoginRequest, SignupRequest, AuthResponse, User } from "@/models/auth";
import { queryKeys } from "@/api/queryKeys";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAdminAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Admin login mutation
    const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: adminApi.login,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.user, data.user);
            toast.success("Admin login successful!");
            navigate("/admin/dashboard");
        },
        onError: (error) => {
            toast.error(error.message || "Login failed");
        },
    });

    // Admin register mutation
    const registerMutation = useMutation<AuthResponse, Error, SignupRequest>({
        mutationFn: adminApi.register,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.user, data.user);
            toast.success("Admin registration successful!");
            navigate("/admin/dashboard");
        },
        onError: (error) => {
            toast.error(error.message || "Registration failed");
        },
    });

    // Get admin profile
    const profileQuery = useQuery<User>({
        queryKey: queryKeys.auth.user,
        queryFn: adminApi.getProfile,
        enabled: !!localStorage.getItem("accessToken") && localStorage.getItem("userType") === "admin",
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update admin profile mutation
    const updateProfileMutation = useMutation<
        { message: string; admin: User },
        Error,
        { username?: string; admin_email?: string }
    >({
        mutationFn: adminApi.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.user, data.admin);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
            toast.success("Profile updated successfully!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });

    // Delete admin account mutation
    const deleteAccountMutation = useMutation<{ message: string }, Error>({
        mutationFn: adminApi.deleteAccount,
        onSuccess: () => {
            queryClient.clear();
            localStorage.clear();
            toast.success("Account deleted successfully");
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete account");
        },
    });

    // Delete user by admin mutation
    const deleteUserMutation = useMutation<
        { message: string },
        Error,
        number
    >({
        mutationFn: adminApi.deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully");
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete user");
        },
    });

    const isAdmin = () => {
        return localStorage.getItem("userType") === "admin";
    };

    return {
        // Queries
        profile: profileQuery.data,
        isLoadingProfile: profileQuery.isLoading,
        profileError: profileQuery.error,

        // Mutations
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        updateProfile: updateProfileMutation.mutate,
        isUpdatingProfile: updateProfileMutation.isPending,
        updateProfileError: updateProfileMutation.error,

        deleteAccount: deleteAccountMutation.mutate,
        isDeletingAccount: deleteAccountMutation.isPending,
        deleteAccountError: deleteAccountMutation.error,

        deleteUser: deleteUserMutation.mutate,
        isDeletingUser: deleteUserMutation.isPending,
        deleteUserError: deleteUserMutation.error,

        // Utilities
        isAdmin,
    };
};
