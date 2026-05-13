import { useState, useEffect } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from "firebase/auth";
import { auth } from "../lib/firebase";

import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    // Check if Firebase is initialized with valid keys
    if (!auth.app.options.apiKey || auth.app.options.apiKey === "your-api-key") {
      toast.error("Firebase keys are missing!", {
        description: "Please add your Firebase credentials to the .env file to enable Sign In.",
      });
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error("Sign in failed", {
        description: error.message || "Please check your Firebase console and .env keys.",
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, loginWithGoogle, logout };
}
