"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";
import Cookies from 'js-cookie';

// Create a client component for the signup form
function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignUp = async (data: { email: string; password: string; username?: string }) => {
        try {
            setIsLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to sign up');
            }
            
            const result = await response.json();
            
            // Save token in both localStorage and cookie
            localStorage.setItem('token', result.token);
            Cookies.set('token', result.token, { expires: 7 }); // Cookie expires in 7 days
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(result.user));
            
            toast.success('Account created successfully!', {
                description: 'Welcome to PurrPal!'
            });

            // Redirect to returnUrl if exists, otherwise to home
            const returnUrl = searchParams.get('returnUrl');
            router.push(returnUrl || '/main/home');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err instanceof Error ? err.message : 'Failed to sign up. Please try again.');
            toast.error('Registration failed', {
                description: err instanceof Error ? err.message : 'Please try again later'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <AuthForm mode="signup" onSubmit={handleSignUp} error={error} isLoading={isLoading} />
        </div>
    );
}

// Main page component with Suspense
export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}
