
import { ChatRole } from './constants';

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm
  frequency: 'daily' | 'specific_days' | 'interval'; // Add more as needed
  days?: string[]; // For specific_days
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
}

export interface VitalRecord {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  type: 'steps' | 'heart_rate' | 'glucose';
  value: string | number;
  unit: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// For icon names from lucide-react
export type IconName = 
  | 'MessageCircle' 
  | 'BellRing' 
  | 'CalendarDays' 
  | 'Activity' 
  | 'ShieldAlert'
  | 'Settings'
  | 'Trash2'
  | 'Edit3'
  | 'PlusCircle'
  | 'Save'
  | 'XCircle'
  | 'Send'
  | 'Copy'
  | 'CheckCircle'
  | 'AlertTriangle'
  | 'Linkedin'
  | 'Instagram'
  | 'Github'
  | 'Twitter' // X
  | 'Youtube'
  | 'BookOpen' // Blog
  | 'Phone' // Added Phone icon name
  | 'Home'; // Added Home icon name