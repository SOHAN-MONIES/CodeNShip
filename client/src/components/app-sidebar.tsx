"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Rocket,
    Settings,
} from "lucide-react"

import { UserButton, useUser, SignInButton } from "@clerk/nextjs"
import { ThemeToggleSidebar } from "@/components/theme-toggle-sidebar"

export function AppSidebar() {
    const pathname = usePathname()
    const { user } = useUser()

    return (
        <Sidebar collapsible="offcanvas">

            {/* HEADER — OUTSIDE CONTENT */}
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1 font-bold text-lg">
                    🚀 CodeNShip
                </div>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>

                {/* PLATFORM */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Platform
                    </SidebarGroupLabel>

                    <SidebarMenu>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/dashboard"}
                            >
                                <Link href="/dashboard">
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/dashboard/deployments"}
                            >
                                <Link href="/dashboard/deployments">
                                    <Rocket />
                                    <span>Deployments</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarGroup>

                {/* SETTINGS */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Settings
                    </SidebarGroupLabel>

                    <SidebarMenu>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/dashboard/settings"}
                            >
                                <Link href="/dashboard/settings">
                                    <Settings />
                                    <span>General</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <ThemeToggleSidebar />
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarGroup>

            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <div className="flex items-center justify-between gap-2 px-2 py-2">

                    {user ? (
                        <>
                            <div className="flex flex-col text-xs">
                                <span className="font-medium">
                                    {user.fullName}
                                </span>
                                <span className="text-muted-foreground">
                                    {user.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>

                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8",
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <div className="w-full flex justify-center py-1">
                            <SignInButton mode="modal">
                                <button className="w-full text-center py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md text-sm font-medium transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                        </div>
                    )}

                </div>
            </SidebarFooter>

        </Sidebar>
    )
}