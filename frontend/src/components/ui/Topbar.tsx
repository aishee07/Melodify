import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const Topbar = () => {
    const { isSignedIn } = useUser();
    const { isAdmin, checkAdminStatus } = useAuthStore();

    useEffect(() => {
        if (isSignedIn) {
            checkAdminStatus(); // fetch admin status after sign in
        }
    }, [isSignedIn]);

    return (
        <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="/melodify.png" className="h-10 w-8" alt="melodify logo" />
                Melodify
            </div>

            <div className="flex items-center gap-4">
                <SignedIn>
                    {isAdmin && (
                        <Link to="/admin" className={cn(buttonVariants({ variant: "outline" }))}>
                            <LayoutDashboardIcon className="size-4 mr-2" />
                            Admin Dashboard
                        </Link>
                    )}
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <div className="flex gap-2 items-center">
                        <Link to="/sign-up" className={cn(buttonVariants({ variant: "outline" }), "h-8 px-4")}>
                        Sign Up / Sign In
                        </Link>
                    </div>
                </SignedOut>

            </div>
        </div>
    );
};

export default Topbar;
