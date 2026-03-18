
import React, { useState } from 'react';
import { trendingTopics, featuredCommunities, VibeLogo, HomeIcon, ShopIcon, ProfileIcon, InboxIcon } from '../constants';
import type { Community } from '../types';
import type { View } from '../App';

interface LeftSidebarProps {
  onNavigate: (view: View) => void;
  currentView: View;
  onLogout: () => void;
}

const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-purple-600/30 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
    {icon}
    <span className="font-medium text-xs">{label}</span>
  </button>
);


const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNavigate, currentView, onLogout }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleMenuItemClick = (action: string) => {
    setIsMoreOpen(false);
    switch (action) {
      case 'settings':
        onNavigate('settings');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        alert(`${action} clicked! (Not fully implemented yet)`);
    }
  };

  return (
    <div className="text-white p-4 space-y-8 bg-[#181520] rounded-2xl h-full flex flex-col relative">
      <div className="flex items-center">
        <VibeLogo />
        <h1 className="text-2xl font-bold tracking-wider">Reelify</h1>
      </div>

      <nav className="space-y-2">
        <NavItem icon={<HomeIcon active={currentView === 'feed'} />} label="Home" active={currentView === 'feed'} onClick={() => onNavigate('feed')} />
        <NavItem icon={<ShopIcon className="w-6 h-6" active={currentView === 'foryou'} />} label="Shop" active={currentView === 'foryou'} onClick={() => onNavigate('foryou')} />
        <NavItem icon={<InboxIcon active={currentView === 'inbox'} />} label="Inbox" active={currentView === 'inbox'} onClick={() => onNavigate('inbox')} />
        <NavItem icon={<ProfileIcon active={currentView === 'profile'} />} label="Profile" active={currentView === 'profile'} onClick={() => onNavigate('profile')} />
        <button 
          onClick={() => onNavigate('upload')}
          className="w-full flex flex-col items-center gap-1 px-4 py-3 mt-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <span className="font-medium text-xs">Upload</span>
        </button>
        <button 
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="w-full flex flex-col items-center gap-1 px-4 py-3 mt-4 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="font-medium text-xs">More</span>
        </button>
      </nav>

      {isMoreOpen && (
        <div className="absolute bottom-20 left-4 w-64 bg-[#252530] rounded-xl p-4 shadow-xl z-50 text-sm space-y-4">
          <div>
            <h4 className="text-gray-400 font-semibold mb-2">Settings</h4>
            <ul className="space-y-1 text-gray-200">
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('settings')}>Settings</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('language')}>English (US)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('darkmode')}>Dark mode</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 font-semibold mb-2">Tools</h4>
            <ul className="space-y-1 text-gray-200">
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('studio')}>Reelify Studio</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('effects')}>Create Reelify effects</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('live')}>Reelify LIVE tools</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('coins')}>Get Reelify Coins</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('shop')}>Sell on Reelify Shop</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-400 font-semibold mb-2">Reelify</h4>
            <ul className="space-y-1 text-gray-200">
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('support')}>Support</li>
              <li className="hover:text-white cursor-pointer" onClick={() => handleMenuItemClick('logout')}>Log out</li>
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 pt-6 flex-grow flex flex-col gap-8 overflow-y-auto">
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-300">Trending Topics</h3>
            <ul className="space-y-2">
            {trendingTopics.map((topic, index) => (
                <li key={index} className="text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">{topic}</li>
            ))}
            </ul>
        </div>
        <div>
            <h3 className="text-lg font-bold mb-4 text-gray-300">Featured Communities</h3>
            <ul className="space-y-4">
            {featuredCommunities.map((community: Community) => (
                <li key={community.name} className="flex items-center space-x-3 cursor-pointer group">
                <img src={community.icon} alt={community.name} className="w-10 h-10 rounded-full border-2 border-purple-500 group-hover:border-cyan-400 transition-colors" />
                <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{community.name}</span>
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;