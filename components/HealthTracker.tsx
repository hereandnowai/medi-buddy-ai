
import React, { useState } from 'react';
import { VitalRecord } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from './Modal';
import { PlusCircle, Activity, Save, XCircle, Trash2 } from './icons';
import { BRAND_CONFIG } from '../constants';

const VitalForm: React.FC<{
  onSubmit: (vital: Omit<VitalRecord, 'id' | 'date'>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<'steps' | 'heart_rate' | 'glucose'>('steps');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('steps');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'steps' | 'heart_rate' | 'glucose';
    setType(newType);
    if (newType === 'steps') setUnit('steps');
    else if (newType === 'heart_rate') setUnit('bpm');
    else if (newType === 'glucose') setUnit('mg/dL');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
        alert("Value is required.");
        return;
    }
    onSubmit({ type, value: type === 'steps' ? parseInt(value) : parseFloat(value) , unit });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vitalType" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Vital Type</label>
        <select id="vitalType" value={type} onChange={handleTypeChange}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`}>
          <option value="steps">Steps</option>
          <option value="heart_rate">Heart Rate</option>
          <option value="glucose">Glucose</option>
        </select>
      </div>
      <div>
        <label htmlFor="vitalValue" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Value</label>
        <input type="number" id="vitalValue" value={value} onChange={e => setValue(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="vitalUnit" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Unit</label>
        <input type="text" id="vitalUnit" value={unit} readOnly
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm`} />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
         <button type="button" onClick={onCancel} 
                className={`px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.secondary}] text-[${BRAND_CONFIG.brand.colors.secondary}]`}>
          <XCircle size={18} className="inline mr-1" /> Cancel
        </button>
        <button type="submit" 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.primary}]`}
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary}}>
          <Save size={18} className="inline mr-1" /> Add Record
        </button>
      </div>
    </form>
  );
};


const HealthTracker: React.FC = () => {
  const [vitals, setVitals] = useLocalStorage<VitalRecord[]>('healthVitals', []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddVital = (vitalData: Omit<VitalRecord, 'id' | 'date'>) => {
    const newVital: VitalRecord = {
      ...vitalData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setVitals(prevVitals => [newVital, ...prevVitals].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsModalOpen(false);
  };

  const handleDeleteVital = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vital record?")) {
        setVitals(vitals.filter(v => v.id !== id));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border-2" style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{color: BRAND_CONFIG.brand.colors.secondary}}>Health Tracker</h2>
        <button onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary, borderColor: BRAND_CONFIG.brand.colors.primary}}>
          <PlusCircle size={20} className="mr-2" /> Add Vital Record
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Manually track your health vitals like steps, heart rate, or glucose levels. This app does not sync with external devices automatically.
      </p>

      {vitals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No health vitals recorded yet. Click "Add Vital Record" to get started.</p>
      ) : (
        <div className="space-y-3">
          {vitals.map(vital => (
            <div key={vital.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center" style={{borderColor: BRAND_CONFIG.brand.colors.primary}}>
              <div>
                <div className="flex items-center mb-1">
                    <Activity size={20} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/>
                    <h3 className="text-md font-semibold capitalize" style={{color: BRAND_CONFIG.brand.colors.secondary}}>{vital.type.replace('_', ' ')}: {vital.value} {vital.unit}</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Recorded: {new Date(vital.date).toLocaleString()}
                </p>
              </div>
              <button onClick={() => handleDeleteVital(vital.id)} className="p-2 text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vital Record">
        <VitalForm onSubmit={handleAddVital} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HealthTracker;
