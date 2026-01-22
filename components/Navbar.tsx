
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
  isVerified: boolean;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onStartVerification: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn, 
  userName, 
  isVerified, 
  currentLang,
  onLanguageChange,
  onLogout, 
  onLoginClick, 
  onRegisterClick,
  onStartVerification 
}) => {
  const t = translations[currentLang];
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; native: string; flag: string }[] = [
    { code: 'en', name: 'English', native: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: 'https://flagcdn.com/w40/in.png' },
  ];

  const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-3">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-rose-800 text-amber-400 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-500/30 group-hover:rotate-6 transition-transform">
              NM
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-rose-900 leading-tight">
                Nalam Matrimony
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-600">
                Traditional & Trusted
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-gray-700 font-semibold text-sm">
            <a href="#" className="hover:text-rose-800 transition py-2 border-b-2 border-transparent hover:border-amber-400 font-bold">{t.home}</a>
            <a href="#" className="hover:text-rose-800 transition py-2 border-b-2 border-transparent hover:border-amber-400 font-bold">{t.matches}</a>
            <a href="#" className="hover:text-rose-800 transition py-2 border-b-2 border-transparent hover:border-amber-400 font-bold">{t.upgrade}</a>
            
            {/* Custom Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center space-x-3 border-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 group ${
                  isLangOpen ? 'bg-amber-50 border-amber-400 text-rose-950 ring-4 ring-amber-100/50' : 'bg-white border-amber-200 text-rose-900 hover:border-amber-400'
                }`}
              >
                <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <img src={currentLangData.flag} alt={currentLangData.name} className="w-full h-full object-cover" />
                </div>
                <span className="uppercase tracking-wider font-black">{currentLangData.native}</span>
                <svg className={`w-3 h-3 transition-transform duration-500 text-amber-600 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border-2 border-amber-100 rounded-[2rem] shadow-[0_20px_50px_rgba(153,27,27,0.2)] overflow-hidden animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 ring-4 ring-rose-50/50">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest block flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Choose Language
                    </span>
                  </div>
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group/item ${
                          currentLang === lang.code 
                          ? 'bg-rose-800 text-amber-400 shadow-lg scale-[1.02]' 
                          : 'text-gray-700 hover:bg-amber-50 hover:text-rose-900 hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-5 overflow-hidden rounded shadow-sm border transition-all ${
                            currentLang === lang.code ? 'border-amber-400 scale-110' : 'border-gray-200 group-hover/item:border-amber-200'
                          }`}>
                            <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-sm transition-colors ${currentLang === lang.code ? 'font-black' : 'font-bold'}`}>{lang.native}</span>
                            <span className={`text-[9px] uppercase tracking-tighter transition-colors ${currentLang === lang.code ? 'text-rose-200' : 'text-gray-400 group-hover/item:text-rose-800/60'}`}>{lang.name}</span>
                          </div>
                        </div>
                        {currentLang === lang.code && (
                          <div className="w-5 h-5 bg-amber-400 text-rose-900 rounded-full flex items-center justify-center shadow-inner animate-in zoom-in duration-300">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 md:space-x-5">
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    {isVerified ? (
                      <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border border-green-200 flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border border-amber-200/50 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        <span>Trust: Basic</span>
                      </div>
                    )}
                    <span className="text-sm font-black text-rose-900">{userName}</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.welcome}</span>
                </div>

                {!isVerified && (
                  <button 
                    onClick={onStartVerification}
                    className="group relative flex items-center space-x-2 bg-gradient-to-r from-rose-800 to-rose-700 text-amber-400 px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg border-b-4 border-rose-950 transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 active:border-b-0"
                  >
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75"></div>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="uppercase tracking-widest">Verify Profile</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-rose-900 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl text-center">
                      Get 5x more trust and matches!
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-rose-900"></div>
                    </div>
                  </button>
                )}

                <button 
                  onClick={onLogout} 
                  className="p-2 text-gray-400 hover:text-rose-800 transition-colors group"
                  title="Logout"
                >
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onLoginClick} 
                  className="text-rose-900 font-black px-5 py-2 hover:bg-rose-50 rounded-2xl transition text-sm uppercase tracking-wider"
                >
                  {t.login}
                </button>
                <button 
                  onClick={onRegisterClick} 
                  className="bg-rose-800 text-amber-400 px-6 py-2.5 rounded-2xl font-black shadow-xl hover:bg-rose-900 transition-all text-sm border-b-4 border-rose-950 active:scale-95 uppercase tracking-wider"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fde68a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fbbf24;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
