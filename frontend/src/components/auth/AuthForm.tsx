"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface AuthFormProps {
    mode: "login" | "signup";
    onSubmit: (data: { email: string; password: string; username?: string }) => void;
    error?: string;
    isLoading?: boolean;
}

export function AuthForm({ mode, onSubmit, error, isLoading = false }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "signup" && password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        const data = mode === "signup" ? { email, password, username } : { email, password };
        onSubmit(data);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#FAFAFA] p-4 overflow-hidden">
            {/* Gradient Circles */}
            <div className="absolute top-20 left-[15%] w-[30rem] h-[30rem] bg-[#FF823C]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-[15%] w-[25rem] h-[25rem] bg-[#C54F0C]/10 rounded-full blur-3xl" />

            <div className="relative flex w-full max-w-[1100px] overflow-hidden rounded-[32px] bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                {/* Left side - Form */}
                <div className="flex w-full flex-col justify-center p-12 lg:w-1/2">
                    <div className="mb-10">
                        <div className="relative mb-8 h-[50px] w-[150px]">
                            <Image
                                src="/auth/login/logo.svg"
                                alt="Purrpal Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            {mode === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="mt-3 text-base text-gray-500">
                            {mode === "login" 
                                ? "Please enter your details to sign in" 
                                : "Join PurrPal and start your journey"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            {mode === "signup" && (
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-200 px-4 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-[#FF7F50] focus:ring-[#FF7F50]"
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-200 px-4 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-[#FF7F50] focus:ring-[#FF7F50]"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border-gray-200 pr-10 px-4 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-[#FF7F50] focus:ring-[#FF7F50]"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {mode === "signup" && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="block w-full rounded-lg border-gray-200 pr-10 px-4 py-2.5 text-gray-700 placeholder:text-gray-400 focus:border-[#FF7F50] focus:ring-[#FF7F50]"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-lg bg-[#FF7F50] px-5 py-3 text-base font-semibold text-white transition-all hover:bg-[#FF6347] focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader size="small" className="mx-auto" />
                            ) : mode === "login" ? (
                                "Sign in"
                            ) : (
                                "Create account"
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                href={mode === "login" ? "/auth/signup" : "/auth/login"}
                                className="font-medium text-[#FF7F50] hover:text-[#FF6347]"
                            >
                                {mode === "login" ? "Sign up" : "Sign in"}
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Right side - Illustration */}
                <div className="relative hidden w-1/2 bg-gradient-to-br from-[#FFF5EE] to-[#FFE4E1] lg:block">
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <Image
                            src={mode === "login" ? "/auth/login/auth-illustration.png" : "/auth/login/register-auth.png"}
                            alt={mode === "login" ? "Login illustration" : "Sign up illustration"}
                            width={500}
                            height={500}
                            priority
                            className="max-w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}