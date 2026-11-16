import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Server,
  Layers,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface MockPortalPageProps {
  language?: LanguageCode;
  initialAckNo?: string;
}

export const MockPortalPage: React.FC<MockPortalPageProps> = ({ 
  language = 'en', 
  initialAckNo 
}) => {
  const t = translations[language] || translations.en;
  const [ackInput, setAckInput] = useState(initialAckNo || 'MH-REV-WID-2026-53501');
  const [portalData, setPortalData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAckNo) {
      setAckInput(initialAckNo);
      handleVerify(initialAckNo);
    } else {
      handleVerify(ackInput);
    }
  }, [initialAckNo]);

  const handleVerify = async (ackToVerify?: string) => {
    const target = ackToVerify || ackInput;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.verifyPortalAck(target.trim());
      setPortalData(data);
    } catch (err: any) {
      setError(err.message || 'Portal verification failed');
      setPortalData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Official Testbed Header */}
      <div className="bg-[#0C382E] text-white rounded-2xl p-6 shadow-md border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-[#0C382E] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded uppercase">
                  {t.portalHeaderBadge}
                </span>
                <span className="text-emerald-300 text-xs">MahaDBT / National Citizen Services</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {t.portalTitle}
              </h1>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-emerald-900/60 border border-emerald-700/60 px-3 py-2 rounded-xl self-start sm:self-auto">
            <Server className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-stone-300 block text-[10px]">{t.gatewayStatusLabel}:</span>
              <strong className="text-emerald-300">ONLINE (28ms)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment Search Form */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-stone-900 text-sm">
          {t.verifySearchTitle}
        </h3>
        <p className="text-xs text-stone-500">
          {t.verifySearchDesc}
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row gap-2 pt-1"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={ackInput}
              onChange={(e) => setAckInput(e.target.value)}
              placeholder="e.g. MH-REV-WID-2026-53501 or MH-AGRI-KIS-2026-88192"
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C382E] font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {loading ? t.queryingBtn : t.verifyBtn}
          </button>
        </form>

        <div className="flex items-center gap-2 pt-2 text-xs text-stone-500">
          <span className="font-semibold text-stone-700">{t.quickTestIdsLabel}:</span>
          <button 
            type="button" 
            onClick={() => { setAckInput('MH-REV-WID-2026-53501'); handleVerify('MH-REV-WID-2026-53501'); }}
            className="text-[#0C382E] hover:underline font-mono font-bold"
          >
            MH-REV-WID-2026-53501
          </button>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => { setAckInput('MH-AGRI-KIS-2026-21049'); handleVerify('MH-AGRI-KIS-2026-21049'); }}
            className="text-[#0C382E] hover:underline font-mono font-bold"
          >
            MH-AGRI-KIS-2026-21049
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {portalData && (
        <div className="bg-white border-2 border-emerald-600/40 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-stone-900 text-lg">
                  {portalData.portal_name}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{portalData.department}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.refNoLabel}:</span>
              <span className="font-mono font-extrabold text-emerald-900 text-sm bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded inline-block mt-0.5">
                {portalData.acknowledgment_number}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.welfareSchemeLabel}</span>
              <p className="font-bold text-stone-900 text-sm">{portalData.scheme_name}</p>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.submissionChannelLabel}</span>
              <p className="font-bold text-stone-900">{portalData.submission_channel}</p>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.currentStageLabel}</span>
              <p className="font-bold text-amber-900">{portalData.current_portal_stage}</p>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.assignedOfficeLabel}</span>
              <p className="font-bold text-stone-900">{portalData.assigned_office}</p>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.beneficiaryVerificationLabel}</span>
              <p className="font-bold text-emerald-800">{portalData.beneficiary_verification_status}</p>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="text-stone-500 font-medium">{t.dbtStatusLabel}</span>
              <p className="font-bold text-emerald-800">{portalData.direct_benefit_status}</p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-[11px] text-stone-600 flex items-center justify-between">
            <span>Transmission: <strong>{portalData.transmission_timestamp}</strong></span>
            <span className="text-stone-400">Resolution: ~{portalData.estimated_resolution_days} working days</span>
          </div>
        </div>
      )}
    </div>
  );
};
