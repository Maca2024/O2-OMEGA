import { useEffect, useRef, useState } from 'react';
import { BiometricService } from '../biometrics';
import { BiometricState } from '../types/biometrics';

interface UseBiometricsReturn {
  currentState: BiometricState | null;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  polyvagalState: 'ventral' | 'sympathetic' | 'dorsal';
}

export function useBiometrics(): UseBiometricsReturn {
  const serviceRef = useRef<BiometricService | null>(null);
  const [currentState, setCurrentState] = useState<BiometricState | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    serviceRef.current = new BiometricService();
    return () => {
      serviceRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!serviceRef.current || !isMonitoring) return;
    const unsubscribe = serviceRef.current.subscribe((state) => {
      setCurrentState(state);
    });
    serviceRef.current.startMonitoring();
    return () => {
      unsubscribe();
      serviceRef.current?.stopMonitoring();
    };
  }, [isMonitoring]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);

  return {
    currentState,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    polyvagalState: currentState?.polyvagalState ?? 'ventral',
  };
}
