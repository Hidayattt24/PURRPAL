"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
            
            // Save token in both localStorage and cookie
            localStorage.setItem('token', result.token);
            Cookies.set('token', result.token, { expires: 7 }); // Cookie expires in 7 days
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(result.user));
            
            toast.success('Welcome back!', {
                description: 'Successfully logged in to your account.'
            });

            // Redirect to returnUrl if exists, otherwise to home
            const returnUrl = searchParams.get('returnUrl');
            router.push(returnUrl || '/main/home');
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
