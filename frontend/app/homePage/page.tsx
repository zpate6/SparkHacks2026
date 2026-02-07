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
import llogo from "../photos/curtaincalllogo.png";
import { Heart, X, MessageCircle, User, Star, MapPin, Briefcase, Film, Award, Layers, BookOpen, Share2, Clapperboard, LogOut } from "lucide-react";
import MiniNetwork from "@/components/MiniNetwork";
import { randomBeta } from "d3";

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
  const [loading, setLoading] = useState(true);
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
      } finally{
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [router]);

  const isStackEmpty = profiles.length === 0 || currentProfileIndex >= profiles.length;
  const currentProfile = !isStackEmpty ? profiles[currentProfileIndex] : null;

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

  // 1. Initial Loading State
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col bg-black text-white items-center justify-center">
        <div className="text-xl animate-pulse">Finding matching profiles...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden font-sans">
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-800 shrink-0 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-cefnter justify-center rounded-full shadow-lg shadow-red-900/40">
            <Image
              src={llogo}
              alt="Curtain Call logo"
              width={104}
              height={104}
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Curtain <span className="text-red-600">Call</span>
          </h1>
        </div>
        
        {/* Functional Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("user"); // Clears session
            router.push("/");               // Redirects to login page
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800 active:scale-95"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl animate-pulse text-zinc-500">Scanning the network...</div>
          </div>
        ) : (
          <>
            {/* LEFT SIDE: Swiping Area (Always Visible) */}
            <main className="flex-[0.6] flex flex-col items-center justify-center relative border-r border-zinc-800 bg-zinc-950/50">
              <div className="relative w-full max-w-sm h-[600px]">
                {!isStackEmpty ? (
                  /* Real User Card */
                  <div className={`absolute w-full h-full rounded-[32px] bg-zinc-900 overflow-hidden shadow-2xl border border-zinc-800 transition-transform duration-300 ${direction === "left" ? "-translate-x-[150%] rotate-[-20deg]" : direction === "right" ? "translate-x-[150%] rotate-[20deg]" : ""}`}>
                    <div className="relative h-full w-full">
                      <Image src={currentProfile!.image} alt={currentProfile!.name} fill className="object-cover" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8">
                         <h2 className="text-4xl font-bold">{currentProfile!.name}</h2>
                         <p className="text-red-500 font-semibold">{currentProfile!.role}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GENERIC "NO USER FOUND" CARD */
                  <div className="absolute w-full h-full rounded-[32px] bg-zinc-900 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-center p-8">
                    <Clapperboard size={80} className="text-zinc-800 mb-6" />
                    <h2 className="text-2xl font-bold text-zinc-400 mb-2">No More Matches</h2>
                    <p className="text-zinc-600 text-sm">You've reached the end of the reel. Check back later for new talent.</p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS (Disabled if no user found) */}
              <div className={`mt-8 flex items-center gap-6 z-10 transition-opacity ${isStackEmpty ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <button onClick={() => handleSwipe("left")} className="h-16 w-16 rounded-full bg-zinc-800 text-red-500 flex items-center justify-center border border-zinc-700"><X size={32}/></button>
                <button onClick={() => handleSwipe("right")} className="h-16 w-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-900/50"><Heart size={32} fill="currentColor"/></button>
              </div>
            </main>

            {/* RIGHT SIDE: Sidebar (Always Visible) */}
            <aside className="flex-[0.4] bg-zinc-900 overflow-y-auto p-8 custom-scrollbar">
              {!isStackEmpty ? (
                /* Profile Details */
                 <div className="space-y-8">
                 <section>
                   <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><BookOpen size={16}/> Biography</h3>
                   <p className="text-zinc-300 leading-relaxed text-lg">{currentProfile!.bio}</p>
                 </section>

                 <section>
                   <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><Layers size={16}/> Skills & Tags</h3>
                   <div className="flex flex-wrap gap-2">
                    {currentProfile!.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300">#{tag}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4"><Award size={16}/> Industry Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <p className="text-xs text-zinc-500 mb-1">Location</p>
                      <p className="font-medium">{currentProfile!.distance}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <p className="text-xs text-zinc-500 mb-1">Current Role</p>
                      <p className="font-medium">{currentProfile!.role}</p>
                    </div>
                  </div>
                </section>

                {/* NEW: Mini Network View */}
                <section>
                  <h3 className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">
                    <Share2 size={16}/> How you're connected
                  </h3>
                  <MiniNetwork fromId={user.profileId} toId={currentProfile!.id} />
                </section>
                        
                {/* Call to action */}
                <div className="pt-4">
                  <Link href={`/portfolioPage/${currentProfile!.id}`} className="block w-full text-center py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl border border-zinc-700 transition font-bold">
                    View Full Portfolio
                  </Link>
                </div>
              </div>
              ) : (
                /* EMPTY SIDEBAR STATE */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Film className="text-zinc-800" size={48} />
                  <p className="text-zinc-600 italic">Select a profile to view details</p>
                </div>
              )}
            </aside>
          </>
        )}
      </div>

      <nav className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 pb-10 shrink-0">
        <ul className="flex items-center justify-around max-w-md mx-auto">
          <li><Link href="/homePage" className="text-red-600"><Film size={28} strokeWidth={2.5} /></Link></li>
          <li><Link href="/communicationPage" className="text-zinc-500 hover:text-zinc-300 transition"><MessageCircle size={28} /></Link></li>
          <li><Link href="/viewPublishedProfilePage" className="text-zinc-500 hover:text-zinc-300 transition"><User size={28} /></Link></li>
        </ul>
      </nav>
    </div>
  );
}
