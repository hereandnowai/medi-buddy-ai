import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import Modal from './Modal';
import { PlusCircle, Edit3, Trash2, Save, XCircle, CalendarDays } from './icons';
import { BRAND_CONFIG } from '../constants';
import { scheduleNotification, showNotification, requestNotificationPermission, checkAndRequestPermissionOnLoad } from '../services/notificationService';


const AppointmentForm: React.FC<{
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
  initialData?: Appointment | null;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [doctor, setDoctor] = useState(initialData?.doctor || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialData?.time || '09:00');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!title || !date || !time) {
        alert("Appointment title, date, and time are required.");
        return;
    }
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      title,
      doctor,
      date,
      time,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="aptTitle" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Appointment Title*</label>
        <input type="text" id="aptTitle" value={title} onChange={e => setTitle(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="aptDoctor" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Doctor/Specialist</label>
        <input type="text" id="aptDoctor" value={doctor} onChange={e => setDoctor(e.target.value)}
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="aptDate" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Date*</label>
        <input type="date" id="aptDate" value={date} onChange={e => setDate(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="aptTime" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Time*</label>
        <input type="time" id="aptTime" value={time} onChange={e => setTime(e.target.value)} required
               className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[${BRAND_CONFIG.brand.colors.primary}] focus:border-[${BRAND_CONFIG.brand.colors.primary}] sm:text-sm`} />
      </div>
      <div>
        <label htmlFor="aptNotes" className={`block text-sm font-medium text-[${BRAND_CONFIG.brand.colors.secondary}]`}>Notes</label>
        <textarea id="aptNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
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
          <Save size={18} className="inline mr-1" /> {initialData ? 'Update' : 'Add'} Appointment
        </button>
      </div>
    </form>
  );
};

const AppointmentScheduler: React.FC = () => {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [scheduledTimeouts, setScheduledTimeouts] = useState<Record<string, number>>({});


  useEffect(() => {
    checkAndRequestPermissionOnLoad().then(() => setNotificationPermission(Notification.permission));
  }, []);
  
  const clearScheduledNotification = (appointmentId: string) => {
    if (scheduledTimeouts[appointmentId]) {
      clearTimeout(scheduledTimeouts[appointmentId]);
      setScheduledTimeouts(prev => {
        const newTimeouts = {...prev};
        delete newTimeouts[appointmentId];
        return newTimeouts;
      });
    }
  };

  const scheduleNewNotification = (appointment: Appointment) => {
     if (notificationPermission === 'granted') {
      clearScheduledNotification(appointment.id);
      const [year, month, day] = appointment.date.split('-').map(Number);
      const [hours, minutes] = appointment.time.split(':').map(Number);
      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
      
      // Schedule reminder 1 hour before, or if less than 1 hour, then 10 mins before, or if less than 10 mins, then immediately (if not past)
      let reminderDateTime = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000); // 1 hour before
      const now = new Date();

      if (reminderDateTime.getTime() < now.getTime()) { // If 1hr before is past
        reminderDateTime = new Date(appointmentDateTime.getTime() - 10 * 60 * 1000); // 10 mins before
      }
      if (reminderDateTime.getTime() < now.getTime()) { // If 10mins before is past
         // Don't schedule if appointment itself is past
        if (appointmentDateTime.getTime() < now.getTime()) {
          console.warn(`Appointment "${appointment.title}" time is in the past. No notification scheduled.`);
          return;
        }
        reminderDateTime = new Date(now.getTime() + 1000); //ほぼ即時 (1秒後)
      }


      const timeoutId = scheduleNotification(
        appointment.id,
        `Appointment Reminder: ${appointment.title}`,
        `Your appointment for ${appointment.title} with ${appointment.doctor || 'your doctor'} is at ${appointment.time} on ${appointment.date}. Notes: ${appointment.notes || 'None'}`,
        reminderDateTime
      );
      if (timeoutId !== null) { // Check if timeoutId is not null
        setScheduledTimeouts(prev => ({...prev, [appointment.id]: timeoutId}));
      }
    }
  };
  
  // Re-schedule notifications on load
  useEffect(() => {
    appointments.forEach(scheduleNewNotification);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, notificationPermission]);


  const handleAddOrUpdateAppointment = (appointment: Appointment) => {
    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
    } else {
      setAppointments([...appointments, appointment]);
    }
    scheduleNewNotification(appointment);
    setIsModalOpen(false);
    setEditingAppointment(null);
    showNotification('Appointment Set!', { body: `Appointment for ${appointment.title} on ${appointment.date} at ${appointment.time} has been ${editingAppointment ? 'updated' : 'added'}.`});
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter(a => a.id !== id));
      clearScheduledNotification(id);
      showNotification('Appointment Deleted', { body: 'The appointment has been successfully deleted.'});
    }
  };

  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
        appointments.forEach(scheduleNewNotification);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border-2" style={{borderColor: BRAND_CONFIG.brand.colors.secondary}}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{color: BRAND_CONFIG.brand.colors.secondary}}>Appointments</h2>
        <button onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{backgroundColor: BRAND_CONFIG.brand.colors.secondary, color: BRAND_CONFIG.brand.colors.primary, borderColor: BRAND_CONFIG.brand.colors.primary}}>
          <PlusCircle size={20} className="mr-2" /> Add Appointment
        </button>
      </div>

       {notificationPermission !== 'granted' && (
        <div className={`p-3 mb-4 rounded-md flex items-center justify-between ${notificationPermission === 'denied' ? 'bg-red-100 text-red-700' : `bg-[${BRAND_CONFIG.brand.colors.primary}] bg-opacity-20 text-[${BRAND_CONFIG.brand.colors.secondary}]`}`}>
          <p className="text-sm">
            {notificationPermission === 'denied' 
              ? 'Notification permissions are denied. Please enable them in your browser settings to receive appointment reminders.'
              : 'Enable notifications to get appointment reminders.'}
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

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No appointments scheduled. Click "Add Appointment" to get started.</p>
      ) : (
        <div className="space-y-4">
          {appointments.sort((a,b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()).map(apt => (
            <div key={apt.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-start" style={{borderColor: BRAND_CONFIG.brand.colors.primary}}>
              <div>
                <div className="flex items-center mb-1">
                    <CalendarDays size={20} className="mr-2" style={{color: BRAND_CONFIG.brand.colors.secondary}}/>
                    <h3 className="text-lg font-semibold" style={{color: BRAND_CONFIG.brand.colors.secondary}}>{apt.title}</h3>
                </div>
                <p className="text-sm text-gray-600">With: {apt.doctor || 'N/A'}</p>
                <p className="text-sm text-gray-600">Date: {new Date(apt.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-600">Time: {apt.time}</p>
                {apt.notes && <p className="text-xs text-gray-500 mt-1">Notes: {apt.notes}</p>}
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button onClick={() => handleEdit(apt)} className="p-2 text-blue-600 hover:text-blue-800"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(apt.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingAppointment(null); }} title={editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}>
        <AppointmentForm 
          onSubmit={handleAddOrUpdateAppointment} 
          onCancel={() => { setIsModalOpen(false); setEditingAppointment(null); }}
          initialData={editingAppointment} 
        />
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;