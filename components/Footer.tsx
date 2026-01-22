
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-rose-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold">NM</div>
              <span className="text-xl font-serif font-bold">Nalam Matrimony</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nalam is the trusted matrimony service dedicated to helping people find their perfect life partner with care, security, and AI-driven precision.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-500">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-500">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Premium Membership</a></li>
              <li><a href="#" className="hover:text-white transition">Matchmaking</a></li>
              <li><a href="#" className="hover:text-white transition">Nalam Assist</a></li>
              <li><a href="#" className="hover:text-white transition">Elite Matrimony</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-rose-500">Download App</h4>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg flex items-center space-x-3 cursor-pointer hover:bg-white/20 transition">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Available on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg flex items-center space-x-3 cursor-pointer hover:bg-white/20 transition">
                <div className="text-2xl">🍎</div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Nalam Matrimony. All Rights Reserved. "Nalam" is a registered trademark.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
