import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichEditor } from "@/components/ui/RichEditor";
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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuestionDetail } from "@/hooks/useQuestions";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import MarkdownPreview from "../components/ui/MarkdownPreview";

const QuestionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated, user } = useAuth();
    const {
        data: questionData,
        isLoading,
        error,
    } = useQuestionDetail(id || "");
    const [newAnswer, setNewAnswer] = useState("");

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

    const upvoteQuestion = () => {
        if (!isAuthenticated) {
            alert("Please log in to vote");
            return;
        }
        // TODO: Implement upvote API call
    };

    const submitAnswer = () => {
        if (!newAnswer.trim()) return;
        if (!isAuthenticated) {
            alert("Please log in to answer");
            return;
        }
        // TODO: Implement submit answer API call
        console.log("Submitting answer:", newAnswer);
        setNewAnswer("");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link to="/" className="text-blue-600 hover:underline">
                        ← Back to Questions
                    </Link>
                </nav>

                {/* Question */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <Card className="mb-8">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                            {questionData.question_title}
                                        </h1>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span>
                                                Asked by{" "}
                                                {questionData.user.username}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {questionData.upvotes.length}{" "}
                                                votes
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {questionData.answers.length}{" "}
                                                answers
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex">
                                    {/* Vote Section */}
                                    <div className="flex flex-col items-center mr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={upvoteQuestion}
                                            className="p-2"
                                        >
                                            <ArrowUp className="h-6 w-6" />
                                        </Button>
                                        <span className="text-lg font-medium my-2">
                                            {questionData.upvotes.length}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-2"
                                        >
                                            <ArrowDown className="h-6 w-6" />
                                        </Button>
                                    </div>

                                    {/* Question Content */}
                                    <div className="flex-1">
                                        <div className="prose max-w-none mb-4">
                                            <MarkdownPreview>
                                                {
                                                    questionData.question_description
                                                }
                                            </MarkdownPreview>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary">
                                                    {questionData.question_tag}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500">
                                                <User className="h-4 w-4 mr-1" />
                                                <span>
                                                    {questionData.user.username}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answers */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">
                                {questionData.answers.length} Answer
                                {questionData.answers.length !== 1 ? "s" : ""}
                            </h2>

                            {questionData.answers.map((answer) => (
                                <Card key={answer.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex">
                                            {/* Vote Section */}
                                            <div className="flex flex-col items-center mr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2"
                                                >
                                                    <ArrowUp className="h-6 w-6" />
                                                </Button>
                                                <span className="text-lg font-medium my-2">
                                                    {answer.upvotes.length}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2"
                                                >
                                                    <ArrowDown className="h-6 w-6" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 mt-2"
                                                >
                                                    <Check className="h-6 w-6 text-green-600" />
                                                </Button>
                                            </div>

                                            {/* Answer Content */}
                                            <div className="flex-1">
                                                <div className="prose max-w-none mb-4">
                                                    <MarkdownPreview>
                                                        {
                                                            answer.answer_description
                                                        }
                                                    </MarkdownPreview>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        {answer.comments.length}{" "}
                                                        comments
                                                    </Button>

                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 mr-1" />
                                                        <span>
                                                            {
                                                                answer.user
                                                                    .username
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Comments */}
                                                {answer.comments.length > 0 && (
                                                    <div className="mt-4 border-t pt-4">
                                                        {answer.comments.map(
                                                            (comment) => (
                                                                <div
                                                                    key={
                                                                        comment.id
                                                                    }
                                                                    className="text-sm text-gray-600 mb-2"
                                                                >
                                                                    {
                                                                        comment.comment_content
                                                                    }{" "}
                                                                    –
                                                                    <span className="font-medium ml-1">
                                                                        {
                                                                            comment
                                                                                .user
                                                                                .username
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Answer */}
                            {isAuthenticated ? (
                                <Card>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">
                                            Your Answer
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <RichEditor
                                            value={newAnswer}
                                            onChange={(value) =>
                                                setNewAnswer(value)
                                            }
                                            placeholder="Write your answer here..."
                                            className="mb-4 min-h-[200px]"
                                        />
                                        <Button
                                            onClick={submitAnswer}
                                            disabled={!newAnswer.trim()}
                                        >
                                            Post Answer
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <p className="text-gray-600 mb-4">
                                            Please log in to post an answer.
                                        </p>
                                        <Button>Log In</Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">
                                    Related Questions
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <Link
                                        to="#"
                                        className="block text-blue-600 hover:underline"
                                    >
                                        How to type useState in TypeScript?
                                    </Link>
                                    <Link
                                        to="#"
                                        className="block text-blue-600 hover:underline"
                                    >
                                        React useEffect with TypeScript
                                    </Link>
                                    <Link
                                        to="#"
                                        className="block text-blue-600 hover:underline"
                                    >
                                        Custom hooks TypeScript best practices
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuestionDetail;
