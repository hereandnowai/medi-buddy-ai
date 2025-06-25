
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BRAND_CONFIG, NAV_ITEMS } from '../constants';
import { Icon } from './icons';
import { IconName } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const baseLinkClasses = "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ease-in-out";
  const activeLinkClasses = `bg-[${BRAND_CONFIG.brand.colors.primary}] text-[${BRAND_CONFIG.brand.colors.secondary}] font-semibold`;
  const inactiveLinkClasses = `text-white hover:bg-[${BRAND_CONFIG.brand.colors.primary}] hover:text-[${BRAND_CONFIG.brand.colors.secondary}]`;
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 p-4 transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: BRAND_CONFIG.brand.colors.secondary }}
      >
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }} // Close sidebar on mobile after click
              className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
            >
              <Icon name={item.icon as IconName} size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs" style={{color: BRAND_CONFIG.brand.colors.primary}}>
                Powered by {BRAND_CONFIG.brand.organizationShortName}
            </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;