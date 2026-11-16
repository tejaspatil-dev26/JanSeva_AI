import { User, Scheme, DocumentItem, Application, ChatMessage, NotificationItem, ExtractedField } from './types';

const API_BASE = '/api/v1';

export const api = {
  // Auth & Profile
  async getCurrentUser(userId = 1): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async updateProfile(data: any, userId = 1): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/profile?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async loadDemoPersona(key: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/demo-persona/${key}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to switch persona');
    return res.json();
  },

  // Schemes
  async getSchemes(params?: { category?: string; government_level?: string; search?: string; user_id?: number }): Promise<Scheme[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.government_level && params.government_level !== 'All') query.append('government_level', params.government_level);
    if (params?.search) query.append('search', params.search);
    if (params?.user_id) query.append('user_id', String(params.user_id));

    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return res.json();
  },

  async getSchemeById(id: number, userId = 1): Promise<Scheme> {
    const res = await fetch(`${API_BASE}/schemes/${id}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch scheme');
    return res.json();
  },

  // Documents
  async getDocuments(userId = 1): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/documents?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async uploadDocument(file: File, docType: string, userId = 1): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);
    formData.append('user_id', String(userId));

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async loadSampleDocument(sampleType: string, userId = 1): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/load-sample/${sampleType}?user_id=${userId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to load sample document');
    return res.json();
  },

  async correctField(fieldId: number, correctedValue: string, userId = 1): Promise<ExtractedField> {
    const res = await fetch(`${API_BASE}/documents/fields/${fieldId}/correct?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_id: fieldId, corrected_value: correctedValue })
    });
    if (!res.ok) throw new Error('Failed to correct field');
    return res.json();
  },

  // Assistant
  async askAssistant(message: string, language = 'en', sessionId?: string, userId = 1): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/assistant/chat?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, session_id: sessionId })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getChatHistory(sessionId?: string, userId = 1): Promise<ChatMessage[]> {
    const query = sessionId ? `?session_id=${sessionId}&user_id=${userId}` : `?user_id=${userId}`;
    const res = await fetch(`${API_BASE}/assistant/history${query}`);
    if (!res.ok) throw new Error('Failed to get chat history');
    return res.json();
  },

  // Applications
  async prepareApplication(schemeId: number, userId = 1): Promise<any> {
    const res = await fetch(`${API_BASE}/applications/prepare/${schemeId}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to prepare application');
    return res.json();
  },

  async submitApplication(data: any, userId = 1): Promise<Application> {
    const res = await fetch(`${API_BASE}/applications/submit?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit application');
    }
    return res.json();
  },

  async getApplications(userId = 1): Promise<Application[]> {
    const res = await fetch(`${API_BASE}/applications?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async getApplicationById(id: number, userId = 1): Promise<Application> {
    const res = await fetch(`${API_BASE}/applications/${id}?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch application');
    return res.json();
  },

  // Notifications
  async getNotifications(userId = 1): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: number, userId = 1): Promise<NotificationItem> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read?user_id=${userId}`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Failed to mark read');
    return res.json();
  },

  async markAllNotificationsRead(userId = 1): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/read-all?user_id=${userId}`, {
      method: 'PUT'
    });
    return res.json();
  },

  // Admin & Portal
  async getAdminMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return res.json();
  },

  async getAllAdminApplications(): Promise<Application[]> {
    const res = await fetch(`${API_BASE}/admin/applications`);
    if (!res.ok) throw new Error('Failed to fetch admin applications');
    return res.json();
  },

  async updateApplicationStatus(id: number, status: string, remarks?: string, nextAction?: string): Promise<Application> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks, next_action: nextAction })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async getAuditLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async verifyPortalAck(ackNo: string): Promise<any> {
    const res = await fetch(`${API_BASE}/mock-portal/verify/${ackNo}`);
    if (!res.ok) throw new Error('Failed to verify acknowledgment on portal');
    return res.json();
  }
};
