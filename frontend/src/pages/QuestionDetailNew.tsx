import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    ArrowUp,
    ArrowDown,
    MessageSquare,
    Eye,
    User,
    Check,
    Bell,
    Search,
    Plus,
    Menu,
    Loader2,
    Edit,
    Trash2,
    Send,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuestionDetail } from "@/hooks/useQuestions";
import {
    useCreateAnswer,
    useCreateComment,
    useUpdateAnswer,
    useUpdateComment,
    useDeleteAnswer,
    useDeleteComment,
    useToggleQuestionUpvote,
    useToggleAnswerUpvote,
} from "@/hooks/useInteractions";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { toast } from "sonner";
import MarkdownPreview from "../components/ui/MarkdownPreview";

const QuestionDetailNew = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated, user } = useAuth();
    const {
        data: questionData,
        isLoading,
        error,
    } = useQuestionDetail(id || "");

    // Mutations
    const createAnswerMutation = useCreateAnswer();
    const createCommentMutation = useCreateComment();
    const updateAnswerMutation = useUpdateAnswer();
    const updateCommentMutation = useUpdateComment();
    const deleteAnswerMutation = useDeleteAnswer();
    const deleteCommentMutation = useDeleteComment();
    const toggleQuestionUpvoteMutation = useToggleQuestionUpvote();
    const toggleAnswerUpvoteMutation = useToggleAnswerUpvote();

    // Form states
    const [newAnswer, setNewAnswer] = useState("");
    const [newComments, setNewComments] = useState<Record<string, string>>({});
    const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editingAnswerText, setEditingAnswerText] = useState("");
    const [editingCommentText, setEditingCommentText] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !questionData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <h2 className="text-xl font-semibold mb-2">
                            Question Not Found
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {error?.message ||
                                "The question you're looking for doesn't exist."}
                        </p>
                        <Button asChild>
                            <Link to="/">Back to Questions</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleUpvoteQuestion = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to vote");
            return;
        }
        try {
            await toggleQuestionUpvoteMutation.mutateAsync(id!);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleUpvoteAnswer = async (answerId: string) => {
        if (!isAuthenticated) {
            toast.error("Please log in to vote");
            return;
        }
        try {
            await toggleAnswerUpvoteMutation.mutateAsync(answerId);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleSubmitAnswer = async () => {
        if (!newAnswer.trim()) {
            toast.error("Please enter your answer");
            return;
        }

        if (!isAuthenticated) {
            toast.error("Please log in to answer");
            return;
        }

        try {
            await createAnswerMutation.mutateAsync({
                questionId: id!,
                answerDescription: newAnswer,
            });
            setNewAnswer("");
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleSubmitComment = async (answerId: string) => {
        const commentText = newComments[answerId];
        if (!commentText?.trim()) {
            toast.error("Please enter your comment");
            return;
        }

        if (!isAuthenticated) {
            toast.error("Please log in to comment");
            return;
        }

        try {
            await createCommentMutation.mutateAsync({
                answerId,
                commentContent: commentText,
            });
            setNewComments((prev) => ({ ...prev, [answerId]: "" }));
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleStartEditingAnswer = (
        answerId: string,
        currentText: string
    ) => {
        setEditingAnswer(answerId);
        setEditingAnswerText(currentText);
    };

    const handleUpdateAnswer = async () => {
        if (!editingAnswer || !editingAnswerText.trim()) return;

        try {
            await updateAnswerMutation.mutateAsync({
                answerId: editingAnswer,
                answerDescription: editingAnswerText,
            });
            setEditingAnswer(null);
            setEditingAnswerText("");
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const handleDeleteAnswer = async (answerId: string) => {
        try {
            await deleteAnswerMutation.mutateAsync(answerId);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    const getUserVoteStatus = (upvotes: Array<{ by_user: { id: number } }>) => {
        if (!user) return false;
        return upvotes.some(
            (upvote) => upvote.by_user.id === parseInt(user.id)
        );
    };

    const getTotalVotes = (upvotes: Array<{ upvote_count: number }>) => {
        return upvotes.reduce(
            (total, upvote) => total + upvote.upvote_count,
            0
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="text-2xl font-bold text-blue-600"
                            >
                                StackIt
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to="/ask">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Ask Question
                                        </Link>
                                    </Button>
                                    <div className="relative">
                                        <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            3
                                        </span>
                                    </div>
                                    <UserProfileDropdown />
                                </>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost">Log In</Button>
                                    <Button>Sign Up</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Question Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    {questionData.question_title}
                                </h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                    <span>
                                        Asked by{" "}
                                        <span className="font-medium text-blue-600">
                                            {questionData.user.username}
                                        </span>
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {questionData.answers.length} answers
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {getTotalVotes(questionData.upvotes)}{" "}
                                        votes
                                    </span>
                                </div>
                                <Badge variant="secondary" className="mb-4">
                                    {questionData.question_tag}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4">
                            {/* Voting Section */}
                            <div className="flex flex-col items-center space-y-2">
                                <Button
                                    variant={
                                        getUserVoteStatus(questionData.upvotes)
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={handleUpvoteQuestion}
                                    disabled={
                                        toggleQuestionUpvoteMutation.isPending
                                    }
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <span className="text-lg font-semibold">
                                    {getTotalVotes(questionData.upvotes)}
                                </span>
                            </div>

                            {/* Question Content */}
                            <div className="flex-1">
                                <div className="prose max-w-none">
                                    <MarkdownPreview>
                                        {questionData.question_description}
                                    </MarkdownPreview>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Answers Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {questionData.answers.length} Answer
                        {questionData.answers.length !== 1 ? "s" : ""}
                    </h2>

                    <div className="space-y-6">
                        {questionData.answers.map((answer) => (
                            <Card key={answer.id}>
                                <CardContent className="pt-6">
                                    <div className="flex space-x-4">
                                        {/* Answer Voting */}
                                        <div className="flex flex-col items-center space-y-2">
                                            <Button
                                                variant={
                                                    getUserVoteStatus(
                                                        answer.upvotes
                                                    )
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    handleUpvoteAnswer(
                                                        answer.id.toString()
                                                    )
                                                }
                                                disabled={
                                                    toggleAnswerUpvoteMutation.isPending
                                                }
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <span className="text-lg font-semibold">
                                                {getTotalVotes(answer.upvotes)}
                                            </span>
                                            <Check className="h-5 w-5 text-green-600" />
                                        </div>

                                        {/* Answer Content */}
                                        <div className="flex-1">
                                            {editingAnswer ===
                                            answer.id.toString() ? (
                                                <div className="space-y-4">
                                                    <Textarea
                                                        value={
                                                            editingAnswerText
                                                        }
                                                        onChange={(e) =>
                                                            setEditingAnswerText(
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={6}
                                                        placeholder="Edit your answer..."
                                                    />
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            onClick={
                                                                handleUpdateAnswer
                                                            }
                                                            disabled={
                                                                updateAnswerMutation.isPending
                                                            }
                                                        >
                                                            {updateAnswerMutation.isPending ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                "Update Answer"
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingAnswer(
                                                                    null
                                                                );
                                                                setEditingAnswerText(
                                                                    ""
                                                                );
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="prose max-w-none mb-4">
                                                        <MarkdownPreview>
                                                            {
                                                                answer.answer_description
                                                            }
                                                        </MarkdownPreview>
                                                    </div>

                                                    {/* Answer Actions */}
                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            {user &&
                                                                user.id ===
                                                                    answer.user.id.toString() && (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleStartEditingAnswer(
                                                                                    answer.id.toString(),
                                                                                    answer.answer_description
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit className="h-4 w-4 mr-1" />
                                                                            Edit
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-red-600 hover:text-red-700"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                                                    Delete
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        Delete
                                                                                        Answer
                                                                                    </AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        Are
                                                                                        you
                                                                                        sure
                                                                                        you
                                                                                        want
                                                                                        to
                                                                                        delete
                                                                                        this
                                                                                        answer?
                                                                                        This
                                                                                        action
                                                                                        cannot
                                                                                        be
                                                                                        undone.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>
                                                                                        Cancel
                                                                                    </AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() =>
                                                                                            handleDeleteAnswer(
                                                                                                answer.id.toString()
                                                                                            )
                                                                                        }
                                                                                        className="bg-red-600 hover:bg-red-700"
                                                                                    >
                                                                                        Delete
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </>
                                                                )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span>
                                                                answered by
                                                            </span>
                                                            <span className="font-medium text-blue-600">
                                                                {
                                                                    answer.user
                                                                        .username
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Comments Section */}
                                                    {answer.comments.length >
                                                        0 && (
                                                        <div className="ml-8 pt-4 border-t border-gray-200">
                                                            <div className="space-y-3">
                                                                {answer.comments.map(
                                                                    (
                                                                        comment
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                comment.id
                                                                            }
                                                                            className="bg-gray-50 p-3 rounded text-sm"
                                                                        >
                                                                            <p className="text-gray-700 mb-2">
                                                                                {
                                                                                    comment.comment_content
                                                                                }
                                                                            </p>
                                                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                                                <span>
                                                                                    by{" "}
                                                                                    <span className="font-medium text-blue-600">
                                                                                        {
                                                                                            comment
                                                                                                .user
                                                                                                .username
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                                {user &&
                                                                                    user.id ===
                                                                                        comment.user.id.toString() && (
                                                                                        <div className="flex space-x-2">
                                                                                            <button className="hover:text-gray-700">
                                                                                                Edit
                                                                                            </button>
                                                                                            <button className="hover:text-red-600">
                                                                                                Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Add Comment Form */}
                                                    {isAuthenticated && (
                                                        <div className="ml-8 pt-4 border-t border-gray-200">
                                                            <div className="flex space-x-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Add a comment..."
                                                                    value={
                                                                        newComments[
                                                                            answer.id.toString()
                                                                        ] || ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setNewComments(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [answer.id.toString()]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleSubmitComment(
                                                                            answer.id.toString()
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        createCommentMutation.isPending
                                                                    }
                                                                >
                                                                    <Send className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Add Your Answer Section */}
                {isAuthenticated ? (
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">
                                Your Answer
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="answer">Answer</Label>
                                    <Textarea
                                        id="answer"
                                        placeholder="Share your knowledge and help others..."
                                        value={newAnswer}
                                        onChange={(e) =>
                                            setNewAnswer(e.target.value)
                                        }
                                        rows={8}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitAnswer}
                                        disabled={
                                            !newAnswer.trim() ||
                                            createAnswerMutation.isPending
                                        }
                                    >
                                        {createAnswerMutation.isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            "Post Your Answer"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Want to answer?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Please log in to post an answer.
                            </p>
                            <Button>Log In</Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default QuestionDetailNew;
