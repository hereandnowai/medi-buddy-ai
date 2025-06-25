
import React from 'react';
import { BRAND_CONFIG } from '../constants';
import { Menu } from './icons'; // Assuming Menu icon is available

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 h-16 shadow-md flex items-center justify-between px-4 z-50"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.secondary }}
    >
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 mr-2 text-white md:hidden hover:bg-[rgba(255,255,255,0.1)] rounded-full"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <img 
          src={BRAND_CONFIG.brand.logo.title} 
          alt={`${BRAND_CONFIG.brand.organizationShortName} Logo`} 
          className="h-10 object-contain" 
        />
        <h1 className="ml-3 text-xl font-semibold hidden sm:block" style={{color: BRAND_CONFIG.brand.colors.primary}}>
          MediBuddy AI
        </h1>
      </div>
      <div className="flex items-center">
        <span className="text-xs sm:text-sm mr-4 hidden md:block" style={{color: BRAND_CONFIG.brand.colors.primary}}>
          {BRAND_CONFIG.brand.organizationShortName}
        </span>
        {/* Placeholder for future elements like profile icon or settings */}
      </div>
    </nav>
  );
};

export default Navbar;
