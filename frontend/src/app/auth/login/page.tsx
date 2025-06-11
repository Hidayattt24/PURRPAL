"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to login');
            }

            const result = await response.json();
            
            // Save token
            localStorage.setItem('token', result.token);
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(result.user));
            
            toast.success('Welcome back!', {
                description: 'Successfully logged in to your account.'
            });

            // Redirect to home
            router.push('/main/home');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
            toast.error('Login failed', {
                description: err instanceof Error ? err.message : 'Please check your credentials and try again'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <AuthForm mode="login" onSubmit={handleLogin} error={error} isLoading={isLoading} />
        </div>
    );
}
