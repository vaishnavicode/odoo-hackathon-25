import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    answersApi,
    commentsApi,
    upvoteApi,
    userProfileApi,
} from "@/api/interactions";
import { queryKeys } from "@/api/queryKeys";
import { toast } from "sonner";

// Hook for creating answers
export const useCreateAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            questionId,
            answerDescription,
        }: {
            questionId: string;
            answerDescription: string;
        }) => answersApi.createAnswer(questionId, answerDescription),
        onSuccess: (data, variables) => {
            // Invalidate question detail to show new answer
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.detail(variables.questionId),
            });
            toast.success("Answer posted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to post answer");
        },
    });
};

// Hook for updating answers
export const useUpdateAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            answerId,
            answerDescription,
        }: {
            answerId: string;
            answerDescription: string;
        }) => answersApi.updateAnswer(answerId, answerDescription),
        onSuccess: () => {
            // Invalidate all question details since answer is part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Answer updated successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update answer");
        },
    });
};

// Hook for deleting answers
export const useDeleteAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: answersApi.deleteAnswer,
        onSuccess: () => {
            // Invalidate all question details since answer is part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Answer deleted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete answer");
        },
    });
};

// Hook for creating comments
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            answerId,
            commentContent,
        }: {
            answerId: string;
            commentContent: string;
        }) => commentsApi.createComment(answerId, commentContent),
        onSuccess: () => {
            // Invalidate all question details since comments are part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Comment posted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to post comment");
        },
    });
};

// Hook for updating comments
export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            commentId,
            commentContent,
        }: {
            commentId: string;
            commentContent: string;
        }) => commentsApi.updateComment(commentId, commentContent),
        onSuccess: () => {
            // Invalidate all question details since comments are part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Comment updated successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update comment");
        },
    });
};

// Hook for deleting comments
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentsApi.deleteComment,
        onSuccess: () => {
            // Invalidate all question details since comments are part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success("Comment deleted successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete comment");
        },
    });
};

// Hook for toggling question upvotes
export const useToggleQuestionUpvote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upvoteApi.toggleQuestionUpvote,
        onSuccess: (data, questionId) => {
            // Invalidate both list and detail queries to update vote counts
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.detail(questionId),
            });
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update vote");
        },
    });
};

// Hook for toggling answer upvotes
export const useToggleAnswerUpvote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upvoteApi.toggleAnswerUpvote,
        onSuccess: (data) => {
            // Invalidate all question details since answer votes are part of question data
            queryClient.invalidateQueries({
                queryKey: queryKeys.questions.all,
            });
            toast.success(data.message);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update vote");
        },
    });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userProfileApi.updateProfile,
        onSuccess: (data) => {
            // Update user data in cache
            queryClient.setQueryData(queryKeys.auth.user, data.user);
            // Also update localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Profile updated successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });
};

// Hook for deleting user account
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userProfileApi.deleteAccount,
        onSuccess: () => {
            // Clear all data and redirect to home
            queryClient.clear();
            localStorage.clear();
            toast.success("Account deleted successfully");
            window.location.href = "/";
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete account");
        },
    });
};
