import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import BottomNav from './components/BottomNav';
import ProfilePage from './components/ProfilePage';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import InboxPage from './components/InboxPage';
import ShopPage from './components/ShopPage';
import EditProfilePage from './components/EditProfilePage';
import PostCreationPage from './components/PostCreationPage';
import PhotoFeedPage from './components/PhotoFeedPage';
import VideoEditorPage from './components/VideoEditorPage';
import PhotoPostPage from './components/PhotoPostPage';
import ShopDetailPage from './components/ShopDetailPage';
import AuthPage from './components/AuthPage';
import UploadModal from './components/UploadModal';
import UploadPage from './components/UploadPage';
import CreatePhotoPostPage from './components/CreatePhotoPostPage';
import SettingsPage from './components/SettingsPage';
import type { User, Video, GalleryMedia, ShopPost, PhotoPost, Comment } from './types';
import { initialVideosData, mariaKhan, tusharEmran, mdesa, allUsers as initialAllUsers, photoPostsData as initialPhotoPosts, shopPostsData as initialShopPosts } from './constants';
import { firebaseService } from './firebaseService';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export type View = 'feed' | 'foryou' | 'profile' | 'inbox' | 'editProfile' | 'postCreation' | 'photos' | 'observing' | 'userFeed' | 'videoEditor' | 'photoPost' | 'shopDetail' | 'upload' | 'createPhotoPost' | 'settings';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('feed');
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialAllUsers);
  const [allVideos, setAllVideos] = useState<Video[]>(initialVideosData);
  const [allPhotoPosts, setAllPhotoPosts] = useState<PhotoPost[]>(initialPhotoPosts);
  const [allShopPosts, setAllShopPosts] = useState<ShopPost[]>(initialShopPosts);

  const [userFeedVideos, setUserFeedVideos] = useState<Video[]>([]);
  const [userFeedStartIndex, setUserFeedStartIndex] = useState(0);
  const [videoToEditUrl, setVideoToEditUrl] = useState<string | null>(null);
  const [videoToPostUrl, setVideoToPostUrl] = useState<string | null>(null);
  const [photoToPostUrl, setPhotoToPostUrl] = useState<string | null>(null);
  const [initialUploadTab, setInitialUploadTab] = useState<'video' | 'photo' | 'shop'>('video');

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryMedia | null>(null);
  const [selectedShopPost, setSelectedShopPost] = useState<ShopPost | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const switchableAccounts = [mariaKhan, tusharEmran, mdesa];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [users, videos, photos, shop] = await Promise.all([
          firebaseService.getAllUsers(),
          firebaseService.getVideos(),
          firebaseService.getPhotoPosts(),
          firebaseService.getShopPosts()
        ]);
        
        if (users && users.length > 0) setAllUsers(users);
        if (videos && videos.length > 0) setAllVideos(videos);
        if (photos && photos.length > 0) setAllPhotoPosts(photos);
        if (shop && shop.length > 0) setAllShopPosts(shop);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const profile = await firebaseService.getProfile(user.uid);
        if (profile) {
          setLoggedInUser(profile);
        }
      } else {
        setIsLoggedIn(false);
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Removed localStorage sync for auth state as it's handled by Supabase
  }, [isLoggedIn, loggedInUser, allVideos, allUsers, allPhotoPosts, allShopPosts]);

  const handleLoginSuccess = async () => {
    const user = auth.currentUser;
    if (user) {
      const profile = await firebaseService.getProfile(user.uid);
      if (profile) {
        setLoggedInUser(profile);
        setIsLoggedIn(true);
      }
    }
  };
  
    const handleToggleObserve = (userToToggle: User) => {
    if (!loggedInUser) return;
    const isObserving = loggedInUser.observing.includes(userToToggle.username);

    const updatedLoggedInUser = {
      ...loggedInUser,
      observing: isObserving
        ? loggedInUser.observing.filter(username => username !== userToToggle.username)
        : [...loggedInUser.observing, userToToggle.username],
      stats: {
          ...loggedInUser.stats,
          observing: loggedInUser.stats.observing + (isObserving ? -1 : 1)
      }
    };

    const updatedAllUsers = allUsers.map(u => {
      if (u.username === loggedInUser.username) {
        return updatedLoggedInUser;
      }
      if (u.username === userToToggle.username) {
        return {
          ...u,
          stats: {
            ...u.stats,
            observers: u.stats.observers + (isObserving ? -1 : 1),
          },
        };
      }
      return u;
    });

    setLoggedInUser(updatedLoggedInUser);
    setAllUsers(updatedAllUsers);

    if (viewedUser?.username === userToToggle.username) {
        setViewedUser(updatedAllUsers.find(u => u.username === userToToggle.username) || null);
    }
     if (viewedUser?.username === loggedInUser.username) {
        setViewedUser(updatedLoggedInUser);
    }
  };

  const handleSelectUserFromFeed = (user: User) => {
    const freshUserData = allUsers.find(u => u.username === user.username) || user;
    if (loggedInUser && freshUserData.username === loggedInUser.username) {
        setViewedUser(loggedInUser);
    } else {
        setViewedUser(freshUserData);
    }
    setCurrentView('profile');
  };

  const handleNavigate = (view: View) => {
    if (view === 'profile' && loggedInUser) {
      setViewedUser(loggedInUser);
    }
    setCurrentView(view);
  };
  
  const handleBackFromProfile = () => {
    setCurrentView('feed');
    setViewedUser(null);
  };

  const handleSaveProfile = (updatedUser: User) => {
    if (!loggedInUser) return;
    const oldUsername = loggedInUser.username;
    
    setLoggedInUser(updatedUser);
    
    if (viewedUser?.username === oldUsername) {
      setViewedUser(updatedUser);
    }
    
    setAllUsers(prevUsers => prevUsers.map(u => u.username === oldUsername ? updatedUser : u));

    setAllVideos(prevVideos => prevVideos.map(video => {
        if (video.user.username === oldUsername) {
            return { ...video, user: updatedUser };
        }
        return video;
    }));

    setAllPhotoPosts(prevPosts => prevPosts.map(post => {
      if (post.user.username === oldUsername) {
        return { ...post, user: updatedUser };
      }
      return post;
    }));

    setAllShopPosts(prevPosts => prevPosts.map(post => {
      if (post.seller.username === oldUsername) { 
        return { ...post, seller: updatedUser };
      }
      return post;
    }));

    setCurrentView('profile');
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };
  
  const handleGoToUploadPage = () => {
    setIsUploadModalOpen(false);
    setCurrentView('upload');
  }
  
  const handleGoToCreateShopPost = () => {
    setInitialUploadTab('shop');
    setCurrentView('upload');
  };
  
  const handleUploadClose = () => {
    setInitialUploadTab('video');
    setCurrentView('feed');
  };


  const handleVideoSelectedForUpload = (videoUrl: string) => {
    setVideoToEditUrl(videoUrl);
    setCurrentView('videoEditor');
  }
  
  const handlePhotoSelectedForUpload = (photoUrl: string) => {
    setPhotoToPostUrl(photoUrl);
    setCurrentView('createPhotoPost');
  }

  const handleEditorNext = (videoUrl: string) => {
    setVideoToPostUrl(videoUrl);
    setCurrentView('postCreation');
  };

  const handlePublishVideo = (videoData: { title: string; description: string; videoUrl: string; hashtags: string[] }) => {
    if (!loggedInUser) return;
    const newVideo: Video = {
      id: Date.now(),
      user: loggedInUser,
      title: videoData.title,
      caption: videoData.description,
      videoUrl: videoData.videoUrl,
      posterUrl: videoData.videoUrl, 
      hashtags: videoData.hashtags,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setAllVideos(prevVideos => [newVideo, ...prevVideos]);
    setCurrentView('feed');
  };

  const handlePublishPhoto = (caption: string) => {
    if (!photoToPostUrl || !loggedInUser) return;
    const newPhotoPost: PhotoPost = {
      id: Date.now(),
      user: loggedInUser,
      timestamp: 'Just now',
      caption: caption,
      imageUrl: photoToPostUrl,
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
      myReaction: undefined,
      reactions: {},
    };
    setAllPhotoPosts(prev => [newPhotoPost, ...prev]);
    setPhotoToPostUrl(null);
    setCurrentView('photos');
  };
  
  const handlePublishShopPost = (postData: Omit<ShopPost, 'id' | 'seller' | 'rating' | 'reviews' | 'views'>) => {
    if (!loggedInUser) return;
    const newShopPost: ShopPost = {
      id: Date.now(),
      ...postData,
      seller: loggedInUser,
      rating: undefined,
      reviews: [],
      views: 0,
    };
    setAllShopPosts(prev => [newShopPost, ...prev]);
    setCurrentView('foryou');
  };
  
  const handlePhotoReaction = (postId: number, reaction: string) => {
    setAllPhotoPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedPost = { ...post };
          const stats = updatedPost.stats ? { ...updatedPost.stats } : { likes: 0, comments: 0, shares: 0, views: 0 };
          const reactions = updatedPost.reactions ? { ...updatedPost.reactions } : {};
          const currentReaction = updatedPost.myReaction;

          // Case 1: Un-reacting
          if (currentReaction === reaction) {
            updatedPost.myReaction = undefined;
            if (stats.likes > 0) stats.likes--;
            if (reactions[currentReaction] > 1) {
              reactions[currentReaction]--;
            } else {
              delete reactions[currentReaction];
            }
          } else {
            // Case 2: Changing reaction
            if (currentReaction) {
              if (reactions[currentReaction] > 1) {
                reactions[currentReaction]--;
              } else {
                delete reactions[currentReaction];
              }
            } else {
              // Case 3: New reaction
              stats.likes++;
            }
            
            updatedPost.myReaction = reaction;
            reactions[reaction] = (reactions[reaction] || 0) + 1;
          }

          updatedPost.stats = stats;
          updatedPost.reactions = reactions;
          return updatedPost;
        }
        return post;
      })
    );
  };
  
  const handleVideoReaction = (videoId: number, reaction: string | undefined) => {
    setAllVideos(prevVideos =>
      prevVideos.map(video => {
        if (video.id === videoId) {
          const updatedVideo = { ...video };
          const reactions = updatedVideo.reactions ? { ...updatedVideo.reactions } : {};
          const currentReaction = updatedVideo.myReaction;

          if (reaction && currentReaction === reaction) {
            updatedVideo.myReaction = undefined;
            if (updatedVideo.likes > 0) updatedVideo.likes--;
            if (reactions[currentReaction] > 1) {
              reactions[currentReaction]--;
            } else {
              delete reactions[currentReaction];
            }
          } else { 
            if (currentReaction) {
              if (reactions[currentReaction] > 1) {
                reactions[currentReaction]--;
              } else {
                delete reactions[currentReaction];
              }
            } else { 
              if (reaction) updatedVideo.likes++;
            }
            
            if (reaction) {
              updatedVideo.myReaction = reaction;
              reactions[reaction] = (reactions[reaction] || 0) + 1;
            } else { 
              if (currentReaction) {
                  if (updatedVideo.likes > 0) updatedVideo.likes--;
              }
              updatedVideo.myReaction = undefined;
            }
          }
          
          updatedVideo.reactions = reactions;
          return updatedVideo;
        }
        return video;
      })
    );
  };

  const handleAddComment = (videoId: number, text: string) => {
    if (!loggedInUser) return;
    setAllVideos(prevVideos => 
        prevVideos.map(video => {
            if (video.id === videoId) {
                const newComment: Comment = {
                    id: Date.now(),
                    user: loggedInUser,
                    text,
                    timestamp: 'Just now',
                    likes: 0,
                    isLikedByMe: false,
                    replies: []
                };
                const updatedComments = [...(video.commentData || []), newComment];
                return {
                    ...video,
                    commentData: updatedComments,
                    comments: video.comments + 1,
                };
            }
            return video;
        })
    );
  };

  const handleLikeComment = (videoId: number, commentId: number) => {
      setAllVideos(prevVideos => 
        prevVideos.map(video => {
            if (video.id === videoId) {
                const updatedCommentData = (video.commentData || []).map(comment => {
                    if (comment.id === commentId) {
                        const isLiked = !comment.isLikedByMe;
                        return {
                            ...comment,
                            isLikedByMe: isLiked,
                            likes: isLiked ? comment.likes + 1 : comment.likes - 1,
                        };
                    }
                    return comment;
                });
                return { ...video, commentData: updatedCommentData };
            }
            return video;
        })
      );
  };

  const handlePlayFromProfile = (user: User, videoId: number) => {
    const userVideos = allVideos.filter(v => v.user.username === user.username);
    const startIndex = userVideos.findIndex(v => v.id === videoId);
    
    if (startIndex !== -1) {
        setUserFeedVideos(userVideos);
        setUserFeedStartIndex(startIndex);
        setViewedUser(user);
        setCurrentView('userFeed');
    }
  };
  
  const handleSelectPhoto = (photo: GalleryMedia) => {
    setSelectedPhoto(photo);
    setCurrentView('photoPost');
  };

  const handleSelectShopPost = (post: ShopPost) => {
    setSelectedShopPost(post);
    setCurrentView('shopDetail');
  };

  const handleSwitchAccount = (account: User) => {
    const freshAccountData = allUsers.find(u => u.username === account.username) || account;
    setLoggedInUser(freshAccountData);
    if (viewedUser?.username === loggedInUser.username || (viewedUser && switchableAccounts.some(acc => acc.username === viewedUser.username))) {
      setViewedUser(freshAccountData);
    }
  };

  const handleBackFromUserFeed = () => {
      setCurrentView('profile');
  };

  if (!isLoggedIn || !loggedInUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const observingVideos = allVideos.filter(video => 
    loggedInUser.observing.includes(video.user.username)
  );

  let pageContent;
  switch (currentView) {
    case 'feed':
      pageContent = <VideoPlayer videos={allVideos} onSelectUser={handleSelectUserFromFeed} onNavigate={handleNavigate} currentView={currentView} loggedInUser={loggedInUser!} onToggleObserve={handleToggleObserve} onVideoReaction={handleVideoReaction} onAddComment={handleAddComment} onLikeComment={handleLikeComment} />;
      break;
    case 'observing':
      pageContent = <VideoPlayer videos={observingVideos} onSelectUser={handleSelectUserFromFeed} onNavigate={handleNavigate} currentView={currentView} loggedInUser={loggedInUser!} onToggleObserve={handleToggleObserve} onVideoReaction={handleVideoReaction} onAddComment={handleAddComment} onLikeComment={handleLikeComment} />;
      break;
    case 'userFeed':
        pageContent = <VideoPlayer 
            videos={userFeedVideos} 
            onSelectUser={handleSelectUserFromFeed} 
            onNavigate={handleNavigate} 
            currentView={currentView}
            startIndex={userFeedStartIndex}
            onBack={handleBackFromUserFeed}
            loggedInUser={loggedInUser!} 
            onToggleObserve={handleToggleObserve}
            onVideoReaction={handleVideoReaction}
            onAddComment={handleAddComment} 
            onLikeComment={handleLikeComment}
        />;
        break;
    case 'photos':
      pageContent = <PhotoFeedPage posts={allPhotoPosts} onReactionSelect={handlePhotoReaction} />;
      break;
    case 'photoPost':
      if (selectedPhoto) {
        pageContent = <PhotoPostPage post={selectedPhoto} onBack={() => setCurrentView('photos')} />;
      } else {
        setCurrentView('photos');
      }
      break;
    case 'foryou':
      pageContent = <ShopPage posts={allShopPosts} onSelectPost={handleSelectShopPost} onGoToCreatePost={handleGoToCreateShopPost} />;
      break;
    case 'shopDetail':
      if (selectedShopPost) {
        pageContent = <ShopDetailPage post={selectedShopPost} onBack={() => setCurrentView('foryou')} loggedInUser={loggedInUser!} onToggleObserve={handleToggleObserve} />;
      } else {
        setCurrentView('foryou');
      }
      break;
    case 'profile':
      if (viewedUser) {
        const isOwnProfile = viewedUser.username === loggedInUser!.username;
        pageContent = (
            <ProfilePage 
                user={viewedUser} 
                allVideos={allVideos}
                allPhotoPosts={allPhotoPosts}
                onBack={handleBackFromProfile} 
                showBackButton={!isOwnProfile}
                onEdit={isOwnProfile ? () => setCurrentView('editProfile') : undefined}
                onSettings={isOwnProfile ? () => setCurrentView('settings') : undefined}
                onPlayVideo={(videoId) => handlePlayFromProfile(viewedUser, videoId)}
                loggedInUser={loggedInUser!}
                switchableAccounts={isOwnProfile ? switchableAccounts : []}
                onSwitchAccount={handleSwitchAccount}
                onToggleObserve={handleToggleObserve}
            />
        );
      }
      break;
    case 'settings':
      pageContent = (
        <SettingsPage 
          onBack={() => setCurrentView('profile')} 
          onLogout={async () => {
            await signOut(auth);
            setIsLoggedIn(false);
            setLoggedInUser(null);
            window.location.reload();
          }}
          onDeleteAccount={async () => {
            // In a real app, this would call an API
            await signOut(auth);
            setIsLoggedIn(false);
            setLoggedInUser(null);
            window.location.reload();
          }}
        />
      );
      break;
    case 'inbox':
      pageContent = <InboxPage onSelectUser={handleSelectUserFromFeed} />;
      break;
    case 'editProfile':
      pageContent = (
          <EditProfilePage
              user={loggedInUser}
              onSave={handleSaveProfile}
              onCancel={() => {
                  setViewedUser(loggedInUser);
                  setCurrentView('profile');
              }}
          />
      );
      break;
    case 'upload':
       pageContent = <UploadPage 
         initialTab={initialUploadTab}
         onVideoSelected={handleVideoSelectedForUpload}
         onPhotoSelected={handlePhotoSelectedForUpload}
         onPublishShopPost={handlePublishShopPost}
         onClose={handleUploadClose} 
        />;
       break;
    case 'videoEditor':
      pageContent = <VideoEditorPage videoUrl={videoToEditUrl} onNext={handleEditorNext} onBack={() => setCurrentView('upload')} />;
      break;
    case 'postCreation':
       if (videoToPostUrl) {
            pageContent = <PostCreationPage 
                videoUrl={videoToPostUrl}
                onBack={() => setCurrentView('videoEditor')} 
                onPublish={handlePublishVideo} 
            />;
       } else {
           setCurrentView('feed');
           pageContent = null;
       }
      break;
    case 'createPhotoPost':
        if(photoToPostUrl) {
            pageContent = <CreatePhotoPostPage
                imageUrl={photoToPostUrl}
                user={loggedInUser}
                onBack={() => setCurrentView('upload')}
                onPublish={handlePublishPhoto}
            />;
        } else {
            setCurrentView('upload');
            pageContent = null;
        }
        break;
    default:
      pageContent = <VideoPlayer videos={allVideos} onSelectUser={handleSelectUserFromFeed} onNavigate={handleNavigate} currentView='feed' loggedInUser={loggedInUser} onToggleObserve={handleToggleObserve} onVideoReaction={handleVideoReaction} onAddComment={handleAddComment} onLikeComment={handleLikeComment} />;
  }


  return (
    <div className="w-screen h-screen bg-[#0D0F13] text-white font-sans">
        <div className="container mx-auto h-full max-w-screen-xl flex lg:gap-6 lg:p-4">
            
            <nav className="hidden lg:block w-[280px] shrink-0">
                <LeftSidebar onNavigate={handleNavigate} currentView={currentView} />
            </nav>

            <div className="flex-grow flex flex-col h-full overflow-hidden relative">
                <main className="flex-grow h-full overflow-hidden relative bg-black lg:rounded-2xl">
                    {pageContent}
                </main>
                <div className="lg:hidden">
                     <BottomNav 
                        currentView={currentView}
                        onNavigate={handleNavigate}
                        onUploadClick={handleUploadClick}
                    />
                </div>
                {isUploadModalOpen && (
                    <UploadModal 
                        isOpen={isUploadModalOpen} 
                        onClose={() => setIsUploadModalOpen(false)}
                        user={loggedInUser}
                        onGoToUploadPage={handleGoToUploadPage}
                    />
                )}
            </div>

            <aside className="hidden lg:block w-[320px] shrink-0">
                <RightSidebar allUsers={allUsers} loggedInUser={loggedInUser!} onSelectUser={handleSelectUserFromFeed} onToggleObserve={handleToggleObserve} />
            </aside>
            
        </div>
    </div>
  );
};

export default App;