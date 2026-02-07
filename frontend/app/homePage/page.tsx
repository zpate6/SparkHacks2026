"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import actor from "../photos/actor.png";
import director from "../photos/director.png";
import musician from "../photos/musician.png";
import producer from "../photos/producer.png";
import writer from "../photos/scriptwriter.png";
import studio from "../photos/studio.png";
import { Heart, X, MessageCircle, User, Star, MapPin, Briefcase, Film, Award, Layers, BookOpen, Share2 } from "lucide-react";
import MiniNetwork from "@/components/MiniNetwork";

interface Profile {
  id: string;
  name: string;
  role: string;
  distance: string;
  image: string;
  bio: string;
  tags: string[];
}

interface User {
  id: string;
  name?: string;
  email: string;
  type: string;
  profileId: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchProfiles = async () => {
      try {
        // 1. Get user's profile to get zipcode
        const profileRes = await fetch(`http://localhost:8080/api/users/profile/${parsedUser.profileId}`);
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();

        // 2. Get recommendations
        // Use profileId so backend can correctly filter out the current user
        const res = await fetch(`http://localhost:8080/api/connections/cards/${parsedUser.profileId}?zipcode=${profileData.zipcode}`);
        if (res.ok) {
          const data = await res.json();
          // Transform backend data to match frontend expectations if needed
          // Assuming backend returns list of Profile objects matching the interface largely
          // but we might need to map 'profession' to 'role' or similar if they differ.
          // Let's check the backend model: Profile has firstName, lastName, profession, zipcode, skills, genres, preferredPay.
          // Frontend Profile interface needs: id, name, role, distance, image, bio, tags.

          // Helper to get default image based on role
          const getDefaultImage = (role: string) => {
            const normalizedRole = role?.toLowerCase() || "";
            if (normalizedRole.includes("director")) return director;
            if (normalizedRole.includes("producer")) return producer;
            if (normalizedRole.includes("musician")) return musician;
            if (normalizedRole.includes("writer")) return writer;
            if (normalizedRole.includes("actor")) return actor;
            if (normalizedRole.includes("studio")) return studio;
            return director; // Fallback
          };

          const mappedProfiles = data.map((p: any) => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            role: p.profession,
            distance: "10 miles away", // Mock distance for now as backend doesn't calculate it yet
            image: p.image || getDefaultImage(p.profession), // Use uploaded image or role-based default
            bio: p.bio || "No bio available", // Add bio to backend model if missing, or use default
            tags: p.skills || [],
          }));
          setProfiles(mappedProfiles);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [router]);

  const handleSwipe = async (dir: "left" | "right") => {
    if (!user || profiles.length === 0) return;

    const targetProfile = profiles[currentProfileIndex];
    setDirection(dir);

    // Send swipe to backend
    // Use profileId for both requester and target to maintain consistency in the graph
    try {
      await fetch(`http://localhost:8080/api/connections/swipe?requesterId=${user.profileId}&targetId=${targetProfile.id}&rightSwipe=${dir === 'right'}`, {
        method: 'POST'
      });
    } catch (err) {
      console.error("Error sending swipe:", err);
    }

    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setDirection(null);
    }, 300);
  };

  if (!user) return null;

  // Show loading or empty state if no profiles
  if (profiles.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col bg-black text-white items-center justify-center">
        <div className="text-xl">Finding matching profiles...</div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden font-sans">
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-900/40">
            <span className="text-xl">🎬</span>
          </div>
          <h1 className="text-xl font-bold">Entertainment <span className="text-red-600">Tinder</span></h1>
        </div>
        {/* Navigation / Logout */}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE: Swiping Area */}
        <main className="flex-[0.6] flex flex-col items-center justify-center relative border-r border-zinc-800 bg-zinc-950/50">
          <div className="relative w-full max-w-sm h-[600px]">
            <div className={`absolute w-full h-full rounded-[32px] bg-zinc-900 overflow-hidden shadow-2xl border border-zinc-800 transition-transform duration-300 ${direction === "left" ? "-translate-x-[150%] rotate-[-20deg]" : direction === "right" ? "translate-x-[150%] rotate-[20deg]" : ""}`}>
              <div className="relative h-full w-full">
                <Image src={currentProfile.image} alt={currentProfile.name} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                   <h2 className="text-4xl font-bold">{currentProfile.name}</h2>
                   <p className="text-red-500 font-semibold">{currentProfile.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 z-10">
            <button onClick={() => handleSwipe("left")} className="h-16 w-16 rounded-full bg-zinc-800 text-red-500 flex items-center justify-center hover:bg-zinc-700 transition"><X size={32}/></button>
            <button onClick={() => handleSwipe("right")} className="h-16 w-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition shadow-lg shadow-red-900/50"><Heart size={32} fill="currentColor"/></button>
          </div>
        </main>

        {/* RIGHT SIDE: Detailed Profile View */}
        <aside className="flex-[0.4] bg-zinc-900 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><BookOpen size={16}/> Biography</h3>
              <p className="text-zinc-300 leading-relaxed text-lg">{currentProfile.bio}</p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><Layers size={16}/> Skills & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300">#{tag}</span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><Award size={16}/> Industry Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Location</p>
                  <p className="font-medium">{currentProfile.distance}</p>
                </div>
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">Current Role</p>
                  <p className="font-medium">{currentProfile.role}</p>
                </div>
              </div>
            </section>

            {/* NEW: Mini Network View */}
            <section>
              <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">
                <Share2 size={16}/> How you're connected
              </h3>
              <MiniNetwork fromId={user.profileId} toId={currentProfile.id} />
            </section>
                    
            {/* Call to action */}
            <div className="pt-4">
              <Link href={`/portfolioPage/${currentProfile.id}`} className="block w-full text-center py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl border border-zinc-700 transition font-bold">
                View Full Portfolio
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Nav */}
      <nav className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 pb-8 md:pb-4">
        <ul className="flex items-center justify-around">
          <li>
            <Link href="/homePage" className="flex flex-col items-center gap-1 text-red-600">
              <Film size={24} strokeWidth={2.5} />
            </Link>
          </li>
          {/* this is the star */}
          {/* <li>
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <Star size={24} />
            </button>
          </li> */}
          <li>
            <Link href="/communicationPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <MessageCircle size={24} />
            </Link>
          </li>
          <li>
            <Link href="/portfolioPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <User size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 pt-14 md:pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-lg shadow-red-900/40">
            <span className="text-xl">🎬</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Entertainment <span className="text-red-600">Tinder</span>
          </h1>
        </div>
        <button
          className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main Card Area */}
      <main className="flex-1 px-4 py-2 flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-sm h-[65vh] md:h-[600px]">
          {/* Background Cards (Mock Stack Effect) */}
          <div className="absolute top-4 scale-95 opacity-50 w-full h-full rounded-[32px] bg-zinc-800 border border-zinc-700 origin-bottom transform transition-all duration-300"></div>
          <div className="absolute top-2 scale-[0.97] opacity-70 w-full h-full rounded-[32px] bg-zinc-800 border border-zinc-700 origin-bottom transform transition-all duration-300"></div>

          {/* Active Card */}
          <div
            className={`absolute w-full h-full rounded-[32px] bg-zinc-900 overflow-hidden shadow-2xl shadow-black border border-zinc-800 transition-transform duration-300 ease-out ${direction === "left"
              ? "-translate-x-[150%] rotate-[-20deg]"
              : direction === "right"
                ? "translate-x-[150%] rotate-[20deg]"
                : ""
              }`}
          >
            {/* Image */}
            <div className="relative h-[65%] w-full">
              <Image
                src={currentProfile.image}
                alt={currentProfile.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 w-full p-6 flex flex-col gap-3 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent pt-12">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    {currentProfile.name}
                  </h2>
                  <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-medium text-red-500 border border-red-600/30">
                    {currentProfile.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{currentProfile.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>Available</span>
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                {currentProfile.bio}
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                {currentProfile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 border border-zinc-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Overlay indicators */}
            {direction === 'left' && (
              <div className="absolute top-8 right-8 text-4xl font-bold text-red-500 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12 opacity-80">NOPE</div>
            )}
            {direction === 'right' && (
              <div className="absolute top-8 left-8 text-4xl font-bold text-green-500 border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12 opacity-80">LIKE</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-6 z-10">
          <button
            onClick={() => handleSwipe("left")}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-red-500 shadow-lg transition active:scale-95 hover:bg-zinc-700 hover:text-red-400 border border-zinc-700"
          >
            <X size={32} strokeWidth={2.5} />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-blue-400 shadow-lg transition active:scale-95 hover:bg-zinc-800 hover:text-blue-300 border border-zinc-800">
            <Star size={20} fill="currentColor" className="text-blue-400" />
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white shadow-lg shadow-red-900/50 transition active:scale-95 hover:from-red-500 hover:to-red-800"
          >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
          </button>


        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 pb-8 md:pb-4">
        <ul className="flex items-center justify-around">
          <li>
            <Link href="/homePage" className="flex flex-col items-center gap-1 text-red-600">
              <Film size={24} strokeWidth={2.5} />
            </Link>
          </li>
          <li>
            <Link href="/communicationPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <MessageCircle size={24} />
            </Link>
          </li>
          <li>
            <Link href="/portfolioPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <User size={24} />
            </Link>
          </li>
          <li>
            <Link href="/searchPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <Map size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
