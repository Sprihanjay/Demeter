// src/App.tsx
import React, { useState, useEffect } from "react";
import {
  auth,
  signUpWithEmail,
  signInWithEmail,
  logout,
  onAuthStateChanged,
  signInWithGoogle,
} from "../firebaseConfig";
import type { User } from "firebase/auth";

function AuthPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // ---------------- Auth ----------------
  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      alert("Sign-up successful!");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      alert("Sign-in successful!");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // ---------------- Upload ----------------
  const uploadToServer = async (file: File) => {
    if (!user) return alert("You must be logged in.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uid", user.uid); // required for user-specific path

    try {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert("Upload successful! URL:\n" + data.url);
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) return alert("Choose a file first.");
    uploadToServer(selectedFile);
  };

  const handleUploadImage = () => {
    if (!selectedImage) return alert("Choose an image first.");
    uploadToServer(selectedImage);
  };

  // ---------------- Render ----------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Firebase Auth & Upload Test</h1>

      {user ? (
        <div className="flex flex-col gap-4">
          <p>Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Log Out
          </button>

          {/* Upload File */}
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="font-semibold">Upload a JSON File</h2>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={handleUploadFile}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Upload File
            </button>
          </div>

          {/* Upload Image */}
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="font-semibold">Upload Image/PDF</h2>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            />
            <button
              onClick={handleUploadImage}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Upload Image
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-w-xs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={handleSignUp}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign Up
          </button>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-red-500 text-white rounded mt-2"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
