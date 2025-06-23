import React, { useMemo } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import CustomSlider from '../CustomSlider';

const AudioPlayer = () => {
  const { 
    isPlaying, 
    togglePlayPause, 
    volume, 
    changeVolume, 
    currentTrack, 
    tracks, 
    setTrack,
    currentTime,
    duration,
    seek
  } = useAudio();

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentTrackIndex = useMemo(() => tracks.findIndex(t => t.src === currentTrack.src), [tracks, currentTrack]);

  const playNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setTrack(nextIndex);
  };

  const playPrev = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setTrack(prevIndex);
  };
  
  const handleVolumeChange = (value) => {
    changeVolume(value / 100);
  };
  
  const handleSeek = (value) => {
    seek(value);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-5 right-5 w-[350px] bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl text-white p-4">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="Album art" className="w-16 h-16 rounded-md bg-white/10"/>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{currentTrack.name}</h3>
          <p className="text-sm text-gray-400">Ambient Companion</p>
        </div>
      </div>

      <div className="mt-4">
        <CustomSlider 
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2 w-1/3">
          <button 
            onClick={() => handleVolumeChange(volume > 0 ? 0 : 50)} 
            className="text-gray-300 hover:text-white transition-colors"
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <CustomSlider 
            min={0}
            max={100}
            value={volume * 100}
            onChange={handleVolumeChange}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={playPrev} className="text-gray-300 hover:text-white transition-colors" aria-label="Previous track">
            <SkipBack size={22} />
          </button>
          <button 
            onClick={togglePlayPause} 
            className="w-12 h-12 flex items-center justify-center bg-brand-blue/80 hover:bg-brand-blue rounded-full transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          <button onClick={playNext} className="text-gray-300 hover:text-white transition-colors" aria-label="Next track">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="w-1/3" />
      </div>
    </div>
  );
};

export default React.memo(AudioPlayer);
