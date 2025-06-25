import React from 'react';
import {
  MessageCircle,
  BellRing,
  CalendarDays,
  Activity,
  ShieldAlert,
  Settings,
  Trash2,
  Edit3,
  PlusCircle,
  Save,
  XCircle,
  Send,
  Copy,
  CheckCircle,
  AlertTriangle,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  Youtube,
  BookOpen,
  Icon as LucideIcon,
  Home,
  Menu,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  EyeOff,
  Briefcase,
  ExternalLink,
  Info,
  Phone // Added Phone icon
} from 'lucide-react';
import { IconName } from '../types';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

const iconMap: { [key in IconName]: LucideIcon } = {
  MessageCircle,
  BellRing,
  CalendarDays,
  Activity,
  ShieldAlert,
  Settings,
  Trash2,
  Edit3,
  PlusCircle,
  Save,
  XCircle,
  Send,
  Copy,
  CheckCircle,
  AlertTriangle,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  Youtube,
  BookOpen,
  Phone,
  Home, // Added Home to map
  // Add other icons if used by name
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, className, color }) => {
  const LucideIconComponent = iconMap[name];

  if (!LucideIconComponent) {
    // Fallback icon or handle error
    console.warn(`Icon "${name}" not found in iconMap. Falling back to MessageCircle.`);
    return <MessageCircle size={size} className={className} color={color} />;
  }

  return <LucideIconComponent size={size} className={className} color={color} />;
};

// Export individual icons for direct use if preferred
export {
  MessageCircle,
  BellRing,
  CalendarDays,
  Activity,
  ShieldAlert,
  Settings,
  Trash2,
  Edit3,
  PlusCircle,
  Save,
  XCircle,
  Send,
  Copy,
  CheckCircle,
  AlertTriangle,
  Linkedin,
  Instagram,
  Github,
  Twitter,
  Youtube,
  BookOpen,
  Home,
  Menu,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  EyeOff,
  Briefcase,
  ExternalLink,
  Info,
  Phone // Exported Phone icon
};