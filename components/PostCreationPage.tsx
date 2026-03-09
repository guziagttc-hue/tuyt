import React, { useState, useRef, useEffect } from 'react';
import { 
    BackIcon, 
    HashtagIcon, 
    AtIcon, 
    ContentDisclosureIcon, 
    ChevronRightIcon, 
    LockIcon,
    ChatBubbleIcon,
    DuetIcon,
    PublishIcon,
    ShopBagIcon
} from '../constants';

interface PostCreationPageProps {
    onBack: () => void;
    onPublish: (videoData: { title: string; description: string; videoUrl: string; hashtags: string[] }) => void;
    videoUrl: string;
}

const PostCreationPage: React.FC<PostCreationPageProps> = ({ onBack, onPublish, videoUrl }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    useEffect(() => {
        if (!videoUrl) return;

        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.crossOrigin = "anonymous";
        videoElement.muted = true;
        videoElement.preload = 'auto';

        const generateThumbnail = () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                setThumbnailUrl(canvas.toDataURL('image/jpeg'));
            }
            videoElement.removeEventListener('seeked', generateThumbnail);
        };
      
        videoElement.addEventListener('loadeddata', () => {
            videoElement.currentTime = 0.5; // Seek to half a second
        });

        videoElement.addEventListener('seeked', generateThumbnail);
      
        return () => {
          // Cleanup video element listeners
          videoElement.removeEventListener('loadeddata', () => {});
          videoElement.removeEventListener('seeked', generateThumbnail);
        }

    }, [videoUrl]);


    const handlePublish = () => {
        if (!videoUrl) {
            alert('Please select a video file.');
            return;
        }
        if (!title.trim()) {
            alert('Please enter a title.');
            return;
        }

        const extractedHashtags = description.match(/#\w+/g) || [];

        onPublish({
            title,
            description,
            videoUrl: videoUrl,
            hashtags: extractedHashtags,
        });
    };

    return (
        <div className="w-full h-full bg-white text-black flex flex-col">
            {/* Header */}
            <header className="p-4 flex items-center shrink-0 border-b">
                <button onClick={onBack} className="mr-4">
                    <BackIcon className="w-6 h-6 text-black" />
                </button>
                <h1 className="text-lg font-bold">New Post</h1>
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="flex gap-4">
                    <div
                        className="w-32 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer overflow-hidden"
                    >
                       {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                        ) : (
                           <div className="text-xs">Generating...</div>
                        )}
                    </div>
                    <div className="flex-grow space-y-2">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-28 bg-gray-100 p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="bg-gray-200 text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><HashtagIcon /> Hashtags</button>
                    <button className="bg-gray-200 text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"><AtIcon /> Friends</button>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="p-4 flex items-center gap-4 shrink-0 border-t bg-white">
                <button className="flex-1 bg-gray-200 text-black font-bold py-3 rounded-lg">Save as Draft</button>
                <button onClick={handlePublish} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    <PublishIcon /> Publish
                </button>
            </footer>
        </div>
    );
};

export default PostCreationPage;