"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Redirect to main page
            router.push("/main/home");
        } catch (error) {
            console.error("Login failed:", error);
            setError(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
}
