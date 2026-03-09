

import React, { useRef, useEffect, useState } from 'react';
import { SearchIcon, BackIcon, HeartIconFilled } from '../constants';
import VideoInfo from './VideoInfo';
import VideoActions from './VideoActions';
import type { Video, User, Comment as CommentType } from '../types';
import type { View } from '../App';
import ShareMenu from './ShareMenu';
// FIX: Updated import to use named export for CommentsSheet.
import { CommentsSheet } from './CommentsSheet';

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  onSelectUser: (user: User) => void;
  loggedInUser: User;
  onToggleObserve: (user: User) => void;
  onVideoReaction: (videoId: number, reaction: string | undefined) => void;
  onAddComment: (videoId: number, text: string) => void;
  onLikeComment: (videoId: number, commentId: number) => void;
}

const PlayPauseIcon = ({ isPlaying }: { isPlaying: boolean }) => (
    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
        {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
        ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
        )}
    </div>
);


const VideoItem: React.FC<VideoItemProps> = ({ video, isActive, onSelectUser, loggedInUser, onToggleObserve, onVideoReaction, onAddComment, onLikeComment }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isCommentsSheetOpen, setIsCommentsSheetOpen] = useState(false);
  const iconTimer = useRef<number | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.play().catch(error => {
        console.log("Autoplay with sound was prevented:", error);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }, [isActive]);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    
    setIsPlaying(!videoElement.paused);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);
  
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }

    setShowPlayPauseIcon(true);
    if (iconTimer.current) {
      clearTimeout(iconTimer.current);
    }
    iconTimer.current = window.setTimeout(() => {
      setShowPlayPauseIcon(false);
    }, 1000);
  };

  const handleDoubleClick = () => {
    if (video.myReaction !== '❤️') {
      onVideoReaction(video.id, '❤️');
    }
    setShowLikeAnimation(true);
    setTimeout(() => {
        setShowLikeAnimation(false);
    }, 800);
  };
  
  const handleAddCommentForVideo = (text: string) => {
    onAddComment(video.id, text);
  };

  const handleLikeCommentForVideo = (commentId: number) => {
    onLikeComment(video.id, commentId);
  };


  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video.videoUrl}
        poster={video.posterUrl}
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      
       <div className="absolute inset-0 z-10" onClick={togglePlayPause} onDoubleClick={handleDoubleClick}></div>
      
      {showPlayPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 opacity-100 z-20">
           <PlayPauseIcon isPlaying={!videoRef.current?.paused} />
        </div>
      )}
      
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <HeartIconFilled className="w-24 h-24 text-red-500/90 animate-like" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end z-20">
        <div className="flex-grow">
          <VideoInfo video={video} onSelectUser={onSelectUser} />
        </div>
        <div className="shrink-0">
          <VideoActions 
            video={video} 
            onSelectUser={onSelectUser} 
            loggedInUser={loggedInUser} 
            onToggleObserve={onToggleObserve} 
            onVideoReaction={onVideoReaction}
            onOpenShareMenu={() => setIsShareMenuOpen(true)}
            onOpenCommentsMenu={() => setIsCommentsSheetOpen(true)}
          />
        </div>
      </div>
      <ShareMenu isOpen={isShareMenuOpen} onClose={() => setIsShareMenuOpen(false)} />
      <CommentsSheet 
        isOpen={isCommentsSheetOpen} 
        onClose={() => setIsCommentsSheetOpen(false)}
        comments={video.commentData || []}
        totalComments={video.comments}
        onAddComment={handleAddCommentForVideo}
        onLikeComment={handleLikeCommentForVideo}
        loggedInUser={loggedInUser}
      />
    </div>
  );
};

interface VideoPlayerProps {
  videos: Video[];
  onSelectUser: (user: User) => void;
  onNavigate: (view: View) => void;
  currentView: View;
  startIndex?: number;
  onBack?: () => void;
  loggedInUser: User;
  onToggleObserve: (user: User) => void;
  onVideoReaction: (videoId: number, reaction: string | undefined) => void;
  onAddComment: (videoId: number, text: string) => void;
  onLikeComment: (videoId: number, commentId: number) => void;
}

const NavTab: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`relative py-1 text-lg font-semibold transition-colors duration-200 ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
  >
    {label}
    {active && 
      <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-white rounded-full"></div>
    }
  </button>
);


const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos, onSelectUser, onNavigate, currentView, startIndex, onBack, loggedInUser, onToggleObserve, onVideoReaction, onAddComment, onLikeComment }) => {
    const [currentVideo, setCurrentVideo] = useState(startIndex || 0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (startIndex !== undefined && containerRef.current) {
            const targetElement = containerRef.current.children[startIndex] as HTMLElement;
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'auto' });
            }
        }
    }, [startIndex]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = entry.target.getAttribute('data-index');
                    if (index) {
                        setCurrentVideo(parseInt(index, 10));
                    }
                }
            });
        }, options);

        const currentContainer = containerRef.current;
        if (currentContainer) {
            const videoElements = currentContainer.querySelectorAll('.video-container');
            videoElements.forEach(video => observer.observe(video));
        }

        return () => {
            if (currentContainer) {
                const videoElements = currentContainer.querySelectorAll('.video-container');
                videoElements.forEach(video => observer.unobserve(video));
            }
        };
    }, [videos]);

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full bg-black overflow-y-auto snap-y snap-mandatory">
                {videos.map((video, index) => (
                    <div 
                        key={`${video.id}-${index}`}
                        data-index={index}
                        className="video-container w-full h-full snap-start relative"
                    >
                        <VideoItem 
                          video={video} 
                          isActive={index === currentVideo} 
                          onSelectUser={onSelectUser}
                          loggedInUser={loggedInUser}
                          onToggleObserve={onToggleObserve}
                          onVideoReaction={onVideoReaction}
                          onAddComment={onAddComment}
                          onLikeComment={onLikeComment}
                        />
                    </div>
                ))}
            </div>

            <header className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                {onBack ? (
                    <button onClick={onBack} className="p-2">
                        <BackIcon className="w-6 h-6 text-white" />
                    </button>
                ) : (
                    <button className="p-2">
                        <SearchIcon className="w-6 h-6 text-white" />
                    </button>
                )}
                
                {!onBack && (
                    <div className="flex items-center gap-6">
                        <NavTab label="For You" active={currentView === 'feed'} onClick={() => onNavigate('feed')} />
                        <NavTab label="Photos" active={currentView === 'photos'} onClick={() => onNavigate('photos')} />
                        <NavTab label="Observing" active={currentView === 'observing'} onClick={() => onNavigate('observing')} />
                    </div>
                )}
                <div className="w-10 h-10"></div>
            </header>
        </div>
    );
};

export default VideoPlayer;