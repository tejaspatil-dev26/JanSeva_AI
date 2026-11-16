export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'bn';

export interface UserProfile {
  id?: number;
  user_id?: number;
  age?: number;
  gender?: string;
  marital_status?: string;
  state?: string;
  district?: string;
  taluka_or_subdistrict?: string;
  village_or_city?: string;
  pincode?: string;
  occupation?: string;
  is_farmer?: boolean;
  land_holding_acres?: string;
  annual_income?: number;
  income_category?: string;
  social_category?: string;
  has_disability?: boolean;
  is_widow?: boolean;
  deceased_spouse_name?: string;
  date_of_spouse_demise?: string;
  dependents_count?: number;
  has_bank_account?: boolean;
  bank_name?: string;
  account_number_masked?: string;
  ifsc_code?: string;
}

export interface User {
  id: number;
  phone?: string;
  email?: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'officer';
  preferred_language: LanguageCode;
  is_active: boolean;
  profile?: UserProfile;
}

export interface Scheme {
  id: number;
  slug: string;
  name: string;
  name_hi?: string;
  name_mr?: string;
  department: string;
  government_level: 'Central' | 'State';
  state?: string;
  category: string;
  description: string;
  description_hi?: string;
  description_mr?: string;
  benefits: string;
  financial_benefit_amount?: string;
  eligibility_summary: string;
  required_documents: string[];
  application_procedure: string;
  official_portal_url: string;
  last_verified_date: string;
  is_active: boolean;
  eligibility_status?: 'Likely Eligible' | 'Possibly Eligible' | 'More Information Required' | 'Not Eligible';
  match_score?: number;
  missing_criteria?: string[];
  satisfied_criteria?: string[];
}

export interface ExtractedField {
  id: number;
  field_key: string;
  field_label: string;
  extracted_value?: string;
  corrected_value?: string;
  confidence: number;
  is_sensitive: boolean;
}

export interface DocumentItem {
  id: number;
  user_id: number;
  document_type: string;
  original_filename: string;
  file_size_bytes: number;
  mime_type: string;
  ocr_status: string;
  ocr_confidence: number;
  ocr_raw_text?: string;
  is_verified: boolean;
  has_issues: boolean;
  validation_notes?: string;
  created_at: string;
  extracted_fields: ExtractedField[];
}

export interface ApplicationStatusHistory {
  id: number;
  status: string;
  title: string;
  description?: string;
  action_by: string;
  remarks?: string;
  created_at: string;
}

export interface Application {
  id: number;
  application_reference_no: string;
  portal_acknowledgment_no?: string;
  user_id: number;
  scheme_id: number;
  status: 'Draft' | 'Ready for Review' | 'Submitted' | 'Under Verification' | 'Approved' | 'Rejected' | 'Additional Documents Required';
  department: string;
  form_data: Record<string, any>;
  attached_documents: any[];
  reviewed_by_citizen: boolean;
  citizen_declaration_signed: boolean;
  submission_method: string;
  portal_response_data?: Record<string, any>;
  screenshot_url?: string;
  next_required_action?: string;
  created_at: string;
  submitted_at?: string;
  updated_at: string;
  scheme?: Scheme;
  status_history: ApplicationStatusHistory[];
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  language: string;
  has_audio: boolean;
  suggested_actions?: string[];
  recommended_schemes?: any[];
  follow_up_questions?: string[];
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'alert';
  category: string;
  link?: string;
  is_read: boolean;
  sent_in_app: boolean;
  sent_whatsapp: boolean;
  whatsapp_status?: string;
  sent_sms: boolean;
  sms_status?: string;
  created_at: string;
}
