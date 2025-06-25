
import React, { ReactNode } from 'react';
import { XCircle } from './icons';
import { BRAND_CONFIG } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div 
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} flex flex-col`}
        style={{ borderColor: BRAND_CONFIG.brand.colors.secondary, borderWidth: '2px' }}
      >
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ backgroundColor: BRAND_CONFIG.brand.colors.secondary, borderBottomColor: BRAND_CONFIG.brand.colors.primary }}
        >
          <h3 className="text-lg font-semibold" style={{ color: BRAND_CONFIG.brand.colors.primary }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]">
            <XCircle size={24} style={{ color: BRAND_CONFIG.brand.colors.primary }} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
