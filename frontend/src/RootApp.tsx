// src/RootApp.tsx
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import type { User } from "firebase/auth";

import AuthPage from "./AuthPage"; // <-- your login UI
import RenderScreen from "../pages/RenderScreen"; // <-- the bottom nav app

export default function RootApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? <RenderScreen /> : <AuthPage />;
}
