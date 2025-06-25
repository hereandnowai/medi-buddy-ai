
import React from 'react';
import { BRAND_CONFIG } from '../constants';
import { Icon } from './icons';
import { IconName } from '../types';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Blog', href: BRAND_CONFIG.brand.socialMedia.blog, icon: 'BookOpen' as IconName },
    { name: 'LinkedIn', href: BRAND_CONFIG.brand.socialMedia.linkedin, icon: 'Linkedin' as IconName },
    { name: 'Instagram', href: BRAND_CONFIG.brand.socialMedia.instagram, icon: 'Instagram' as IconName },
    { name: 'GitHub', href: BRAND_CONFIG.brand.socialMedia.github, icon: 'Github' as IconName },
    { name: 'X', href: BRAND_CONFIG.brand.socialMedia.x, icon: 'Twitter' as IconName }, // Assuming Twitter icon for X
    { name: 'YouTube', href: BRAND_CONFIG.brand.socialMedia.youtube, icon: 'Youtube' as IconName },
  ];

  return (
    <footer 
      className="p-6 text-center"
      style={{ backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary }}
    >
      <div className="mb-2"> {/* Changed mb-4 to mb-2 */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {BRAND_CONFIG.brand.organizationLongName}. All rights reserved.
        </p>
        <p className="text-xs italic mt-1">
          {BRAND_CONFIG.brand.slogan}
        </p>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className={`hover:text-white transition-colors`}
            style={{color: BRAND_CONFIG.brand.colors.primary}}
          >
            <Icon name={link.icon} size={24} />
          </a>
        ))}
      </div>
      <p className="text-xs">
        Contact: <a href={`mailto:${BRAND_CONFIG.brand.email}`} className={`hover:underline`}>{BRAND_CONFIG.brand.email}</a> | 
        Phone: {BRAND_CONFIG.brand.mobile}
      </p>
      <p className="text-xs mt-2">
        <a href={BRAND_CONFIG.brand.website} target="_blank" rel="noopener noreferrer" className={`hover:underline`}>
          Visit our website
        </a>
      </p>
    </footer>
  );
};

export default Footer;