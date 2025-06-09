"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();

    const handleSignUp = async (data: { email: string; password: string; username?: string }) => {
        try {
            // TODO: Implement signup logic here
            console.log("Sign up attempt with:", data);

            // For now, just redirect to login
            router.push("/auth/login");
        } catch (error) {
            console.error("Sign up failed:", error);
        }
    };

    return <AuthForm mode="signup" onSubmit={handleSignUp} />;
}
