import React, { createContext, useContext, useState, useMemo, useRef, useCallback, useEffect } from 'react';

const AudioContext = createContext();

const tracks = [
  { name: 'Lofi Chill', src: 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_1c8d1969c3.mp3' },
  { name: 'Forest River', src: 'https://cdn.pixabay.com/download/audio/2022/08/20/audio_6b5a133400.mp3' },
  { name: 'White Noise', src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3c3b894953.mp3' },
];

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', pause); // Optional: pause when track ends, since loop is on

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', pause);
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);
  
  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setTrack = useCallback((index) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.src = tracks[index].src;
      if (isPlaying) {
        play();
      }
    }
  }, [isPlaying, play]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const changeVolume = useCallback((value) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const value = useMemo(() => ({
    isPlaying,
    currentTrack: tracks[currentTrackIndex],
    volume,
    tracks,
    duration,
    currentTime,
    play,
    pause,
    setTrack,
    seek,
    togglePlayPause,
    changeVolume,
  }), [isPlaying, currentTrackIndex, volume, duration, currentTime, play, pause, setTrack, seek, togglePlayPause, changeVolume]);

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} loop volume={volume} />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
