import React, { useState } from 'react';
import type { User } from '../types';
import { BackIcon, GlobeIcon, PhotosIcon, TagPeopleIcon, FeelingActivityIcon, GetMessagesIcon, VerifiedBadgeIcon } from '../constants';

interface CreatePhotoPostPageProps {
    imageUrl: string;
    user: User;
    onBack: () => void;
    onPublish: (caption: string) => void;
}

const ActionItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="w-full flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors rounded-lg">
        {icon}
        <span className="font-semibold text-gray-700">{label}</span>
    </button>
);

const CreatePhotoPostPage: React.FC<CreatePhotoPostPageProps> = ({ imageUrl, user, onBack, onPublish }) => {
    const [caption, setCaption] = useState('');

    const handlePublish = () => {
        onPublish(caption);
    };

    return (
        <div className="w-full h-full bg-gray-100 text-black flex flex-col">
            {/* Header */}
            <header className="p-3 flex items-center justify-between shrink-0 border-b bg-white">
                <div className="flex items-center gap-4">
                    <button onClick={onBack}>
                        <BackIcon className="w-6 h-6 text-black" />
                    </button>
                    <h1 className="text-lg font-bold">Create post</h1>
                </div>
                <button 
                    onClick={handlePublish}
                    className="font-bold px-5 py-1.5 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    POST
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                <div className="p-4 bg-white">
                    <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            {/* FIX: Added a verified icon next to the username if the user is verified. */}
                            <div className="flex items-center gap-1">
                                <p className="font-bold">{user.name}</p>
                                {user.isVerified && <VerifiedBadgeIcon className="w-4 h-4 text-blue-500" />}
                            </div>
                            <button className="flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded-md text-xs font-semibold text-gray-700">
                                <GlobeIcon className="w-3 h-3 text-gray-600" />
                                <span>Public</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>

                    <textarea
                        placeholder={`What's on your mind?`}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full h-24 mt-4 bg-transparent p-1 resize-none focus:outline-none text-lg placeholder:text-gray-400"
                    />
                </div>
                
                {imageUrl && (
                     <div className="mt-2 p-2 bg-white">
                        <div className="border rounded-lg overflow-hidden relative">
                             <img src={imageUrl} alt="Post preview" className="w-full h-auto" />
                             <div className="absolute top-2 right-2 flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                                <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                             </div>
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="p-2 border-t bg-white shrink-0">
                <ActionItem icon={<PhotosIcon className="w-6 h-6 text-green-500"/>} label="Photos" />
                <ActionItem icon={<TagPeopleIcon className="w-6 h-6 text-blue-500"/>} label="Tag people" />
                <ActionItem icon={<FeelingActivityIcon className="w-6 h-6 text-red-500"/>} label="Feeling/activity" />
                <ActionItem icon={<GetMessagesIcon className="w-6 h-6 text-blue-600"/>} label="Get messages" />
            </footer>
        </div>
    );
};

export default CreatePhotoPostPage;