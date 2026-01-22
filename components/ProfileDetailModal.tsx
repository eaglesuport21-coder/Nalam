
import React from 'react';
import { Profile } from '../types';

interface ProfileDetailModalProps {
  profile: Profile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  onCheckCompatibility: (profile: Profile) => void;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ 
  profile, 
  isFavorite, 
  onToggleFavorite, 
  onClose, 
  onCheckCompatibility 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto ${isFavorite ? 'border-4 border-rose-400' : ''}`}>
        
        {/* Favorited Badge Banner */}
        {isFavorite && (
          <div className="absolute top-20 left-0 z-20 bg-rose-600 text-white px-4 py-1 text-xs font-bold rounded-r-lg shadow-lg">
            IN YOUR FAVORITES
          </div>
        )}

        <div className="relative h-80">
          <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
          
          {/* Action Buttons Header */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button 
              onClick={onToggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg ${
                isFavorite 
                ? 'bg-rose-600 text-white scale-110' 
                : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2.5" 
                className="w-5 h-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition backdrop-blur-md shadow-lg"
            >
              ✕
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
            <h2 className="text-3xl font-serif font-bold text-white">{profile.name}, {profile.age}</h2>
            <p className="text-rose-200 font-medium">{profile.occupation}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Education</p>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <span className="text-rose-500">🎓</span> {profile.education}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Height</p>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <span className="text-rose-500">📏</span> {profile.height}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Religion / Caste</p>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <span className="text-rose-500">🕉️</span> {profile.religion} / {profile.caste}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
              <p className="text-gray-900 font-medium flex items-center gap-2">
                <span className="text-rose-500">📍</span> {profile.location}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-100 pb-2">About {profile.name.split(' ')[0]}</h3>
            <p className="text-gray-600 leading-relaxed text-lg italic font-light">
              "{profile.about}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onCheckCompatibility(profile)}
              className="flex-1 bg-white border-2 border-rose-600 text-rose-600 font-bold py-4 rounded-2xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <span>✨</span> Run AI Match Analysis
            </button>
            <button className="flex-1 bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
              Send Connection Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;
