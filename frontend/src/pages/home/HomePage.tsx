import Topbar from "@/components/ui/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
    const {
        fetchFeaturedSongs,
        fetchMadeForYouSongs,
        fetchTrendingSongs,
        isLoading,
        madeForYouSongs,
        featuredSongs,
        trendingSongs,
        searchResults
    } = useMusicStore();

    const { initializeQueue } = usePlayerStore();

    // Function to get time-based greeting
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        
        if (hour>=5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 18) return "Good Afternoon";
        if (hour >= 18 && hour < 20) return "Good Evening";
        return "Good Night";
    };
    
    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
    }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

    useEffect(() => {
        if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
            initializeQueue(allSongs);
        }
    }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

    return (
        <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-[#2c1045]/100 to-black">
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className="p-4 sm:p-6">
                    {searchResults.length > 0 ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Search Results</h1>
                            <SectionGrid 
                                title="Search Results"
                                songs={searchResults} 
                                isLoading={isLoading} 
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                                {getTimeBasedGreeting()}
                            </h1>
                            <FeaturedSection />
                            <div className="space-y-8">
                                <SectionGrid 
                                    title="Made For You" 
                                    songs={madeForYouSongs} 
                                    isLoading={isLoading} 
                                />
                                <SectionGrid 
                                    title="Trending" 
                                    songs={trendingSongs} 
                                    isLoading={isLoading} 
                                />
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </main>
    )
};
export default HomePage;