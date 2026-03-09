
import React from 'react';
import { trendingTopics, featuredCommunities, VibeLogo, HomeIcon, ShopIcon, ProfileIcon, InboxIcon } from '../constants';
import type { Community } from '../types';
import type { View } from '../App';

interface LeftSidebarProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-purple-600/30 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
    {icon}
    <span className="font-bold text-lg">{label}</span>
  </button>
);


const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNavigate, currentView }) => {
  return (
    <div className="text-white p-4 space-y-8 bg-[#181520] rounded-2xl h-full flex flex-col">
      <div className="flex items-center">
        <VibeLogo />
        <h1 className="text-2xl font-bold tracking-wider">VIBE</h1>
      </div>

      <nav className="space-y-2">
        <NavItem icon={<HomeIcon active={currentView === 'feed'} />} label="Home" active={currentView === 'feed'} onClick={() => onNavigate('feed')} />
        <NavItem icon={<ShopIcon className="w-6 h-6" active={currentView === 'foryou'} />} label="Shop" active={currentView === 'foryou'} onClick={() => onNavigate('foryou')} />
        <NavItem icon={<InboxIcon active={currentView === 'inbox'} />} label="Inbox" active={currentView === 'inbox'} onClick={() => onNavigate('inbox')} />
        <NavItem icon={<ProfileIcon active={currentView === 'profile'} />} label="Profile" active={currentView === 'profile'} onClick={() => onNavigate('profile')} />
      </nav>

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