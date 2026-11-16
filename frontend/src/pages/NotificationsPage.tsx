import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NotificationItem, LanguageCode } from '../types';
import { api } from '../api';
import { translations } from '../translations';

interface NotificationsPageProps {
  language: LanguageCode;
  userId?: number;
  onRefreshUnreadCount?: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  language,
  userId = 1,
  onRefreshUnreadCount,
}) => {
  const t = translations[language] || translations.en;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'in_app' | 'dispatch_log'>('in_app');

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(userId);
      setNotifications(data);
      if (onRefreshUnreadCount) onRefreshUnreadCount();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(userId);
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOneRead = async (id: number) => {
    try {
      await api.markNotificationRead(id, userId);
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
              {t.notifHeaderBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {t.notifHeaderTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.notifHeaderSubtitle}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-[#0C382E]" />
          <span>{t.markAllReadBtn}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('in_app')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'in_app' ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t.inAppTabTitle} ({unreadCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch_log')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'dispatch_log' ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{t.dispatchLogTabTitle}</span>
        </button>
      </div>

      {/* TAB 1: IN-APP NOTIFICATIONS */}
      {activeTab === 'in_app' && (
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500">...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-xs">
              {t.noNotifsTitle}
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && handleMarkOneRead(notif.id)}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 cursor-pointer ${
                  !notif.is_read 
                    ? 'bg-amber-50/50 border-amber-200/80 shadow-xs' 
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.notification_type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notif.notification_type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{notif.title}</h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-stone-400 mt-2 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SIMULATED SMS & WHATSAPP LOG */}
      {activeTab === 'dispatch_log' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-1">
            <h4 className="font-bold text-stone-900">{t.multiChannelTitle}</h4>
            <p className="leading-relaxed">
              {t.multiChannelDesc}
            </p>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-white border border-stone-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-bold text-stone-800">{notif.title}</span>
                  <span className="text-[10px] text-stone-400">{new Date(notif.created_at).toLocaleTimeString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* WhatsApp Simulation */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="font-bold text-emerald-900 text-[11px] block">{t.whatsAppAlertLabel}</span>
                        <span className="text-[10px] text-emerald-700">Recipient: +91 98765 43210</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                      {notif.whatsapp_status || 'Delivered'}
                    </span>
                  </div>

                  {/* SMS Simulation */}
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-stone-700" />
                      <div>
                        <span className="font-bold text-stone-900 text-[11px] block">{t.govSmsLabel}</span>
                        <span className="text-[10px] text-stone-500">Sender ID: GOVMAH-JS</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-stone-700 text-white font-bold px-2 py-0.5 rounded">
                      {notif.sms_status || 'Delivered'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded">
                  "{notif.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
