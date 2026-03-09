import React from 'react';
import { CloseIcon, formatNumber } from '../constants';

interface ReactionSummaryModalProps {
  reactions: { [key: string]: number };
  totalLikes: number;
  onClose: () => void;
}

const reactionsOrder = ['❤️', '💓', '🥰', '🤣', '😥', '🤭'];

const ReactionSummaryModal: React.FC<ReactionSummaryModalProps> = ({ reactions, totalLikes, onClose }) => {
  const displayedReactions = reactionsOrder.filter(r => reactions[r]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#1A1B20] w-full max-w-xs rounded-2xl p-4 border border-gray-700/50" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {displayedReactions.map(reaction => (
              <span key={reaction} className="text-xl">{reaction}</span>
            ))}
            <span className="text-gray-300 font-semibold">{formatNumber(totalLikes)}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {displayedReactions.map(reaction => (
              <div key={reaction} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10">
                <span className="text-2xl">{reaction}</span>
                <span className="text-white font-semibold">{formatNumber(reactions[reaction])}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ReactionSummaryModal;