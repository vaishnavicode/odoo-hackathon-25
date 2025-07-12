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
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for initial display
const mockQuestions = [
    {
        id: 1,
        title: "How to use React hooks with TypeScript?",
        description:
            "I'm having trouble understanding how to properly type React hooks in TypeScript...",
        author: "john_doe",
        authorReputation: 1250,
        tags: ["React", "TypeScript", "Hooks"],
        votes: 15,
        answers: 3,
        views: 142,
        timeAgo: "2 hours ago",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isAccepted: true,
    },
    {
        id: 2,
        title: "Best practices for JWT authentication",
        description:
            "What are the security considerations when implementing JWT authentication?",
        author: "sarah_dev",
        authorReputation: 890,
        tags: ["JWT", "Authentication", "Security"],
        votes: 8,
        answers: 2,
        views: 89,
        timeAgo: "4 hours ago",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isAccepted: false,
    },
    {
        id: 3,
        title: "Tailwind CSS vs styled-components performance",
        description:
            "Which styling approach offers better performance for large React applications?",
        author: "alex_smith",
        authorReputation: 2350,
        tags: ["CSS", "Tailwind", "Performance"],
        votes: 23,
        answers: 7,
        views: 256,
        timeAgo: "1 day ago",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isAccepted: true,
    },
    {
        id: 4,
        title: "How to optimize React performance for large datasets?",
        description:
            "My React app is becoming slow when rendering large lists. What are the best optimization techniques?",
        author: "mike_react",
        authorReputation: 3200,
        tags: ["React", "Performance", "Optimization"],
        votes: 35,
        answers: 12,
        views: 678,
        timeAgo: "3 days ago",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isAccepted: true,
    },
    {
        id: 5,
        title: "Understanding Node.js event loop",
        description:
            "Can someone explain how the Node.js event loop works with practical examples?",
        author: "node_ninja",
        authorReputation: 1890,
        tags: ["Node.js", "JavaScript", "Event Loop"],
        votes: 42,
        answers: 8,
        views: 834,
        timeAgo: "1 week ago",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        isAccepted: false,
    },
    {
        id: 6,
        title: "Python async/await best practices",
        description:
            "What are the common pitfalls when using async/await in Python and how to avoid them?",
        author: "python_pro",
        authorReputation: 4500,
        tags: ["Python", "Async", "Best Practices"],
        votes: 18,
        answers: 5,
        views: 245,
        timeAgo: "2 days ago",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isAccepted: true,
    },
];

const Index = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [filterBy, setFilterBy] = useState("all");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Filter and sort questions based on current state
    const filteredAndSortedQuestions = useMemo(() => {
        let filtered = [...mockQuestions];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (q) =>
                    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    q.tags.some((tag) =>
                        tag.toLowerCase().includes(searchQuery.toLowerCase())
                    )
            );
        }

        // Apply tag filter
        if (selectedTag) {
            filtered = filtered.filter((q) => q.tags.includes(selectedTag));
        }

        // Apply status filter
        if (filterBy === "answered") {
            filtered = filtered.filter((q) => q.answers > 0);
        } else if (filterBy === "unanswered") {
            filtered = filtered.filter((q) => q.answers === 0);
        } else if (filterBy === "accepted") {
            filtered = filtered.filter((q) => q.isAccepted);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return b.createdAt.getTime() - a.createdAt.getTime();
                case "oldest":
                    return a.createdAt.getTime() - b.createdAt.getTime();
                case "votes":
                    return b.votes - a.votes;
                case "views":
                    return b.views - a.views;
                case "answers":
                    return b.answers - a.answers;
                case "reputation":
                    return b.authorReputation - a.authorReputation;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [searchQuery, sortBy, filterBy, selectedTag]);

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
                            {isLoggedIn && (
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
                            <div className="mt-4 text-sm text-gray-600">
                                Showing {filteredAndSortedQuestions.length}{" "}
                                question
                                {filteredAndSortedQuestions.length !== 1
                                    ? "s"
                                    : ""}
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
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredAndSortedQuestions.length === 0 ? (
                                <Card className="text-center py-12">
                                    <CardContent>
                                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No questions found
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {searchQuery
                                                ? `No questions match "${searchQuery}"`
                                                : "No questions match your current filters"}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                            {(searchQuery ||
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
                                            {isLoggedIn && (
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
                                filteredAndSortedQuestions.map((question) => (
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
                                                {question.description}
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
        </div>
    );
};

export default Index;
