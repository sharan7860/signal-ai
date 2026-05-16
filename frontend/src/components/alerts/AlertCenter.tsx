import React, { useState, useEffect, useCallback, useRef } from 'react';
import AlertBell from './AlertBell';
import AlertDrawer from './AlertDrawer';
import { alertService, Alert } from '../../services/alertService';
import { toast } from 'sonner';

const POLL_INTERVAL = 30_000;

const AlertCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const prevAlertIdsRef = useRef<Set<string>>(new Set());

  const fetchAlerts = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await alertService.getAlerts();

      // Show a toast for each NEW high-priority unread alert
      data.alerts.forEach((a) => {
        if (!a.read && a.priority >= 4 && !prevAlertIdsRef.current.has(a.id)) {
          toast.warning(a.title, {
            description: a.message,
            icon: '⚡',
            duration: 5000,
          });
        }
      });

      prevAlertIdsRef.current = new Set(data.alerts.map((a) => a.id));
      setAlerts(data.alerts);
      setUnreadCount(data.unread_count);
    } catch {
      // Silent fail – backend may not be running or network issue
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchAlerts();
    const id = setInterval(() => fetchAlerts(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchAlerts]);

  const handleMarkRead = async (id: string) => {
    try {
      await alertService.markAsRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error('Could not dismiss alert');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await alertService.markAllAsRead();
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      setUnreadCount(0);
      toast.success('All signals cleared');
    } catch {
      toast.error('Could not clear signals');
    }
  };

  return (
    <>
      <AlertBell
        count={unreadCount}
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
      />

      <AlertDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        alerts={alerts}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onRefresh={() => fetchAlerts()}
        isLoading={isLoading}
        unreadCount={unreadCount}
      />
    </>
  );
};

export default AlertCenter;
