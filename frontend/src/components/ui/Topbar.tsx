import { LayoutDashboardIcon, SearchIcon, Mic, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { debounce } from "lodash";

const Topbar = () => {
    const { isSignedIn } = useUser();
    const { isAdmin, checkAdminStatus } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const { searchSongs, clearSearchResults } = useMusicStore();

    // Initialize speech recognition
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognizer = new SpeechRecognition();
                recognizer.continuous = false;
                recognizer.interimResults = false;
                recognizer.lang = "en-US";

                recognizer.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setSearchQuery(transcript);
                    searchSongs(transcript);
                };

                recognizer.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognizer.onend = () => {
                    setIsListening(false);
                };

                setRecognition(recognizer);
            }
        }
    }, []);

    useEffect(() => {
        if (isSignedIn) {
            checkAdminStatus();
        }
    }, [isSignedIn]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (query.trim()) {
                searchSongs(query);
            } else {
                clearSearchResults();
            }
        }, 300),
        [searchSongs, clearSearchResults]
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const toggleVoiceSearch = () => {
        if (!recognition) {
            alert("Voice search not supported in your browser");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        clearSearchResults();
    };

    return (
        <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="/melodify.png" className="h-10 w-8" alt="melodify logo" />
                Melodify
            </div>

            <div className="relative flex-1 max-w-md mx-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search songs, artists or use voice..."
                    className="w-full bg-zinc-800 rounded-full py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-white"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <button
                    onClick={toggleVoiceSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                        isListening ? "animate-pulse bg-red-500" : "bg-zinc-700 hover:bg-zinc-600"
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start voice search"}
                >
                    <Mic className="h-4 w-4" />
                </button>
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