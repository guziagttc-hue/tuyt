import React from 'react';

const socialIcons = [
    { name: 'WhatsApp', icon: '📱', color: 'bg-[#25D366]' },
    { name: 'Facebook', icon: 'fb', color: 'bg-[#1877F2]' },
    { name: 'Messenger', icon: '⚡', color: 'bg-[#0084FF]' },
    { name: 'Twitter', icon: '🐦', color: 'bg-[#1DA1F2]' },
    { name: 'More', icon: '•••', color: 'bg-[#333]' },
];

const actionIcons = [
    { name: 'Copy Link', icon: '🔗' },
    { name: 'Save', icon: '⬇️' },
    { name: 'Remix', icon: '✂️' },
    { name: 'Not Int.', icon: '🚫' },
    { name: 'Report', icon: '🚩' },
];

interface ShareMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={onClose}
        >
            <div 
                className="w-full bg-[#1f1f1f] text-white rounded-t-2xl pt-4 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center text-sm font-bold mb-4 text-gray-400">Share to</div>

                {/* Row 1: Social Apps */}
                <div className="flex overflow-x-auto pb-4 px-4 gap-5 scrollbar-hide">
                    {socialIcons.map(item => (
                        <div key={item.name} className="flex flex-col items-center shrink-0 gap-1.5">
                            <button className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${item.color} transition-transform active:scale-90`}>
                                {item.icon}
                            </button>
                            <span className="text-xs text-gray-300">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* Row 2: Actions */}
                <div className="flex overflow-x-auto pb-5 px-4 gap-4 scrollbar-hide border-t border-b border-white/10 pt-4">
                     {actionIcons.map(item => (
                        <div key={item.name} className="flex flex-col items-center shrink-0 gap-1.5 w-16">
                            <button className="w-14 h-11 bg-[#333] rounded-lg flex items-center justify-center text-xl transition-transform active:scale-90">
                                {item.icon}
                            </button>
                            <span className="text-xs text-gray-300 text-center">{item.name}</span>
                        </div>
                    ))}
                </div>
                
                <button 
                    onClick={onClose}
                    className="w-full text-center py-4 bg-[#111] font-semibold text-base"
                >
                    Cancel
                </button>
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ShareMenu;