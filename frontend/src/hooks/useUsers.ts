import { useQuery } from "@tanstack/react-query";

interface User {
    id: string;
    username: string;
}

interface UsersListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
        id: number;
        username: string;
        user_email: string;
    }>;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to get authorization headers
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

// API function to get users for mentions (simple list)
const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.map((user: { id: number; username: string }) => ({
        id: user.id.toString(),
        username: user.username,
    }));
};

// API function to get all users (for admin)
const fetchAllUsers = async (): Promise<UsersListResponse["results"]> => {
    const response = await fetch(`${API_BASE_URL}/questions/?page_size=1000`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch all users");
    }

    // Extract unique users from questions (since there's no dedicated users endpoint)
    const data = await response.json();
    const users: Record<string, UsersListResponse["results"][0]> = {};

    data.results?.forEach(
        (question: {
            user?: { id: number; username: string; user_email?: string };
        }) => {
            if (question.user) {
                users[question.user.id] = {
                    id: question.user.id,
                    username: question.user.username,
                    user_email: question.user.user_email || "",
                };
            }
        }
    );

    return Object.values(users);
};

// Hook to get users for mention suggestions
export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
        meta: {
            errorMessage: "Failed to load users for mentions",
        },
    });
};

// Hook to get all users (for admin dashboard)
export const useAllUsers = () => {
    return useQuery<UsersListResponse["results"]>({
        queryKey: ["users", "all"],
        queryFn: fetchAllUsers,
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: localStorage.getItem("userType") === "admin",
        meta: {
            errorMessage: "Failed to load users",
        },
    });
};
