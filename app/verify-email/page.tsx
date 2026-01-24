'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided');
            return;
        }

        const verifyEmail = async () => {
            try {
                const mutation = `
                    mutation VerifyEmail($token: String!) {
                        verifyEmail(token: $token) {
                            id
                            email
                            username
                            emailVerified
                        }
                    }
                `;

                const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: mutation,
                        variables: { token }
                    }),
                });

                const result = await response.json();

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                setUsername(result.data.verifyEmail.username);
                setStatus('success');
                setMessage('Your email has been verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (error: any) {
                console.error('Verification failed:', error);
                setStatus('error');
                setMessage(error.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-[3rem] p-12 max-w-md w-full border border-white/10 shadow-2xl"
            >
                <div className="text-center">
                    {status === 'verifying' && (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 mx-auto mb-6"
                            >
                                <div className="w-full h-full rounded-full border-4 border-[var(--neon-blue)] border-t-transparent"></div>
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gradient uppercase mb-4">Verifying Email</h1>
                            <p className="text-gray-400 font-mono">Scanning quantum signature...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-16 h-16 mx-auto mb-6 text-6xl"
                            >
                                ✅
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gradient uppercase mb-4">Verification Complete!</h1>
                            <p className="text-gray-300 mb-2">Welcome to the grid, <span className="text-gradient font-bold">{username}</span>!</p>
                            <p className="text-gray-400 font-mono text-sm">{message}</p>
                            <p className="text-gray-500 font-mono text-xs mt-4 italic">Redirecting to login...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-16 h-16 mx-auto mb-6 text-6xl"
                            >
                                ❌
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gradient uppercase mb-4">Verification Failed</h1>
                            <p className="text-red-400 mb-6">{message}</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="gradient-cyber px-8 py-3 rounded-2xl font-bold uppercase tracking-widest neon-glow-blue hover:scale-105 transition-transform"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
