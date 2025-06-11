"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
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
            
            // Save token
            localStorage.setItem('token', result.token);
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(result.user));
            
            toast.success('Account created successfully!', {
                description: 'Welcome to PurrPal!'
            });

            // Redirect to home
            router.push('/main/home');
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
