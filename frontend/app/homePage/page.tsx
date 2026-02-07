"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-[520px] rounded-[28px] bg-zinc-900 p-8 shadow-[0_10px_50px_rgba(220,38,38,0.35)]">
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome 🎬
        </h1>

        {user.name && (
          <p className="text-zinc-300 mb-2">
            <span className="text-red-500">Name:</span> {user.name}
          </p>
        )}

        <p className="text-zinc-300 mb-6">
          <span className="text-red-500">Email:</span> {user.email}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
          className="w-full rounded-full border-2 border-red-600 py-3 text-red-500 hover:bg-red-600 hover:text-white transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
