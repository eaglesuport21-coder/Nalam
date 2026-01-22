
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProfileCard from './components/ProfileCard';
import Footer from './components/Footer';
import VerificationModal from './components/VerificationModal';
import ProfileDetailModal from './components/ProfileDetailModal';
import { MOCK_PROFILES } from './mockData';
import { Profile, CompatibilityResult, Language } from './types';
import { getMatchCompatibility } from './services/gemini';
import { translations } from './translations';

const App: React.FC = () => {
  const [profiles] = useState<Profile[]>(MOCK_PROFILES);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('nalam_lang') as Language) || 'en';
  });
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [regData, setRegData] = useState<Partial<Profile>>({ gender: 'Female' });

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [aiInsight, setAiInsight] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Connection states
  const [isConnectSuccessOpen, setIsConnectSuccessOpen] = useState(false);
  const [connectedProfile, setConnectedProfile] = useState<Profile | null>(null);

  // Search state for logged in users
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchTaluk, setSearchTaluk] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nalam_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('nalam_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const t = translations[currentLang];

  const availableDistricts = useMemo(() => {
    const districts = Array.from(new Set(MOCK_PROFILES.map(p => p.district))).sort();
    return districts;
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('nalam_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nalam_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('nalam_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('nalam_lang', currentLang);
  }, [currentLang]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  const toggleFavorite = (profileId: string) => {
    setFavorites(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };

  const addToRecentlyViewed = (profile: Profile) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== profile.id);
      const updated = [profile, ...filtered].slice(0, 6); // Keep last 6 viewed
      return updated;
    });
  };

  const executeFilter = (pincode: string, district: string, taluk: string) => {
    let filtered = profiles;

    if (district) {
      filtered = filtered.filter(p => p.district === district);
    }

    if (taluk) {
      const lowTaluk = taluk.toLowerCase();
      filtered = filtered.filter(p => p.taluk?.toLowerCase().includes(lowTaluk));
    }

    if (pincode) {
      filtered = filtered.filter(p => p.pincode.startsWith(pincode));
    }

    setFilteredProfiles(filtered);
  };

  const handleSearch = (pincode: string, district: string, taluk: string = '') => {
    setSearchDistrict(district);
    setSearchPincode(pincode);
    setSearchTaluk(taluk);
    
    executeFilter(pincode, district, taluk);
    
    // Smooth scroll to matches
    const element = document.getElementById('matches-section');
    if (element) {
      const offset = 140; // Sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const resetFilters = () => {
    setSearchDistrict('');
    setSearchPincode('');
    setSearchTaluk('');
    setFilteredProfiles(profiles);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const foundUser = MOCK_PROFILES.find(
      p => p.email?.toLowerCase() === loginEmail.toLowerCase() && p.password === loginPassword
    );

    if (foundUser) {
      setUser(foundUser);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      localStorage.setItem('nalam_user', JSON.stringify(foundUser));
    } else {
      setLoginError(t.invalidLogin);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('nalam_user');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerStep < 3) {
      setRegisterStep(prev => prev + 1);
    } else {
      const newUser = { 
        ...regData, 
        id: Math.random().toString(), 
        image: 'https://picsum.photos/seed/user/400/500' 
      } as Profile;
      setUser(newUser);
      setIsLoggedIn(true);
      setIsRegisterModalOpen(false);
      localStorage.setItem('nalam_user', JSON.stringify(newUser));
    }
  };

  const handleCheckCompatibility = async (profile: Profile) => {
    setIsDetailModalOpen(false);
    setSelectedProfile(profile);
    setIsModalOpen(true);
    setIsLoading(true);
    setAiInsight(null);
    
    const insight = await getMatchCompatibility(user || {}, profile);
    setAiInsight(insight);
    setIsLoading(false);
    addToRecentlyViewed(profile);
  };

  const handleViewDetails = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsDetailModalOpen(true);
    addToRecentlyViewed(profile);
  };

  const handleConnect = (profile: Profile) => {
    setConnectedProfile(profile);
    setIsConnectSuccessOpen(true);
    setTimeout(() => setIsConnectSuccessOpen(false), 4000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn}
        userName={user?.name}
        isVerified={isUserVerified} 
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onLoginClick={() => {
          setLoginError('');
          setIsLoginModalOpen(true);
        }}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        onStartVerification={() => setIsVerificationModalOpen(true)} 
      />
      
      <main className="flex-grow">
        {!isLoggedIn ? (
          <Hero 
            currentLang={currentLang} 
            onRegisterClick={() => setIsRegisterModalOpen(true)} 
            onSearch={(p, d, t) => handleSearch(p, d, t)} 
            availableDistricts={availableDistricts}
          />
        ) : (
          <div className="bg-rose-900 py-10 text-white shadow-inner relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
             
             <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left">
                   <h1 className="text-3xl font-serif font-bold">{t.welcome}, {user?.name}!</h1>
                   <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
                      <div className="h-0.5 w-10 bg-amber-400"></div>
                      <p className="text-rose-200 font-medium text-sm">Find your soulmate across Tamil Nadu</p>
                   </div>
                </div>
                <div className="flex space-x-4 mt-8 md:mt-0">
                   <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[140px] shadow-lg transition-transform hover:scale-105">
                      <div className="text-3xl font-black text-amber-400 mb-1">42</div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-rose-100">Recommended</div>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[140px] shadow-lg transition-transform hover:scale-105">
                      <div className="text-3xl font-black text-amber-400 mb-1">128</div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-rose-100">Profiles Seen</div>
                   </div>
                </div>
             </div>
          </div>
        )}
        
        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <section className="bg-amber-50/50 py-12 border-b border-amber-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-rose-800 text-amber-400 rounded-2xl flex items-center justify-center shadow-xl border-b-4 border-rose-950">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                   <h2 className="text-2xl font-serif font-bold text-rose-950">{t.recentlyViewed}</h2>
                   <div className="h-0.5 w-12 bg-amber-400 mt-1"></div>
                </div>
              </div>
              <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide snap-x">
                {recentlyViewed.map(profile => (
                  <div key={`recent-${profile.id}`} className="flex-shrink-0 w-72 snap-start">
                    <ProfileCard 
                      profile={profile} 
                      isFavorite={favorites.includes(profile.id)}
                      onToggleFavorite={toggleFavorite}
                      onCheckCompatibility={handleCheckCompatibility}
                      onViewDetails={handleViewDetails}
                      onConnect={handleConnect}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Improved Search & Filter Bar for Logged In Users */}
        {isLoggedIn && (
          <div className="bg-white border-b-4 border-amber-100 sticky top-20 z-30 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-grow w-full lg:w-1/4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-400">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                    </div>
                    <select 
                      className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none font-black text-rose-900 transition-all cursor-pointer appearance-none shadow-sm hover:border-amber-400"
                      value={searchDistrict}
                      onChange={(e) => handleSearch(searchPincode, e.target.value, searchTaluk)}
                    >
                      <option value="">{t.allDistricts}</option>
                      {availableDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-500">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                <div className="flex-grow w-full lg:w-1/4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-400">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder={t.talukPlace}
                      value={searchTaluk}
                      onChange={(e) => handleSearch(searchPincode, searchDistrict, e.target.value)}
                      className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none font-black text-rose-900 transition-all shadow-sm hover:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex-grow w-full lg:w-1/4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-400">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                    </div>
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder={t.searchPlace}
                      value={searchPincode}
                      onChange={(e) => handleSearch(e.target.value, searchDistrict, searchTaluk)}
                      className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl pl-11 pr-4 py-4 text-sm focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none font-black text-rose-900 transition-all shadow-sm hover:border-amber-400"
                    />
                  </div>
                </div>

                {(searchDistrict || searchPincode || searchTaluk) && (
                  <button 
                    onClick={resetFilters}
                    className="flex items-center space-x-2 bg-rose-50 text-rose-800 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors border-2 border-rose-100"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"/></svg>
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <section id="matches-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-amber-50 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif font-bold text-rose-950 mb-3 flex items-center gap-4">
                {isLoggedIn ? t.newMatches : t.successStories}
                <div className="h-1 flex-grow bg-amber-100 rounded-full"></div>
              </h2>
              <p className="text-gray-500 font-medium italic text-lg">Hand-picked matches across every taluk and district of Tamil Nadu.</p>
            </div>
            <div className="mt-6 md:mt-0 text-amber-600 font-black text-xs uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
               {filteredProfiles.length} Matches Found
            </div>
          </div>
          
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProfiles.map(profile => (
                <ProfileCard 
                  key={profile.id} 
                  profile={profile} 
                  isFavorite={favorites.includes(profile.id)}
                  onToggleFavorite={toggleFavorite}
                  onCheckCompatibility={handleCheckCompatibility}
                  onViewDetails={handleViewDetails}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-amber-50/50 rounded-[4rem] border-4 border-dashed border-amber-100 animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner text-5xl">🔭</div>
              <h3 className="text-3xl font-serif font-bold text-rose-900 mb-4">Auspicious timing awaits...</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium">No matches found with current filters. Try exploring a different district or reset the filters to see more profiles.</p>
              <button onClick={resetFilters} className="mt-10 bg-rose-800 text-amber-400 px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-rose-900 transition-all border-b-4 border-rose-950 uppercase tracking-widest">Show All Profiles</button>
            </div>
          )}
        </section>

        {/* Connect Success Modal */}
        {isConnectSuccessOpen && connectedProfile && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-[2px]" onClick={() => setIsConnectSuccessOpen(false)}></div>
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-top-4 duration-300 border-4 border-amber-200">
              <div className="bg-rose-800 p-8 text-center">
                <div className="w-16 h-16 bg-amber-400 text-rose-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg border-4 border-white animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-serif font-bold text-amber-100">{t.connectSuccessTitle}</h3>
              </div>
              <div className="p-8 text-center space-y-4">
                <p className="text-rose-900 font-bold text-lg">
                  {t.connectSuccessMsg} <span className="text-amber-600 font-serif italic text-2xl block mt-1">{connectedProfile.name}</span>
                </p>
                <p className="text-gray-500 text-sm font-medium italic">
                  {t.connectSuccessSub}
                </p>
                <button 
                  onClick={() => setIsConnectSuccessOpen(false)}
                  className="w-full bg-rose-50 text-rose-800 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-rose-100 hover:bg-rose-100 transition-colors mt-4"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-rose-800 p-10 text-center">
                <div className="text-amber-400 text-3xl font-serif font-bold mb-2">{t.login}</div>
                <p className="text-rose-100 text-xs font-bold uppercase tracking-widest">Access Nalam Matrimony</p>
              </div>
              <form onSubmit={handleLogin} className="p-10 space-y-6">
                {loginError && (
                  <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-pulse">
                    {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 outline-none font-bold focus:border-rose-500 transition-colors" 
                    placeholder="e.g. ananya@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Password</label>
                  <input 
                    required 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 outline-none font-bold focus:border-rose-500 transition-colors" 
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-rose-800 text-amber-400 py-4 rounded-2xl font-black text-lg shadow-xl border-b-4 border-rose-950 hover:bg-rose-900 transition-colors">
                  {t.login.toUpperCase()}
                </button>
                <div className="text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Demo: ananya@example.com / password123
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div className="bg-rose-800 px-10 py-8 relative">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-amber-400 text-2xl font-serif font-bold">Registration Step {registerStep}</div>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`h-1.5 w-6 rounded-full ${s <= registerStep ? 'bg-amber-400' : 'bg-rose-900'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleRegister} className="p-10 space-y-6">
                {registerStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Email Address</label>
                      <input required type="email" onChange={e => setRegData({...regData, email: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="yourname@gmail.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Create Password</label>
                      <input required type="password" onChange={e => setRegData({...regData, password: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="Minimum 6 characters" />
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Full Name</label>
                      <input required type="text" onChange={e => setRegData({...regData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="Enter Full Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Gender</label>
                        <select className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" onChange={e => setRegData({...regData, gender: e.target.value as any})}>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Location</label>
                        <input required type="text" onChange={e => setRegData({...regData, location: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="Chennai, TN" />
                      </div>
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Occupation</label>
                        <input required type="text" onChange={e => setRegData({...regData, occupation: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-rose-900 uppercase mb-2 tracking-widest">Education</label>
                        <input required type="text" onChange={e => setRegData({...regData, education: e.target.value})} className="w-full bg-gray-50 border-2 border-amber-50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-rose-500" placeholder="B.E / MBA" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  {registerStep > 1 && (
                    <button type="button" onClick={() => setRegisterStep(prev => prev - 1)} className="flex-1 bg-amber-50 text-rose-800 py-4 rounded-2xl font-black text-lg border-2 border-amber-100">
                      BACK
                    </button>
                  )}
                  <button type="submit" className="flex-[2] bg-rose-800 text-amber-400 py-4 rounded-2xl font-black text-lg shadow-xl border-b-4 border-rose-950 hover:bg-rose-900 transition-all">
                    {registerStep === 3 ? "FINISH REGISTRATION" : "CONTINUE"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDetailModalOpen && selectedProfile && (
          <ProfileDetailModal 
            profile={selectedProfile}
            isFavorite={favorites.includes(selectedProfile.id)}
            onToggleFavorite={() => toggleFavorite(selectedProfile.id)}
            onClose={() => setIsDetailModalOpen(false)}
            onCheckCompatibility={handleCheckCompatibility}
          />
        )}
        
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto border-4 border-amber-100">
              <div className="bg-rose-800 p-8 text-white text-center sticky top-0 z-10 border-b-4 border-amber-500">
                <div className="w-16 h-16 bg-amber-400 text-rose-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg font-bold">✨</div>
                <h3 className="text-2xl font-serif font-bold text-amber-100">Auspicious Match Report</h3>
              </div>
              <div className="p-10">
                {isLoading ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-rose-900 font-bold animate-pulse text-lg font-serif">Consulting AI Oracle...</p>
                  </div>
                ) : aiInsight ? (
                  <div className="space-y-10">
                    <div className="text-center bg-amber-50 rounded-[2.5rem] p-10 border-2 border-amber-100">
                      <div className={`text-6xl font-serif font-black mb-2 ${getScoreColor(aiInsight.overallScore)}`}>
                        {aiInsight.overallScore}%
                      </div>
                      <p className="mt-6 text-rose-900 leading-relaxed italic text-lg font-serif">"{aiInsight.summary}"</p>
                    </div>
                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-amber-50 text-rose-800 py-4 rounded-2xl font-black text-lg">CLOSE</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        
        {isVerificationModalOpen && (
          <VerificationModal 
            onClose={() => setIsVerificationModalOpen(false)}
            onVerified={() => setIsUserVerified(true)}
          />
        )}
      </main>
      <Footer />
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
