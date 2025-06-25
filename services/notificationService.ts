import { BRAND_CONFIG } from '../constants';

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return 'denied';
  }
  return Notification.requestPermission();
};

export const showNotification = (title: string, options?: NotificationOptions): Notification | null => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: BRAND_CONFIG.brand.logo.favicon,
      badge: BRAND_CONFIG.brand.logo.favicon,
      ...options,
    });
    return notification;
  } else if (Notification.permission !== 'denied') {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          icon: BRAND_CONFIG.brand.logo.favicon,
          badge: BRAND_CONFIG.brand.logo.favicon,
          ...options,
        });
      }
    });
  }
  return null;
};

export const scheduleNotification = (
  id: string,
  title: string,
  body: string,
  dateTime: Date
): number | null => {
  const now = new Date();
  const timeUntilNotification = dateTime.getTime() - now.getTime();

  if (timeUntilNotification <= 0) {
    console.warn(`Notification time for "${title}" is in the past.`);
    // Optionally, show immediately if it's a very recent past time
    // showNotification(title, { body });
    return null;
  }

  const timeoutId = setTimeout(() => {
    showNotification(title, { body });
    // Here you might want to remove the notification from a pending list
  }, timeUntilNotification);

  return timeoutId as unknown as number; // Cast to number for browser compatibility
};

export const checkAndRequestPermissionOnLoad = async () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await requestNotificationPermission();
    }
};