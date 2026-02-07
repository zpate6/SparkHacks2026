"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Film, MessageCircle, Globe } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Navigation items mapping to your backend controllers
  const navItems = [
    { icon: Film, href: "/homePage", label: "Home" }, // RecommendationService stacks
    { icon: Globe, href: "/web", label: "Network" }, // ConnectionController Graph
    { icon: MessageCircle, href: "/communicationPage", label: "Messages" }, // MessageRepository threads
    { icon: User, href: "/viewPublishedProfilePage", label: "Profile" }, // User/Portfolio data
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950 px-6 py-4 pb-10 z-50">
      <ul className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`transition-all duration-200 block p-2 ${
                  isActive 
                    ? "text-red-600 scale-110" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                aria-label={item.label}
              >
                <Icon 
                  size={28} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}