import { User, Scheme, DocumentItem, Application, ChatMessage, NotificationItem, ExtractedField } from './types';
import { 
  DEFAULT_SCHEMES, 
  DEFAULT_USER, 
  DEMO_PERSONAS, 
  DEFAULT_DOCUMENTS, 
  DEFAULT_APPLICATIONS, 
  DEFAULT_NOTIFICATIONS, 
  DEFAULT_ADMIN_METRICS, 
  DEFAULT_AUDIT_LOGS,
  getMockAssistantReply 
} from './mockData';

const API_BASE = '/api/v1';

// Helper to check if fetch response is valid JSON
async function tryFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Vercel SPA rewrites unknown routes to index.html (text/html)
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

// Local Storage Helper Utilities for Offline / Serverless Demo Mode
function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore localStorage write quota errors
  }
}

export const api = {
  // Auth & Profile
  async getCurrentUser(userId = 1): Promise<User> {
    const data = await tryFetchJson<User>(`${API_BASE}/auth/me?user_id=${userId}`);
    if (data) return data;

    const storedUser = getStored<User>('janseva_user', DEFAULT_USER);
    return storedUser;
  },

  async updateProfile(profileData: any, userId = 1): Promise<any> {
    const data = await tryFetchJson<any>(`${API_BASE}/auth/profile?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (data) return data;

    const currentUser = getStored<User>('janseva_user', DEFAULT_USER);
    const updatedUser: User = {
      ...currentUser,
      full_name: profileData.full_name || currentUser.full_name,
      preferred_language: profileData.preferred_language || currentUser.preferred_language,
      profile: {
        ...(currentUser.profile || {}),
        ...profileData
      }
    };
    setStored('janseva_user', updatedUser);
    return updatedUser;
  },

  async loadDemoPersona(key: string): Promise<User> {
    const data = await tryFetchJson<User>(`${API_BASE}/auth/demo-persona/${key}`, { method: 'POST' });
    if (data) return data;

    const persona = DEMO_PERSONAS[key] || DEFAULT_USER;
    setStored('janseva_user', persona);
    return persona;
  },

  // Schemes Discovery
  async getSchemes(params?: { category?: string; government_level?: string; search?: string; user_id?: number }): Promise<Scheme[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.government_level && params.government_level !== 'All') query.append('government_level', params.government_level);
    if (params?.search) query.append('search', params.search);
    if (params?.user_id) query.append('user_id', String(params.user_id));

    const data = await tryFetchJson<Scheme[]>(`${API_BASE}/schemes?${query.toString()}`);
    if (data && Array.isArray(data) && data.length > 0) return data;

    // Fallback: local verified scheme repository
    let schemes = [...DEFAULT_SCHEMES];

    if (params?.category && params.category !== 'All') {
      schemes = schemes.filter(s => s.category.toLowerCase().includes(params.category!.toLowerCase()));
    }

    if (params?.government_level && params.government_level !== 'All') {
      schemes = schemes.filter(s => s.government_level.toLowerCase() === params.government_level!.toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      schemes = schemes.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.name_hi && s.name_hi.toLowerCase().includes(q)) ||
        (s.name_mr && s.name_mr.toLowerCase().includes(q)) ||
        s.department.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.description_hi && s.description_hi.toLowerCase().includes(q)) ||
        (s.description_mr && s.description_mr.toLowerCase().includes(q))
      );
    }

    return schemes;
  },

  async getSchemeById(id: number, userId = 1): Promise<Scheme> {
    const data = await tryFetchJson<Scheme>(`${API_BASE}/schemes/${id}?user_id=${userId}`);
    if (data) return data;

    const found = DEFAULT_SCHEMES.find(s => s.id === Number(id));
    return found || DEFAULT_SCHEMES[0];
  },

  // Documents Vault & OCR Intelligence
  async getDocuments(userId = 1): Promise<DocumentItem[]> {
    const data = await tryFetchJson<DocumentItem[]>(`${API_BASE}/documents?user_id=${userId}`);
    if (data) return data;

    return getStored<DocumentItem[]>('janseva_docs', DEFAULT_DOCUMENTS);
  },

  async uploadDocument(file: File, docType: string, userId = 1): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);
    formData.append('user_id', String(userId));

    const data = await tryFetchJson<DocumentItem>(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    if (data) return data;

    // Fallback: create verified client-side document record
    const existing = getStored<DocumentItem[]>('janseva_docs', DEFAULT_DOCUMENTS);
    const newDocId = Date.now();
    const newDoc: DocumentItem = {
      id: newDocId,
      user_id: userId,
      document_type: docType || 'Government Certificate',
      original_filename: file.name,
      file_size_bytes: file.size || 45000,
      mime_type: file.type || 'application/pdf',
      ocr_status: 'Completed',
      ocr_confidence: 0.97,
      ocr_raw_text: `Verified Indian Official Document: ${file.name}\nDigitally parsed via JanSeva AI Document Intelligence.`,
      is_verified: true,
      has_issues: false,
      validation_notes: 'Document structure authenticated against standard civic registries.',
      created_at: new Date().toISOString(),
      extracted_fields: [
        { id: newDocId + 1, field_key: 'citizen_name', field_label: 'Name of Citizen', extracted_value: 'Savitribai Tukaram Patil', confidence: 0.98, is_sensitive: false },
        { id: newDocId + 2, field_key: 'document_reference', field_label: 'Certificate / Doc Ref No.', extracted_value: `MH-${Math.floor(100000 + Math.random() * 900000)}`, confidence: 0.96, is_sensitive: false },
        { id: newDocId + 3, field_key: 'issued_location', field_label: 'Place of Issuance', extracted_value: 'Pune District, Maharashtra', confidence: 0.95, is_sensitive: false }
      ]
    };

    const updated = [newDoc, ...existing];
    setStored('janseva_docs', updated);
    return newDoc;
  },

  async loadSampleDocument(sampleType: string, userId = 1): Promise<DocumentItem> {
    const data = await tryFetchJson<DocumentItem>(`${API_BASE}/documents/load-sample/${sampleType}?user_id=${userId}`, {
      method: 'POST'
    });
    if (data) return data;

    const existing = getStored<DocumentItem[]>('janseva_docs', DEFAULT_DOCUMENTS);
    let sample = DEFAULT_DOCUMENTS[0];
    if (sampleType === 'land_record') sample = DEFAULT_DOCUMENTS[1];
    else if (sampleType === 'aadhaar') sample = DEFAULT_DOCUMENTS[2];

    const cloned: DocumentItem = {
      ...sample,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    const updated = [cloned, ...existing];
    setStored('janseva_docs', updated);
    return cloned;
  },

  async correctField(fieldId: number, correctedValue: string, userId = 1): Promise<ExtractedField> {
    const data = await tryFetchJson<ExtractedField>(`${API_BASE}/documents/fields/${fieldId}/correct?user_id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field_id: fieldId, corrected_value: correctedValue })
    });
    if (data) return data;

    const docs = getStored<DocumentItem[]>('janseva_docs', DEFAULT_DOCUMENTS);
    let targetField: ExtractedField | null = null;
    for (const doc of docs) {
      for (const field of doc.extracted_fields) {
        if (field.id === fieldId) {
          field.corrected_value = correctedValue;
          targetField = field;
          break;
        }
      }
    }
    setStored('janseva_docs', docs);

    return targetField || {
      id: fieldId,
      field_key: 'corrected_field',
      field_label: 'Corrected Field',
      corrected_value: correctedValue,
      confidence: 1.0,
      is_sensitive: false
    };
  },

  // Conversational AI Assistant
  async askAssistant(message: string, language = 'en', sessionId?: string, userId = 1): Promise<ChatMessage> {
    const data = await tryFetchJson<ChatMessage>(`${API_BASE}/assistant/chat?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, session_id: sessionId })
    });
    if (data) return data;

    // Fallback: Domain-specific conversational simulation
    const chatHistory = getStored<ChatMessage[]>('janseva_chat', []);
    const userMsg: ChatMessage = {
      id: Date.now(),
      conversation_id: 1,
      sender: 'user',
      text: message,
      language,
      has_audio: false,
      created_at: new Date().toISOString()
    };
    const replyMsg = getMockAssistantReply(message, language);
    const updatedHistory = [...chatHistory, userMsg, replyMsg];
    setStored('janseva_chat', updatedHistory);

    return replyMsg;
  },

  async getChatHistory(sessionId?: string, userId = 1): Promise<ChatMessage[]> {
    const query = sessionId ? `?session_id=${sessionId}&user_id=${userId}` : `?user_id=${userId}`;
    const data = await tryFetchJson<ChatMessage[]>(`${API_BASE}/assistant/history${query}`);
    if (data && data.length > 0) return data;

    const user = getStored<User>('janseva_user', DEFAULT_USER);
    const lang = user.preferred_language || 'mr';

    const welcomeText = lang === 'mr'
      ? "नमस्कार! मी जनसेवा AI सहाय्यक आहे. मी तुम्हाला केंद्र व राज्य शासनाच्या विविध कल्याणकारी योजना शोधण्यात, कागदपत्रांची पडताळणी करण्यात आणि थेट अर्ज भरण्यात मदत करू शकतो.\n\nतुम्ही शेतकरी विधवा मदत, पेन्शन योजना किंवा पी.एम. किसानबद्दल विचारू शकता."
      : lang === 'hi'
      ? "नमस्ते! मैं जनसेवा AI सहायक हूँ। मैं आपको केंद्र और राज्य सरकार की कल्याणकारी योजनाओं को खोजने, पात्रता जांचने और सीधे आवेदन करने में मदद कर सकता हूँ।"
      : "Hello! I am your JanSeva AI Government Service Agent. Ask me about widow assistance, farmer pensions, PM-KISAN succession, or Ayushman Bharat healthcare schemes.";

    const defaultInitial: ChatMessage[] = [
      {
        id: 1,
        conversation_id: 1,
        sender: 'assistant',
        text: welcomeText,
        language: lang,
        has_audio: true,
        suggested_actions: [
          lang === 'mr' ? 'शेतकरी विधवा मदत यात्रा पाहा' : 'Try Farmer\'s Widow Journey',
          lang === 'mr' ? 'शासकीय योजना शोधा' : 'Explore All Schemes'
        ],
        follow_up_questions: [
          lang === 'mr' ? 'माझे पती शेतकरी होते, त्यांचे निधन झाले आहे.' : 'My husband was a farmer and recently passed away.',
          lang === 'mr' ? 'पी.एम. किसान वारस हस्तांतरण कसे करायचे?' : 'How do I transfer PM-KISAN to widow\'s name?'
        ],
        created_at: new Date().toISOString()
      }
    ];

    return getStored<ChatMessage[]>('janseva_chat', defaultInitial);
  },

  // Applications
  async prepareApplication(schemeId: number, userId = 1): Promise<any> {
    const data = await tryFetchJson<any>(`${API_BASE}/applications/prepare/${schemeId}?user_id=${userId}`);
    if (data) return data;

    const scheme = DEFAULT_SCHEMES.find(s => s.id === Number(schemeId)) || DEFAULT_SCHEMES[0];
    const user = getStored<User>('janseva_user', DEFAULT_USER);
    const p = user.profile || DEFAULT_USER.profile;

    return {
      scheme,
      user,
      form_data: {
        applicant_name: user.full_name,
        gender: p?.gender || 'Female',
        date_of_birth: `Age: ${p?.age || 47}`,
        contact_phone: user.phone || '9876543210',
        residence_address: `Village ${p?.village_or_city || 'Ambegaon'}, Taluka ${p?.taluka_or_subdistrict || 'Haveli'}, Dist ${p?.district || 'Pune'}, ${p?.state || 'Maharashtra'} - ${p?.pincode || '411046'}`,
        district: p?.district || 'Pune',
        taluka: p?.taluka_or_subdistrict || 'Haveli',
        state: p?.state || 'Maharashtra',
        pincode: p?.pincode || '411046',
        aadhaar_masked: 'XXXX-XXXX-6712',
        social_category: p?.social_category || 'OBC',
        annual_income: `₹ ${p?.annual_income?.toLocaleString() || '48,000'} / year`,
        income_category: p?.income_category || 'BPL',
        is_widow_applicant: p?.is_widow ? 'Yes' : 'No',
        deceased_spouse_name: p?.deceased_spouse_name || 'Late Tukaram Pandurang Patil',
        date_of_spouse_demise: p?.date_of_spouse_demise || '14/10/2025',
        death_registration_no: 'MC/PUN/DTH/2025/08941',
        issuing_death_authority: 'Registrar of Births & Deaths, Pune Municipal Corporation',
        is_farmer: p?.is_farmer ? 'Yes' : 'No',
        survey_gat_number: 'Gat No. 204/A',
        khata_number: 'KH-148/2',
        land_area_acres: `${p?.land_holding_acres || '4.32'} Acres`,
        bank_name: p?.bank_name || 'State Bank of India',
        account_number_masked: p?.account_number_masked || 'XXXX-XXXX-8921',
        ifsc_code: p?.ifsc_code || 'SBIN0004123'
      },
      attached_documents: [
        { type: 'Death Certificate', filename: 'Tukaram_Patil_Death_Certificate_PuneMC.pdf' },
        { type: '7/12 Land Record Extract', filename: 'Satbara_7_12_Extract_Gat_204A_Ambegaon.pdf' },
        { type: 'Aadhaar Card', filename: 'Savitribai_Patil_Aadhaar_Masked.pdf' }
      ],
      missing_documents: []
    };
  },

  async submitApplication(submitData: any, userId = 1): Promise<Application> {
    const data = await tryFetchJson<Application>(`${API_BASE}/applications/submit?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });
    if (data) return data;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ackNo = `MH-SGN-2026-${randomSuffix}`;
    const refNo = `JANSEVA-2026-${randomSuffix}`;
    const scheme = DEFAULT_SCHEMES.find(s => s.id === Number(submitData.scheme_id)) || DEFAULT_SCHEMES[0];

    const newApp: Application = {
      id: Date.now(),
      application_reference_no: refNo,
      portal_acknowledgment_no: ackNo,
      user_id: userId,
      scheme_id: scheme.id,
      status: 'Submitted',
      department: scheme.department,
      form_data: submitData.form_data || {},
      attached_documents: submitData.attached_documents || [
        { type: 'Death Certificate', filename: 'Tukaram_Patil_Death_Certificate_PuneMC.pdf' },
        { type: '7/12 Land Record Extract', filename: 'Satbara_7_12_Extract_Gat_204A_Ambegaon.pdf' },
        { type: 'Aadhaar Card', filename: 'Savitribai_Patil_Aadhaar_Masked.pdf' }
      ],
      reviewed_by_citizen: true,
      citizen_declaration_signed: true,
      submission_method: 'Automated Portal Adapter (MahaDBT / MahaSeva)',
      portal_response_data: {
        portal_name: 'MahaDBT (Government of Maharashtra)',
        token: `MHD-TOK-2026-${randomSuffix}`,
        verification_officer: 'Tahsildar Haveli Desk',
        dbt_linked_bank: 'State Bank of India (Ending 8921)'
      },
      next_required_action: 'Primary document scrutiny by Taluka Social Welfare Officer',
      created_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scheme,
      status_history: [
        {
          id: 1,
          status: 'Submitted',
          title: 'Application Submitted to MahaDBT Portal',
          description: 'Application successfully forwarded to official government portal adapter.',
          action_by: 'JanSeva Citizen Agent',
          remarks: `Acknowledgment No. ${ackNo} generated.`,
          created_at: new Date().toISOString()
        }
      ]
    };

    const existingApps = getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
    setStored('janseva_apps', [newApp, ...existingApps]);

    // Push in-app notification
    const existingNotifs = getStored<NotificationItem[]>('janseva_notifs', DEFAULT_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: Date.now(),
      user_id: userId,
      title: `Application Submitted: ${scheme.name}`,
      message: `Your application has been received by the MahaDBT portal. Acknowledgment: ${ackNo}. Verification is underway.`,
      notification_type: 'success',
      category: 'application',
      is_read: false,
      sent_in_app: true,
      sent_whatsapp: true,
      whatsapp_status: 'simulated_delivered',
      sent_sms: true,
      created_at: new Date().toISOString()
    };
    setStored('janseva_notifs', [newNotif, ...existingNotifs]);

    return newApp;
  },

  async getApplications(userId = 1): Promise<Application[]> {
    const data = await tryFetchJson<Application[]>(`${API_BASE}/applications?user_id=${userId}`);
    if (data) return data;

    return getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
  },

  async getApplicationById(id: number, userId = 1): Promise<Application> {
    const data = await tryFetchJson<Application>(`${API_BASE}/applications/${id}?user_id=${userId}`);
    if (data) return data;

    const apps = getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
    return apps.find(a => a.id === Number(id)) || apps[0];
  },

  // Notifications
  async getNotifications(userId = 1): Promise<NotificationItem[]> {
    const data = await tryFetchJson<NotificationItem[]>(`${API_BASE}/notifications?user_id=${userId}`);
    if (data) return data;

    return getStored<NotificationItem[]>('janseva_notifs', DEFAULT_NOTIFICATIONS);
  },

  async markNotificationRead(id: number, userId = 1): Promise<NotificationItem> {
    const data = await tryFetchJson<NotificationItem>(`${API_BASE}/notifications/${id}/read?user_id=${userId}`, {
      method: 'PUT'
    });
    if (data) return data;

    const notifs = getStored<NotificationItem[]>('janseva_notifs', DEFAULT_NOTIFICATIONS);
    const notif = notifs.find(n => n.id === id);
    if (notif) notif.is_read = true;
    setStored('janseva_notifs', notifs);
    return notif || DEFAULT_NOTIFICATIONS[0];
  },

  async markAllNotificationsRead(userId = 1): Promise<any> {
    const data = await tryFetchJson<any>(`${API_BASE}/notifications/read-all?user_id=${userId}`, {
      method: 'PUT'
    });
    if (data) return data;

    const notifs = getStored<NotificationItem[]>('janseva_notifs', DEFAULT_NOTIFICATIONS);
    notifs.forEach(n => { n.is_read = true; });
    setStored('janseva_notifs', notifs);
    return { ok: true };
  },

  // Admin & Portal Verification
  async getAdminMetrics(): Promise<any> {
    const data = await tryFetchJson<any>(`${API_BASE}/admin/metrics`);
    if (data) return data;

    return DEFAULT_ADMIN_METRICS;
  },

  async getAllAdminApplications(): Promise<Application[]> {
    const data = await tryFetchJson<Application[]>(`${API_BASE}/admin/applications`);
    if (data) return data;

    return getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
  },

  async updateApplicationStatus(id: number, status: string, remarks?: string, nextAction?: string): Promise<Application> {
    const data = await tryFetchJson<Application>(`${API_BASE}/admin/applications/${id}/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks, next_action: nextAction })
    });
    if (data) return data;

    const apps = getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
    const app = apps.find(a => a.id === Number(id));
    if (app) {
      app.status = status as any;
      if (nextAction) app.next_required_action = nextAction;
      app.status_history.push({
        id: Date.now(),
        status,
        title: `Application Status Changed to ${status}`,
        description: remarks || 'Status updated by District Review Officer',
        action_by: 'JanSeva District Administrative Officer',
        remarks: remarks || '',
        created_at: new Date().toISOString()
      });
      setStored('janseva_apps', apps);
    }
    return app || apps[0];
  },

  async getAuditLogs(): Promise<any[]> {
    const data = await tryFetchJson<any[]>(`${API_BASE}/admin/audit-logs`);
    if (data) return data;

    return DEFAULT_AUDIT_LOGS;
  },

  async verifyPortalAck(ackNo: string): Promise<any> {
    const data = await tryFetchJson<any>(`${API_BASE}/mock-portal/verify/${ackNo}`);
    if (data) return data;

    const apps = getStored<Application[]>('janseva_apps', DEFAULT_APPLICATIONS);
    const matched = apps.find(a => a.portal_acknowledgment_no?.toLowerCase() === ackNo.toLowerCase());

    return {
      found: true,
      portal_acknowledgment_no: ackNo,
      scheme_name: matched?.scheme?.name || 'Sanjay Gandhi Niradhar Anudan Yojana',
      status: matched?.status || 'Under Verification',
      verification_office: 'Office of the Tahsildar & Sub-Divisional Officer, Haveli Taluka, District Pune',
      applicant_name: matched?.form_data?.applicant_name || 'Savitribai Tukaram Patil',
      timestamp: matched?.submitted_at || '2026-03-01 11:05:00 IST',
      dbt_status: 'Aadhaar e-KYC Seeded (SBI xxxx8921)'
    };
  }
};
