
import React, { useState, useEffect } from 'react';
import { BackIcon, ChevronRightIcon, UserIcon, LockIcon, BellIcon, BriefcaseIcon, MegaphoneIcon, ClockIcon, LayersIcon, UsersIcon } from '../constants';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

type SubView = 'main' | 'manage' | 'privacy' | 'notifications' | 'business' | 'ads' | 'screentime' | 'content' | 'family' | 'phone' | 'email' | 'password' | 'comments' | 'dm' | 'download';

const SettingsItem: React.FC<{ icon: React.ReactNode; label: string; value?: string; onClick: () => void }> = ({ icon, label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-400">
        {icon}
      </div>
      <span className="text-white font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-gray-500 text-sm">{value}</span>}
      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
    </div>
  </button>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
    <div className="bg-[#1A1B20] rounded-2xl overflow-hidden mx-4">
      {children}
    </div>
  </div>
);

const SubPage: React.FC<{ title: string; onBack: () => void; children: React.ReactNode }> = ({ title, onBack, children }) => (
  <div className="absolute inset-0 bg-[#0D0F13] flex flex-col z-50 animate-in slide-in-from-right duration-300">
    <header className="shrink-0 p-4 flex items-center gap-4 border-b border-white/5">
      <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
        <BackIcon />
      </button>
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </header>
    <div className="flex-grow overflow-y-auto p-4">
      {children}
    </div>
  </div>
);

const Toggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: () => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-grow pr-4">
      <p className="text-white font-medium">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-cyan-500' : 'bg-gray-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout, onDeleteAccount }) => {
  const [currentSubView, setCurrentSubView] = useState<SubView>('main');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem('vibe-settings-toggles');
    return saved ? JSON.parse(saved) : {
      privateAccount: false,
      pushEnabled: true,
      personalizedAds: true,
      screenTimeReminder: false,
      targetedAdsOutside: true,
      offTikTokActivity: true,
      weeklyUpdates: true,
      desktopNotifications: false,
    };
  });

  const [accountInfo, setAccountInfo] = useState(() => {
    const saved = localStorage.getItem('vibe-settings-account');
    return saved ? JSON.parse(saved) : {
      phone: '+880 1XXX XXXXXX',
      email: 'm***@gmail.com',
      password: '••••••••',
      comments: 'Everyone',
      dm: 'Friends',
    };
  });

  useEffect(() => {
    localStorage.setItem('vibe-settings-toggles', JSON.stringify(toggles));
  }, [toggles]);

  useEffect(() => {
    localStorage.setItem('vibe-settings-account', JSON.stringify(accountInfo));
  }, [accountInfo]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const renderSubView = () => {
    switch (currentSubView) {
      case 'manage':
        return (
          <SubPage title="Manage account" onBack={() => setCurrentSubView('main')}>
            <div className="space-y-6">
              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Account information</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button onClick={() => setCurrentSubView('phone')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white">Phone number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{accountInfo.phone}</span>
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  </button>
                  <button onClick={() => setCurrentSubView('email')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white">Email</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{accountInfo.email}</span>
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  </button>
                  <button onClick={() => setCurrentSubView('password')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white">Password</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="p-4 flex justify-between items-center border-b border-white/5">
                    <span className="text-white">Account region</span>
                    <span className="text-gray-400">Bangladesh</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">Your account region is initially set based on the time and place of registration.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Account control</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setCurrentSubView('business')}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5"
                  >
                    <span className="text-white font-medium">Switch to Business Account</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-red-500 font-medium"
                  >
                    <span>Delete account</span>
                    <span className="text-xs bg-red-500/10 px-2 py-1 rounded">Delete</span>
                  </button>
                </div>
              </section>
            </div>
          </SubPage>
        );
      case 'phone':
        return (
          <SubPage title="Phone number" onBack={() => setCurrentSubView('manage')}>
            <div className="p-4 space-y-4">
              <p className="text-gray-400 text-sm">Update your phone number to keep your account secure.</p>
              <div className="bg-[#1A1B20] p-4 rounded-2xl">
                <input 
                  type="tel" 
                  value={accountInfo.phone}
                  onChange={(e) => setAccountInfo({...accountInfo, phone: e.target.value})}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              <button 
                onClick={() => { showToastMsg('Phone number updated'); setCurrentSubView('manage'); }}
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl"
              >
                Save
              </button>
            </div>
          </SubPage>
        );
      case 'email':
        return (
          <SubPage title="Email" onBack={() => setCurrentSubView('manage')}>
            <div className="p-4 space-y-4">
              <p className="text-gray-400 text-sm">Update your email address for account recovery and notifications.</p>
              <div className="bg-[#1A1B20] p-4 rounded-2xl">
                <input 
                  type="email" 
                  value={accountInfo.email}
                  onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="Enter email address"
                />
              </div>
              <button 
                onClick={() => { showToastMsg('Email updated'); setCurrentSubView('manage'); }}
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl"
              >
                Save
              </button>
            </div>
          </SubPage>
        );
      case 'password':
        return (
          <SubPage title="Password" onBack={() => setCurrentSubView('manage')}>
            <div className="p-4 space-y-4">
              <p className="text-gray-400 text-sm">Change your password to keep your account secure.</p>
              <div className="bg-[#1A1B20] p-4 rounded-2xl">
                <input 
                  type="password" 
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="Current password"
                />
              </div>
              <div className="bg-[#1A1B20] p-4 rounded-2xl">
                <input 
                  type="password" 
                  className="w-full bg-transparent text-white outline-none"
                  placeholder="New password"
                />
              </div>
              <button 
                onClick={() => { showToastMsg('Password changed'); setCurrentSubView('manage'); }}
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl"
              >
                Update Password
              </button>
            </div>
          </SubPage>
        );
      case 'privacy':
        return (
          <SubPage title="Privacy" onBack={() => setCurrentSubView('main')}>
            <div className="space-y-6">
              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Discoverability</h3>
                <div className="bg-[#1A1B20] rounded-2xl p-4">
                  <Toggle 
                    label="Private account" 
                    description="With a private account, only users you approve can follow you and watch your videos. Your existing followers won’t be affected."
                    checked={toggles.privateAccount}
                    onChange={() => handleToggle('privateAccount')}
                  />
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Interactions</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button onClick={() => setCurrentSubView('comments')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <div>
                      <p className="text-white font-medium">Comments</p>
                      <p className="text-xs text-gray-500">Who can comment on your posts</p>
                    </div>
                    <span className="text-gray-400 text-sm">{accountInfo.comments}</span>
                  </button>
                  <button onClick={() => setCurrentSubView('dm')} className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                    <div>
                      <p className="text-white font-medium">Direct messages</p>
                      <p className="text-xs text-gray-500">Who can send you messages</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{accountInfo.dm}</span>
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  </button>
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Data</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button onClick={() => setCurrentSubView('download')} className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                    <div>
                      <p className="text-white font-medium">Download your data</p>
                      <p className="text-xs text-gray-500">Get a copy of your TikTok data</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </section>
            </div>
          </SubPage>
        );
      case 'comments':
        return (
          <SubPage title="Comments" onBack={() => setCurrentSubView('privacy')}>
            <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
              {['Everyone', 'Friends', 'No one'].map(option => (
                <button 
                  key={option}
                  onClick={() => { setAccountInfo({...accountInfo, comments: option}); setCurrentSubView('privacy'); }}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-0"
                >
                  <span className="text-white">{option}</span>
                  {accountInfo.comments === option && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
                </button>
              ))}
            </div>
          </SubPage>
        );
      case 'dm':
        return (
          <SubPage title="Direct messages" onBack={() => setCurrentSubView('privacy')}>
            <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
              {['Everyone', 'Friends', 'No one'].map(option => (
                <button 
                  key={option}
                  onClick={() => { setAccountInfo({...accountInfo, dm: option}); setCurrentSubView('privacy'); }}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-0"
                >
                  <span className="text-white">{option}</span>
                  {accountInfo.dm === option && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
                </button>
              ))}
            </div>
          </SubPage>
        );
      case 'download':
        return (
          <SubPage title="Download data" onBack={() => setCurrentSubView('privacy')}>
            <div className="p-4 text-center space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto">
                <LayersIcon className="w-10 h-10 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Request data</h2>
                <p className="text-gray-400 text-sm">Your request may take a few days to process. Once your file is ready, you'll have 4 days to download it.</p>
              </div>
              <button 
                onClick={() => { showToastMsg('Data request submitted'); setCurrentSubView('privacy'); }}
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl"
              >
                Request Data
              </button>
            </div>
          </SubPage>
        );
      case 'notifications':
        return (
          <SubPage title="Push notifications" onBack={() => setCurrentSubView('main')}>
            <div className="space-y-6">
              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Desktop notifications</h3>
                <div className="bg-[#1A1B20] rounded-2xl p-4">
                  <Toggle 
                    label="Allow in browser" 
                    description="Stay on top of notifications for likes, comments, the latest videos, and more on desktop. You can turn them off anytime."
                    checked={toggles.desktopNotifications}
                    onChange={() => handleToggle('desktopNotifications')}
                  />
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Your preferences</h3>
                <p className="px-4 mb-2 text-[10px] text-gray-500">Your preferences will be synced automatically to the TikTok app.</p>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <div>
                      <p className="text-white font-medium">Interactions</p>
                      <p className="text-xs text-gray-500">Likes, comments, new followers, mentions and tags</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                    <span className="text-white font-medium">In-app notifications</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </section>
            </div>
          </SubPage>
        );
      case 'business':
        return (
          <SubPage title="Business account" onBack={() => setCurrentSubView('manage')}>
            <div className="text-center py-10 px-6">
              <BriefcaseIcon className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Business account</h2>
              <p className="text-gray-400 text-sm mb-8">Access marketing tools and exclusive features through your business account to better connect with viewers.</p>
              <button 
                onClick={() => { showToastMsg('Switched to Business Account'); setCurrentSubView('manage'); }}
                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl hover:bg-cyan-400 transition-colors"
              >
                Next
              </button>
            </div>
          </SubPage>
        );
      case 'ads':
        return (
          <SubPage title="Ads" onBack={() => setCurrentSubView('main')}>
            <div className="space-y-6">
              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Manage the ads you see</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <div>
                      <p className="text-white font-medium">Manage ad topics</p>
                      <p className="text-xs text-gray-500">Change factors used to tailor the ads you see.</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white font-medium">Mute advertisers</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                    <div>
                      <p className="text-white font-medium">Edit personal details</p>
                      <p className="text-xs text-gray-500">Select the gender which may be used to tailor the ads you see.</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Manage your off-TikTok data</h3>
                <div className="bg-[#1A1B20] rounded-2xl p-4 space-y-4 divide-y divide-white/5">
                  <Toggle 
                    label="Targeted ads outside of TikTok" 
                    description="With this setting, TikTok may show you ads on other websites and apps using information collected about you, both on and off TikTok. This setting controls the ads our advertising partners ask us to show you off TikTok. All your ad privacy choices on TikTok will continue to inform the ads we show you."
                    checked={toggles.targetedAdsOutside}
                    onChange={() => handleToggle('targetedAdsOutside')}
                  />
                  <div className="pt-4">
                    <Toggle 
                      label="Using Off-TikTok activity for ad targeting" 
                      description="With this setting, the ads you see on TikTok can be more tailored to your interests based on data that advertising partners share with us about your activity on their apps and websites. You will always see ads on TikTok based on what you do on TikTok or other data described in our privacy policy."
                      checked={toggles.offTikTokActivity}
                      onChange={() => handleToggle('offTikTokActivity')}
                    />
                  </div>
                  <button onClick={() => showToastMsg('Advertisers disconnected')} className="w-full text-left py-4 text-white font-medium">Disconnect advertisers</button>
                  <button onClick={() => showToastMsg('Data cleared')} className="w-full text-left py-4 text-red-500 font-medium">Clear off-TikTok data</button>
                </div>
              </section>
            </div>
          </SubPage>
        );
      case 'screentime':
        return (
          <SubPage title="Screen time" onBack={() => setCurrentSubView('main')}>
            <div className="space-y-6">
              <section>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white font-medium">Daily screen time</span>
                    <span className="text-gray-500">Off</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white font-medium">Screen time breaks</span>
                    <span className="text-gray-500">Off</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5">
                    <span className="text-white font-medium">Sleep hours</span>
                    <span className="text-gray-500">Off</span>
                  </button>
                  <div className="p-4">
                    <Toggle 
                      label="Weekly screen time updates" 
                      description="Stay updated on your time from your Inbox."
                      checked={toggles.weeklyUpdates}
                      onChange={() => handleToggle('weeklyUpdates')}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Summary</h3>
                <div className="bg-[#1A1B20] rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Your weekly metrics include your time on the app and on tiktok.com.</p>
                </div>
              </section>

              <section>
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Help and resources</h3>
                <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                    <span className="text-white font-medium">Digital well-being tips</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </section>
            </div>
          </SubPage>
        );
      case 'content':
        return (
          <SubPage title="Content preferences" onBack={() => setCurrentSubView('main')}>
            <div className="bg-[#1A1B20] rounded-2xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5">
                <div>
                  <p className="text-white font-medium">Filter keywords</p>
                  <p className="text-xs text-gray-500 mt-1">When you filter a keyword, you won’t see posts in your selected feeds that contain that word in any titles, descriptions, or stickers. Certain keywords can’t be filtered.</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-600 shrink-0 ml-4" />
              </button>
            </div>
          </SubPage>
        );
      case 'family':
        return (
          <SubPage title="Family Pairing" onBack={() => setCurrentSubView('main')}>
            <div className="text-center py-10 px-6">
              <UsersIcon className="w-16 h-16 mx-auto text-fuchsia-500 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Family Pairing</h2>
              <p className="text-gray-400 text-sm mb-8">Family Pairing allows you to customize your teen’s TikTok settings for a safer experience.</p>
              <button 
                onClick={() => { showToastMsg('Family Pairing setup started'); setCurrentSubView('main'); }}
                className="w-full py-4 bg-fuchsia-500 text-white font-bold rounded-2xl hover:bg-fuchsia-400 transition-colors"
              >
                Continue
              </button>
            </div>
          </SubPage>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#0D0F13] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="shrink-0 p-4 flex items-center gap-4 border-b border-white/5">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold text-white">Settings and privacy</h1>
      </header>

      {/* Content */}
      <div className="flex-grow overflow-y-auto py-6">
        <SettingsSection title="Account">
          <SettingsItem icon={<UserIcon className="w-5 h-5" />} label="Manage account" onClick={() => setCurrentSubView('manage')} />
          <SettingsItem icon={<LockIcon className="w-5 h-5" />} label="Privacy" onClick={() => setCurrentSubView('privacy')} />
          <SettingsItem icon={<BellIcon className="w-5 h-5" />} label="Push notifications" onClick={() => setCurrentSubView('notifications')} />
        </SettingsSection>

        <SettingsSection title="Content & Activity">
          <SettingsItem icon={<MegaphoneIcon className="w-5 h-5" />} label="Ads" onClick={() => setCurrentSubView('ads')} />
          <SettingsItem icon={<ClockIcon className="w-5 h-5" />} label="Screen time" onClick={() => setCurrentSubView('screentime')} />
          <SettingsItem icon={<LayersIcon className="w-5 h-5" />} label="Content preferences" onClick={() => setCurrentSubView('content')} />
          <SettingsItem icon={<UsersIcon className="w-5 h-5" />} label="Family Pairing" onClick={() => setCurrentSubView('family')} />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem icon={<div className="w-5 h-5 flex items-center justify-center font-bold text-xs border-2 border-current rounded-full">?</div>} label="Help Center" onClick={() => showToastMsg('Opening Help Center...')} />
          <SettingsItem icon={<div className="w-5 h-5 flex items-center justify-center font-bold text-xs border-2 border-current rounded-full">!</div>} label="Report a problem" onClick={() => showToastMsg('Opening Report form...')} />
        </SettingsSection>

        <div className="px-4 mt-4 mb-10">
          <button 
            onClick={onLogout}
            className="w-full py-4 bg-[#1A1B20] text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-colors"
          >
            Log out
          </button>
          <p className="text-center text-gray-600 text-xs mt-6">Version 3.1.0 (20260308)</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-medium shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-[#1A1B20] w-full max-w-sm rounded-3xl p-6 text-center animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-2">Delete account?</h2>
            <p className="text-gray-400 text-sm mb-6">This action is permanent and cannot be undone. All your data will be deleted.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={onDeleteAccount}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Views */}
      {currentSubView !== 'main' && renderSubView()}
    </div>
  );
};

export default SettingsPage;
