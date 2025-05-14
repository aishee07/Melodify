import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AudioPlayer = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, isLooping } = usePlayerStore();

  useEffect(() => {
    if (!isSignedIn && currentSong) {
      // Redirect to login if trying to play while logged out
      navigate("/sign-in");
      return;
    }
  }, [currentSong, isSignedIn, navigate]);

  useEffect(() => {
    if (!isSignedIn) {
      audioRef.current?.pause();
      return;
    }

    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying, isSignedIn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!isSignedIn) return;
      
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNext, isLooping, isSignedIn]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    const isSongChange = prevSongRef.current !== currentSong.audioUrl;

    if (isSongChange) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong.audioUrl;

      if (isPlaying && isSignedIn) audio.play();
    }
  }, [currentSong, isPlaying, isSignedIn]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;