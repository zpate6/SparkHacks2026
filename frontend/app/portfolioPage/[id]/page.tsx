// app/portfolioPage/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

interface PortfolioData {
  resumeUrl: string;
  experience: Array<{ title: string; project: string; year: number }>;
  mediaLinks: string[];
}

interface ProfileData {
  firstName: string;
  lastName: string;
  profession: string;
}

export default function ViewPortfolioPage({ params }: Props) {
  const { id } = use(params); // The profileId from the URL
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchData() {
    try {
      // 1. Fetch Profile for names/role
      const profileRes = await fetch(`http://localhost:8080/api/users/profile/${id}`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      // 2. Fetch User by profileId to get the portfolioId
      const userRes = await fetch(`http://localhost:8080/api/users/by-profile/${id}`);
      const userData = await userRes.json();

      // 3. Safety Check: If portfolioId is null, don't fetch and show a default state
      if (!userData.portfolioId) {
        console.warn("User has no portfolioId assigned.");
        setLoading(false);
        return;
      }

      // 4. Fetch actual Portfolio using the ID from User
      const portfolioRes = await fetch(`http://localhost:8080/api/portfolios/${userData.portfolioId}`);
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData);
      
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Portfolio...</div>;

  return (
    <div className="relative min-h-screen bg-black text-zinc-300 font-sans p-6">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-900/20 to-transparent" />

      <div className="relative max-w-4xl mx-auto pt-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-red-500 text-xl font-medium tracking-wide uppercase">
              {profile?.profession}
            </p>
          </div>
          <Link href="/homePage" className="px-6 py-2 border border-zinc-700 rounded-full hover:bg-zinc-800 transition">
            Back to Discovery
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h3 className="text-zinc-500 text-sm font-bold uppercase mb-4 tracking-widest">Resume Summary</h3>
              <p className="text-lg leading-relaxed text-zinc-200">
                {portfolio?.resumeUrl || "Professional resume details are currently being updated by the user."}
              </p>
            </section>

            <section>
              <h3 className="text-zinc-500 text-sm font-bold uppercase mb-6 tracking-widest">Experience</h3>
              <div className="space-y-6">
                {portfolio?.experience?.map((exp, i) => (
                  <div key={i} className="border-l-2 border-red-600 pl-6 py-1">
                    <h4 className="text-white font-bold text-lg">{exp.title}</h4>
                    <p className="text-zinc-400">{exp.project} • {exp.year}</p>
                  </div>
                )) || <p className="text-zinc-500 italic">No experience listed yet.</p>}
              </div>
            </section>
          </div>

          {/* Sidebar / Links */}
          <div className="space-y-8">
            <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
              <h3 className="text-white font-bold mb-4">Media & Links</h3>
              <ul className="space-y-3">
                {portfolio?.mediaLinks?.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" className="text-red-400 hover:text-red-300 text-sm break-all">
                      {link}
                    </a>
                  </li>
                )) || <p className="text-zinc-500 text-xs">No external links available.</p>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}