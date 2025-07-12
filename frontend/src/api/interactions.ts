import { Answer, Comment, AnswerUpvote, User } from "@/models/question";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response
            .json()
            .catch(() => ({ message: "Network error" }));
        throw new Error(
            errorData.message ||
                errorData.error ||
                `HTTP error! status: ${response.status}`
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

// Answer-related API calls
export const answersApi = {
    // Get answer detail by ID
    getAnswerDetail: async (answerId: string): Promise<Answer> => {
        const response = await fetch(`${API_BASE_URL}/answers/${answerId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return handleResponse<Answer>(response);
    },

    // Create new answer for a question
    createAnswer: async (
        questionId: string,
        answerDescription: string
    ): Promise<{ message: string; answer: Answer }> => {
        const response = await fetch(
            `${API_BASE_URL}/questions/${questionId}/answers/`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    answer_description: answerDescription,
                }),
            }
        );

        return handleResponse<{ message: string; answer: Answer }>(response);
    },

    // Update answer (only by author)
    updateAnswer: async (
        answerId: string,
        answerDescription: string
    ): Promise<{ message: string; answer: Answer }> => {
        const response = await fetch(
            `${API_BASE_URL}/answers/${answerId}/update/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    answer_description: answerDescription,
                }),
            }
        );

        return handleResponse<{ message: string; answer: Answer }>(response);
    },

    // Delete answer (only by author or admin)
    deleteAnswer: async (answerId: string): Promise<{ message: string }> => {
        const response = await fetch(
            `${API_BASE_URL}/answers/${answerId}/delete/`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            }
        );

        return handleResponse<{ message: string }>(response);
    },
};

// Comment-related API calls
export const commentsApi = {
    // Create new comment on an answer
    createComment: async (
        answerId: string,
        commentContent: string
    ): Promise<{ message: string; comment: Comment }> => {
        const response = await fetch(`${API_BASE_URL}/comment/add/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                answer_id: answerId,
                comment_content: commentContent,
            }),
        });

        return handleResponse<{ message: string; comment: Comment }>(response);
    },

    // Update comment (only by author)
    updateComment: async (
        commentId: string,
        commentContent: string
    ): Promise<{ message: string; comment: Comment }> => {
        const response = await fetch(
            `${API_BASE_URL}/comment/edit/${commentId}/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    comment_content: commentContent,
                }),
            }
        );

        return handleResponse<{ message: string; comment: Comment }>(response);
    },

    // Delete comment (only by author or admin)
    deleteComment: async (commentId: string): Promise<{ message: string }> => {
        const response = await fetch(
            `${API_BASE_URL}/comment/delete/${commentId}/`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            }
        );

        return handleResponse<{ message: string }>(response);
    },
};

// Upvote-related API calls
export const upvoteApi = {
    // Toggle upvote on question
    toggleQuestionUpvote: async (
        questionId: string
    ): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/upvote/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                question_id: questionId,
                vote: 1, // 1 for upvote, -1 for remove
            }),
        });

        return handleResponse<{ message: string }>(response);
    },

    // Toggle upvote on answer
    toggleAnswerUpvote: async (
        answerId: string
    ): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/upvote/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                answer_id: answerId,
                vote: 1, // 1 for upvote, -1 for remove
            }),
        });

        return handleResponse<{ message: string }>(response);
    },
};

// User profile management API calls
export const userProfileApi = {
    // Update user profile
    updateProfile: async (profileData: {
        username?: string;
        user_email?: string;
    }): Promise<{ message: string; user: User }> => {
        const response = await fetch(
            `${API_BASE_URL}/auth/user/profile/update/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(profileData),
            }
        );

        return handleResponse<{ message: string; user: User }>(response);
    },

    // Delete user account
    deleteAccount: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/user/delete/`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        return handleResponse<{ message: string }>(response);
    },
};
