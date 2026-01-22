
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
          <div className="flex items-center space-x-3">
            <div className="bg-rose-800 text-amber-400 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg border border-amber-500/30">
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
                className="flex items-center space-x-3 bg-white border-2 border-amber-200 hover:border-amber-400 rounded-2xl px-4 py-2 text-xs font-bold text-rose-900 transition-all shadow-sm active:scale-95 group"
              >
                <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm border border-gray-100">
                  <img src={currentLangData.flag} alt={currentLangData.name} className="w-full h-full object-cover" />
                </div>
                <span className="uppercase tracking-wider font-black">{currentLangData.native}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 text-amber-600 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border-2 border-amber-100 rounded-[2rem] shadow-[0_20px_50px_rgba(153,27,27,0.15)] overflow-hidden animate-in fade-in zoom-in duration-200 ring-4 ring-rose-50/50">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest block">Choose Language</span>
                  </div>
                  <div className="p-2 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                          currentLang === lang.code 
                          ? 'bg-rose-800 text-amber-400 shadow-lg' 
                          : 'text-gray-700 hover:bg-amber-50 hover:text-rose-900'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-5 overflow-hidden rounded shadow-sm border ${currentLang === lang.code ? 'border-amber-400/50' : 'border-gray-200'}`}>
                            <img src={lang.flag} alt={lang.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-sm ${currentLang === lang.code ? 'font-black' : 'font-bold'}`}>{lang.native}</span>
                            <span className={`text-[9px] uppercase tracking-tighter ${currentLang === lang.code ? 'text-rose-200' : 'text-gray-400'}`}>{lang.name}</span>
                          </div>
                        </div>
                        {currentLang === lang.code && (
                          <div className="w-5 h-5 bg-amber-400 text-rose-900 rounded-full flex items-center justify-center">
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
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{t.welcome}</span>
                  <span className="text-sm font-black text-rose-900">{userName}</span>
                </div>
                {!isVerified && (
                  <button 
                    onClick={onStartVerification}
                    className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full text-[10px] font-black border-2 border-amber-200 hover:bg-amber-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    VERIFY ME
                  </button>
                )}
                <button 
                  onClick={onLogout} 
                  className="text-gray-400 hover:text-rose-800 font-black text-[10px] uppercase tracking-widest transition"
                >
                  Logout
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
    </nav>
  );
};

export default Navbar;
