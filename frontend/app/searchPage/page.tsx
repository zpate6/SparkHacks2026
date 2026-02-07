"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clear } from "console";

export default function PortfolioPage() {

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
        <h1>Search Page</h1>
        <Link href="/homePage">Back to Home</Link>
    </div>
  );
}
