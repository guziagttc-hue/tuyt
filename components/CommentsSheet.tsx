import React, { useState } from 'react';
import type { Comment as CommentType, User } from '../types';
import { CloseIcon } from '../constants';
import CommentItem from './CommentItem';

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentType[];
  totalComments: number;
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: number) => void;
  loggedInUser: User;
}

// FIX: Changed to a named export to resolve import issues.
export const CommentsSheet: React.FC<CommentsSheetProps> = ({ isOpen, onClose, comments, totalComments, onAddComment, onLikeComment, loggedInUser }) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-end"
        onClick={onClose}
    >
        <div 
            className="w-full h-[70vh] bg-[#1f1f1f] text-white rounded-t-2xl flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <header className="shrink-0 p-4 border-b border-white/10 flex justify-center items-center relative">
                <h2 className="font-bold">{totalComments} Comments</h2>
                <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <CloseIcon />
                </button>
            </header>

            {/* Comments List */}
            <main className="flex-grow overflow-y-auto px-4">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} onLike={onLikeComment} />
                ))}
            </main>

            {/* Footer - Add Comment */}
            <footer className="shrink-0 p-3 border-t border-white/10 bg-[#1f1f1f]">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <img src={loggedInUser.avatar} alt="Your avatar" className="w-9 h-9 rounded-full" />
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-[#333] rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 border border-transparent focus:outline-none focus:border-cyan-400"
                    />
                    <button type="submit" className="font-semibold text-cyan-400 hover:text-cyan-300 disabled:text-gray-500" disabled={!newComment.trim()}>
                        Post
                    </button>
                </form>
            </footer>

            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    </div>
  );
};

export default CommentsSheet;
