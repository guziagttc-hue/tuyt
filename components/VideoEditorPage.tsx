import React, { useState, useRef, useEffect } from 'react';
import { 
    BackIcon, 
    MusicNoteIcon, 
    TextIcon, 
    StickersIcon, 
    FiltersIcon, 
    CropIcon, 
    PrivacySettingsIcon,
    EditProfileIcon
} from '../constants';

interface VideoEditorPageProps {
  videoUrl: string | null;
  onNext: (videoUrl: string) => void;
  onBack: () => void;
}

const EditorToolButton: React.FC<{icon: React.ReactNode, label: string}> = ({ icon, label }) => (
    <button className="flex flex-col items-center gap-1 text-white group">
        {icon}
        <span className="text-xs font-bold drop-shadow-md">{label}</span>
    </button>
);


const VideoEditorPage: React.FC<VideoEditorPageProps> = ({ videoUrl, onNext, onBack }) => {
    
    useEffect(() => {
        // This is a safety check. If for some reason the page is loaded without a video,
        // navigate back to prevent a broken state.
        if (!videoUrl) {
            onBack();
        }
    }, [videoUrl, onBack]);

    const handleNext = () => {
        if (videoUrl) {
            onNext(videoUrl);
        } else {
            alert("No video to proceed with.");
        }
    };

    return (
        <div className="w-full h-full bg-black text-white flex flex-col relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={onBack} className="p-2">
                    <BackIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 flex justify-center">
                    <button className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                        <MusicNoteIcon className="w-5 h-5"/>
                        <span className="font-semibold">Add sound</span>
                    </button>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center overflow-hidden">
                {videoUrl ? (
                    <video 
                        src={videoUrl} 
                        className="max-w-full max-h-full"
                        autoPlay
                        loop
                        muted
                        key={videoUrl} // Add key to force re-render when video changes
                    />
                ) : (
                    <div className="text-gray-400">
                        <p>Loading video...</p>
                    </div>
                )}
            </main>

             {/* Right Sidebar Tools */}
            <aside className="absolute top-0 right-0 z-20 h-full flex items-center p-4">
                <div className="flex flex-col items-center gap-6 bg-black/30 backdrop-blur-sm p-3 rounded-full">
                    <EditorToolButton icon={<TextIcon />} label="Text" />
                    <EditorToolButton icon={<StickersIcon />} label="Stickers" />
                    <EditorToolButton icon={<FiltersIcon />} label="Filters" />
                    <EditorToolButton icon={<CropIcon />} label="Crop" />
                    <EditorToolButton icon={<PrivacySettingsIcon />} label="Privacy" />
                </div>
            </aside>


            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-4">
                    <button className="flex-1 bg-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                        Edit
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="flex-1 bg-white text-black font-bold py-3 rounded-lg"
                    >
                        Next
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default VideoEditorPage;