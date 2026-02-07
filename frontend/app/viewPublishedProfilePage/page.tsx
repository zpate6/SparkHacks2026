"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ChevronLeft, Globe, DollarSign, Briefcase, Award } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

/* ---------- Types matching Backend Models ---------- */
interface Experience {
  title: string;
  project: string;
  year: number;
}

interface PreferredPay {
  amount: number;
  type: string; // HOURLY, PER_PROJECT
}

interface PortfolioData {
  resumeUrl: string;
  experience: Experience[];
  mediaLinks: string[];
}

interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
  zipcode: string;
  skills: string[];
  genres: string[];
  image: string;
  preferredPay: PreferredPay;
}

export default function ViewPublishedPortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const localUser = JSON.parse(stored);

        // 1. Fetch User to get the linked IDs
        const userRes = await fetch(`http://localhost:8080/api/users/by-profile/${localUser.profileId}`);
        const userData = await userRes.json();

        // 2. Fetch the Portfolio data
        const portRes = await fetch(`http://localhost:8080/api/users/portfolio/${userData.portfolioId}`);
        const portData = await portRes.json();
        setPortfolio(portData);

        // 3. Fetch the Profile data
        const profRes = await fetch(`http://localhost:8080/api/users/profile/${localUser.profileId}`);
        const profData = await profRes.json();
        setProfile(profData);

      } catch (err) {
        console.error("Error loading portfolio details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
      Loading professional profile...
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black px-4 md:px-8 py-10 font-sans text-zinc-300">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Header with Profile Info */}
        <header className="mb-10 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {profile?.image ? (
              <img src={profile.image} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-red-600" />
            ) : (
              <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-900/40">
                <Globe size={32} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{profile?.firstName} {profile?.lastName}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-red-500 font-medium flex items-center gap-1"><Briefcase size={14}/> {profile?.profession}</span>
                <span className="text-zinc-500">• {profile?.zipcode}</span>
              </div>
            </div>
          </div>
          <Link href="/homePage" className="text-zinc-400 hover:text-white transition flex items-center gap-2 font-medium">
            <ChevronLeft size={20} /> Back Home
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Resume Viewer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
              <FileText size={20}/> Resume Viewer
            </h2>
            <div className="h-[800px] w-full bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
              {portfolio?.resumeUrl ? (
                <iframe
                  src={`http://localhost:8080${portfolio.resumeUrl}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="Professional Resume"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-500 italic">
                  No resume has been uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Details & Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Rates & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <section className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Skills & Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-white">{s}</span>
                  ))}
                  {profile?.genres?.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-red-900/20 border border-red-900/30 rounded-full text-xs text-red-400">{g}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* Experience */}
            <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-xl">
              <h4 className="text-sm font-bold text-red-600 uppercase tracking-widest border-b border-zinc-800 pb-4 mb-6">Professional Experience</h4>
              <div className="space-y-6">
                {portfolio?.experience && portfolio.experience.length > 0 ? (
                  portfolio.experience.map((e, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-zinc-800 hover:border-red-600 transition-colors py-1 group">
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-zinc-800 border border-black group-hover:bg-red-600 transition-colors" />
                      <h5 className="text-white font-bold text-lg leading-none">{e.title}</h5>
                      <p className="text-zinc-500 text-sm mt-1">{e.project}</p>
                      <span className="inline-block mt-2 text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-400">{e.year}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 italic text-sm">No roles listed yet.</p>
                )}
              </div>
            </section>

            {/* Links */}
            <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Media & External Links</h4>
              <div className="grid gap-3">
                {portfolio?.mediaLinks && portfolio.mediaLinks.length > 0 ? (
                  portfolio.mediaLinks.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600/50 transition group">
                      <span className="text-xs truncate max-w-[200px]">{link}</span>
                      <Globe size={14} className="text-zinc-600 group-hover:text-red-500" />
                    </a>
                  ))
                ) : (
                  <p className="text-zinc-600 italic text-xs">No links provided.</p>
                )}
              </div>
            </section>
            
            <Link
              href="/editPortfolioPage"
              className="block w-full py-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition shadow-lg active:scale-[0.98]"
            >
              Edit My Portfolio
            </Link>
          </div>
        </div>
        <BottomNav></BottomNav>
      </div>
    </div>
  );
}
