import React, { useState } from 'react';
import { ShieldAlert, Phone, User, Edit3, Save, XCircle } from './icons';
import { BRAND_CONFIG } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { EmergencyContact } from '../types';
import Modal from './Modal';

const ContactForm: React.FC<{
  onSubmit: (contact: EmergencyContact) => void;
  onCancel: () => void;
  initialData?: EmergencyContact | null;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [relation, setRelation] = useState(initialData?.relation || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        alert("Name and phone number are required.");
        return;
    }
    onSubmit({ name, phone, relation });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contactName" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Contact Name*</label>
        <input type="text" id="contactName" value={name} onChange={e => setName(e.target.value)} required 
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="contactPhone" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Phone Number*</label>
        <input type="tel" id="contactPhone" value={phone} onChange={e => setPhone(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="contactRelation" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Relation (e.g., Spouse, Son)</label>
        <input type="text" id="contactRelation" value={relation} onChange={e => setRelation(e.target.value)}
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onCancel} 
                className={`px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.secondary}] text-[${BRAND_CONFIG.brand.colors.secondary}]`}>
          <XCircle size={18} className="inline mr-1" /> Cancel
        </button>
        <button type="submit" 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.primary}]`}
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary}}>
          <Save size={18} className="inline mr-1" /> Save Contact
        </button>
      </div>
    </form>
  );
};


const EmergencyAlert: React.FC = () => {
  const [contact, setContact] = useLocalStorage<EmergencyContact | null>('emergencyContact', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);

  const handleSaveContact = (newContact: EmergencyContact) => {
    setContact(newContact);
    setIsModalOpen(false);
    alert('Emergency contact saved!');
  };
  
  const handleSOS = () => {
    if (!contact) {
        alert("No emergency contact set. Please configure your emergency contact first.");
        setIsModalOpen(true);
        return;
    }
    setShowEmergencyInfo(true);
    // In a real app, this would trigger actual alerts, SMS, location sharing etc.
    // For this demo, we just show the information.
    alert("SOS Activated! Your emergency contact information is displayed. In a real emergency, contact emergency services directly (e.g., 911, 112).");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl text-center border-2" style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}>
      <ShieldAlert size={64} className="mx-auto mb-4" style={{color: BRAND_CONFIG.brand.colors.secondary}}/>
      <h2 className="text-2xl font-semibold mb-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}>Emergency Alert</h2>
      <p className="text-gray-600 mb-6">
        In case of a medical emergency, press the SOS button. 
        This will display your pre-set emergency contact information.
        <strong>Always call your local emergency number (e.g., 911, 112) for immediate life-threatening situations.</strong>
      </p>

      <button 
        onClick={handleSOS}
        className="w-full max-w-xs mx-auto px-6 py-4 text-xl font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
      >
        SOS - ACTIVATE ALERT
      </button>

      <div className="mt-8 text-left max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2 flex justify-between items-center" style={{color: BRAND_CONFIG.brand.colors.secondary}}>
          Emergency Contact
          <button onClick={() => setIsModalOpen(true)} className="text-sm p-1 rounded hover:bg-gray-200">
            <Edit3 size={18} style={{color: BRAND_CONFIG.brand.colors.secondary}}/>
          </button>
        </h3>
        {contact ? (
          <div className="p-4 border rounded-md" style={{borderColor: BRAND_CONFIG.brand.colors.primary}}>
            <p className="flex items-center mb-1"><User size={18} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/> <strong>Name:</strong> {contact.name}</p>
            <p className="flex items-center mb-1"><Phone size={18} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/> <strong>Phone:</strong> <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">{contact.phone}</a></p>
            {contact.relation && <p className="flex items-center"><User size={18} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/> <strong>Relation:</strong> {contact.relation}</p>}
          </div>
        ) : (
          <p className="text-gray-500">No emergency contact set. Click the edit icon to add one.</p>
        )}
      </div>
      
      {showEmergencyInfo && contact && (
        <Modal isOpen={showEmergencyInfo} onClose={() => setShowEmergencyInfo(false)} title="SOS Activated - Emergency Information">
            <div className="text-center p-4">
                <ShieldAlert size={48} className="mx-auto mb-4 text-red-600"/>
                <h3 className="text-xl font-bold text-red-600 mb-2">EMERGENCY ALERT</h3>
                <p className="text-gray-700 mb-4">
                    This information is for your reference. <strong>Please contact emergency services (e.g., 911, 112) immediately if this is a real emergency.</strong>
                </p>
                <div className="text-left bg-red-50 p-4 rounded-md border border-red-200">
                    <h4 className="font-semibold text-lg mb-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}>Emergency Contact Details:</h4>
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Phone:</strong> {contact.phone}</p>
                    {contact.relation && <p><strong>Relation:</strong> {contact.relation}</p>}
                </div>
                <button 
                    onClick={() => setShowEmergencyInfo(false)} 
                    className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </Modal>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={contact ? 'Edit Emergency Contact' : 'Set Emergency Contact'}>
        <ContactForm onSubmit={handleSaveContact} onCancel={() => setIsModalOpen(false)} initialData={contact} />
      </Modal>
    </div>
  );
};

export default EmergencyAlert;