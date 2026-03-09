import React from 'react';
import type { User } from '../types';
import { CloseIcon, UploadIcon, CameraIcon, TemplatesIcon } from '../constants';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onGoToUploadPage: () => void;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className="w-16 h-16 bg-[#282A36] rounded-2xl flex items-center justify-center group-hover:bg-[#3b3d4d] transition-colors">
            {icon}
        </div>
        <span className="text-sm font-semibold text-gray-300">{label}</span>
    </button>
);


const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, user, onGoToUploadPage }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
    >
        <div 
            className="bg-[#1A1B20] w-full max-w-sm rounded-3xl p-6 text-center border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative">
                <button onClick={onClose} className="absolute -top-2 -right-2 text-gray-400 hover:text-white">
                    <CloseIcon />
                </button>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                    <div className="absolute inset-0 rounded-full border-4 border-purple-600 ring-4 ring-purple-600/30"></div>
                </div>
                
                <p className="text-gray-400 mt-4 text-sm font-semibold">{user.username}</p>
                <h2 className="text-2xl font-bold text-white mt-2">Create new content</h2>

                <div className="flex justify-around w-full mt-8">
                    <ActionButton 
                        icon={<UploadIcon className="w-8 h-8 text-purple-400"/>} 
                        label="Upload"
                        onClick={onGoToUploadPage}
                    />
                    <ActionButton 
                        icon={<CameraIcon className="w-8 h-8 text-cyan-400"/>} 
                        label="Camera"
                    />
                    <ActionButton 
                        icon={<TemplatesIcon className="w-8 h-8 text-pink-400"/>} 
                        label="Templates"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default UploadModal;