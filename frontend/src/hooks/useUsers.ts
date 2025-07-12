import { useQuery } from "@tanstack/react-query";

interface User {
    id: string;
    username: string;
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

// API function to get users for mentions
const fetchUsers = async (): Promise<User[]> => {
    // For now, we'll create a simple endpoint to get users
    // In a real app, you might want to limit this or add search functionality
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

// Hook to get users for mention suggestions
export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        // For now, we'll return empty array if it fails
        // In production, you might want to handle this differently
        retry: false,
        meta: {
            errorMessage: "Failed to load users for mentions",
        },
    });
};
