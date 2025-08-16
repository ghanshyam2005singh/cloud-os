"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    if(error) setError(error.message);
    else window.location.href = "/web/Desktop";
  }
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else setShowRegister(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-white text-center">Cloud OS</h1>
        <p className="text-lg text-gray-200 mb-6 text-center">
          Unlock your web-native desktop
        </p>
        {!showRegister ? (
          <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={e=> setUsername(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-3"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-3"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md w-full font-semibold"
              >
                Unlock
              </button>
            </form>
             <button
              className="mt-4 text-blue-300 hover:underline w-full"
              onClick={() => setShowRegister(true)}
            >
              Create New User
            </button>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-3"
                required
              />
              <input
                type="password"
                placeholder="Choose Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-3"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md w-full font-semibold"
              >
                Register
              </button>
            </form>
            <button
              className="mt-4 text-blue-300 hover:underline w-full"
              onClick={() => setShowRegister(false)}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}