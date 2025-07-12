// API query keys for React Query

export const queryKeys = {
    auth: {
        user: ["auth", "user"] as const,
        profile: (userId: string) => ["auth", "profile", userId] as const,
    },
    admin: {
        profile: ["admin", "profile"] as const,
        users: ["admin", "users"] as const,
    },
    questions: {
        all: ["questions"] as const,
        list: (filters?: Record<string, string | number | undefined>) =>
            ["questions", "list", filters] as const,
        detail: (id: string) => ["questions", "detail", id] as const,
        byUser: (userId: string) => ["questions", "byUser", userId] as const,
    },
    answers: {
        byQuestion: (questionId: string) =>
            ["answers", "byQuestion", questionId] as const,
        byUser: (userId: string) => ["answers", "byUser", userId] as const,
    },
    notifications: {
        all: ["notifications"] as const,
        list: (page?: number) => ["notifications", "list", page] as const,
        unreadCount: ["notifications", "unreadCount"] as const,
    },
    users: {
        all: ["users"] as const,
        list: ["users", "list"] as const,
        mentions: ["users", "mentions"] as const,
    },
} as const;
