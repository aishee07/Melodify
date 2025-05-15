import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const { isSignedIn } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { 
    currentSong, 
    isPlaying, 
    playNext, 
    isLooping,
    restorePlayerState
  } = usePlayerStore();

  // Restore player state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
      const { currentSong, isPlaying, queue, currentIndex } = JSON.parse(savedState);
      restorePlayerState(currentSong, queue, currentIndex, isPlaying);
    }
  }, [restorePlayerState]);

  // Save player state to localStorage when it changes
  useEffect(() => {
    const state = usePlayerStore.getState();
    localStorage.setItem('playerState', JSON.stringify({
      currentSong: state.currentSong,
      isPlaying: state.isPlaying,
      queue: state.queue,
      currentIndex: state.currentIndex
    }));
  }, [currentSong, isPlaying]);

  // Handle play/pause based on isPlaying and sign-in status
  useEffect(() => {
    if (!isSignedIn) {
      audioRef.current?.pause();
      usePlayerStore.setState({ isPlaying: false });
      return;
    }

    const handlePlayback = async () => {
      try {
        if (isPlaying && currentSong) {
          await audioRef.current?.play();
        } else {
          audioRef.current?.pause();
        }
      } catch (error) {
        console.error("Playback error:", error);
        usePlayerStore.setState({ isPlaying: false });
      }
    };

    handlePlayback();
  }, [isPlaying, isSignedIn, currentSong]);

  // Handle song end behavior
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!isSignedIn) return;

      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Loop play error:", e));
      } else {
        playNext();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNext, isLooping, isSignedIn]);

  // Handle song change
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    const isSongChange = prevSongRef.current !== currentSong.audioUrl;

    if (isSongChange) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong.audioUrl;

      const handleCanPlay = () => {
        if (isPlaying && isSignedIn) {
          audio.play().catch(e => console.error("Autoplay error:", e));
        }
        audio.removeEventListener("canplay", handleCanPlay);
      };

      audio.addEventListener("canplay", handleCanPlay);
    }
  }, [currentSong, isPlaying, isSignedIn]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;