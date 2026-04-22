import VisualWrapper from "@/components/VisualWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { JSX } from "react";

export default function Home(): JSX.Element {
    return (
        <div className="relative min-h-screen bg-white text-black overflow-hidden">

            {/* 🌈 Gradient Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_40%)]" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <Navbar />

            <main className="relative z-10">

                {/* HERO */}
                <section className="pt-40 pb-28 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">

                    {/* LEFT */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-medium text-sm shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                            Next Generation Collaboration
                        </div>

                        {/* Heading */}
                        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                            Code at the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400">
                Speed of Thought
              </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                            Real-time collaboration, instant deployments, and a seamless
                            cloud workspace — built for modern engineering teams.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Start Building
                            </button>

                            <button className="px-8 py-4 rounded-xl border border-gray-300 bg-white/70 backdrop-blur hover:bg-gray-50 font-semibold transition">
                                View Docs
                            </button>

                        </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    {/* RIGHT VISUAL */}
                    <div className="flex-1 w-full flex justify-center relative">

                        {/* Soft Glow Behind */}
                        <div className="absolute -inset-16 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-full -z-10" />

                        <div className="relative w-full max-w-[620px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
                            <VisualWrapper />
                        </div>

                    </div>

                </section>

                {/* FEATURES */}
                {/* FEATURES */}
                <section className="py-32 px-6 bg-gray-50">

                    <div className="max-w-7xl mx-auto">

                        {/* Section Header */}
                        <div className="text-center mb-20 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Everything You Need
                            </h2>

                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                A powerful toolkit designed for modern engineering teams —
                                collaborate, deploy, and scale effortlessly.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                            {/* CARD 1 */}
                            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

                                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Real-time Sync
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    Zero-latency collaboration across your team.
                                    See updates instantly without refresh.
                                </p>

                            </div>

                            {/* CARD 2 */}
                            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

                                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Multi-file Projects
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    Organize complex architectures effortlessly.
                                    Deploy entire projects in seconds.
                                </p>

                            </div>

                            {/* CARD 3 */}
                            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

                                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeWidth={2} d="M12 2l9 5-9 5-9-5 9-5z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    3D Visualization
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    Build inside an immersive environment designed
                                    for speed and clarity.
                                </p>

                            </div>

                        </div>

                    </div>
                </section>

            </main>
            // Todo : Add login fallback


            <Footer />
        </div>
    );
}