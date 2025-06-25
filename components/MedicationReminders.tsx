import React, { useState, useEffect } from 'react';
import { MedicationReminder } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from './Modal';
import { PlusCircle, Edit3, Trash2, Save, XCircle, BellRing } from './icons';
import { BRAND_CONFIG } from '../constants';
import { scheduleNotification, showNotification, requestNotificationPermission, checkAndRequestPermissionOnLoad } from '../services/notificationService';

const MedicationForm: React.FC<{
  onSubmit: (reminder: MedicationReminder) => void;
  onCancel: () => void;
  initialData?: MedicationReminder | null;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [dosage, setDosage] = useState(initialData?.dosage || '');
  const [time, setTime] = useState(initialData?.time || '08:00');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !time) {
        alert("Medication name and time are required.");
        return;
    }
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      name,
      dosage,
      time,
      frequency: 'daily', // Simplified for this example
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="medName" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Medication Name*</label>
        <input type="text" id="medName" value={name} onChange={e => setName(e.target.value)} required 
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="medDosage" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Dosage (e.g., 1 pill, 10mg)</label>
        <input type="text" id="medDosage" value={dosage} onChange={e => setDosage(e.target.value)}
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="medTime" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Time* (HH:MM)</label>
        <input type="time" id="medTime" value={time} onChange={e => setTime(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
       <div>
        <label htmlFor="medNotes" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Notes</label>
        <textarea id="medNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`}></textarea>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onCancel} 
                className={`px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.secondary}] text-[${BRAND_CONFIG.brand.colors.secondary}]`}>
          <XCircle size={18} className="inline mr-1" /> Cancel
        </button>
        <button type="submit" 
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${BRAND_CONFIG.brand.colors.primary}]`}
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary}}>
          <Save size={18} className="inline mr-1" /> {initialData ? 'Update' : 'Add'} Reminder
        </button>
      </div>
    </form>
  );
};


const MedicationReminders: React.FC = () => {
  const [reminders, setReminders] = useLocalStorage<MedicationReminder[]>('medicationReminders', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [scheduledTimeouts, setScheduledTimeouts] = useState<Record<string, number>>({});

  useEffect(() => {
    checkAndRequestPermissionOnLoad().then(() => setNotificationPermission(Notification.permission));
  }, []);
  
  const clearScheduledNotification = (reminderId: string) => {
    if (scheduledTimeouts[reminderId]) {
      clearTimeout(scheduledTimeouts[reminderId]);
      setScheduledTimeouts(prev => {
        const newTimeouts = {...prev};
        delete newTimeouts[reminderId];
        return newTimeouts;
      });
    }
  };

  const scheduleNewNotification = (reminder: MedicationReminder) => {
    if (notificationPermission === 'granted') {
      clearScheduledNotification(reminder.id); // Clear existing before setting new
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const now = new Date();
      const reminderDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      // If reminder time is already past for today, schedule for tomorrow
      if (reminderDateTime.getTime() < now.getTime()) {
        reminderDateTime.setDate(reminderDateTime.getDate() + 1);
      }

      const timeoutId = scheduleNotification(
        reminder.id,
        `Medication Reminder: ${reminder.name}`,
        `Time to take your ${reminder.name} (${reminder.dosage || 'as prescribed'}). Notes: ${reminder.notes || 'None'}`,
        reminderDateTime
      );
      if (timeoutId !== null) { // Check if timeoutId is not null
        setScheduledTimeouts(prev => ({...prev, [reminder.id]: timeoutId}));
      }
    }
  };
  
  // Re-schedule notifications on load
  useEffect(() => {
    reminders.forEach(scheduleNewNotification);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, notificationPermission]);


  const handleAddOrUpdateReminder = (reminder: MedicationReminder) => {
    if (editingReminder) {
      setReminders(reminders.map(r => r.id === reminder.id ? reminder : r));
    } else {
      setReminders([...reminders, reminder]);
    }
    scheduleNewNotification(reminder);
    setIsModalOpen(false);
    setEditingReminder(null);
    showNotification('Reminder Set!', { body: `Reminder for ${reminder.name} at ${reminder.time} has been ${editingReminder ? 'updated' : 'added'}.`});
  };

  const handleEdit = (reminder: MedicationReminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      setReminders(reminders.filter(r => r.id !== id));
      clearScheduledNotification(id);
      showNotification('Reminder Deleted', { body: `The reminder has been successfully deleted.`});
    }
  };
  
  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
        reminders.forEach(scheduleNewNotification); // Schedule existing reminders
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border-2" style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{color: BRAND_CONFIG.brand.colors.secondary}}>Medication Reminders</h2>
        <button onClick={() => { setEditingReminder(null); setIsModalOpen(true); }}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary, borderColor: BRAND_CONFIG.brand.colors.primary}}>
          <PlusCircle size={20} className="mr-2" /> Add Reminder
        </button>
      </div>

      {notificationPermission !== 'granted' && (
        <div className={`p-3 mb-4 rounded-md flex items-center justify-between ${notificationPermission === 'denied' ? 'bg-red-100 text-red-700' : `bg-[${BRAND_CONFIG.brand.colors.primary}] bg-opacity-20 text-[${BRAND_CONFIG.brand.colors.secondary}]`}`}>
          <p className="text-sm">
            {notificationPermission === 'denied' 
              ? 'Notification permissions are denied. Please enable them in your browser settings to receive reminders.'
              : 'Enable notifications to get medication reminders.'}
          </p>
          {notificationPermission !== 'denied' && (
            <button onClick={handleRequestPermission} 
                    className={`px-3 py-1 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary}}>
              Enable Notifications
            </button>
          )}
        </div>
      )}

      {reminders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No medication reminders set yet. Click "Add Reminder" to get started.</p>
      ) : (
        <div className="space-y-4">
          {reminders.sort((a,b) => a.time.localeCompare(b.time)).map(r => (
            <div key={r.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-start" style={{borderColor: BRAND_CONFIG.brand.colors.primary}}>
              <div>
                <div className="flex items-center mb-1">
                    <BellRing size={20} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/>
                    <h3 className="text-lg font-semibold" style={{color: BRAND_CONFIG.brand.colors.secondary}}>{r.name}</h3>
                </div>
                <p className="text-sm text-gray-600">Dosage: {r.dosage || 'N/A'}</p>
                <p className="text-sm text-gray-600">Time: {r.time}</p>
                {r.notes && <p className="text-xs text-gray-500 mt-1">Notes: {r.notes}</p>}
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button onClick={() => handleEdit(r)} className="p-2 text-blue-600 hover:text-blue-800"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingReminder(null); }} title={editingReminder ? 'Edit Reminder' : 'Add New Reminder'}>
        <MedicationForm 
          onSubmit={handleAddOrUpdateReminder} 
          onCancel={() => { setIsModalOpen(false); setEditingReminder(null); }}
          initialData={editingReminder} 
        />
      </Modal>
    </div>
  );
};

export default MedicationReminders;