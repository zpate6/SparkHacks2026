"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Send, ChevronLeft, Award, User, MessageSquare } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

/* --- Match Backend Models --- */
interface ChatMessage {
  senderId: string;
  text: string;
  timestamp: string;
}

interface Thread {
  id: string;
  participants: string[];
  messages: ChatMessage[];
}

interface ConnectionInfo {
  profileId: string;
  name: string;
  profession: string;
}

export default function CommunicationPage() {
  const [connections, setConnections] = useState<ConnectionInfo[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // 1. Load Connections from Backend
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    setCurrentUserId(user.id);

    // Fetch accepted connections from ConnectionService logic
    fetch(`http://localhost:8080/api/connections/graph`)
      .then(res => res.json())
      .then(data => {
        // Filter nodes to show only other people you are connected to
        const filtered = data.nodes.filter((n: any) => n.id !== user.id);
        setConnections(filtered);
        if (filtered.length > 0) setSelectedProfileId(filtered[0].id);
      });
  }, []);

  // 2. Fetch Messages for Selected Connection
  useEffect(() => {
    if (!selectedProfileId) return;
    // Implementation matches MessageRepository.findByParticipantsContaining
    fetch(`http://localhost:8080/api/messages/thread?userA=${currentUserId}&userB=${selectedProfileId}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  }, [selectedProfileId, currentUserId]);

  const handleSend = async () => {
    if (!input.trim() || !selectedProfileId) return;

    const newMessage = {
      senderId: currentUserId,
      text: input,
      timestamp: new Date().toISOString()
    };

    // Optimistic Update
    setMessages([...messages, newMessage]);
    setInput("");

    // Backend POST (Connects to Message model)
    await fetch(`http://localhost:8080/api/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participants: [currentUserId, selectedProfileId],
        message: newMessage
      })
    });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[800px] bg-zinc-950 rounded-[2.5rem] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="bg-red-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/homePage" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
              <ChevronLeft className="text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Professional Network</h1>
              <p className="text-xs text-red-100 italic">Collaborate with your matched industry peers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
            <Award size={16} className="text-yellow-400" />
            <span className="text-xs font-bold text-white uppercase tracking-tighter">Verified Pro</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Active Matches */}
          <aside className="w-80 border-r border-zinc-900 bg-zinc-950 overflow-y-auto">
            <div className="p-4 border-b border-zinc-900">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Matches</h3>
            </div>
            {connections.map((conn) => (
              <button
                key={conn.profileId}
                onClick={() => setSelectedProfileId(conn.profileId)}
                className={`w-full p-4 flex items-center gap-4 transition border-b border-zinc-900/50 ${
                  selectedProfileId === conn.profileId ? "bg-red-600/10 border-r-2 border-r-red-600" : "hover:bg-zinc-900"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <User size={20} className={selectedProfileId === conn.profileId ? "text-red-500" : "text-zinc-500"} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{conn.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-tight">{conn.profession}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col bg-black">
            {selectedProfileId ? (
              <>
                {/* Chat Details */}
                <div className="p-4 bg-zinc-900/50 border-b border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-white">Active Discussion</span>
                  </div>
                  <button className="text-xs text-red-500 hover:underline">View Portfolio</button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-4 rounded-3xl text-sm shadow-xl ${
                        msg.senderId === currentUserId 
                          ? "bg-red-600 text-white rounded-tr-none" 
                          : "bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800"
                      }`}>
                        {msg.text}
                        <div className={`text-[10px] mt-2 opacity-50 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-zinc-950 border-t border-zinc-900">
                  <div className="relative flex items-center">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Discuss collaboration terms..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl px-6 py-4 pr-16 outline-none focus:border-red-600 transition shadow-inner"
                    />
                    <button
                      onClick={handleSend}
                      className="absolute right-2 p-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition shadow-lg"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare size={40} className="text-zinc-700" />
                </div>
                <h2 className="text-2xl font-bold text-white">No Matched Selected</h2>
                <p className="text-zinc-500 mt-2 max-w-xs">Select a connection from the left to start a professional discussion.</p>
              </div>
            )}
          </main>
        </div>
        <BottomNav></BottomNav>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type Message = {
//   sender: "me" | "them";
//   text: string;
// };

// export default function ConnectionsPage() {
//   const connections = ["Alex Rivera", "Jordan Kim", "Sam Patel"];

//   const [selected, setSelected] = useState(connections[0]);
//   const [messages, setMessages] = useState<Record<string, Message[]>>({});
//   const [input, setInput] = useState("");
//   const [endorsements, setEndorsements] = useState<Record<string, number>>({});
//   const [endorsed, setEndorsed] = useState<Record<string, boolean>>({});

//   // Load messages
//   useEffect(() => {
//     const saved = localStorage.getItem("messages");
//     if (saved) setMessages(JSON.parse(saved));
//   }, []);

//   // Save messages
//   useEffect(() => {
//     localStorage.setItem("messages", JSON.stringify(messages));
//   }, [messages]);

//   // Load endorsements
//   useEffect(() => {
//     const saved = localStorage.getItem("endorsements");
//     if (saved) setEndorsements(JSON.parse(saved));
//     const savedFlag = localStorage.getItem("endorsed");
//     if (savedFlag) setEndorsed(JSON.parse(savedFlag));
//   }, []);

//   // Save endorsements
//   useEffect(() => {
//     localStorage.setItem("endorsements", JSON.stringify(endorsements));
//   }, [endorsements]);

//   useEffect(() => {
//     localStorage.setItem("endorsed", JSON.stringify(endorsed));
//   }, [endorsed]);

//   const handleEndorse = () => {
//     setEndorsements((prev) => ({
//       ...prev,
//       [selected]: (prev[selected] || 0) + 1,
//     }));
//     setEndorsed((prev) => ({ ...prev, [selected]: true }));
//   };

//   const handleRetract = () => {
//     setEndorsements((prev) => ({
//       ...prev,
//       [selected]: Math.max(0, (prev[selected] || 0) - 1),
//     }));
//     setEndorsed((prev) => ({ ...prev, [selected]: false }));
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     setMessages((prev) => ({
//       ...prev,
//       [selected]: [
//         ...(prev[selected] || []),
//         { sender: "me", text: input },
//       ],
//     }));

//     setInput("");
//   };

//   return (
//     <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
//       {/* Floating background */}
//       <div className="pointer-events-none absolute inset-0">
//         {[...Array(8)].map((_, i) => (
//           <span
//             key={i}
//             className="absolute animate-float text-3xl opacity-20"
//             style={{
//               left: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 10}s`,
//               animationDuration: `${12 + Math.random() * 10}s`,
//             }}
//           >
//             🎬
//           </span>
//         ))}
//       </div>

//       {/* Phone Frame */}
//       <div className="relative h-[720px] w-[560px] rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-8 pb-4 text-white">
//           <h1 className="text-xl font-semibold">Connections</h1>
//           <p className="text-sm text-white/90">
//             Network & communicate professionally
//           </p>
//         </div>

//         {/* BODY */}
//         <div className="grid grid-cols-3 h-[540px]">
//           {/* LEFT — Connections */}
//           <div className="border-r border-zinc-800 bg-zinc-950 p-3 overflow-y-auto">
//             {connections.map((name) => (
//               <button
//                 key={name}
//                 onClick={() => setSelected(name)}
//                 className={`w-full rounded-lg px-3 py-2 mb-1 text-left text-sm transition ${
//                   selected === name
//                     ? "bg-red-600 text-white"
//                     : "text-zinc-300 hover:bg-zinc-800"
//                 }`}
//               >
//                 {name}
//               </button>
//             ))}
//           </div>

//           {/* RIGHT — Chat */}
//           <div className="col-span-2 flex flex-col bg-zinc-900">
//             {/* Chat Header */}
//             <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-300 flex items-center justify-between">
//               <div>
//                 Chat with <span className="text-red-500">{selected}</span>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="text-sm text-zinc-300">
//                   Endorsements:{' '}
//                   <span className="font-semibold text-white">
//                     {endorsements[selected] || 0}
//                   </span>
//                 </div>

//                 {endorsed[selected] ? (
//                   <button
//                     onClick={handleRetract}
//                     className="rounded-md bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition"
//                   >
//                     Retract
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleEndorse}
//                     className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition"
//                   >
//                     Endorse
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Messages (SCROLLABLE, FOOTER SAFE) */}
//             <div className="flex-1 overflow-y-auto px-4 py-3 pb-[90px] space-y-3">
//               {(messages[selected] || []).map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
//                     msg.sender === "me"
//                       ? "ml-auto bg-red-600 text-white"
//                       : "bg-zinc-800 text-zinc-200"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>

//             {/* Input */}
//             <div className="border-t border-zinc-800 p-3 flex gap-2 bg-zinc-900">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
//               />
//               <button
//                 onClick={sendMessage}
//                 className="rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER (NON-OVERLAPPING) */}
//         <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 px-6 pb-4 pt-2">
//           <Link
//             href="/homePage"
//             className="block w-full rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </div>

//       {/* Floating animation */}
//       <style jsx global>{`
//         @keyframes float {
//           0% {
//             transform: translateY(110vh);
//           }
//           100% {
//             transform: translateY(-20vh);
//           }
//         }
//         .animate-float {
//           animation: float linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }