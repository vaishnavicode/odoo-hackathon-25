import {
    AuthResponse,
    LoginRequest,
    SignupRequest,
    User,
    BackendLoginResponse,
    BackendRegisterResponse,
    BackendUserProfile,
} from "@/models/auth";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response
            .json()
            .catch(() => ({ message: "Network error" }));
        throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
        );
    }
    return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export const authApi = {
    // Login user
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/user/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const data = await handleResponse<BackendLoginResponse>(response);

        // Transform backend response to match frontend interface
        const authResponse: AuthResponse = {
            user: {
                id: data.user.id.toString(),
                username: data.user.username,
                email: data.user.user_email,
                reputation: 0, // Default value as backend doesn't provide this
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
        };

        // Store tokens in localStorage
        localStorage.setItem("accessToken", authResponse.accessToken);
        localStorage.setItem("refreshToken", authResponse.refreshToken);
        localStorage.setItem("user", JSON.stringify(authResponse.user));

        return authResponse;
    },

    // Register new user
    signup: async (userData: SignupRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/user/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userData.username,
                user_email: userData.email,
                password: userData.password,
                password2: userData.confirmPassword,
            }),
        });

        const data = await handleResponse<BackendRegisterResponse>(response);

        // After registration, login to get tokens
        return await authApi.login({
            email: userData.email,
            password: userData.password,
        });
    },

    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/user/profile/`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await handleResponse<BackendUserProfile>(response);

        return {
            id: data.id.toString(),
            username: data.username,
            email: data.user_email,
            reputation: 0, // Default value as backend doesn't provide this
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    // Logout user
    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout/`, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
            } catch (error) {
                // Even if logout fails on server, clear local storage
                console.error("Logout error:", error);
            }
        }

        // Clear local storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    // Refresh access token
    refreshToken: async (): Promise<{ accessToken: string }> => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        const data = await handleResponse<{ access: string }>(response);

        // Update access token in localStorage
        localStorage.setItem("accessToken", data.access);

        return { accessToken: data.access };
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        return !!(token && user);
    },

    // Get stored user data
    getStoredUser: (): User | null => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    },
};
