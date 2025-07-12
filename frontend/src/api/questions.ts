import {
    Question,
    QuestionDetail,
    CreateQuestionRequest,
    CreateQuestionResponse,
    QuestionFilters,
    PaginatedResponse,
} from "@/models/question";

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

export const questionsApi = {
    // Get list of questions with pagination and filters
    getQuestions: async (
        filters?: QuestionFilters
    ): Promise<PaginatedResponse<Question>> => {
        const params = new URLSearchParams();

        if (filters?.search) {
            params.append("search", filters.search);
        }
        if (filters?.tag) {
            params.append("question_tag", filters.tag);
        }
        if (filters?.user) {
            params.append("user", filters.user);
        }
        if (filters?.ordering) {
            params.append("ordering", filters.ordering);
        }
        if (filters?.page) {
            params.append("page", filters.page.toString());
        }
        if (filters?.page_size) {
            params.append("page_size", filters.page_size.toString());
        }

        const queryString = params.toString();
        const url = `${API_BASE_URL}/questions/${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return handleResponse<PaginatedResponse<Question>>(response);
    },

    // Get question detail by ID
    getQuestionDetail: async (questionId: string): Promise<QuestionDetail> => {
        const response = await fetch(
            `${API_BASE_URL}/questions/${questionId}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return handleResponse<QuestionDetail>(response);
    },

    // Create new question (authenticated users only)
    createQuestion: async (
        questionData: CreateQuestionRequest
    ): Promise<CreateQuestionResponse> => {
        const response = await fetch(`${API_BASE_URL}/questions/ask/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(questionData),
        });

        return handleResponse<CreateQuestionResponse>(response);
    },

    // Update question (only by author)
    updateQuestion: async (
        questionId: string,
        questionData: Partial<CreateQuestionRequest>
    ): Promise<{ message: string; question: CreateQuestionRequest }> => {
        const response = await fetch(
            `${API_BASE_URL}/questions/${questionId}/update/`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(questionData),
            }
        );

        return handleResponse<{
            message: string;
            question: CreateQuestionRequest;
        }>(response);
    },

    // Delete question (only by author or admin)
    deleteQuestion: async (
        questionId: string
    ): Promise<{ message: string }> => {
        const response = await fetch(
            `${API_BASE_URL}/questions/${questionId}/delete/`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            }
        );

        return handleResponse<{ message: string }>(response);
    },
};
