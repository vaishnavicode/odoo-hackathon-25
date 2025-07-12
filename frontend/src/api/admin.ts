import {
    AuthResponse,
    LoginRequest,
    SignupRequest,
    User,
    BackendAdminLoginResponse,
    BackendAdminRegisterResponse,
    BackendAdminProfile,
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

export const adminApi = {
    // Admin login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/admin/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const data = await handleResponse<BackendAdminLoginResponse>(response);

        // Transform backend response to match frontend interface
        const authResponse: AuthResponse = {
            user: {
                id: data.admin.id.toString(),
                username: data.admin.username,
                email: data.admin.admin_email,
                reputation: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isAdmin: true,
            },
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
        };

        // Store tokens in localStorage with admin flag
        localStorage.setItem("accessToken", authResponse.accessToken);
        localStorage.setItem("refreshToken", authResponse.refreshToken);
        localStorage.setItem("user", JSON.stringify(authResponse.user));
        localStorage.setItem("userType", "admin");

        return authResponse;
    },

    // Admin registration
    register: async (adminData: SignupRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/admin/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: adminData.username,
                admin_email: adminData.email,
                password: adminData.password,
                password2: adminData.confirmPassword,
            }),
        });

        const data =
            await handleResponse<BackendAdminRegisterResponse>(response);

        // After registration, login to get tokens
        return await adminApi.login({
            email: adminData.email,
            password: adminData.password,
        });
    },

    // Get admin profile
    getProfile: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/admin/profile/`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const data = await handleResponse<BackendAdminProfile>(response);

        return {
            id: data.id.toString(),
            username: data.username,
            email: data.admin_email,
            reputation: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isAdmin: true,
        };
    },

    // Update admin profile
    updateProfile: async (profileData: {
        username?: string;
        admin_email?: string;
    }): Promise<{ message: string; admin: User }> => {
        const response = await fetch(
            `${API_BASE_URL}/auth/admin/profile/update/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(profileData),
            }
        );

        return handleResponse<{ message: string; admin: User }>(response);
    },

    // Delete admin account
    deleteAccount: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/admin/delete/`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        return handleResponse<{ message: string }>(response);
    },

    // Delete user by admin
    deleteUser: async (userId: number): Promise<{ message: string }> => {
        const response = await fetch(
            `${API_BASE_URL}/auth/admin/delete-user/${userId}/`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            }
        );

        return handleResponse<{ message: string }>(response);
    },

    // View user profile by admin
    viewUserProfile: async (userId: number): Promise<User> => {
        const response = await fetch(
            `${API_BASE_URL}/auth/admin/user/${userId}/`,
            {
                method: "GET",
                headers: getAuthHeaders(),
            }
        );

        const data = await handleResponse<BackendUserProfile>(response);

        return {
            id: data.id.toString(),
            username: data.username,
            email: data.user_email,
            reputation: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    // Update user profile by admin
    updateUserProfile: async (
        userId: number,
        profileData: {
            username?: string;
            user_email?: string;
        }
    ): Promise<{ message: string; user: User }> => {
        const response = await fetch(
            `${API_BASE_URL}/auth/admin/user/${userId}/update/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(profileData),
            }
        );

        return handleResponse<{ message: string; user: User }>(response);
    },
};
