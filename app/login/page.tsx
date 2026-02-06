'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-[3rem] shadow-[0_20px_100px_rgba(0,0,0,0.05)] border border-zinc-100 p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-black mb-3">
              Welcome Back<span className="text-orange-500">.</span>
            </h1>
            <p className="text-zinc-500 font-medium">
              Sign in to manage your local business.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 border border-zinc-100 rounded-2xl bg-zinc-50 text-black font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  onClick={() => { setShowReset(true); setResetEmail(email); }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-4 border border-zinc-100 rounded-2xl bg-zinc-50 text-black font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-300 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-gradient-to-r from-orange-500 to-red-500 text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <FaArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Forgot Password Modal */}
          {showReset && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-5 bg-zinc-50 rounded-2xl border border-zinc-100"
            >
              <h3 className="font-bold text-black text-sm mb-1">Reset Your Password</h3>
              <p className="text-xs text-zinc-400 mb-4">We&apos;ll send a password reset link to your email.</p>
              {resetSent ? (
                <div className="text-sm text-emerald-600 font-bold">✓ Reset link sent! Check your inbox.</div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={async () => {
                      if (!resetEmail) return;
                      setResetLoading(true);
                      try {
                        await sendPasswordResetEmail(auth, resetEmail);
                        setResetSent(true);
                      } catch {
                        setError('Could not send reset email. Check the address and try again.');
                      } finally {
                        setResetLoading(false);
                      }
                    }}
                    disabled={resetLoading || !resetEmail}
                    className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {resetLoading ? '...' : 'Send'}
                  </button>
                </div>
              )}
              <button onClick={() => { setShowReset(false); setResetSent(false); }} className="text-xs text-zinc-400 hover:text-zinc-600 mt-3 font-medium">
                Cancel
              </button>
            </motion.div>
          )}

          <div className="mt-10 text-center">
            <p className="text-zinc-500 font-medium">
              New to MohnMenu?{' '}
              <Link href="/register">
                <span className="font-bold text-orange-600 hover:text-orange-700 hover:underline decoration-2 underline-offset-4 transition-colors">Create an account</span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
