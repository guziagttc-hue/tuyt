import React, { useState, useRef } from 'react';
import type { PhotoPost } from '../types';
import { VerifiedBadgeIcon, GlobeIcon, MoreHorizIcon, CloseIcon, HeartIconFilled, CommentBubbleIconSimple, ShareIconSimple, EyeIcon, formatNumber } from '../constants';
import ReactionSummaryModal from './ReactionSummaryModal';

interface PhotoPostCardProps {
  post: PhotoPost;
  onReactionSelect: (postId: number, reaction: string) => void;
}

const reactions = ['❤️', '😥', '🤣', '💓', '🥰', '🤭'];
const reactionsOrder = ['❤️', '💓', '🥰', '🤣', '😥', '🤭'];

const PhotoPostCard: React.FC<PhotoPostCardProps> = ({ post, onReactionSelect }) => {
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [isReactionPopoverVisible, setIsReactionPopoverVisible] = useState(false);
    const holdTimer = useRef<number | null>(null);

    const handleMouseDown = () => {
        holdTimer.current = window.setTimeout(() => {
            setIsReactionPopoverVisible(true);
        }, 400);
    };

    const handleMouseUp = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        if (!isReactionPopoverVisible) {
            handleLikeClick();
        }
    };

    const handleMouseLeave = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
    };
    
    const handleLikeClick = () => {
        onReactionSelect(post.id, '❤️');
    };

    const handleReactionSelect = (reaction: string) => {
        onReactionSelect(post.id, reaction);
        setIsReactionPopoverVisible(false);
    };

    const getReactionIcon = () => {
        if (post.myReaction && reactions.includes(post.myReaction)) {
            return <span className="text-xl">{post.myReaction}</span>;
        }
        return <HeartIconFilled className="w-5 h-5" />;
    };

    const getReactionLabel = () => {
        const reactionMap: { [key: string]: string } = {
            '❤️': 'Love', '💓': 'Love', '🥰': 'Care',
            '🤣': 'Haha', '😥': 'Sad', '🤭': 'Wow'
        };
        return post.myReaction ? reactionMap[post.myReaction] || 'Like' : 'Like';
    };

    const displayedReactionIcons = reactionsOrder.filter(r => post.reactions && post.reactions[r]).slice(0, 3);

    return (
        <>
            {isSummaryVisible && post.reactions && (
                <ReactionSummaryModal 
                    reactions={post.reactions}
                    totalLikes={post.stats?.likes || 0}
                    onClose={() => setIsSummaryVisible(false)}
                />
            )}
            <div className="bg-[#181520] rounded-lg mb-4">
                <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center gap-1">
                                <p className="font-bold text-white">{post.user.name}</p>
                                {post.user.isVerified && <VerifiedBadgeIcon className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <span>{post.timestamp}</span>
                                <span>•</span>
                                <GlobeIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white"><MoreHorizIcon /></button>
                        <button className="hover:text-white"><CloseIcon className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="px-3 pb-3">
                    <p className="text-white">{post.caption}</p>
                </div>

                <div className="w-full bg-black flex justify-center">
                    <img src={post.imageUrl} alt="Post content" className="max-h-[70vh] w-auto" />
                </div>
                
                {post.stats && (post.stats.likes > 0 || post.stats.comments > 0) && (
                    <div className="px-3 pt-3 flex justify-between items-center text-sm text-gray-400">
                        <button 
                            onClick={() => setIsSummaryVisible(true)}
                            className="flex items-center gap-1 hover:underline"
                        >
                            {displayedReactionIcons.map(r => <span key={r} className="text-lg -ml-1">{r}</span>)}
                            <span className="ml-1">{formatNumber(post.stats.likes)}</span>
                        </button>
                        <button className="hover:underline">
                          {formatNumber(post.stats.comments)} comments
                        </button>
                    </div>
                )}
                
                <div className="p-2 mx-2 mt-1 border-t border-white/10">
                    <div className="flex items-center justify-around">
                        <div 
                            className="relative w-1/3 flex justify-center" 
                            onMouseLeave={handleMouseLeave}
                        >
                            {isReactionPopoverVisible && (
                                <div className="absolute bottom-full mb-2 flex items-center gap-2 bg-[#282A36] p-2 rounded-full shadow-lg border border-gray-700">
                                    {reactions.map(reaction => (
                                        <button 
                                            key={reaction} 
                                            onClick={() => handleReactionSelect(reaction)}
                                            className="text-2xl transform transition-transform duration-150 hover:scale-125"
                                        >
                                            {reaction}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onTouchStart={handleMouseDown}
                                onTouchEnd={handleMouseUp}
                                className={`flex items-center justify-center gap-2 w-full py-1.5 rounded-lg transition-colors hover:bg-white/10 ${post.myReaction ? 'text-teal-400' : 'text-gray-300'}`}
                            >
                                {getReactionIcon()}
                                <span className="font-semibold text-sm">{getReactionLabel()}</span>
                            </button>
                        </div>
                        
                        <button className="flex items-center justify-center gap-2 text-gray-300 hover:bg-white/10 w-1/3 py-1.5 rounded-lg transition-colors">
                            <CommentBubbleIconSimple className="w-5 h-5" />
                            <span className="font-semibold text-sm">Comment</span>
                        </button>

                        <button className="flex items-center justify-center gap-2 text-gray-300 hover:bg-white/10 w-1/3 py-1.5 rounded-lg transition-colors">
                            <ShareIconSimple className="w-5 h-5" />
                            <span className="font-semibold text-sm">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PhotoPostCard;