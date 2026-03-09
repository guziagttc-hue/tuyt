import React from 'react';
import type { GalleryMedia } from '../types';
import { CloseIcon, HeartIconFilled, CommentBubbleIconSimple, ShareIconSimple, EyeIcon, formatNumber } from '../constants';

interface PhotoPostPageProps {
  post: GalleryMedia;
  onBack: () => void;
}

const ActionButton: React.FC<{icon: React.ReactNode; label: string; active?: boolean}> = ({ icon, label, active }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className={`font-semibold text-sm ${active ? 'text-teal-400' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const PhotoPostPage: React.FC<PhotoPostPageProps> = ({ post, onBack }) => {
  if (!post.user || !post.caption || !post.timestamp || !post.stats) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <p>Post data is incomplete.</p>
        <button onClick={onBack} className="ml-4 p-2 bg-gray-200 rounded">Back</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white text-black flex flex-col">
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white">
          {/* Post Header */}
          <header className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold">{post.user.name}</p>
                   <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.928 17.202l-3.27-3.27a.75.75 0 011.06-1.061l2.74 2.739 5.86-5.86a.75.75 0 011.061 1.06l-6.39 6.391a.75.75 0 01-1.06 0z"></path></svg>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <span>{post.timestamp}</span>
                  <span>·</span>
                   <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM9 11H7V7h2v4zm0-5H7V5h2v1z"></path></svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
              <button onClick={onBack}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Post Content */}
          <div className="px-4 pb-2">
            <p className="text-base">{post.caption}</p>
          </div>
          <img src={post.url} alt={post.caption} className="w-full" />
        </div>
      </main>

      {/* Post Footer */}
      <footer className="w-full max-w-2xl mx-auto p-3 border-t bg-white shrink-0">
        <div className="flex justify-around items-center">
{/* FIX: Converted number to formatted string to match prop type. */}
          <ActionButton icon={<HeartIconFilled className="w-5 h-5 text-teal-500"/>} label={formatNumber(post.stats.likes)} active />
{/* FIX: Converted number to formatted string to match prop type. */}
          <ActionButton icon={<CommentBubbleIconSimple className="w-5 h-5 text-gray-500"/>} label={formatNumber(post.stats.comments)} />
{/* FIX: Converted number to formatted string to match prop type. */}
          <ActionButton icon={<ShareIconSimple className="w-5 h-5 text-gray-500"/>} label={formatNumber(post.stats.shares)} />
{/* FIX: Converted number to formatted string to match prop type. */}
          <ActionButton icon={<EyeIcon className="w-5 h-5 text-gray-500"/>} label={formatNumber(post.stats.views)} />
        </div>
         <div className="relative h-1 mt-3">
            <div className="absolute top-0 left-0 h-full w-full bg-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 h-full w-1/4 bg-teal-500 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default PhotoPostPage;