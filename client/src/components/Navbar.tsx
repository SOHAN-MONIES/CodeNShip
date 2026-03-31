"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">

            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-gray-900">
            Code<span className="text-indigo-600">N</span>Ship
          </span>

                </Link>

                {/* NAV LINKS */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">

                    {["Features", "Templates", "Pricing", "Docs"].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="relative text-gray-600 hover:text-gray-900 transition"
                        >
                            {item}

                            {/* Hover underline */}
                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all group-hover:w-full" />
                        </Link>
                    ))}

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">

                    <Link
                        href="/sign-in"
                        className="text-gray-600 hover:text-gray-900 font-medium transition"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                    >
                        Get Started
                    </Link>

                </div>

            </div>
        </nav>
    );
}