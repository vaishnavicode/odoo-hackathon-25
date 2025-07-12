import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Plus, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateQuestion } from "@/hooks/useQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

const AskQuestion = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const createQuestionMutation = useCreateQuestion();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tag: "", // Backend expects a single tag
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.title.trim() &&
            formData.description.trim() &&
            formData.tag.trim()
        ) {
            try {
                await createQuestionMutation.mutateAsync({
                    question_title: formData.title.trim(),
                    question_description: formData.description.trim(),
                    question_tag: formData.tag.trim(),
                });
                navigate("/");
            } catch (error) {
                // Error handling is done in the hook
                console.error("Failed to create question:", error);
            }
        }
    };

    return (
        <ProtectedRoute>
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

                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        3
                                    </span>
                                </div>
                                <UserProfileDropdown />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <Link to="/" className="text-blue-600 hover:underline">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-500">/</span>
                        <span className="text-gray-700">Ask Question</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Question Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        Ask a Public Question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Title */}
                                        <div>
                                            <Label
                                                htmlFor="title"
                                                className="text-base font-semibold"
                                            >
                                                Title
                                            </Label>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Be specific and imagine you're
                                                asking a question to another
                                                person.
                                            </p>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g., How to center a div in CSS?"
                                                className="w-full"
                                                required
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label
                                                htmlFor="description"
                                                className="text-base font-semibold"
                                            >
                                                What are the details of your
                                                problem?
                                            </Label>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Introduce the problem and expand
                                                on what you put in the title.
                                                Minimum 20 characters.
                                            </p>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        description:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="Describe your problem in detail..."
                                                className="w-full min-h-[200px]"
                                                required
                                            />
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <Label
                                                htmlFor="tag"
                                                className="text-base font-semibold"
                                            >
                                                Tag
                                            </Label>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Add a tag to describe what your
                                                question is about.
                                            </p>
                                            <Input
                                                id="tag"
                                                value={formData.tag}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        tag: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g., javascript, react, python"
                                                className="w-full"
                                                required
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => navigate("/")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    createQuestionMutation.isPending
                                                }
                                                className="min-w-[120px]"
                                            >
                                                {createQuestionMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Posting...
                                                    </>
                                                ) : (
                                                    "Post Question"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tips Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Writing a good question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            You're ready to ask a
                                            programming-related question and
                                            this form will help guide you
                                            through the process.
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Looking to ask a non-programming
                                            question? See the topics here to
                                            find a relevant site.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Steps
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>
                                                • Summarize your problem in a
                                                one-line title.
                                            </li>
                                            <li>
                                                • Describe your problem in more
                                                detail.
                                            </li>
                                            <li>
                                                • Describe what you tried and
                                                what you expected to happen.
                                            </li>
                                            <li>
                                                • Add "tags" which help surface
                                                your question to members of the
                                                community.
                                            </li>
                                            <li>
                                                • Review your question and post
                                                it to the site.
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        How to format
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>
                                            • Use **bold** to highlight
                                            important parts
                                        </p>
                                        <p>• Use `code` for inline code</p>
                                        <p>
                                            • Use ```code block``` for multiple
                                            lines of code
                                        </p>
                                        <p>• Add links: [text](url)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default AskQuestion;
