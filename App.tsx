
import React, { useState, useEffect } from 'react';
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
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
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
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nalam_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const t = translations[currentLang];

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

  const handleSearch = (pincode: string) => {
    if (!pincode) {
      setFilteredProfiles(profiles);
      return;
    }
    const filtered = profiles.filter(p => p.pincode.startsWith(pincode) || p.district.toLowerCase().includes(pincode.toLowerCase()));
    setFilteredProfiles(filtered);
    
    // Smooth scroll to matches
    const element = document.getElementById('matches-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Real validation against mock data
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
  };

  const handleViewDetails = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsDetailModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-400';
    return 'bg-rose-500';
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
          <Hero currentLang={currentLang} onRegisterClick={() => setIsRegisterModalOpen(true)} onSearch={handleSearch} />
        ) : (
          <div className="bg-rose-900 py-10 text-white shadow-inner">
             <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <div>
                   <h1 className="text-3xl font-serif font-bold">{t.welcome}, {user?.name}!</h1>
                   <p className="text-rose-200 mt-2 font-medium">Your search for a soulmate across Tamil Nadu continues...</p>
                </div>
                <div className="flex space-x-4 mt-6 md:mt-0">
                   <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-center min-w-[120px]">
                      <div className="text-2xl font-bold text-amber-400">42</div>
                      <div className="text-[10px] uppercase font-bold text-rose-100">Daily Matches</div>
                   </div>
                   <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-center min-w-[120px]">
                      <div className="text-2xl font-bold text-amber-400">128</div>
                      <div className="text-[10px] uppercase font-bold text-rose-100">Profile Views</div>
                   </div>
                </div>
             </div>
          </div>
        )}
        
        <section id="matches-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-amber-50 pb-6">
            <div>
              <h2 className="text-4xl font-serif font-bold text-rose-950 mb-2">
                {isLoggedIn ? t.newMatches : t.successStories}
              </h2>
              <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
              <p className="text-gray-500 mt-4 font-medium italic">Discover matches from villages and towns across Tamil Nadu</p>
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-amber-50 rounded-[3rem] border-2 border-dashed border-amber-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-serif font-bold text-rose-900">No matches found in this Pincode</h3>
              <p className="text-gray-500 mt-2">Try a nearby area or search by district name like "Chennai".</p>
              <button onClick={() => handleSearch('')} className="mt-6 text-rose-800 font-bold underline">Show all profiles</button>
            </div>
          )}
        </section>

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

        {/* Multi-step Register Modal */}
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
      </main>
      <Footer />
    </div>
  );
};

export default App;
