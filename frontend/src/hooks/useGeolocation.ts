import { useState, useCallback } from 'react';

export interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface UseGeolocationReturn {
  location: Geolocation | null;
  error: string | null;
  isLoading: boolean;
  getLocation: () => Promise<Geolocation | null>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = useCallback(async (): Promise<Geolocation | null> => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: Geolocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(locationData);
          setIsLoading(false);
          resolve(locationData);
        },
        (err) => {
          let errorMessage = 'Error al obtener ubicación';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Ubicación no disponible';
              break;
            case err.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }
          setError(errorMessage);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { location, error, isLoading, getLocation };
};