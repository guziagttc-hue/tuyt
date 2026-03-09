import React from 'react';
import type { Video, User } from '../types';
import { MusicNoteIcon, formatNumber, CheckmarkIcon } from '../constants';

interface VideoActionsProps {
  video: Video;
  onSelectUser: (user: User) => void;
  loggedInUser: User;
  onToggleObserve: (user: User) => void;
  onVideoReaction: (videoId: number, reaction: string | undefined) => void;
  onOpenShareMenu: () => void;
  onOpenCommentsMenu: () => void;
}

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-white group">
        <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full group-hover:bg-purple-600 transition-colors">
            {icon}
        </div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

const VideoActions: React.FC<VideoActionsProps> = ({ video, onSelectUser, loggedInUser, onToggleObserve, onVideoReaction, onOpenShareMenu, onOpenCommentsMenu }) => {
    const iconClasses = "w-7 h-7";
    const isObserving = loggedInUser.observing.includes(video.user.username);
    const isOwnProfile = loggedInUser.username === video.user.username;

    const handleLikeClick = () => {
        onVideoReaction(video.id, '❤️');
    };

  return (
    <div className="flex flex-col items-center gap-5">
        <div className="relative mb-2">
            <button onClick={() => onSelectUser(video.user)} className="group">
                <img src={video.user.avatar} alt={video.user.username} className="w-12 h-12 rounded-full border-2 border-purple-500 group-hover:border-cyan-400 transition-colors"/>
            </button>
            {!isOwnProfile && (
                <button 
                    onClick={() => onToggleObserve(video.user)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-white transition-transform duration-200 ease-in-out hover:scale-110"
                >
                    {isObserving ? (
                        <CheckmarkIcon className="w-4 h-4" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    )}
                </button>
            )}
        </div>
      
         <button 
            className="flex flex-col items-center gap-1 text-white group"
            onClick={handleLikeClick}
        >
            <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full group-hover:bg-purple-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} transition-colors`} fill={video.myReaction === '❤️' ? 'rgb(239 68 68)' : 'none'} viewBox="0 0 24 24" stroke={video.myReaction === '❤️' ? 'rgb(239 68 68)' : 'currentColor'}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
            </div>
            <span className="text-xs font-bold text-white">{formatNumber(video.likes)}</span>
        </button>

        <ActionButton 
            onClick={onOpenCommentsMenu}
            label={formatNumber(video.comments)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
        />
        <ActionButton 
            onClick={onOpenShareMenu}
            label={formatNumber(video.shares)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>}
        />
        {video.musicCoverUrl && (
            <div className="mt-4">
                <div className="w-12 h-12 rounded-full bg-black/50 p-1 animate-spin [animation-duration:5s]">
                    <img src={video.musicCoverUrl} alt="audio track" className="w-full h-full rounded-full object-cover"/>
                </div>
            </div>
        )}
    </div>
  );
};

export default VideoActions;