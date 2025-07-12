import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                                <Lock className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>Authentication Required</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-gray-600">
                                You need to be logged in to access this page.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setAuthDialogOpen(true)}
                                >
                                    Log In
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => setAuthDialogOpen(true)}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <AuthDialog
                    isOpen={authDialogOpen}
                    onClose={() => setAuthDialogOpen(false)}
                    defaultMode="login"
                />
            </>
        );
    }

    return <>{children}</>;
};
