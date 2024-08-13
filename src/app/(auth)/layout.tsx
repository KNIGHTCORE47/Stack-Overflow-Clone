"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { session } = useAuthStore();
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session, router])   //NOTE - Logic => As soon as we provide session, in availability of sessions we have to re-route the user to the home page. 

    if (session) {
        return null;    //NOTE - Logic => Session is available so the value of the session go null.
    }
    return (    //NOTE - Logic => if there is no session we want to load childrens like login or register that will come up here
        <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
            <div className="relative">{children}</div>
        </div>
    )
}
