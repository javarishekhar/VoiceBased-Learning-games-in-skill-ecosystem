
import { useState, useEffect } from 'react';

export interface NetworkStatus {
  online: boolean;
  type: string | null;
  effectiveType: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    type: null,
    effectiveType: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, online: false }));
    };

    const handleConnectionChange = (e: any) => {
      const { type, effectiveType } = e.target;
      setNetworkStatus(prev => ({
        ...prev,
        type,
        effectiveType
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for Connection API
    if ('connection' in navigator) {
      // @ts-ignore - Connection API might not be in typescript types but exists in some browsers
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        setNetworkStatus({
          online: navigator.onLine,
          // @ts-ignore
          type: connection.type || null,
          // @ts-ignore
          effectiveType: connection.effectiveType || null
        });

        connection.addEventListener('change', handleConnectionChange);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if ('connection' in navigator) {
        // @ts-ignore
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connection.removeEventListener('change', handleConnectionChange);
        }
      }
    };
  }, []);

  return networkStatus;
}
