"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BottomNav } from "@/components/BottomNav";

type ChatMessage = {
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
};

type Connection = {
  id: string; // Profile/User ID
  firstName: string;
  lastName: string;
  image: string;
  profession: string;
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load User
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Load Connections
  useEffect(() => {
    if (!currentUser) return;

    const fetchConnections = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/connections/${currentUser.profileId}?status=ACCEPTED`);
        if (res.ok) {
          const data = await res.json();
          setConnections(data);
          if (data.length > 0) {
            setSelectedConnection(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  // Load Messages when selected connection changes
  useEffect(() => {
    if (!currentUser || !selectedConnection) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/messages/${currentUser.profileId}/${selectedConnection.id}`);
        if (res.ok) {
          const data = await res.json();
          // Backend returns Message object with messages list
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        setMessages([]);
      }
    };

    fetchMessages();

    // Set up polling for new messages (simple implementation)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [currentUser, selectedConnection]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !selectedConnection) return;

    const newMessage = {
      senderId: currentUser.profileId,
      receiverId: selectedConnection.id,
      content: input
    };

    try {
      const res = await fetch("http://localhost:8080/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (res.ok) {
        const updatedConversation = await res.json();
        setMessages(updatedConversation.messages);
        setInput("");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading connections...</div>;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Floating background */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 10}s`,
            }}
          >
            🎬
          </span>
        ))}
      </div>

      {/* Phone Frame */}
      <div className="relative h-[720px] w-[560px] rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-8 pb-4 text-white shrink-0">
          <h1 className="text-xl font-semibold">Connections</h1>
          <p className="text-sm text-white/90">
            Network & communicate professionally
          </p>
        </div>

        {/* BODY */}
        <div className="flex-1 grid grid-cols-3 overflow-hidden">
          {/* LEFT — Connections */}
          <div className="border-r border-zinc-800 bg-zinc-950 p-3 overflow-y-auto">
            {connections.length === 0 ? (
              <div className="text-zinc-500 text-xs text-center mt-10">No connections yet</div>
            ) : (
              connections.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => setSelectedConnection(conn)}
                  className={`w-full rounded-lg px-3 py-2 mb-1 text-left text-sm transition flex items-center gap-2 ${selectedConnection?.id === conn.id
                    ? "bg-red-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-800 relative shrink-0">
                    {conn.image ? (
                      <Image src={conn.image} alt={conn.firstName} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-700 text-xs">{conn.firstName[0]}</div>
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-medium truncate">{conn.firstName} {conn.lastName}</div>
                    <div className="text-xs opacity-70 truncate">{conn.profession}</div>
                  </div>
                </button>
              ))
            )}

          </div>

          {/* RIGHT — Chat */}
          <div className="col-span-2 flex flex-col bg-zinc-900 h-full overflow-hidden">
            {selectedConnection ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-300 flex items-center justify-between shrink-0 bg-zinc-900 z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{selectedConnection.firstName} {selectedConnection.lastName}</span>
                    <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded-full">{selectedConnection.profession}</span>
                  </div>
                </div>

                {/* Messages (SCROLLABLE) */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                      start the conversation
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm break-words ${msg.senderId === currentUser?.profileId
                          ? "ml-auto bg-red-600 text-white"
                          : "bg-zinc-800 text-zinc-200"
                          }`}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-zinc-800 p-3 flex gap-2 bg-zinc-900 shrink-0">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600 transition"
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 transition"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Select a connection to chat
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-zinc-900 px-6 pb-4 pt-2 shrink-0">
          <Link
            href="/homePage"
            className="block w-full rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Back to Home
          </Link>
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