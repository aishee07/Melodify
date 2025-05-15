import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { useAuth } from "@clerk/clerk-react";

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                    <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                        <LeftSidebar />
                    </ResizablePanel>

                    <ResizableHandle className="w-2 bg-zinc-800" />

                    <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                        <Outlet />
                    </ResizablePanel>

                    {!isMobile && (
                        <>
                            <ResizableHandle className="w-2 bg-zinc-800" />
                            <ResizablePanel defaultSize={20} minSize={0} maxSize={25}>
                                <FriendsActivity />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>

            {/* Show player controls only when signed in */}
            {isSignedIn && (
                <div className="w-full border-t border-zinc-800">
                    <PlaybackControls />
                </div>
            )}
            
            <Chatbot />
        </div>
    );
};

export default MainLayout;