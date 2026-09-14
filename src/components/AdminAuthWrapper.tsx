import React, { useState, useEffect, createContext, useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Shield, ShieldAlert, LogOut, Loader2, LogIn } from 'lucide-react';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminStatus(currentUser);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkAdminStatus = async (currentUser: User) => {
    try {
      setLoading(true);
      setError(null);
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        setIsAdmin(true);
      } else {
        // Auto-provision initial admin for prototype
        if (currentUser.email === 'domislinkint@gmail.com') {
          await setDoc(adminDocRef, {
            email: currentUser.email,
            createdAt: new Date()
          });
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setError('You do not have administrative privileges.');
        }
      }
    } catch (err: any) {
      console.error('Error checking admin status:', err);
      setError('Failed to verify admin permissions.');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const signOutAdmin = async () => {
    await signOut(auth);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, error, signIn, signOutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export function AdminProtectedView({ children, requireAdmin = true }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, isAdmin, loading, error, signIn, signOutAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white/50 backdrop-blur-sm border border-[#D4AF37]/30 rounded-2xl h-full w-full min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#0A192F] animate-spin" />
        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Verifying Credentials...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-xl max-w-md mx-auto my-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]" />
        <div className="w-16 h-16 bg-[#0A192F] rounded-full flex items-center justify-center text-[#D4AF37] shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-serif font-black uppercase text-[#0A192F] text-xl">Restricted Access</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">Authentication is required to access the Administrative Dashboard, Audit Logs, and Financial Records.</p>
        </div>
        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#0A192F] text-[#D4AF37] font-mono text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#132545] transition-all transform hover:scale-[1.02]"
        >
          <LogIn className="w-5 h-5" />
          Sign In with Google
        </button>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white border border-red-500/30 rounded-2xl shadow-xl max-w-md mx-auto my-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-serif font-black uppercase text-[#0A192F] text-xl">Clearance Denied</h3>
          <p className="text-sm text-red-600/80 mt-2 leading-relaxed">{error || 'You do not have the required administrative clearance to view this module.'}</p>
          <p className="text-xs text-gray-400 font-mono mt-4 bg-gray-50 py-1.5 px-3 rounded-lg inline-block">User: {user.email}</p>
        </div>
        <button 
          onClick={signOutAdmin}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-mono text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Admin Header Ribbon */}
      <div className="bg-[#0A192F] text-white px-4 py-2 flex flex-col sm:flex-row items-center justify-between border-b-4 border-[#D4AF37] z-10 shrink-0">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Secure Admin Session</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-mono text-gray-400">{user.email}</span>
          <button 
            onClick={signOutAdmin}
            className="text-xs font-mono text-white/70 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 min-h-0 bg-white">
        {children}
      </div>
    </div>
  );
}
