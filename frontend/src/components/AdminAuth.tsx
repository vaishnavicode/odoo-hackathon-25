import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminAuth: React.FC = () => {
    const {
        login,
        register,
        isLoggingIn,
        isRegistering,
        loginError,
        registerError,
    } = useAdminAuth();

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        login: false,
        register: false,
        confirm: false,
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(loginForm);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (registerForm.password !== registerForm.confirmPassword) {
            return;
        }
        register(registerForm);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Portal
                    </h1>
                    <p className="text-gray-600">
                        Secure administrative access
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Admin Authentication
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">
                                    Register
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form
                                    onSubmit={handleLogin}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">
                                            Admin Email
                                        </Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={loginForm.email}
                                            onChange={(e) =>
                                                setLoginForm((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="login-password"
                                                type={
                                                    showPassword.login
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password"
                                                value={loginForm.password}
                                                onChange={(e) =>
                                                    setLoginForm((prev) => ({
                                                        ...prev,
                                                        password:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                                onClick={() =>
                                                    setShowPassword((prev) => ({
                                                        ...prev,
                                                        login: !prev.login,
                                                    }))
                                                }
                                            >
                                                {showPassword.login ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {loginError && (
                                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                            {loginError.message}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoggingIn}
                                    >
                                        {isLoggingIn
                                            ? "Signing in..."
                                            : "Sign In as Admin"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="register-username">
                                            Username
                                        </Label>
                                        <Input
                                            id="register-username"
                                            type="text"
                                            placeholder="Enter admin username"
                                            value={registerForm.username}
                                            onChange={(e) =>
                                                setRegisterForm((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">
                                            Admin Email
                                        </Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={registerForm.email}
                                            onChange={(e) =>
                                                setRegisterForm((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="register-password"
                                                type={
                                                    showPassword.register
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Create password"
                                                value={registerForm.password}
                                                onChange={(e) =>
                                                    setRegisterForm((prev) => ({
                                                        ...prev,
                                                        password:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                                onClick={() =>
                                                    setShowPassword((prev) => ({
                                                        ...prev,
                                                        register:
                                                            !prev.register,
                                                    }))
                                                }
                                            >
                                                {showPassword.register ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="register-confirm-password">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="register-confirm-password"
                                                type={
                                                    showPassword.confirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm password"
                                                value={
                                                    registerForm.confirmPassword
                                                }
                                                onChange={(e) =>
                                                    setRegisterForm((prev) => ({
                                                        ...prev,
                                                        confirmPassword:
                                                            e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                                onClick={() =>
                                                    setShowPassword((prev) => ({
                                                        ...prev,
                                                        confirm: !prev.confirm,
                                                    }))
                                                }
                                            >
                                                {showPassword.confirm ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {registerForm.password !==
                                        registerForm.confirmPassword &&
                                        registerForm.confirmPassword && (
                                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                                Passwords do not match
                                            </div>
                                        )}

                                    {registerError && (
                                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                            {registerError.message}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={
                                            isRegistering ||
                                            registerForm.password !==
                                                registerForm.confirmPassword
                                        }
                                    >
                                        {isRegistering
                                            ? "Creating Account..."
                                            : "Create Admin Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="text-center mt-6 pt-4 border-t">
                            <Link
                                to="/"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Back to main site
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
