/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { pwaUpdateService, PWAUpdateState } from '../services/pwaUpdateService';

export function usePWAUpdate() {
  const [updateState, setUpdateState] = useState<PWAUpdateState>(() => pwaUpdateService.getState());
  const [isChecking, setIsChecking] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaUpdateService.subscribe((state) => {
      setUpdateState(state);
    });
    return unsubscribe;
  }, []);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    setJustChecked(false);
    try {
      const res = await pwaUpdateService.checkForUpdates();
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 4000);
      return res.hasUpdate;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    await pwaUpdateService.applyUpdate();
  }, []);

  const forceHardRefresh = useCallback(async () => {
    await pwaUpdateService.forceHardRefresh();
  }, []);

  return {
    ...updateState,
    isChecking,
    justChecked,
    checkForUpdates,
    applyUpdate,
    forceHardRefresh,
  };
}
