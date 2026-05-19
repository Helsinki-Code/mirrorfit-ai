"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "@/lib/firebase/client";
import type { ThemeMode, UserProfile } from "@/lib/types";
import { nowUnixMs } from "@/lib/utils/time";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePolicyAck: (payload: {
    authorizedUseConfirmed: boolean;
    adultContentPolicyAck: boolean;
  }) => Promise<void>;
  updateThemePreference: (theme: ThemeMode) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildDefaultProfile(user: User): UserProfile {
  const now = nowUnixMs();
  return {
    id: user.uid,
    email: user.email ?? "",
    name: user.displayName ?? "New User",
    plan: "free",
    authorizedUseConfirmed: false,
    adultContentPolicyAck: false,
    theme: "light",
    createdAt: now,
    updatedAt: now,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDocUnsubscribe: Unsubscribe | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setLoading(true);
      setProfile(null);
      setUser(nextUser);

      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", nextUser.uid);
        const existing = await getDoc(userRef);

        if (!existing.exists()) {
          const defaultProfile = buildDefaultProfile(nextUser);
          await setDoc(userRef, defaultProfile);
          setProfile(defaultProfile);
        }

        userDocUnsubscribe = onSnapshot(
          userRef,
          (snapshot) => {
            if (!snapshot.exists()) return;
            setProfile(snapshot.data() as UserProfile);
            setLoading(false);
          },
          () => {
            setLoading(false);
          },
        );
      } catch {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (userDocUnsubscribe) userDocUnsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", credential.user.uid);
    const now = nowUnixMs();

    await setDoc(userRef, {
      id: credential.user.uid,
      email,
      name,
      plan: "free",
      authorizedUseConfirmed: false,
      adultContentPolicyAck: false,
      theme: "light",
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", credential.user.uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      const now = nowUnixMs();
      await setDoc(userRef, {
        id: credential.user.uid,
        email: credential.user.email ?? "",
        name: credential.user.displayName ?? "Google User",
        plan: "free",
        authorizedUseConfirmed: false,
        adultContentPolicyAck: false,
        theme: "light",
        createdAt: now,
        updatedAt: now,
      });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const updatePolicyAck = useCallback(
    async (payload: {
      authorizedUseConfirmed: boolean;
      adultContentPolicyAck: boolean;
    }) => {
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), {
        ...payload,
        updatedAt: nowUnixMs(),
      });
    },
    [user],
  );

  const updateThemePreference = useCallback(
    async (theme: ThemeMode) => {
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), {
        theme,
        updatedAt: nowUnixMs(),
      });
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      resetPassword,
      signOut,
      updatePolicyAck,
      updateThemePreference,
    }),
    [
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      resetPassword,
      signOut,
      updatePolicyAck,
      updateThemePreference,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
