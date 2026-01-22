
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  currentLang: Language;
  onRegisterClick: () => void;
  onSearch: (pincode: string, district: string) => void;
  availableDistricts: string[];
}

const Hero: React.FC<HeroProps> = ({ currentLang, onRegisterClick, onSearch, availableDistricts }) => {
  const t = translations[currentLang];
  const [pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('');

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline font-serif text-rose-900">{t.heroTitle.split(' ')[0]} {t.heroTitle.split(' ')[1]}</span>{' '}
                <span className="block text-amber-600 xl:inline font-serif italic">{t.heroTitle.split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-medium">
                {t.heroSub}
                <span className="text-rose-800 font-bold block mt-2 underline decoration-amber-400">10 Lakh+ Profiles! TN Wide Search Available.</span>
              </p>
              
              <div className="mt-10 bg-amber-50 p-1 rounded-3xl shadow-2xl border-2 border-amber-200 max-w-lg transform -rotate-1">
                <div className="bg-white p-6 rounded-[1.4rem] border border-amber-100 flex flex-col items-center">
                  <div className="text-rose-900 font-serif font-bold text-xl mb-6 text-center">
                    Begin Your Auspicious Journey
                    <div className="h-0.5 w-12 bg-amber-400 mx-auto mt-1"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-amber-700 uppercase mb-1">{t.district}</label>
                      <select 
                        className="w-full bg-gray-50 border-2 border-amber-100 rounded-xl px-3 py-3 text-sm focus:border-rose-500 outline-none font-bold text-gray-700"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      >
                        <option value="">{t.allDistricts}</option>
                        {availableDistricts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-amber-700 uppercase mb-1">{t.lookingFor}</label>
                      <select className="w-full bg-gray-50 border-2 border-amber-100 rounded-xl px-3 py-3 text-sm focus:border-rose-500 outline-none font-bold text-gray-700">
                        <option>Woman</option>
                        <option>Man</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-amber-700 uppercase mb-1">{t.pincode}</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder={t.searchPlace}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-amber-100 rounded-xl px-3 py-3 text-sm focus:border-rose-500 outline-none font-bold text-gray-700" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => onSearch(pincode, district)}
                    className="w-full bg-rose-800 text-amber-400 py-4 rounded-2xl font-black text-xl hover:bg-rose-900 transition-all shadow-xl border-b-4 border-rose-950 flex items-center justify-center space-x-2"
                  >
                    <span>{t.search}</span>
                    <span className="text-sm">→</span>
                  </button>
                  <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Every District • Every Pincode • Every Village</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1769&q=80" alt="Traditional Marriage" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:block hidden"></div>
      </div>
    </div>
  );
};

export default Hero;
