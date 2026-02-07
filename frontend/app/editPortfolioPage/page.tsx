"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, FileText, ChevronLeft, Save, Plus, Trash2, Award } from "lucide-react";

interface Experience {
  title: string;
  project: string;
  year: number;
}

export default function EditPortfolioPage() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);
  const [mediaLinks, setMediaLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch existing data from Backend
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/");
    const user = JSON.parse(storedUser);

    fetch(`http://localhost:8080/api/users/portfolio/${user.portfolioId}`)
      .then(res => res.json())
      .then(data => {
        setResumeUrl(data.resumeUrl || "");
        setExperience(data.experience || []);
        setMediaLinks(data.mediaLinks || []);
        setSkills(data.skills || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // 2. Handle PDF Resume Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return alert("Please upload a PDF");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/users/portfolio/${user.portfolioId}/resume`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setResumeUrl(updated.resumeUrl);
        alert("Resume Uploaded!");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Save all information to Backend
  const saveAll = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // 1. Save Portfolio (Experience and Links)
    const portPromise = fetch(`http://localhost:8080/api/users/portfolio/${user.portfolioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience, mediaLinks }),
    });

    // 2. Save Profile (Skills)
    // Note: You may need a specific endpoint in UserController.java for profile updates
    const profPromise = fetch(`http://localhost:8080/api/users/profile/${user.profileId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }), // Only send the skills list
    });

    await Promise.all([portPromise, profPromise]);
    alert("Portfolio & Skills Saved!");
    router.push("/viewPublishedProfilePage");
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/homePage" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition"><ChevronLeft /></Link>
            <h1 className="text-3xl font-bold text-white">Edit <span className="text-red-600">Portfolio</span></h1>
          </div>
          <button onClick={saveAll} className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-red-900/20 hover:bg-red-500 transition">
            <Save size={18} /> Save Portfolio
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            {/* Resume Section */}
            <section className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Resume Document</h3>
              <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:bg-red-600/5 transition group"
              >
                <Upload className={`group-hover:text-red-500 ${isUploading ? 'animate-bounce' : ''}`} />
                <span className="text-sm mt-2">{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
              </button>
              {resumeUrl && <p className="mt-4 text-xs text-zinc-500 truncate">Current: {resumeUrl}</p>}
            </section>

            {/* --- NEW: Skills & Talents Section --- */}
            <section className="space-y-4">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Award size={14} className="text-red-600"/> Skills & Talents
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
                    <span className="text-sm text-white">{skill}</span>
                    <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="text-zinc-500 hover:text-red-500">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  id="new-skill" 
                  placeholder="e.g. Method Acting, Singing" 
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-red-600 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) { setSkills([...skills, val]); (e.target as HTMLInputElement).value = ""; }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('new-skill') as HTMLInputElement;
                    if (el.value) { setSkills([...skills, el.value]); el.value = ""; }
                  }}
                  className="p-3 bg-zinc-800 rounded-xl text-red-500 hover:bg-zinc-700"
                >
                  <Plus size={18}/>
                </button>
              </div>
            </section>

            {/* Media Links Section */}
            <section className="space-y-4">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Media & Social Links</h3>
              {mediaLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input value={link} onChange={(e) => {
                    const next = [...mediaLinks]; next[i] = e.target.value; setMediaLinks(next);
                  }} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white" />
                  <button onClick={() => setMediaLinks(mediaLinks.filter((_, idx) => idx !== i))} className="p-3 text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
              <button onClick={() => setMediaLinks([...mediaLinks, ""])} className="w-full py-3 border border-zinc-800 rounded-xl text-xs font-bold">+ Add Link</button>
            </section>
          </div>

          {/* Experience Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Professional Experience</h3>
              <button onClick={() => setExperience([...experience, { title: "", project: "", year: 2026 }])} className="text-red-500 text-xs font-bold">+ Add Role</button>
            </div>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 space-y-3">
                  <input placeholder="Job Title" value={exp.title} onChange={e => {
                    const next = [...experience]; next[i].title = e.target.value; setExperience(next);
                  }} className="w-full bg-transparent text-sm font-bold text-white outline-none" />
                  <div className="flex gap-4">
                    <input placeholder="Project" value={exp.project} onChange={e => {
                      const next = [...experience]; next[i].project = e.target.value; setExperience(next);
                    }} className="flex-1 bg-transparent text-xs text-zinc-400 outline-none" />
                    <input type="number" value={exp.year} onChange={e => {
                      const next = [...experience]; next[i].year = parseInt(e.target.value); setExperience(next);
                    }} className="w-16 bg-transparent text-xs text-zinc-400 outline-none text-right" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}