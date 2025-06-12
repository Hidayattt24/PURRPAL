"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { config, debugConfig, testApiConnectivity, apiClient, waitForRuntimeEnv } from "@/lib/config";
import Cookies from 'js-cookie';

// Create a client component for the login form
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEnvReady, setIsEnvReady] = useState<boolean>(false);
    const [connectionTested, setConnectionTested] = useState<boolean>(false);

    // Initialize app and wait for runtime environment
    useEffect(() => {
        const initializeApp = async () => {
            console.log('🚀 Initializing PurrPal Frontend...');
            
            // Wait for runtime environment to be available
            console.log('⏳ Waiting for runtime environment...');
            const envReady = await waitForRuntimeEnv(10000); // 10 second timeout
            
            if (envReady) {
                console.log('✅ Runtime environment is ready');
                setIsEnvReady(true);
                
                // Debug configuration
                debugConfig();
                
                // Test API connectivity
                console.log('🔍 Testing API connectivity...');
                const isConnected = await testApiConnectivity();
                setConnectionTested(true);
                
                if (!isConnected) {
                    console.warn('⚠️ API connectivity test failed');
                    toast.warning('Connection Warning', {
                        description: 'Unable to reach the server. You may experience issues logging in.',
                    });
                } else {
                    console.log('✅ API connectivity confirmed');
                }
            } else {
                console.warn('⚠️ Runtime environment not loaded, using fallback configuration');
                setIsEnvReady(true); // Continue anyway with fallback
                debugConfig();
            }
        };

        initializeApp();

        // Also listen for runtime env loaded event
        const handleEnvLoaded = () => {
            console.log('📡 Runtime environment loaded event received');
            setIsEnvReady(true);
        };

        window.addEventListener('runtimeEnvLoaded', handleEnvLoaded);
        
        return () => {
            window.removeEventListener('runtimeEnvLoaded', handleEnvLoaded);
        };
    }, []);

    const handleLogin = async (data: { email: string; password: string }) => {
        if (!isEnvReady) {
            toast.error('System not ready', {
                description: 'Please wait for the application to finish loading.',
            });
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            
            console.log('🚀 Starting login process...');
            console.log('📍 API URL:', config.apiUrl);
            console.log('🌍 Environment:', config.isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
            
            // Validate input data
            if (!data.email || !data.password) {
                throw new Error('Email and password are required');
            }
            
            if (!data.email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }
            
            // Make login request using the API client
            console.log('📡 Making login request...');
            const response = await apiClient.post('/auth/login', {
                email: data.email,
                password: data.password
            });
            
            console.log('📥 Response status:', response.status);
            
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error('Failed to parse error response:', parseError);
                    throw new Error(`Login failed (${response.status}): ${response.statusText}`);
                }
                
                console.error('🚫 Login API error:', errorData);
                throw new Error(errorData.error || errorData.message || 'Login failed');
            }

            const result = await response.json();
            console.log('✅ Login response received:', {
                hasToken: !!result.token,
                hasUser: !!result.user,
                userEmail: result.user?.email,
            });
            
            // Validate response structure
            if (!result.token) {
                throw new Error('Invalid server response: missing authentication token');
            }
            
            if (!result.user) {
                throw new Error('Invalid server response: missing user data');
            }
            
            // Save token in both localStorage and cookie
            localStorage.setItem('token', result.token);
            Cookies.set('token', result.token, { expires: 7 }); // Cookie expires in 7 days
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(result.user));
            
            console.log('💾 Authentication data saved to localStorage and cookies');
            
            // Show success message
            toast.success('Welcome back!', {
                description: `Successfully logged in as ${result.user.email || result.user.username || 'user'}`,
            });

            // Small delay to ensure localStorage is written
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect to returnUrl if exists, otherwise to home
            const returnUrl = searchParams.get('returnUrl');
            console.log('🏠 Redirecting to:', returnUrl || '/main/home');
            router.push(returnUrl || '/main/home');
            
        } catch (err) {
            console.error('❌ LOGIN ERROR:', err);
            
            let userMessage = 'Login failed. Please try again.';
            let toastDescription = 'Please check your credentials and try again.';
            
            if (err instanceof TypeError) {
                if (err.message.includes('Failed to fetch')) {
                    console.error('🌐 Network/CORS Error Details:');
                    console.error('- API URL:', config.apiUrl);
                    console.error('- Current origin:', window.location.origin);
                    console.error('- Possible causes:');
                    console.error('  1. Backend server is down');
                    console.error('  2. CORS configuration issue');
                    console.error('  3. Network connectivity problem');
                    console.error('  4. Incorrect API URL configuration');
                    
                    userMessage = 'Unable to connect to the server';
                    toastDescription = 'Please check your internet connection and try again. If the problem persists, contact support.';
                }
            } else if (err instanceof Error) {
                userMessage = err.message;
                toastDescription = err.message;
            }
            
            setError(userMessage);
            toast.error('Login Failed', {
                description: toastDescription,
            });
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Environment loading indicator */}
            {!isEnvReady && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-6 py-3 rounded-lg text-sm z-50 shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Loading environment configuration...</span>
                    </div>
                </div>
            )}

            {/* Development debug panel */}
            {config.isDevelopment && isEnvReady && (
                <div className="fixed top-0 right-0 bg-gray-900 text-white p-3 text-xs z-50 max-w-sm border-l border-b rounded-bl-lg">
                    <div className="space-y-1">
                        <div className="font-bold text-green-400">🛠️ Debug Panel</div>
                        <div>API: {config.apiUrl}</div>
                        <div>ENV: {process.env.NODE_ENV}</div>
                        <div>Runtime Env: {isEnvReady ? '✅ Loaded' : '⏳ Loading...'}</div>
                        <div>Connection: {connectionTested ? '✅ Tested' : '⏳ Testing...'}</div>
                        <div className="text-xs text-gray-400 mt-2">
                            Check console for detailed logs
                        </div>
                    </div>
                </div>
            )}
            
            {/* Connection status indicator */}
            {isEnvReady && !connectionTested && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm z-40">
                    🔍 Testing server connectivity...
                </div>
            )}
            
            <AuthForm 
                mode="login" 
                onSubmit={handleLogin} 
                error={error} 
                isLoading={isLoading || !isEnvReady} 
            />
        </div>
    );
}

// Main page component with Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}