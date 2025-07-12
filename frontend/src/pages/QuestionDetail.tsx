import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MarkdownPreview from "../components/ui/MarkdownPreview";

const QuestionDetail = () => {
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [newAnswer, setNewAnswer] = useState("");
    const [votes, setVotes] = useState({ question: 15, answers: [5, -2, 8] });

    // Mock question data
    const question = {
        id: 1,
        title: "How to use React hooks with TypeScript?",
        description: `I'm having trouble understanding how to properly type React hooks in TypeScript. Specifically, I'm confused about:

1. How to type useState with complex objects
2. How to type useEffect dependencies
3. Best practices for custom hooks

Here's what I've tried so far:

\`\`\`typescript
const [user, setUser] = useState<User | null>(null);
\`\`\`

But I'm getting type errors when trying to update nested properties. Any help would be appreciated!`,
        author: "john_doe",
        authorReputation: 1250,
        tags: ["React", "TypeScript", "Hooks"],
        votes: 15,
        views: 142,
        timeAgo: "2 hours ago",
        answers: [
            {
                id: 1,
                content: `Great question! Here's how you can properly type React hooks in TypeScript:

For useState with complex objects, you have several options:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Option 1: Type assertion
const [user, setUser] = useState<User | null>(null);

// Option 2: Default value
const [user, setUser] = useState<User>({
  id: 0,
  name: '',
  email: ''
});
\`\`\`

For updating nested properties, use the spread operator:

\`\`\`typescript
setUser(prevUser => ({
  ...prevUser,
  name: 'New Name'
}));
\`\`\``,
                author: "typescript_expert",
                authorReputation: 5400,
                votes: 5,
                timeAgo: "1 hour ago",
                isAccepted: true,
            },
            {
                id: 2,
                content: `I disagree with the previous answer. You should avoid type assertions when possible.

Instead, use proper type guards:

\`\`\`typescript
const updateUser = (updates: Partial<User>) => {
  setUser(prev => prev ? { ...prev, ...updates } : null);
};
\`\`\``,
                author: "code_reviewer",
                authorReputation: 2100,
                votes: -2,
                timeAgo: "45 minutes ago",
                isAccepted: false,
            },
        ],
    };

    const handleVote = (
        type: "question" | "answer",
        index: number | null,
        direction: "up" | "down"
    ) => {
        if (!isLoggedIn) {
            alert("Please log in to vote");
            return;
        }

        setVotes((prev) => {
            if (type === "question") {
                return {
                    ...prev,
                    question: prev.question + (direction === "up" ? 1 : -1),
                };
            } else if (index !== null) {
                const newAnswerVotes = [...prev.answers];
                newAnswerVotes[index] += direction === "up" ? 1 : -1;
                return {
                    ...prev,
                    answers: newAnswerVotes,
                };
            }
            return prev;
        });
    };

    const handleSubmitAnswer = () => {
        if (!isLoggedIn) {
            alert("Please log in to post an answer");
            return;
        }
        if (newAnswer.trim()) {
            console.log("Submitting answer:", newAnswer);
            setNewAnswer("");
        }
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

                        <div className="hidden md:flex items-center space-x-4">
                            {isLoggedIn ? (
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
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <div className="bg-blue-100 rounded-full p-2">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium">
                                            john_doe
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsLoggedIn(true)}
                                    >
                                        Log In
                                    </Button>
                                    <Button onClick={() => setIsLoggedIn(true)}>
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        ← Back to Questions
                    </Link>
                </nav>

                {/* Question */}
                <Card className="mb-8">
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {question.title}
                        </h1>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span>Asked 2 hours ago</span>
                                <span>Viewed {question.views} times</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6">
                            {/* Voting */}
                            <div className="flex flex-col items-center space-y-2 min-w-[50px]">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleVote("question", null, "up")
                                    }
                                    className="p-2 hover:bg-green-100"
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </Button>
                                <span className="text-lg font-semibold">
                                    {votes.question}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleVote("question", null, "down")
                                    }
                                    className="p-2 hover:bg-red-100"
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="prose max-w-none mb-6">
                                    <MarkdownPreview>
                                        {question.description}
                                    </MarkdownPreview>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {question.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        asked by{" "}
                                        <span className="font-medium text-blue-600">
                                            {question.author}
                                        </span>{" "}
                                        <span className="text-gray-400">
                                            ({question.authorReputation} rep)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Answers */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {question.answers.length} Answer
                        {question.answers.length !== 1 ? "s" : ""}
                    </h2>

                    <div className="space-y-6">
                        {question.answers.map((answer, index) => (
                            <Card
                                key={answer.id}
                                className={
                                    answer.isAccepted
                                        ? "border-green-200 bg-green-50"
                                        : ""
                                }
                            >
                                <CardContent className="pt-6">
                                    <div className="flex gap-6">
                                        {/* Voting */}
                                        <div className="flex flex-col items-center space-y-2 min-w-[50px]">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleVote(
                                                        "answer",
                                                        index,
                                                        "up"
                                                    )
                                                }
                                                className="p-2 hover:bg-green-100"
                                            >
                                                <ArrowUp className="h-5 w-5" />
                                            </Button>
                                            <span className="text-lg font-semibold">
                                                {votes.answers[index]}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleVote(
                                                        "answer",
                                                        index,
                                                        "down"
                                                    )
                                                }
                                                className="p-2 hover:bg-red-100"
                                            >
                                                <ArrowDown className="h-5 w-5" />
                                            </Button>
                                            {answer.isAccepted && (
                                                <div className="bg-green-100 rounded-full p-2">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Answer Content */}
                                        <div className="flex-1">
                                            <div className="prose max-w-none mb-4">
                                                <pre className="whitespace-pre-wrap text-gray-700">
                                                    <MarkdownPreview>
                                                        {answer.content}
                                                    </MarkdownPreview>
                                                </pre>
                                            </div>

                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <div>
                                                    {answer.isAccepted && (
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                                                            ✓ Accepted Answer
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    answered by{" "}
                                                    <span className="font-medium text-blue-600">
                                                        {answer.author}
                                                    </span>{" "}
                                                    <span className="text-gray-400">
                                                        (
                                                        {
                                                            answer.authorReputation
                                                        }{" "}
                                                        rep)
                                                    </span>{" "}
                                                    {answer.timeAgo}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Answer Form */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Your Answer
                        </h3>
                    </CardHeader>
                    <CardContent>
                        {isLoggedIn ? (
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Write your answer here..."
                                    value={newAnswer}
                                    onChange={(e) =>
                                        setNewAnswer(e.target.value)
                                    }
                                    rows={8}
                                    className="min-h-[200px]"
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">
                                        Use proper formatting and provide clear
                                        explanations
                                    </p>
                                    <Button
                                        onClick={handleSubmitAnswer}
                                        disabled={!newAnswer.trim()}
                                    >
                                        Post Your Answer
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">
                                    Please log in to post an answer
                                </p>
                                <Button onClick={() => setIsLoggedIn(true)}>
                                    Log In to Answer
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default QuestionDetail;
