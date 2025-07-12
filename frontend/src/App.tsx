import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuestionDetailNew from "./pages/QuestionDetailNew";
import AskQuestionNew from "./pages/AskQuestionNew";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import { AdminAuth } from "./components/AdminAuth";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route
                        path="/questions/:id"
                        element={<QuestionDetailNew />}
                    />
                    <Route path="/ask" element={<AskQuestionNew />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin" element={<AdminAuth />} />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <AdminProtectedRoute>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        } 
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
