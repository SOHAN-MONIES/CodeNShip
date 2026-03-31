"use client";

import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const [open, setOpen] = useState(true);

    // 🔥 Auto collapse if inside project workspace
    useEffect(() => {
        if (pathname.startsWith("/dashboard/project")) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [pathname]);

    return (<SidebarProvider
        open={open}
        onOpenChange={setOpen}
    > <AppSidebar />


        <SidebarInset>
            <main className={`w-full ${pathname.startsWith("/dashboard/project") ? "" : "p-6"}`}>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>


    );
}
