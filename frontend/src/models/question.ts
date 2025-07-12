// Question related types and interfaces

export interface User {
    id: number;
    username: string;
    user_email: string;
}

export interface Question {
    id: number;
    question_title: string;
    question_description: string;
    question_tag: string;
    user: string; // username from backend
    upvotes: number;
    answer_count: number;
}

export interface QuestionDetail {
    id: number;
    user: User;
    question_title: string;
    question_description: string;
    question_tag: string;
    answers: Answer[];
    upvotes: QuestionUpvote[];
}

export interface Answer {
    id: number;
    user: User;
    answer_description: string;
    comments: Comment[];
    upvotes: AnswerUpvote[];
}

export interface Comment {
    id: number;
    user: User;
    comment_content: string;
}

export interface QuestionUpvote {
    id: number;
    upvote_count: number;
    by_user: User;
}

export interface AnswerUpvote {
    id: number;
    upvote_count: number;
    by_user: User;
}

export interface CreateQuestionRequest {
    question_title: string;
    question_description: string;
    question_tag: string;
}

export interface CreateQuestionResponse {
    message: string;
    question_id: number;
    question: CreateQuestionRequest;
}

// Frontend types for UI
export interface QuestionListItem {
    id: number;
    title: string;
    description: string;
    author: string;
    authorReputation: number;
    tags: string[];
    votes: number;
    answers: number;
    views: number;
    timeAgo: string;
    createdAt: Date;
    isAccepted?: boolean;
}

export interface QuestionFilters {
    search?: string;
    tag?: string;
    user?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
