// src/components/VisitNotifier.js
import { useEffect } from 'react';

const notifyUrl = 'https://portfolio-rkfu.onrender.com/notify'; // Your backend

const VisitNotifier = () => {
  useEffect(() => {
    const payload = {
      source: 'SnapAuction', // <- distinguish the source
      path: window.location.pathname,
      referrer: document.referrer,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`
    };

    const maxAttempts = 3;
    const delayMs = 3000;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const tryNotify = async (attempt = 1) => {
      try {
        const res = await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.success) {
          console.log(`✅ SnapAuction notified backend (attempt ${attempt})`);
        } else {
          console.warn(`⚠️ Backend responded with error:`, json);
          if (attempt < maxAttempts) {
            await delay(delayMs);
            return tryNotify(attempt + 1);
          }
        }
      } catch (err) {
        console.warn(`❌ Attempt ${attempt} failed:`, err);
        if (attempt < maxAttempts) {
          await delay(delayMs);
          return tryNotify(attempt + 1);
        } else {
          console.error('🔥 All SnapAuction notify attempts failed.');
        }
      }
    };

    tryNotify();
  }, []);

  return null;
};

export default VisitNotifier;
