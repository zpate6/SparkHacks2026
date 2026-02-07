"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Users, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  status: string;
  profileId: string;
}

export default function TestPanelPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Get current user from session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // 2. Fetch all users for the list
    fetch('http://localhost:8080/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const handleManualConnect = async (targetUserId: string) => {
    if (!currentUser) return alert("Please login first");

    try {
      // Calls your manual test endpoint
      const response = await fetch(
        `http://localhost:8080/api/connections/test/manual?user1=${currentUser.id}&user2=${targetUserId}&status=ACCEPTED`, 
        { method: 'POST' }
      );

      if (response.ok) {
        alert(`Connection established with ${targetUserId}! Refresh the graph to see it.`);
      }
    } catch (err) {
      alert("Failed to create connection");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
      Initializing Test Environment...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Test Panel</h1>
              <p className="text-zinc-500 text-sm">Create manual connections for network graph testing</p>
            </div>
          </div>
          <Link href="/homePage" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft size={20} /> Back to App
          </Link>
        </header>

        <div className="grid gap-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">
            <Users size={16} /> Registered Users
          </h2>
          
          {users.map((u) => (
            <div 
              key={u.id} 
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${
                u.id === currentUser?.id 
                ? 'bg-zinc-900/50 border-red-900/50 opacity-80' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
                  {u.id === currentUser?.id ? "👤" : "💼"}
                </div>
                <div>
                  <p className="font-mono text-xs text-zinc-500">USER ID: {u.id}</p>
                  <p className="font-semibold text-zinc-200">
                    Profile Linked: <span className="text-red-500">{u.profileId}</span>
                  </p>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded uppercase font-bold text-zinc-400">
                    {u.status}
                  </span>
                </div>
              </div>

              {u.id !== currentUser?.id ? (
                <button
                  onClick={() => handleManualConnect(u.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-red-900/20 active:scale-95"
                >
                  <LinkIcon size={18} />
                  Connect Instantly
                </button>
              ) : (
                <span className="text-zinc-600 text-sm italic font-medium">You</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}