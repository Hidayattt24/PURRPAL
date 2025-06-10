"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

interface AuthFormProps {
    mode: "login" | "signup";
    onSubmit: (data: { email: string; password: string; username?: string }) => void;
    error?: string;
}

export function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
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
                <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
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
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
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

                        <Button
                            type="submit"
                            className="w-full bg-[#FF7F50] hover:bg-[#FF6347]"
                        >
                            {mode === "login" ? "Login" : "Sign up"}
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