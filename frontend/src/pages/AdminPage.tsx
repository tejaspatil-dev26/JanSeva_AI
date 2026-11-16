import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Users, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Server, 
  TrendingUp, 
  Activity,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { Application, LanguageCode } from '../types';
import { api } from '../api';
import { translations } from '../translations';

interface AdminPageProps {
  language: LanguageCode;
}

export const AdminPage: React.FC<AdminPageProps> = ({ language }) => {
  const t = translations[language] || translations.en;
  const [metrics, setMetrics] = useState<any | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'kpi' | 'review_queue' | 'audit_logs'>('kpi');
  
  // Officer status updater state
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('Under Verification');
  const [officerRemarks, setOfficerRemarks] = useState('Documents physically verified with Tahsil record.');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [m, apps, logs] = await Promise.all([
        api.getAdminMetrics(),
        api.getAllAdminApplications(),
        api.getAuditLogs()
      ]);
      setMetrics(m);
      setApplications(apps);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: number) => {
    setUpdating(true);
    try {
      await api.updateApplicationStatus(
        appId,
        newStatus,
        officerRemarks,
        newStatus === 'Approved' ? 'DBT Bank Mandate Activated' : 'Physical Verification by Talathi'
      );
      setSelectedAppId(null);
      await loadAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
              {t.adminHeaderBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {t.adminTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.adminSubtitle}
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Activity className="w-4 h-4 text-[#0C382E]" />
          <span>{t.refreshLiveBtn}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'kpi' ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.kpiTabTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('review_queue')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'review_queue' ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.scrutinyQueueTabTitle} ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'audit_logs' ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.auditLogsTabTitle}</span>
        </button>
      </div>

      {/* TAB 1: METRICS */}
      {activeTab === 'kpi' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-500 block">{t.regCitizensLabel}</span>
              <p className="text-3xl font-black text-stone-900 mt-2">{metrics.total_registered_users}</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Active</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-500 block">{t.activeSchemesLabel}</span>
              <p className="text-3xl font-black text-stone-900 mt-2">{metrics.total_active_schemes}</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Central & State</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-500 block">{t.appsSubmittedLabel}</span>
              <p className="text-3xl font-black text-[#0C382E] mt-2">{metrics.submitted_applications}</p>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Transmitted</span>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-500 block">{t.ocrAccuracyLabel}</span>
              <p className="text-3xl font-black text-[#D97706] mt-2">{metrics.ocr_accuracy_rate}%</p>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">OCR Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">{t.statusBreakdownTitle}</h3>
              <div className="space-y-2 text-xs">
                {Object.entries(metrics.status_distribution || {}).map(([st, cnt]: any) => (
                  <div key={st} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                    <span className="font-medium text-stone-700">{st}</span>
                    <span className="font-bold font-mono text-stone-900">{cnt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">{t.systemHealthTitle}</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-semibold text-emerald-900">MahaSeva Portal Adapter</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-semibold text-emerald-900">Aadhaar Vault DPDP Masking Service</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">ENFORCED</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-semibold text-emerald-900">Playwright Browser Worker Service</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEW QUEUE */}
      {activeTab === 'review_queue' && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
                {t.awaitingReviewTitle}
              </h3>
              <span className="text-xs text-stone-500 font-medium">Click to update</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {applications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-stone-800">{app.application_reference_no}</span>
                      <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border">
                        {app.status}
                      </span>
                      {app.portal_acknowledgment_no && (
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-300">
                          Ack: {app.portal_acknowledgment_no}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{app.scheme?.name}</h4>
                    <p className="text-stone-500">{app.department} • Citizen ID #{app.user_id}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setNewStatus('Under Verification');
                        setOfficerRemarks('Taluka Revenue Officer desk verification in progress.');
                      }}
                      className="px-3 py-1.5 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-semibold rounded-lg transition"
                    >
                      {t.updateStatusBtn}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setNewStatus('Approved');
                        setOfficerRemarks('All eligibility documents verified. Direct Benefit Sanction approved.');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      {t.approveSanctionBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Modal */}
          {selectedAppId && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
                <h3 className="font-bold text-stone-900 text-base">Advance Application Status</h3>
                <p className="text-stone-500">
                  Officer action updates the citizen's application timeline and immediately triggers an in-app & WhatsApp alert.
                </p>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Under Verification">Under Verification</option>
                    <option value="Approved">Approved (Sanction Issued)</option>
                    <option value="Additional Documents Required">Additional Documents Required</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Officer Scrutiny Remarks</label>
                  <textarea
                    rows={3}
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppId(null)}
                    className="px-4 py-2 border border-stone-300 rounded-lg font-semibold hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedAppId)}
                    disabled={updating}
                    className="px-5 py-2 bg-[#0C382E] text-white rounded-lg font-bold"
                  >
                    {updating ? 'Recording Event...' : 'Record & Notify Citizen'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
              {t.auditLogsTabTitle}
            </h3>
            <span className="text-[11px] text-stone-500">DPDP Act Section 8 Accountability Log</span>
          </div>

          <div className="divide-y divide-stone-100 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-stone-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0C382E] font-sans text-xs">{log.action}</span>
                    <span className="text-[10px] text-stone-400">User #{log.user_id}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans">
                    Resource: {log.resource_type} ({log.resource_id})
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
