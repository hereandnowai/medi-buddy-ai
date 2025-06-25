import React from 'react';
import { BRAND_CONFIG, NAV_ITEMS } from '../constants';
import { Icon } from './icons';
import { IconName } from '../types';
import { ShieldAlert } from './icons'; // Specific import for larger icon

const featureIconMap: { [key: string]: IconName } = {
  'Home': 'Home',
  'Chat Assistant': 'MessageCircle',
  'Medication Reminders': 'BellRing',
  'Appointments': 'CalendarDays',
  'Health Tracker': 'Activity',
  'Emergency': 'ShieldAlert'
};


const HomePage: React.FC = () => {
  const coreFeatures = NAV_ITEMS.filter(item => item.path !== '/home'); // Exclude Home from features list

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl border-2" style={{ borderColor: BRAND_CONFIG.brand.colors.secondary }}>
      <header className="text-center mb-10">
        <img 
          src={BRAND_CONFIG.brand.logo.title} 
          alt={`${BRAND_CONFIG.brand.organizationShortName} Logo`} 
          className="h-20 sm:h-24 mx-auto mb-4 object-contain"
        />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: BRAND_CONFIG.brand.colors.secondary }}>
          Welcome to MediBuddy AI
        </h1>
        <p className="text-lg sm:text-xl font-semibold mb-3" style={{ color: BRAND_CONFIG.brand.colors.primary }}>
          Your 24/7 Virtual Health Companion
        </p>
        <p className="text-sm italic" style={{ color: BRAND_CONFIG.brand.colors.secondary }}>
          {BRAND_CONFIG.brand.slogan}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 pb-2 border-b-2" style={{ color: BRAND_CONFIG.brand.colors.secondary, borderColor: BRAND_CONFIG.brand.colors.primary }}>
          Your Health, Simplified
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          MediBuddy AI is an intelligent virtual assistant from ${BRAND_CONFIG.brand.organizationShortName}, created to provide continuous support for your health and wellness journey. We aim to bridge the gap between doctor visits, offering a reliable companion, especially for those managing chronic conditions or seeking round-the-clock health information.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Navigate through our features using the sidebar to take control of your health management.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2" style={{ color: BRAND_CONFIG.brand.colors.secondary, borderColor: BRAND_CONFIG.brand.colors.primary }}>
          Core Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {coreFeatures.map((feature) => (
            <div key={feature.path} className="flex items-start space-x-4 p-4 rounded-lg shadow-md" style={{backgroundColor: `rgba(${parseInt(BRAND_CONFIG.brand.colors.primary.slice(1,3),16)}, ${parseInt(BRAND_CONFIG.brand.colors.primary.slice(3,5),16)}, ${parseInt(BRAND_CONFIG.brand.colors.primary.slice(5,7),16)}, 0.1)`}}>
              <Icon name={featureIconMap[feature.label] || 'Activity'} size={28} color={BRAND_CONFIG.brand.colors.secondary} className="flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: BRAND_CONFIG.brand.colors.secondary }}>{feature.label}</h3>
                <p className="text-sm text-gray-600">
                  {feature.label === 'Chat Assistant' && "Engage in natural language conversations for general health queries and information. Powered by advanced AI."}
                  {feature.label === 'Medication Reminders' && "Set and receive timely reminders for your medications, ensuring you stay on schedule."}
                  {feature.label === 'Appointments' && "Keep track of your doctor appointments with easy scheduling and notifications."}
                  {feature.label === 'Health Tracker' && "Manually log and monitor basic health vitals like steps, heart rate, or glucose levels."}
                  {feature.label === 'Emergency' && "Quickly access your pre-set emergency contact information when you need it most."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 p-4 rounded-md bg-red-50 border border-red-200">
         <div className="flex items-center mb-2">
            <ShieldAlert size={24} className="text-red-600 mr-3 flex-shrink-0" />
            <h2 className="text-xl font-semibold" style={{ color: BRAND_CONFIG.brand.colors.secondary }}>
            Important Note
            </h2>
         </div>
        <p className="text-sm text-red-700 leading-relaxed">
          MediBuddy AI provides general health information and support. It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment. Always consult with your doctor or a qualified healthcare provider for any medical concerns or before making any health decisions. In case of a medical emergency, please call your local emergency number immediately.
        </p>
      </section>
    </div>
  );
};

export default HomePage;