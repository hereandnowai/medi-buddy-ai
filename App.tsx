
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HomePage from './components/HomePage'; // Import HomePage
import ChatAssistant from './components/ChatAssistant';
import MedicationReminders from './components/MedicationReminders';
import AppointmentScheduler from './components/AppointmentScheduler';
import HealthTracker from './components/HealthTracker';
import EmergencyAlert from './components/EmergencyAlert';
import { BRAND_CONFIG } from './constants';
import { checkAndRequestPermissionOnLoad } from './services/notificationService';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768); // Open by default on desktop

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize(); 
    // Request notification permission on load
    checkAndRequestPermissionOnLoad();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 pt-16"> {/* Adjust pt for Navbar height */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main 
            className={`flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out overflow-y-auto 
                       ${isSidebarOpen && window.innerWidth >= 768 ? 'md:ml-64' : 'ml-0'}`}
            style={{ backgroundColor: `rgba(${parseInt(BRAND_CONFIG.brand.colors.primary.slice(1,3),16)}, ${parseInt(BRAND_CONFIG.brand.colors.primary.slice(3,5),16)}, ${parseInt(BRAND_CONFIG.brand.colors.primary.slice(5,7),16)}, 0.05)` }} // very light primary as bg
          >
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} /> {/* Default to home */}
              <Route path="/home" element={<HomePage />} /> {/* Add HomePage route */}
              <Route path="/chat-assistant" element={<ChatAssistant />} />
              <Route path="/reminders" element={<MedicationReminders />} />
              <Route path="/appointments" element={<AppointmentScheduler />} />
              <Route path="/tracker" element={<HealthTracker />} />
              <Route path="/emergency" element={<EmergencyAlert />} />
              {/* Fallback for any unknown route */}
              <Route path="*" element={<Navigate to="/home" replace />} /> {/* Fallback to home */}
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;