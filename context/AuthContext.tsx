'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { LOCLUser, LOCLBusiness } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loclUser: LOCLUser | null;
  currentBusiness: LOCLBusiness | null;
  userBusinesses: LOCLBusiness[];
  loading: boolean;
  error: string | null;
  
  // Auth methods
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Business switching
  switchBusiness: (businessId: string) => Promise<void>;
  
  // User info getters
  isOwner: () => boolean;
  isManager: () => boolean;
  isDriver: () => boolean;
  isCustomer: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loclUser, setLoclUser] = useState<LOCLUser | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<LOCLBusiness | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<LOCLBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, set up auth state listener
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.error('Persistence setup error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          setUser(firebaseUser);

          // Fetch LOCL user profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as LOCLUser;
            setLoclUser(userData);

            // Fetch all businesses this user is associated with
            if (userData.businessIds && userData.businessIds.length > 0) {
              const businesses: LOCLBusiness[] = [];

              for (const businessId of userData.businessIds) {
                const businessDocRef = doc(db, 'businesses', businessId);
                const businessDocSnap = await getDoc(businessDocRef);

                if (businessDocSnap.exists()) {
                  businesses.push(businessDocSnap.data() as LOCLBusiness);
                }
              }

              setUserBusinesses(businesses);

              // Set current business (prioritize active, otherwise first one)
              const activeBusiness = userData.activeBusinessId
                ? businesses.find(b => b.businessId === userData.activeBusinessId)
                : businesses[0];

              if (activeBusiness) {
                setCurrentBusiness(activeBusiness);
              }
            }
          } else {
            // User logged in but no LOCL profile - shouldn't happen in normal flow
            console.warn('User authenticated but no LOCL profile found');
          }
        } else {
          // User logged out
          setUser(null);
          setLoclUser(null);
          setCurrentBusiness(null);
          setUserBusinesses([]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Auth state change error';
        setError(message);
        console.error('Auth state error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
  ) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create LOCL user profile
      const loclUserData: LOCLUser = {
        uid: result.user.uid,
        email,
        displayName: email,
        role: 'customer',
        businessIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, loclUserData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setLoclUser(null);
      setCurrentBusiness(null);
      setUserBusinesses([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  };

  const switchBusiness = async (businessId: string) => {
    try {
      const business = userBusinesses.find(b => b.businessId === businessId);
      if (!business) {
        throw new Error('Business not found');
      }

      setCurrentBusiness(business);

      // Update active business in LOCL user profile
      if (loclUser && user) {
        const updatedUser: LOCLUser = {
          ...loclUser,
          activeBusinessId: businessId,
          updatedAt: new Date().toISOString(),
        };
        setLoclUser(updatedUser);
        
        // Update in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, updatedUser);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to switch business';
      setError(message);
      throw err;
    }
  };

  const isOwner = () => loclUser?.role === 'owner';
  const isManager = () => loclUser?.role === 'manager';
  const isDriver = () => 
    loclUser?.role === 'driver_inhouse' || loclUser?.role === 'driver_marketplace';
  const isCustomer = () => loclUser?.role === 'customer';
  const isAdmin = () => loclUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loclUser,
        currentBusiness,
        userBusinesses,
        loading,
        error,
        loginWithEmail,
        signUpWithEmail,
        logout,
        switchBusiness,
        isOwner,
        isManager,
        isDriver,
        isCustomer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
