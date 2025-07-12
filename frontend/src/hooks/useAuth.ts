import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { queryKeys } from "@/api/queryKeys";
import { LoginRequest, SignupRequest, User } from "@/models/auth";
import { toast } from "sonner";

// Hook for authentication state
export const useAuth = () => {
    const queryClient = useQueryClient();

    // Get current user query
    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: queryKeys.auth.user,
        queryFn: authApi.getCurrentUser,
        enabled: authApi.isAuthenticated(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.user, data.user);
            toast.success("Successfully logged in!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Login failed");
        },
    });

    // Signup mutation
    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.user, data.user);
            toast.success("Account created successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Signup failed");
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success("Successfully logged out");
        },
        onError: (error: Error) => {
            // Even if logout fails, clear local data
            queryClient.clear();
            toast.error(error.message || "Logout failed");
        },
    });

    const login = (credentials: LoginRequest) => {
        return loginMutation.mutateAsync(credentials);
    };

    const signup = (userData: SignupRequest) => {
        return signupMutation.mutateAsync(userData);
    };

    const logout = () => {
        return logoutMutation.mutateAsync();
    };

    const isAuthenticated = authApi.isAuthenticated() && !isError;
    const storedUser = authApi.getStoredUser();

    return {
        user: user || storedUser,
        isLoading: isLoading && authApi.isAuthenticated(),
        isAuthenticated,
        login,
        signup,
        logout,
        isLoginLoading: loginMutation.isPending,
        isSignupLoading: signupMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
    };
};
