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
        tags: [] as string[], // Keep tags array for UI, convert to single tag for API
    });
    const [currentTag, setCurrentTag] = useState("");

    const handleAddTag = () => {
        if (
            currentTag.trim() &&
            !formData.tags.includes(currentTag.trim()) &&
            formData.tags.length < 5
        ) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()],
            }));
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.title.trim() &&
            formData.description.trim() &&
            formData.tags.length > 0
        ) {
            try {
                // Convert tags array to single tag (use first tag for now)
                await createQuestionMutation.mutateAsync({
                    question_title: formData.title.trim(),
                    question_description: formData.description.trim(),
                    question_tag: formData.tags[0], // Backend expects single tag
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
                        <Link
                            to="/"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Questions
                        </Link>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        Ask a Question
                                    </CardTitle>
                                    <p className="text-gray-600">
                                        Get help from the community by asking a
                                        clear, specific question
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="title"
                                                className="text-sm font-medium"
                                            >
                                                Question Title *
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="What's your programming question? Be specific."
                                                value={formData.title}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                            <p className="text-xs text-gray-500">
                                                Be specific and imagine you're
                                                asking a question to another
                                                person
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="description"
                                                className="text-sm font-medium"
                                            >
                                                Question Description *
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Provide all the relevant information someone would need to answer your question..."
                                                value={formData.description}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                                ) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        description:
                                                            e.target.value,
                                                    }))
                                                }
                                                rows={10}
                                                className="min-h-[250px]"
                                                required
                                            />
                                            <p className="text-xs text-gray-500">
                                                Include code snippets, error
                                                messages, and what you've
                                                already tried
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="tags"
                                                className="text-sm font-medium"
                                            >
                                                Tags *
                                            </Label>
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="tags"
                                                        placeholder="Add a tag (e.g., React, TypeScript)"
                                                        value={currentTag}
                                                        onChange={(
                                                            e: React.ChangeEvent<HTMLInputElement>
                                                        ) =>
                                                            setCurrentTag(
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyPress={
                                                            handleKeyPress
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddTag}
                                                        variant="outline"
                                                        disabled={
                                                            !currentTag.trim() ||
                                                            formData.tags
                                                                .length >= 5
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {formData.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.tags.map(
                                                            (tag) => (
                                                                <Badge
                                                                    key={tag}
                                                                    variant="secondary"
                                                                    className="pr-1"
                                                                >
                                                                    {tag}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                                                                        onClick={() =>
                                                                            handleRemoveTag(
                                                                                tag
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Add up to 5 tags to describe
                                                what your question is about
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    !formData.title.trim() ||
                                                    !formData.description.trim() ||
                                                    formData.tags.length ===
                                                        0 ||
                                                    createQuestionMutation.isPending
                                                }
                                                className="min-w-[140px]"
                                            >
                                                {createQuestionMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Posting...
                                                    </>
                                                ) : (
                                                    "Post Your Question"
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link to="/">Cancel</Link>
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Tips */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        How to ask a good question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-sm space-y-2">
                                        <p>
                                            <strong>1. Search first</strong>
                                            <br />
                                            Make sure your question hasn't been
                                            asked before
                                        </p>
                                        <p>
                                            <strong>2. Be specific</strong>
                                            <br />
                                            Include relevant details and context
                                        </p>
                                        <p>
                                            <strong>3. Show your work</strong>
                                            <br />
                                            Include code you've tried and errors
                                            you're getting
                                        </p>
                                        <p>
                                            <strong>
                                                4. Use proper formatting
                                            </strong>
                                            <br />
                                            Format code blocks and make your
                                            question readable
                                        </p>
                                        <p>
                                            <strong>
                                                5. Tag appropriately
                                            </strong>
                                            <br />
                                            Use relevant tags so the right
                                            people see your question
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Popular Tags
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "React",
                                            "TypeScript",
                                            "JavaScript",
                                            "Python",
                                            "Node.js",
                                            "CSS",
                                        ].map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-blue-50"
                                                onClick={() => {
                                                    if (
                                                        !formData.tags.includes(
                                                            tag
                                                        ) &&
                                                        formData.tags.length < 5
                                                    ) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tags: [
                                                                ...prev.tags,
                                                                tag,
                                                            ],
                                                        }));
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
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
