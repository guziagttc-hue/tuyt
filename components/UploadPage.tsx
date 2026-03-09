import React, { useState } from 'react';
import { BackIcon, UploadIcon } from '../constants';
import type { ShopPost } from '../types';
import ShopPostCreationPage from './ShopPostCreationPage';

interface UploadPageProps {
  onVideoSelected: (videoUrl: string) => void;
  onPhotoSelected: (photoUrl: string) => void;
  onPublishShopPost: (postData: Omit<ShopPost, 'id' | 'seller' | 'rating' | 'reviews' | 'views'>) => void;
  onClose: () => void;
  initialTab?: 'video' | 'photo' | 'shop';
}

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void}> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-white/10'}`}
    >
        {label}
    </button>
);

const UploadArea: React.FC<{onFileSelected: (url: string) => void, fileType: 'video' | 'photo'}> = ({ onFileSelected, fileType }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const acceptType = fileType === 'video' ? 'video/*' : 'image/*';

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onFileSelected(url);
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const textMap = {
        video: 'video',
        photo: 'photo',
    }

    return (
        <div className="w-full max-w-md">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={acceptType}
                onChange={handleFileChange}
            />
            <button 
                onClick={triggerFileInput}
                className="w-full aspect-video border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center text-center text-gray-400 hover:border-cyan-400 hover:text-white transition-colors"
            >
                <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
                <h2 className="text-xl font-bold">Tap to upload</h2>
                <p className="text-sm mt-1">Select a {textMap[fileType]} from your device</p>
            </button>
        </div>
    );
};


const UploadPage: React.FC<UploadPageProps> = ({ onVideoSelected, onPhotoSelected, onPublishShopPost, onClose, initialTab = 'video' }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'photo' | 'shop'>(initialTab);

  const headerTitle = activeTab === 'shop' ? 'List a New Product' : 'Create new post';

  const renderContent = () => {
    switch(activeTab) {
      case 'video':
        return <div className="flex-grow flex items-center justify-center p-4"><UploadArea onFileSelected={onVideoSelected} fileType="video" /></div>;
      case 'photo':
        return <div className="flex-grow flex items-center justify-center p-4"><UploadArea onFileSelected={onPhotoSelected} fileType="photo" /></div>;
      case 'shop':
        return <ShopPostCreationPage onPublish={onPublishShopPost} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-full h-full bg-[#0D0F13] text-white flex flex-col">
        <header className="p-4 flex items-center shrink-0 border-b border-white/10 sticky top-0 bg-[#0D0F13] z-10">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                <BackIcon className="text-white" />
            </button>
            <h1 className="text-lg font-bold ml-4">{headerTitle}</h1>
        </header>

        <div className="p-4 flex items-center justify-center gap-2 border-b border-white/10 shrink-0">
            <TabButton label="Video" active={activeTab === 'video'} onClick={() => setActiveTab('video')} />
            <TabButton label="Photo" active={activeTab === 'photo'} onClick={() => setActiveTab('photo')} />
            <TabButton label="Shop" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
        </div>
      
        <main className="flex-grow overflow-y-auto flex flex-col">
            {renderContent()}
        </main>
    </div>
  );
};

export default UploadPage;