"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

interface AuthFormProps {
    mode: "login" | "signup";
    onSubmit: (data: { email: string; password: string; username?: string }) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "signup" && password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        onSubmit(mode === "signup" ? { email, password, username } : { email, password });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="flex w-full max-w-[1200px] overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Left side - Illustration */}
                <div className="relative hidden w-1/2 bg-[#FFF5EE] lg:block">
                    <Image
                        src={mode === "login" ? "/auth/login/auth-illustration.png" : "/auth/login/register-auth.png"}
                        alt={mode === "login" ? "Login illustration" : "Sign up illustration"}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        className="h-full w-full"
                    />
                </div>

                {/* Right side - Form */}
                <div className="w-full px-8 py-12 lg:w-1/2">
                    <div className="mb-8">
                        <div className="relative w-[180px] h-[60px] mb-6">
                            <Image
                                src="/auth/login/logo.svg"
                                alt="Purrpal Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold">
                            {mode === "login" ? "Hello," : "Sign Up"}
                        </h1>
                        <h2 className="text-2xl font-bold">
                            {mode === "login" ? "Welcome Back" : "Create your account"}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {mode === "signup" && (
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            )}
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {mode === "signup" && (
                                <Input
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            )}
                        </div>

                        {mode === "login" && (
                            <div className="text-right">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-gray-600 hover:text-[#FF7F50]"
                                >
                                    Forgot your Password?
                                </Link>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#FF7F50] hover:bg-[#FF6347]"
                        >
                            {mode === "login" ? "Login" : "Sign up"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                // Handle Google login/signup
                            }}
                        >
                            <div className="relative w-5 h-5 mr-2">
                                <Image
                                    src="/auth/login/google.svg"
                                    alt="Google"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            Continue with Google
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                href={mode === "login" ? "/auth/signup" : "/auth/login"}
                                className="font-medium text-[#FF7F50] hover:underline"
                            >
                                {mode === "login" ? "Sign up" : "Login"}
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
} 