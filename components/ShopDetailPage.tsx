import React, { useState } from 'react';
import type { ShopPost, User, Review } from '../types';
import { 
    BackIcon, StarIcon, formatNumber, TagIcon, RulerIcon, PaletteIcon, 
    LocationPinIcon, HandshakeIcon, IncludedIcon, MessageSellerIcon 
} from '../constants';

interface ShopDetailPageProps {
  post: ShopPost;
  onBack: () => void;
  loggedInUser: User;
  onToggleObserve: (user: User) => void;
}

const RatingStars: React.FC<{ rating: number, className?: string }> = ({ rating, className }) => (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="w-4 h-4" filled={i < rating} />
      ))}
    </div>
);


const ShopDetailPage: React.FC<ShopDetailPageProps> = ({ post, onBack, loggedInUser, onToggleObserve }) => {
    const [selectedImage, setSelectedImage] = useState(post.imageUrls[0]);
    
    const isObservingSeller = loggedInUser.observing.includes(post.seller.username);

    const averageRating = post.reviews && post.reviews.length > 0 
        ? post.reviews.reduce((acc, review) => acc + review.rating, 0) / post.reviews.length 
        : 0;

  return (
    <div className="w-full h-full bg-gray-100 text-black flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center shrink-0 border-b bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200">
          <BackIcon className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-bold truncate">{post.title}</h1>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow overflow-y-auto pb-4">
        {/* Image Gallery */}
        <div className="bg-white">
            <div className="aspect-square">
                <img src={selectedImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 flex gap-2 overflow-x-auto">
                {post.imageUrls.map((url, index) => (
                    <button key={index} onClick={() => setSelectedImage(url)} className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 ${selectedImage === url ? 'border-green-500' : 'border-transparent'}`}>
                        <img src={url} alt={`thumbnail ${index+1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white mt-2">
            <div className="flex justify-between items-start">
                <p className="text-2xl font-bold">৳{formatNumber(parseInt(post.price))}</p>
                <span className="text-sm font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">{post.condition}</span>
            </div>
            <h1 className="text-xl font-semibold mt-1">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" filled={averageRating > 0} />
                    <span className="font-bold text-black">{averageRating.toFixed(1)}</span>
                </div>
                <span>({post.reviews?.length || 0} reviews)</span>
                <span>•</span>
                <span>{post.views || 0} views</span>
            </div>
        </div>

        {/* Specifications */}
        <div className="p-4 bg-white mt-2">
            <h2 className="font-bold mb-3">Specifications</h2>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <TagIcon className="w-5 h-5" />
                    <span>Category:</span>
                    <span className="font-semibold text-black">{post.category}</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600">
                    <PaletteIcon className="w-5 h-5" />
                    <span>Color:</span>
                    <span className="font-semibold text-black">{post.color}</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600">
                    <RulerIcon className="w-5 h-5" />
                    <span>Size:</span>
                    <span className="font-semibold text-black">{post.size}</span>
                </div>
            </div>
        </div>
        
        {/* Description */}
        <div className="p-4 bg-white mt-2">
            <h2 className="font-bold mb-2">Description</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.description}</p>
        </div>

        {/* Delivery Details */}
        <div className="p-4 bg-white mt-2">
            <h2 className="font-bold mb-3">Delivery Details</h2>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <LocationPinIcon className="w-5 h-5" />
                    <span>{post.location}</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600">
                    <HandshakeIcon className="w-5 h-5" />
                    <span>{post.deliveryOption}</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600">
                    <IncludedIcon className="w-5 h-5" />
                    <span>Delivery: {post.deliveryCharge === 'Included' ? 'Included In Price' : 'Separate Charge'}</span>
                </div>
            </div>
        </div>
        
        {/* Seller Info */}
        <div className="p-4 bg-white mt-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img src={post.seller.avatar} alt={post.seller.name} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-bold">{post.seller.name}</p>
                    <p className="text-sm text-gray-500">{post.seller.username}</p>
                </div>
            </div>
            {loggedInUser.username !== post.seller.username && (
                <button 
                    onClick={() => onToggleObserve(post.seller)}
                    className={`font-semibold py-2 px-5 rounded-lg transition-colors text-sm ${isObservingSeller ? 'bg-gray-200 text-black' : 'border border-black text-black'}`}
                >
                    {isObservingSeller ? 'Observing' : 'Observe'}
                </button>
            )}
        </div>
         <div className="p-4 bg-white border-t">
             <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100">
                <MessageSellerIcon className="w-5 h-5" />
                Message Seller
            </button>
        </div>
        
        {/* Ratings & Reviews */}
        <div className="p-4 bg-white mt-2">
            <h2 className="font-bold mb-3">Ratings & Reviews</h2>
            <div className="flex flex-col items-center gap-2">
                <p className="font-semibold">Rate this product</p>
                <RatingStars rating={0} className="text-gray-300 text-3xl" />
            </div>
            
            <div className="mt-6 space-y-4">
                {post.reviews?.map(review => (
                    <div key={review.id} className="flex items-start gap-3 border-t pt-4">
                        <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{review.user.name}</p>
                                    <RatingStars rating={review.rating} className="text-yellow-500" />
                                </div>
                                <p className="text-xs text-gray-500">{review.timestamp}</p>
                            </div>
                            <p className="text-sm mt-1">{review.comment}</p>
                        </div>
                    </div>
                ))}
                {(!post.reviews || post.reviews.length === 0) && (
                    <p className="text-sm text-gray-500 text-center pt-4">No reviews yet.</p>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ShopDetailPage;
