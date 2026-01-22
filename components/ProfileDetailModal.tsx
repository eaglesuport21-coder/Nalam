import React, { useState, useEffect } from 'react';
import { Profile } from '../types';
import { generateProfileSummary } from '../services/gemini';

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
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummaryLoading(true);
      const summary = await generateProfileSummary(profile);
      setAiSummary(summary);
      setIsSummaryLoading(false);
    };

    fetchSummary();
  }, [profile]);

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/80 to-transparent">
            <h2 className="text-4xl font-serif font-bold text-rose-900">{profile.name}</h2>
            <p className="text-amber-600 font-bold uppercase tracking-widest text-sm">{profile.occupation}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <span className="block text-[10px] text-amber-700 font-black uppercase tracking-tighter">Age</span>
              <span className="text-lg font-bold text-rose-900">{profile.age} Yrs</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <span className="block text-[10px] text-amber-700 font-black uppercase tracking-tighter">Height</span>
              <span className="text-lg font-bold text-rose-900">{profile.height}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <span className="block text-[10px] text-amber-700 font-black uppercase tracking-tighter">Religion</span>
              <span className="text-lg font-bold text-rose-900">{profile.religion}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <span className="block text-[10px] text-amber-700 font-black uppercase tracking-tighter">Caste</span>
              <span className="text-lg font-bold text-rose-900">{profile.caste}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-serif font-bold text-rose-950 flex items-center space-x-2">
              <span>About Me</span>
              <div className="h-0.5 flex-grow bg-amber-100 rounded-full"></div>
            </h3>
            <p className="text-gray-700 leading-relaxed italic text-lg font-serif">
              "{profile.about}"
            </p>
          </div>

          {/* AI Personality Summary Section */}
          <div className="bg-rose-50/50 rounded-3xl p-6 border-2 border-rose-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16 text-rose-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Nalam AI Personality Insight
            </h4>
            
            {isSummaryLoading ? (
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold uppercase tracking-tighter animate-pulse">Generating Summary...</span>
              </div>
            ) : (
              <p className="text-rose-900 font-medium leading-relaxed">
                {aiSummary || "A wonderful profile with a promising future."}
              </p>
            )}
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest border-l-4 border-amber-400 pl-3">Education & Career</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Education</span>
                  <span className="font-bold text-gray-900 text-right">{profile.education}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Occupation</span>
                  <span className="font-bold text-gray-900 text-right">{profile.occupation}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest border-l-4 border-amber-400 pl-3">Location Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">District</span>
                  <span className="font-bold text-gray-900">{profile.district}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pincode</span>
                  <span className="font-bold text-gray-900">{profile.pincode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onCheckCompatibility(profile)}
              className="flex-1 bg-amber-400 text-rose-950 font-black py-4 rounded-2xl shadow-xl hover:bg-amber-500 transition-all border-b-4 border-amber-600 flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
            >
              <span>✨</span>
              <span>Generate AI Compatibility Report</span>
            </button>
            <button className="flex-1 bg-rose-800 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-rose-900 transition-all border-b-4 border-rose-950 text-sm uppercase tracking-wider">
              Send Express Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;