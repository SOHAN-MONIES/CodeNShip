"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-32">

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* BRAND */}
                    <div className="space-y-4">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <span className="text-white font-bold">C</span>
                            </div>

                            <span className="text-xl font-bold text-gray-900">
                Code<span className="text-indigo-600">N</span>Ship
              </span>

                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                            Deploy, collaborate, and ship projects instantly —
                            built for modern engineering teams.
                        </p>

                    </div>

                    {/* PRODUCT */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Product</h4>

                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="#">Features</Link>
                            <Link href="#">Templates</Link>
                            <Link href="#">Deployments</Link>
                            <Link href="#">Pricing</Link>
                        </div>
                    </div>

                    {/* RESOURCES */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Resources</h4>

                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="#">Documentation</Link>
                            <Link href="#">Guides</Link>
                            <Link href="#">API Reference</Link>
                            <Link href="#">Support</Link>
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Company</h4>

                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="#">About</Link>
                            <Link href="#">Blog</Link>
                            <Link href="#">Careers</Link>
                            <Link href="#">Contact</Link>
                        </div>
                    </div>

                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} CodeNShip. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="#">Twitter</Link>
                        <Link href="#">GitHub</Link>
                        <Link href="#">LinkedIn</Link>
                    </div>

                </div>

            </div>

        </footer>
    );
}