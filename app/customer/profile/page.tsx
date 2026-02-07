'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaUser } from 'react-icons/fa';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function CustomerProfilePage() {
  const { user, MohnMenuUser, loading, isCustomer } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isCustomer())) {
      router.push('/login');
    }
  }, [user, loading, isCustomer, router]);

  useEffect(() => {
    if (MohnMenuUser) {
      setDisplayName(MohnMenuUser.displayName || '');
      setPhone((MohnMenuUser as any).phone || '');
      setAddress((MohnMenuUser as any).address || '');
    }
  }, [MohnMenuUser]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName,
        phone,
        address,
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-zinc-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/customer" className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <FaArrowLeft className="text-sm text-zinc-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black">
              Profile<span className="text-orange-600">.</span>
            </h1>
            <p className="text-sm text-zinc-500 font-medium">Manage your account</p>
          </div>
        </div>

        {/* Avatar + Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-zinc-100 p-10 mb-6"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <FaUser className="text-2xl text-white" />
            </div>
            <div>
              <p className="font-black text-black text-xl">{displayName || 'User'}</p>
              <p className="text-sm text-zinc-400 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-5 py-3.5 border border-zinc-100 rounded-xl bg-zinc-50 text-black font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-300 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-3.5 border border-zinc-100 rounded-xl bg-zinc-50 text-black font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-300 text-sm"
                placeholder="(555) 555-5555"
              />
            </div>
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={(parsed) => setAddress(parsed.formatted)}
              label="Delivery Address"
              placeholder="123 Main St, City, State"
              inputClassName="px-5 py-3.5 border-zinc-100 bg-zinc-50 text-black font-bold placeholder:text-zinc-300"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 w-full group bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-bold text-base flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saved ? (
              <><FaCheck /> Saved!</>
            ) : saving ? (
              'Saving...'
            ) : (
              'Save Changes'
            )}
          </button>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-zinc-100 p-6"
        >
          <h3 className="font-bold text-black text-sm mb-3">Account Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-400 font-medium">Email</span>
              <span className="font-bold text-black">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-400 font-medium">Member Since</span>
              <span className="font-bold text-black">
                {MohnMenuUser?.createdAt
                  ? new Date(MohnMenuUser.createdAt).toLocaleDateString()
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-400 font-medium">Account Type</span>
              <span className="font-bold text-orange-600 capitalize">{MohnMenuUser?.role || 'Customer'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
