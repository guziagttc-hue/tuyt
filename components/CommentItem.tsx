import React from 'react';
import type { Comment as CommentType } from '../types';
import { HeartIconFilled } from '../constants';

interface CommentItemProps {
  comment: CommentType;
  onLike: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike }) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full mt-1 shrink-0" />
      <div className="flex-grow">
        <p className="text-xs text-gray-400">{comment.user.name}</p>
        <p className="text-sm text-white">{comment.text}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span>{comment.timestamp}</span>
          <button className="font-semibold hover:text-white">Reply</button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button onClick={() => onLike(comment.id)}>
          <HeartIconFilled className={`w-4 h-4 transition-colors ${comment.isLikedByMe ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`} />
        </button>
        <span className="text-xs text-gray-400">{comment.likes > 0 ? comment.likes : ''}</span>
      </div>
    </div>
  );
};

export default CommentItem;
