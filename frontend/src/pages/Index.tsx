import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    Search,
    Plus,
    MessageSquare,
    ArrowUp,
    ArrowDown,
    Eye,
    User,
    Menu,
    Filter,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuestions } from "@/hooks/useQuestions";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthDialog } from "@/components/AuthDialog";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { stripMarkdown, truncateText } from "@/lib/markdownUtils";

const Index = () => {
    const { isAuthenticated, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [filterBy, setFilterBy] = useState("all");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [authDialogMode, setAuthDialogMode] = useState<"login" | "signup">(
        "login"
    );

    // Debounce search query to avoid excessive filtering
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Fetch all questions from API (no filtering on backend)
    const { data: questionsResponse, isLoading, error } = useQuestions({});

    // Transform backend data to frontend format and apply all filtering/sorting client-side
    const displayQuestions = useMemo(() => {
        if (!questionsResponse?.results) return [];

        let questions = questionsResponse.results.map((q) => ({
            id: q.id,
            title: q.question_title,
            description: q.question_description,
            author: q.user, // This is the username from backend
            authorReputation: Math.floor(Math.random() * 5000), // Random reputation for demo
            tags: [q.question_tag], // Backend stores single tag, frontend expects array
            votes: q.upvotes,
            answers: q.answer_count,
            views: Math.floor(Math.random() * 1000), // Random views for demo
            timeAgo: "recently", // Default since backend doesn't provide this formatted
            createdAt: new Date(), // Default since backend doesn't provide created_at in list
            isAccepted: q.answer_count > 0 && Math.random() > 0.7, // Random accepted status for demo
        }));

        // Apply search filter
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            questions = questions.filter(
                (q) =>
                    q.title.toLowerCase().includes(query) ||
                    stripMarkdown(q.description)
                        .toLowerCase()
                        .includes(query) ||
                    q.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                    q.author.toLowerCase().includes(query)
            );
        }

        // Apply tag filter
        if (selectedTag) {
            questions = questions.filter((q) =>
                q.tags.some(
                    (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
                )
            );
        }

        // Apply status filter
        if (filterBy === "answered") {
            questions = questions.filter((q) => q.answers > 0);
        } else if (filterBy === "unanswered") {
            questions = questions.filter((q) => q.answers === 0);
        } else if (filterBy === "accepted") {
            questions = questions.filter((q) => q.isAccepted);
        }

        // Apply sorting
        switch (sortBy) {
            case "newest":
                questions.sort((a, b) => b.id - a.id);
                break;
            case "oldest":
                questions.sort((a, b) => a.id - b.id);
                break;
            case "votes":
                questions.sort((a, b) => b.votes - a.votes);
                break;
            case "views":
                questions.sort((a, b) => b.views - a.views);
                break;
            case "answers":
                questions.sort((a, b) => b.answers - a.answers);
                break;
            case "reputation":
                questions.sort(
                    (a, b) => b.authorReputation - a.authorReputation
                );
                break;
            default:
                questions.sort((a, b) => b.id - a.id);
        }

        return questions;
    }, [
        questionsResponse,
        debouncedSearchQuery,
        selectedTag,
        filterBy,
        sortBy,
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="text-2xl font-bold text-blue-600"
                            >
                                StackIt
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Desktop User Actions */}
                        <div className="hidden md:flex items-center space-x-4">
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
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setAuthDialogMode("login");
                                            setAuthDialogOpen(true);
                                        }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setAuthDialogMode("signup");
                                            setAuthDialogOpen(true);
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    setShowMobileMenu(!showMobileMenu)
                                }
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Popular Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "React",
                                    "TypeScript",
                                    "JavaScript",
                                    "CSS",
                                    "Node.js",
                                    "Python",
                                ].map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={
                                            selectedTag === tag
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="cursor-pointer hover:bg-blue-100"
                                        onClick={() =>
                                            setSelectedTag(
                                                selectedTag === tag ? null : tag
                                            )
                                        }
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            {selectedTag && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTag(null)}
                                    className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Clear filter
                                </Button>
                            )}
                        </div>
                    </aside>

                    {/* Questions List */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                All Questions
                            </h1>
                            {isAuthenticated && (
                                <Button asChild>
                                    <Link to="/ask">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ask Question
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Filter and Sort Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Sort Tabs */}
                                <div className="flex-1">
                                    <Tabs
                                        value={sortBy}
                                        onValueChange={setSortBy}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                                            <TabsTrigger value="newest">
                                                Newest
                                            </TabsTrigger>
                                            <TabsTrigger value="votes">
                                                Most Votes
                                            </TabsTrigger>
                                            <TabsTrigger value="views">
                                                Most Viewed
                                            </TabsTrigger>
                                            <TabsTrigger value="answers">
                                                Most Answers
                                            </TabsTrigger>
                                            <TabsTrigger value="reputation">
                                                Reputation
                                            </TabsTrigger>
                                            <TabsTrigger value="oldest">
                                                Oldest
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                {/* Filter Dropdowns */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Select
                                        value={filterBy}
                                        onValueChange={setFilterBy}
                                    >
                                        <SelectTrigger className="w-full sm:w-[140px]">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Filter by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Questions
                                            </SelectItem>
                                            <SelectItem value="answered">
                                                Answered
                                            </SelectItem>
                                            <SelectItem value="unanswered">
                                                Unanswered
                                            </SelectItem>
                                            <SelectItem value="accepted">
                                                Accepted
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={selectedTag || "all"}
                                        onValueChange={(value) =>
                                            setSelectedTag(
                                                value === "all" ? null : value
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full sm:w-[140px]">
                                            <SelectValue placeholder="Filter by tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Tags
                                            </SelectItem>
                                            <SelectItem value="React">
                                                React
                                            </SelectItem>
                                            <SelectItem value="TypeScript">
                                                TypeScript
                                            </SelectItem>
                                            <SelectItem value="JavaScript">
                                                JavaScript
                                            </SelectItem>
                                            <SelectItem value="CSS">
                                                CSS
                                            </SelectItem>
                                            <SelectItem value="Node.js">
                                                Node.js
                                            </SelectItem>
                                            <SelectItem value="Python">
                                                Python
                                            </SelectItem>
                                            <SelectItem value="Performance">
                                                Performance
                                            </SelectItem>
                                            <SelectItem value="Authentication">
                                                Authentication
                                            </SelectItem>
                                            <SelectItem value="Security">
                                                Security
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Results Info */}
                            <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                                <div>
                                    Showing {displayQuestions.length} question
                                    {displayQuestions.length !== 1 ? "s" : ""}
                                    {questionsResponse?.results && (
                                        <span className="text-gray-500">
                                            {" "}
                                            of{" "}
                                            {
                                                questionsResponse.results.length
                                            }{" "}
                                            total
                                        </span>
                                    )}
                                    {selectedTag && (
                                        <span className="ml-2">
                                            filtered by tag:
                                            <Badge
                                                variant="secondary"
                                                className="ml-1"
                                            >
                                                {selectedTag}
                                            </Badge>
                                        </span>
                                    )}
                                    {debouncedSearchQuery && (
                                        <span className="ml-2">
                                            matching "{debouncedSearchQuery}"
                                        </span>
                                    )}
                                </div>
                                {(debouncedSearchQuery ||
                                    selectedTag ||
                                    filterBy !== "all") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedTag(null);
                                            setFilterBy("all");
                                        }}
                                        className="text-xs"
                                    >
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                </div>
                            ) : error ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <div className="text-red-600 mb-4">
                                            Error loading questions:{" "}
                                            {error.message}
                                        </div>
                                        <Button
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                        >
                                            Try Again
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : displayQuestions.length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No questions found
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {debouncedSearchQuery
                                                ? `No questions match "${debouncedSearchQuery}"`
                                                : "No questions match your current filters"}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                            {(debouncedSearchQuery ||
                                                selectedTag ||
                                                filterBy !== "all") && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setSelectedTag(null);
                                                        setFilterBy("all");
                                                    }}
                                                >
                                                    Clear filters
                                                </Button>
                                            )}
                                            {isAuthenticated && (
                                                <Button asChild>
                                                    <Link to="/ask">
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Ask the first question
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                displayQuestions.map((question) => (
                                    <Card
                                        key={question.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <Link
                                                    to={`/questions/${question.id}`}
                                                    className="flex-1"
                                                >
                                                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                        {question.title}
                                                    </h2>
                                                </Link>
                                            </div>
                                            <p className="text-gray-600 mt-2 line-clamp-2">
                                                {truncateText(
                                                    stripMarkdown(
                                                        question.description
                                                    )
                                                )}
                                            </p>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {question.tags.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:bg-blue-100"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedTag(
                                                                selectedTag ===
                                                                    tag
                                                                    ? null
                                                                    : tag
                                                            );
                                                        }}
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <ArrowUp className="h-4 w-4" />
                                                        <span className="font-medium">
                                                            {question.votes}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageSquare className="h-4 w-4" />
                                                        <span>
                                                            {question.answers}{" "}
                                                            answers
                                                        </span>
                                                        {question.isAccepted && (
                                                            <span className="text-green-600 font-medium">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>
                                                            {question.views}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span>asked by</span>
                                                    <span className="font-medium text-blue-600">
                                                        {question.author}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {question.authorReputation.toLocaleString()}
                                                    </Badge>
                                                    <span>
                                                        {question.timeAgo}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Authentication Dialog */}
            <AuthDialog
                isOpen={authDialogOpen}
                onClose={() => setAuthDialogOpen(false)}
                defaultMode={authDialogMode}
            />
        </div>
    );
};

export default Index;
