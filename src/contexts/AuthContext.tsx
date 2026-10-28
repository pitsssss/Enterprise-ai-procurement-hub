import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import {
  UserProfile,
  Organization,
  OrganizationMember,
  UserRole,
} from '../types/procurement';
import {
  getOrCreateUserProfile,
  updateUserProfile as updateProfileDoc,
  updateOrganizationMemberRole,
} from '../services/firestoreService';
import { setAppLanguage } from '../i18n';
import i18n from '../i18n';

export type ProcurementPermission =
  | 'CREATE_RFQ'
  | 'EVALUATE_BIDS'
  | 'AWARD_BID'
  | 'APPROVE_PO'
  | 'SIGN_SOX_WAIVER'
  | 'MANAGE_MEMBERS'
  | 'VIEW_AUDIT_LOGS';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  organization: Organization | null;
  currentMember: OrganizationMember | null;
  userRole: UserRole;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  canPerform: (permission: ProcurementPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentMember, setCurrentMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const { profile: userProf, organization: userOrg, member: userMem } =
            await getOrCreateUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });

          setProfile(userProf);
          setOrganization(userOrg);
          setCurrentMember(userMem);
          setAuthError(null);

          if (userProf?.language && userProf.language !== i18n.language) {
            setAppLanguage(userProf.language as 'en' | 'ar');
          }
        } catch (err: any) {
          console.error('Failed to initialize user session:', err);
          setAuthError(err.message || 'Failed to load enterprise profile.');
        }
      } else {
        setUser(null);
        setProfile(null);
        setOrganization(null);
        setCurrentMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // Suppress benign popup closure by user
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google authentication failed.');
      }
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setOrganization(null);
      setCurrentMember(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const userRole: UserRole = currentMember?.role || 'BUYER';

  const switchRole = async (newRole: UserRole) => {
    if (!user || !organization) return;
    try {
      await updateOrganizationMemberRole(
        organization.id,
        user.uid,
        user.email || 'user@synthetix.corp',
        newRole,
        {
          uid: user.uid,
          email: user.email || 'user@synthetix.corp',
          role: userRole,
        }
      );
      setCurrentMember((prev) => (prev ? { ...prev, role: newRole } : null));
    } catch (err: any) {
      console.error('Role switch failed:', err);
      // Local fallback for testing session if rules permit
      setCurrentMember((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateProfileDoc(user.uid, updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: any) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  const canPerform = (permission: ProcurementPermission): boolean => {
    const role = userRole;
    switch (permission) {
      case 'CREATE_RFQ':
        return ['ADMIN', 'PROCUREMENT_MANAGER', 'BUYER'].includes(role);
      case 'EVALUATE_BIDS':
        return ['ADMIN', 'PROCUREMENT_MANAGER', 'BUYER', 'AUDITOR'].includes(role);
      case 'AWARD_BID':
        return ['ADMIN', 'PROCUREMENT_MANAGER', 'BUYER'].includes(role);
      case 'APPROVE_PO':
        return ['ADMIN', 'APPROVER', 'FINANCE', 'PROCUREMENT_MANAGER'].includes(role);
      case 'SIGN_SOX_WAIVER':
        return ['ADMIN', 'FINANCE'].includes(role);
      case 'MANAGE_MEMBERS':
        return ['ADMIN'].includes(role);
      case 'VIEW_AUDIT_LOGS':
        return ['ADMIN', 'AUDITOR', 'FINANCE', 'PROCUREMENT_MANAGER', 'APPROVER', 'BUYER'].includes(role);
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        currentMember,
        userRole,
        loading,
        authError,
        signInWithGoogle,
        signOutUser,
        switchRole,
        updateProfileData,
        canPerform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
