import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/api/questions";
import { queryKeys } from "@/api/queryKeys";
import { CreateQuestionRequest, QuestionFilters } from "@/models/question";
import { toast } from "sonner";

// Hook for fetching questions list
export const useQuestions = (filters?: QuestionFilters) => {
    return useQuery({
        queryKey: queryKeys.questions.list(
            filters as Record<string, string | number | undefined>
        ),
        queryFn: () => questionsApi.getQuestions(filters),
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook for fetching question detail
export const useQuestionDetail = (questionId: string) => {
    return useQuery({
        queryKey: queryKeys.questions.detail(questionId),
        queryFn: () => questionsApi.getQuestionDetail(questionId),
        enabled: !!questionId,
        staleTime: 60 * 1000, // 1 minute
    });
};

// Hook for creating questions
export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: questionsApi.createQuestion,
        onSuccess: (data) => {
            // Invalidate questions list to refetch with new question
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Question posted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to post question");
        },
    });
};

// Hook for updating questions
export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            questionId,
            data,
        }: {
            questionId: string;
            data: Partial<CreateQuestionRequest>;
        }) => questionsApi.updateQuestion(questionId, data),
        onSuccess: (data, variables) => {
            // Invalidate both list and detail queries
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.detail(variables.questionId),
            });
            toast.success("Question updated successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update question");
        },
    });
};

// Hook for deleting questions
export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: questionsApi.deleteQuestion,
        onSuccess: () => {
            // Invalidate questions list to remove deleted question
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Question deleted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete question");
        },
    });
};
