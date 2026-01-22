
import React from 'react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCheckCompatibility: (profile: Profile) => void;
  onViewDetails: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  isFavorite, 
  onToggleFavorite, 
  onCheckCompatibility, 
  onViewDetails 
}) => {
  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 ${isFavorite ? 'border-amber-400 ring-4 ring-amber-100' : 'border-amber-100'} group relative`}>
      <div className="relative cursor-pointer overflow-hidden" onClick={() => onViewDetails(profile)}>
        <img src={profile.image} alt={profile.name} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent opacity-80"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white font-serif font-bold text-2xl drop-shadow-md">{profile.name}, {profile.age}</h3>
          <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">{profile.occupation}</p>
          <div className="flex items-center text-rose-100 text-[10px] mt-1 font-bold">
            <span className="mr-1">📍</span> {profile.location}, {profile.district} ({profile.pincode})
          </div>
        </div>
        
        {profile.isVerified && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-[10px] font-black text-rose-800 shadow-lg border border-amber-100 z-10 flex items-center space-x-1 uppercase animate-in fade-in zoom-in duration-300">
            <span className="text-amber-500">★</span>
            <span>Verified</span>
          </div>
        )}
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(profile.id);
        }}
        className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 shadow-xl backdrop-blur-md ${
          isFavorite ? 'bg-rose-800 text-amber-400' : 'bg-white/90 text-gray-400 hover:text-rose-800'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-rose-50 text-rose-800 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-rose-100">{profile.religion}</span>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-100">{profile.caste}</span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed italic font-medium line-clamp-2">
          "{profile.about}"
        </p>
        
        <div className="pt-2 grid grid-cols-2 gap-3 relative">
          <button 
            onClick={() => onCheckCompatibility(profile)}
            className="col-span-2 bg-amber-50 text-rose-900 border-2 border-amber-200 font-black py-3 rounded-2xl text-xs hover:bg-amber-100 transition-all flex items-center justify-center space-x-2"
          >
            <span>✨</span> <span>AI MATCH REPORT</span>
          </button>
          <button 
            onClick={() => onViewDetails(profile)}
            className="bg-white border-2 border-rose-800 text-rose-800 font-black py-3 rounded-2xl text-xs hover:bg-rose-800 hover:text-white transition-all"
          >
            DETAILS
          </button>
          
          <div className="relative group/btn">
            {profile.isVerified && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-rose-950 text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm z-10 border border-white uppercase tracking-tighter">
                Highly Trusted Match
              </div>
            )}
            <button className={`w-full font-black py-3 rounded-2xl text-xs transition-all flex items-center justify-center space-x-1 ${
              profile.isVerified 
              ? 'bg-gradient-to-r from-rose-800 to-rose-700 text-amber-400 shadow-[0_4px_14px_0_rgba(153,27,27,0.39)] hover:shadow-[0_6px_20px_rgba(153,27,27,0.23)] border-b-4 border-rose-950' 
              : 'bg-rose-800 text-amber-400 shadow-lg shadow-rose-200 hover:bg-rose-900 border-b-2 border-rose-950'
            }`}>
              {profile.isVerified && (
                <svg className="w-3 h-3 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <span>{profile.isVerified ? 'VERIFIED CONNECT' : 'CONNECT'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
