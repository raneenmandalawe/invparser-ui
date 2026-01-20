'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuth } from '@/lib/auth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Toast from '@/components/ui/toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin') {
            setAuth(true);
            router.push('/dashboard');
        } else {
            setError('Invalid username or password');
            setShowToast(true);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-2">Login</h2>
                <p className="text-slate-500 mb-6">Enter your credentials to continue</p>
                {showToast && error && <Toast message={error} type="error" />}
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </div>
    );
};

export default LoginPage;