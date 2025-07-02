'use client';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard/results');
    } catch (err) {
      alert('Login Failed');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-slate-200  bg-opacity-70 flex justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="bg-white p-4 rounded shadow w-80 z-10">
        <h2 className="text-center text-lg font-bold mb-4">Teacher Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
