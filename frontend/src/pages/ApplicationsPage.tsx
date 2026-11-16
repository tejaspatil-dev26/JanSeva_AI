import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  Download, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { Application, LanguageCode } from '../types';
import { api } from '../api';
import { translations } from '../translations';

interface ApplicationsPageProps {
  language: LanguageCode;
  userId?: number;
  onNavigateToSchemes?: () => void;
  onNavigateToPortalVerify?: (ackNo: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  language,
  userId = 1,
  onNavigateToSchemes,
  onNavigateToPortalVerify,
}) => {
  const t = translations[language] || translations.en;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    loadApplications();
  }, [userId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications(userId);
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Verification':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Ready for Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Approved':
        return t.statusApproved;
      case 'Submitted':
        return t.statusSubmitted;
      case 'Under Verification':
        return t.statusUnderVerification;
      case 'Ready for Review':
        return t.statusReadyForReview;
      case 'Draft':
        return t.statusDraft;
      case 'Rejected':
        return t.statusRejected;
      case 'Additional Documents Required':
        return t.statusDocsRequired;
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
              {t.appsHeaderBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {t.appsHeaderTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.appsHeaderSubtitle}
          </p>
        </div>

        {onNavigateToSchemes && (
          <button
            onClick={onNavigateToSchemes}
            className="px-5 py-2.5 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.applyNewSchemeBtn}</span>
          </button>
        )}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          ...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">{t.noAppsTitle}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {t.noAppsDesc}
          </p>
          {onNavigateToSchemes && (
            <button
              onClick={onNavigateToSchemes}
              className="mt-2 px-5 py-2 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              {t.exploreSchemesBtn}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-stone-200 hover:border-emerald-600/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-600">
                      {t.refNoPrefix}: {app.application_reference_no}
                    </span>
                    {app.portal_acknowledgment_no && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                        {t.ackNoPrefix}: {app.portal_acknowledgment_no}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {language === 'mr' && app.scheme?.name_mr ? app.scheme.name_mr : language === 'hi' && app.scheme?.name_hi ? app.scheme.name_hi : app.scheme?.name || 'Welfare Scheme Application'}
                  </h3>
                  <p className="text-xs text-stone-500">{app.department}</p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                  {app.portal_acknowledgment_no && onNavigateToPortalVerify && (
                    <button
                      onClick={() => onNavigateToPortalVerify(app.portal_acknowledgment_no || '')}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 text-stone-600" />
                      <span>{t.verifyOnPortalBtn}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-4 py-1.5 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1"
                  >
                    <span>{t.viewTimelineBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Next Action Box */}
              {app.next_required_action && (
                <div className="bg-[#FAF9F5] border border-amber-200/80 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-stone-500 font-medium">{t.nextMilestoneLabel}: </span>
                      <strong className="text-stone-900">{app.next_required_action}</strong>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {t.submittedOnLabel}: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Application Detail & Tracking Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0C382E] text-white p-5 relative shrink-0">
              <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40"
              >
                <X className="w-5 h-5" />
              </button>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mb-1 inline-block ${getStatusColor(selectedApp.status)}`}>
                {getStatusLabel(selectedApp.status)}
              </span>
              <h2 className="text-lg font-bold text-white">
                {language === 'mr' && selectedApp.scheme?.name_mr ? selectedApp.scheme.name_mr : language === 'hi' && selectedApp.scheme?.name_hi ? selectedApp.scheme.name_hi : selectedApp.scheme?.name}
              </h2>
              <p className="text-emerald-200 text-xs">{t.ackNoPrefix}: {selectedApp.portal_acknowledgment_no}</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Timeline Section */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-3">
                  {t.timelineTitle}
                </h4>
                <div className="space-y-4 relative pl-4 border-l-2 border-emerald-600/40 ml-2">
                  {selectedApp.status_history?.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full absolute -left-[23px] top-1 border-2 border-white" />
                      <div className="flex items-center justify-between text-stone-400 text-[10px] mb-0.5">
                        <span className="font-bold text-stone-700">{hist.action_by}</span>
                        <span>{new Date(hist.created_at).toLocaleString()}</span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-xs">{hist.title}</h5>
                      <p className="text-stone-600 mt-0.5">{hist.description}</p>
                      {hist.remarks && (
                        <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                          <strong>Note:</strong> {hist.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitted Form Payload */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">
                  {t.formPayloadTitle}
                </h4>
                <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3 divide-y divide-stone-200/60">
                  {Object.entries(selectedApp.form_data || {}).map(([k, v]) => (
                    <div key={k} className="py-1.5 flex justify-between gap-4">
                      <span className="text-stone-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="font-semibold text-stone-900 text-right">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-stone-500 font-mono">
                {t.permanentRefLabel}: {selectedApp.application_reference_no}
              </span>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-[#0C382E] text-white text-xs font-bold rounded-lg"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
