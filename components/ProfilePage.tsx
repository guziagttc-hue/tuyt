

import React, { useState } from 'react';
import type { User, Video, PhotoPost } from '../types';
import { 
  BackIcon, EditProfileIcon, SettingsIcon, ShareIcon,
  VideosIcon, ShopIcon, PhotosIcon,
  PlayIconSimple, GalleryIcon, ChevronDownIcon, CheckmarkIcon, GiftIcon,
  formatNumber
} from '../constants';

interface ProfilePageProps {
  user: User;
  allVideos: Video[];
  allPhotoPosts: PhotoPost[];
  onBack: () => void;
  showBackButton: boolean;
  onEdit?: () => void;
  onSettings?: () => void;
  onPlayVideo: (videoId: number) => void;
  loggedInUser: User;
  switchableAccounts: User[];
  onSwitchAccount: (user: User) => void;
  onToggleObserve: (user: User) => void;
}

const IconButton: React.FC<{children: React.ReactNode, onClick?: () => void}> = ({children, onClick}) => (
    <button onClick={onClick} className="w-10 h-10 bg-[#282A36]/80 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#3b3d4d] transition-colors">
        {children}
    </button>
);

const StatItem: React.FC<{value: string; label: string}> = ({value, label}) => (
    <div className="text-center px-2">
        <p className="text-base font-bold text-white">{value}</p>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

const ProfileTab: React.FC<{icon: React.ReactNode, label: string, active?: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${active ? 'bg-gray-700/50' : 'hover:bg-gray-800/50'}`}>
    {icon}
    <span className={`font-semibold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const VideoGridItem: React.FC<{ video: Video; index: number; onPlay: () => void; }> = ({ video, index, onPlay }) => {
    const neonClasses = [
        "border-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)] group-hover:shadow-[0_0_15px_theme(colors.cyan.400)]",
        "border-fuchsia-500 shadow-[0_0_8px_theme(colors.fuchsia.500)] group-hover:shadow-[0_0_15px_theme(colors.fuchsia.500)]",
        "border-lime-400 shadow-[0_0_8px_theme(colors.lime.400)] group-hover:shadow-[0_0_15px_theme(colors.lime.400)]",
    ];
    const neonClass = neonClasses[index % neonClasses.length];


    return (
        <button onClick={onPlay} className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group">
            <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className={`absolute inset-0 border-2 ${neonClass} rounded-2xl pointer-events-none`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"></div>

            <div className="absolute top-2 right-2 text-white pointer-events-none">
                <GalleryIcon className="w-5 h-5" />
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white text-sm font-bold [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)] pointer-events-none">
                <PlayIconSimple className="w-4 h-4" />
                <span>{formatNumber(video.likes)}</span>
            </div>
        </button>
    );
};

const PhotoGridItem: React.FC<{ post: PhotoPost; index: number; }> = ({ post, index }) => {
    const neonClasses = [
        "border-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)] group-hover:shadow-[0_0_15px_theme(colors.cyan.400)]",
        "border-fuchsia-500 shadow-[0_0_8px_theme(colors.fuchsia.500)] group-hover:shadow-[0_0_15px_theme(colors.fuchsia.500)]",
        "border-lime-400 shadow-[0_0_8px_theme(colors.lime.400)] group-hover:shadow-[0_0_15px_theme(colors.lime.400)]",
    ];
    const neonClass = neonClasses[index % neonClasses.length];

    return (
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className={`absolute inset-0 border-2 ${neonClass} rounded-2xl pointer-events-none`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"></div>
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ user, allVideos, allPhotoPosts, onBack, showBackButton, onEdit, onSettings, onPlayVideo, loggedInUser, switchableAccounts, onSwitchAccount, onToggleObserve }) => {
  const userVideos = allVideos.filter(video => video.user.username === user.username);
  const userPhotos = allPhotoPosts.filter(post => post.user.username === user.username);
  const [activeTab, setActiveTab] = useState('Videos');
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  
  const isOwnProfile = user.username === loggedInUser.username;
  const isObserving = loggedInUser.observing.includes(user.username);

  const BioText: React.FC<{text: string}> = ({text}) => {
    const maxLength = 80;
    if (text.length <= maxLength) {
        return <p className="text-gray-400 mt-1 text-sm">{text}</p>;
    }
    
    if (isBioExpanded) {
        return (
            <p className="text-gray-400 mt-1 text-sm">
                {text}
                <button onClick={() => setIsBioExpanded(false)} className="text-cyan-400 font-semibold ml-2">See less</button>
            </p>
        );
    }
    
    return (
        <p className="text-gray-400 mt-1 text-sm">
            {`${text.substring(0, maxLength)}...`}
            <button onClick={() => setIsBioExpanded(true)} className="text-cyan-400 font-semibold ml-2">See more</button>
        </p>
    );
  };

  return (
    <div className="w-full h-full bg-[#0D0F13] overflow-y-auto">
      {/* Profile Info Section */}
      <div className="relative mb-4">
        {/* Cover Photo */}
        <div className="relative">
            <img src={user.coverPhoto} alt="Cover" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
        </div>
        {showBackButton && (
            <button 
                onClick={onBack} 
                className="absolute top-4 left-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
            >
              <BackIcon />
            </button>
        )}
        
        {/* All content below cover photo */}
        <div className="relative px-4 -mt-16 z-10">
             <div className="flex items-end justify-between">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-24 h-24 rounded-full border-4 border-[#0D0F13] object-cover" 
                    />
                </div>
                {/* Top Buttons */}
                {!isOwnProfile && (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onToggleObserve(user)}
                            className={`font-semibold py-2 px-5 rounded-lg transition-colors text-sm ${isObserving ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-black'}`}
                        >
                            {isObserving ? 'Observing' : 'Observe'}
                        </button>
                        <button className="bg-[#282A36] hover:bg-[#3b3d4d] text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm">
                            Message
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-2 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        {isOwnProfile && switchableAccounts.length > 1 && (
                            <div className="relative">
                                <button onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}>
                                    <ChevronDownIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                                </button>
                                {isAccountSwitcherOpen && (
                                    <div className="absolute top-full mt-2 w-64 bg-[#282A36] rounded-lg shadow-lg z-20 border border-gray-700">
                                        {switchableAccounts.map(account => (
                                            <button 
                                                key={account.username} 
                                                onClick={() => {
                                                    onSwitchAccount(account);
                                                    setIsAccountSwitcherOpen(false);
                                                }}
                                                className="w-full text-left flex items-center gap-3 p-3 hover:bg-[#3b3d4d] transition-colors"
                                            >
                                                <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-white">{account.name}</p>
                                                    <p className="text-sm text-gray-400">{account.username}</p>
                                                </div>
                                                {account.username === loggedInUser.username && (
                                                    <CheckmarkIcon className="w-5 h-5 text-cyan-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <BioText text={user.bio} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    {isOwnProfile && (
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 bg-[#282A36]/80 hover:bg-[#3b3d4d] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                <VideosIcon className="w-5 h-5" />
                                <span>Video Upload</span>
                            </button>
                            <button className="flex items-center gap-2 bg-[#282A36]/80 hover:bg-[#3b3d4d] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                <GiftIcon className="w-5 h-5" />
                                <span>Share Gift</span>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center space-x-3">
                        {isOwnProfile && <IconButton onClick={onEdit}><EditProfileIcon /></IconButton>}
                        <IconButton onClick={onSettings}><SettingsIcon /></IconButton>
                        <IconButton><ShareIcon /></IconButton>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-4 pt-0">
        <div className="bg-[#1A1B20] p-3 rounded-xl">
            <div className="flex items-center justify-around">
                <StatItem value={formatNumber(user.stats.observers)} label="Observers" />
                <div className="h-10 w-px bg-white/10"></div>
                <StatItem value={formatNumber(user.stats.observing)} label="Observing" />
                <div className="h-10 w-px bg-white/10"></div>
                <StatItem value={formatNumber(user.stats.totalViews)} label="Total Views" />
                <div className="h-10 w-px bg-white/10"></div>
                <StatItem value={`${user.stats.joined}`} label="Joined" />
            </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="px-4 mt-2 pb-4">
         <div className="flex items-center justify-around bg-[#1A1B20] p-1 rounded-xl">
           <ProfileTab icon={<VideosIcon />} label="Videos" active={activeTab === 'Videos'} onClick={() => setActiveTab('Videos')} />
           <ProfileTab icon={<ShopIcon />} label="Shop" active={activeTab === 'Shop'} onClick={() => setActiveTab('Shop')} />
           <ProfileTab icon={<PhotosIcon />} label="Photos" active={activeTab === 'Photos'} onClick={() => setActiveTab('Photos')} />
         </div>

         <div className="mt-4">
            {activeTab === 'Videos' && (
              <div className="grid grid-cols-3 gap-1">
                  {userVideos.map((video, index) => (
                    <VideoGridItem key={video.id} video={video} index={index} onPlay={() => onPlayVideo(video.id)} />
                  ))}
              </div>
            )}
            {activeTab === 'Shop' && (
              <div className="text-center py-10 text-gray-500">
                  <ShopIcon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">This user's shop is empty.</h3>
                  <p>Check back later for cool products!</p>
              </div>
            )}
            {activeTab === 'Photos' && (
                userPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1">
                        {userPhotos.map((post, index) => (
                            <PhotoGridItem key={post.id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <PhotosIcon className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">No photos yet.</h3>
                        <p>This user hasn't posted any photos.</p>
                    </div>
                )
            )}
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;