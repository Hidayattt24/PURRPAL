"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            // TODO: Implement login logic here
            console.log("Login attempt with:", data);

            // For now, just redirect to dashboard
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return <AuthForm mode="login" onSubmit={handleLogin} />;
}
