import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  restorePlayerState: (
    currentSong: Song | null,
    queue: Song[],
    currentIndex: number,
    isPlaying: boolean
  ) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  isLooping: false,
  isShuffling: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    if (songs.length === 0) return;
    
    set({
      queue: songs,
      currentSong: songs[0],
      currentIndex: 0,
      isPlaying: true
    });
    
    const socket = useChatStore.getState().socket;
    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${songs[0].title} by ${songs[0].artist}`,
      });
    }
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    
    const shuffledSongs = get().isShuffling 
      ? [...songs].sort(() => Math.random() - 0.5) 
      : songs;
    
    const adjustedIndex = Math.min(startIndex, shuffledSongs.length - 1);
    const song = shuffledSongs[adjustedIndex];
    
    set({
      queue: shuffledSongs,
      currentSong: song,
      currentIndex: adjustedIndex,
      isPlaying: true,
    });
    
    const socket = useChatStore.getState().socket;
    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;

    set({ isPlaying: willStartPlaying });

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: willStartPlaying && currentSong
          ? `Playing ${currentSong.title} by ${currentSong.artist}`
          : "Idle",
      });
    }
  },

  toggleLoop: () => {
    set((state) => ({ isLooping: !state.isLooping }));
  },

  toggleShuffle: () => {
    const currentState = get();
    const newShuffleState = !currentState.isShuffling;
    
    if (newShuffleState && currentState.queue.length > 0) {
      const currentSong = currentState.currentSong;
      const remainingSongs = currentState.queue.filter(
        (_, index) => index !== currentState.currentIndex
      );
      
      const shuffledSongs = [...remainingSongs].sort(() => Math.random() - 0.5);
      const newQueue = currentSong 
        ? [currentSong, ...shuffledSongs]
        : shuffledSongs;

      set({
        isShuffling: newShuffleState,
        queue: newQueue,
        currentIndex: 0
      });
    } else {
      set({ isShuffling: newShuffleState });
    }
  },

  playNext: () => {
    const { currentIndex, queue, isShuffling, isLooping, currentSong } = get();
    
    if (queue.length === 0 || !currentSong) {
      set({ isPlaying: false });
      return;
    }

    let nextIndex: number;

    if (isLooping) {
      nextIndex = currentIndex;
    } else if (isShuffling) {
      const availableSongs = queue.filter((_, index) => index !== currentIndex);
      nextIndex = availableSongs.length > 0
        ? queue.findIndex(song => song._id === 
            availableSongs[Math.floor(Math.random() * availableSongs.length)]._id)
        : currentIndex;
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    const nextSong = queue[nextIndex];
    const socket = useChatStore.getState().socket;
    
    set({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
    });

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
      });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    
    if (queue.length === 0) {
      set({ isPlaying: false });
      return;
    }

    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const prevSong = queue[prevIndex];
    const socket = useChatStore.getState().socket;
    
    set({
      currentSong: prevSong,
      currentIndex: prevIndex,
      isPlaying: true,
    });

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
      });
    }
  },

  addToQueue: (song: Song) => {
    set(state => ({
      queue: [...state.queue, song]
    }));
  },

  clearQueue: () => {
    set({
      queue: [],
      currentSong: null,
      currentIndex: -1,
      isPlaying: false
    });
    localStorage.removeItem('playerState');
  },

  restorePlayerState: (currentSong, queue, currentIndex, isPlaying) => {
    set({
      currentSong,
      queue: queue || [],
      currentIndex: currentIndex || 0,
      isPlaying
    });
  },
}));