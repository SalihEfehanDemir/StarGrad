import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import { BsSoundwave } from 'react-icons/bs';

const channels = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Girl' },
    { id: 'qH3fETPsqXU', name: '24/7 Chill Lofi Radio' },
    { id: '5yx6BWlEVcY', name: 'Chillhop Radio' },
    { id: 'tNkZsRW7h2c', name: 'SomaFM Stream' },
    { id: '7NOSDKb0HlU', name: 'Lofi Beats Radio' },
    { id: '1tJ8sc8I4z0', name: '4K Lofi Beats Radio' },
    { id: '2LB-YgccqdI', name: 'Synthwave Radio' },
    { id: 'UI5NKkW8acM', name: 'Tokyo Night Drive' },
    { id: 'IxPANmjPaek', name: 'Ambient Lofi' },
    { id: 'FrdjVhqSEv4', name: 'Chill Drive' },
    { id: '4xDzrJKXOOY', name: 'Space Lofi' },
    { id: '_bLX5WfDQfM', name: 'Medieval Lofi' },
];

const LofiPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(0);
    const [videoTitle, setVideoTitle] = useState('Loading...');
    const playerRef = useRef(null);
    
    const videoId = channels[currentChannel].id;
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    useEffect(() => {
        if (!apiKey) {
            setVideoTitle('API Key missing. See console for instructions.');
            console.error("YouTube API Key is missing. Please add VITE_YOUTUBE_API_KEY to your .env.local file.");
            return;
        }

        const fetchVideoTitle = async () => {
            setVideoTitle('Loading...');
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    setVideoTitle(data.items[0].snippet.title);
                } else {
                    setVideoTitle('Could not find video title');
                }
            } catch (error) {
                console.error("Error fetching video title:", error);
                setVideoTitle('Error fetching title');
            }
        };

        fetchVideoTitle();
    }, [videoId, apiKey]);

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 0,
            controls: 0,
        },
    };

    const onPlayerStateChange = (event) => {
        // Player is playing
        if (event.data === YouTube.PlayerState.PLAYING) {
            setIsPlaying(true);
        } 
        // Player is paused or ended
        else if (event.data === YouTube.PlayerState.PAUSED || event.data === YouTube.PlayerState.ENDED) {
            setIsPlaying(false);
        }
    };

    const handleReady = (event) => {
        playerRef.current = event.target;
        // If music was playing before the channel switch, start playing the new video.
        if (isPlaying) {
            playerRef.current.playVideo();
        }
    };

    const togglePlay = () => {
        if (!playerRef.current) return;
        
        const isPlayerPlaying = playerRef.current.getPlayerState() === 1;
        if (isPlayerPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const nextChannel = () => {
        setCurrentChannel((prev) => (prev + 1) % channels.length);
    };

    const prevChannel = () => {
        setCurrentChannel((prev) => (prev - 1 + channels.length) % channels.length);
    };

    return (
        <div className="lofi-player relative">
            <div className="hidden">
                <YouTube videoId={videoId} opts={opts} onReady={handleReady} onStateChange={onPlayerStateChange} key={videoId} />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-4">
                    <button onClick={prevChannel} className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-full">
                        <FaBackward />
                    </button>
                    <button 
                        onClick={togglePlay} 
                        className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-full"
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={nextChannel} className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-full">
                        <FaForward />
                    </button>
                </div>
                <div className="flex items-center justify-center pt-2">
                    <BsSoundwave className="text-primary flex-shrink-0 mr-2" />
                    <p className="text-xs text-gray-400 font-mono" title={videoTitle}>
                        {videoTitle}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LofiPlayer; 