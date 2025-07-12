
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Search, Plus, MessageSquare, ArrowUp, ArrowDown, Eye, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for initial display
const mockQuestions = [
  {
    id: 1,
    title: "How to use React hooks with TypeScript?",
    description: "I'm having trouble understanding how to properly type React hooks in TypeScript...",
    author: "john_doe",
    tags: ["React", "TypeScript", "Hooks"],
    votes: 15,
    answers: 3,
    views: 142,
    timeAgo: "2 hours ago",
    isAccepted: true
  },
  {
    id: 2,
    title: "Best practices for JWT authentication",
    description: "What are the security considerations when implementing JWT authentication?",
    author: "sarah_dev",
    tags: ["JWT", "Authentication", "Security"],
    votes: 8,
    answers: 2,
    views: 89,
    timeAgo: "4 hours ago",
    isAccepted: false
  },
  {
    id: 3,
    title: "Tailwind CSS vs styled-components performance",
    description: "Which styling approach offers better performance for large React applications?",
    author: "alex_smith",
    tags: ["CSS", "Tailwind", "Performance"],
    votes: 23,
    answers: 7,
    views: 256,
    timeAgo: "1 day ago",
    isAccepted: true
  }
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <span className="text-sm font-medium">john_doe</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
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
                onClick={() => setShowMobileMenu(!showMobileMenu)}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "JavaScript", "CSS", "Node.js", "Python"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          {/* Questions List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Questions</h1>
              {isLoggedIn && (
                <Button asChild>
                  <Link to="/ask">
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Link>
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Link to={`/questions/${question.id}`} className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {question.title}
                        </h2>
                      </Link>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{question.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="h-4 w-4" />
                          <span className="font-medium">{question.votes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{question.answers} answers</span>
                          {question.isAccepted && (
                            <span className="text-green-600 font-medium">✓</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{question.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>asked by</span>
                        <span className="font-medium text-blue-600">{question.author}</span>
                        <span>{question.timeAgo}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
