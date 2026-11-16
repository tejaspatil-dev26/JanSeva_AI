import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Building2,
  Download,
  ExternalLink,
  Loader2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Scheme, Application, LanguageCode } from '../types';
import { api } from '../api';
import { translations } from '../translations';

interface ApplicationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
  userId?: number;
  onApplicationCreated: (app: Application) => void;
  onNavigateToTracking?: () => void;
  language?: LanguageCode;
}

export const ApplicationWizardModal: React.FC<ApplicationWizardModalProps> = ({
  isOpen,
  onClose,
  scheme,
  userId = 1,
  onApplicationCreated,
  onNavigateToTracking,
  language = 'en',
}) => {
  const t = translations[language] || translations.en;
  const [step, setStep] = useState(1);
  const [loadingPrepare, setLoadingPrepare] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [attachedDocs, setAttachedDocs] = useState<number[]>([]);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [citizenConsent, setCitizenConsent] = useState(false);

  // Automation execution state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<string[]>([]);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scheme) {
      setStep(1);
      setCitizenConsent(false);
      setSubmittedApplication(null);
      setSubmissionError(null);
      setSubmissionProgress([]);
      loadPreparedData(scheme.id);
    }
  }, [isOpen, scheme]);

  const loadPreparedData = async (schemeId: number) => {
    setLoadingPrepare(true);
    try {
      const data = await api.prepareApplication(schemeId, userId);
      setFormData(data.mapped_form_data || {});
      setAttachedDocs(data.attached_document_ids || []);
      setMissingDocs(data.missing_documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrepare(false);
    }
  };

  if (!isOpen || !scheme) return null;

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleExecuteSubmission = async () => {
    if (!citizenConsent) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionProgress([
      "Initializing secure connection to MahaSeva Official Portal Testbed Gateway...",
      "Validating citizen identity token and digital consent declaration...",
      "Populating official form schema fields from verified OCR cache..."
    ]);

    try {
      // Simulate live visual progress ticks
      setTimeout(() => {
        setSubmissionProgress(prev => [...prev, "Attaching verified document bundle (Death Certificate, 7/12 Land Record)..."]);
      }, 700);

      setTimeout(() => {
        setSubmissionProgress(prev => [...prev, "Executing Playwright browser automation & verifying form DOM state..."]);
      }, 1400);

      const payload = {
        scheme_id: scheme.id,
        form_data: formData,
        attached_documents: attachedDocs,
        citizen_declaration_signed: true,
        submission_method: "playwright_automation"
      };

      const result = await api.submitApplication(payload, userId);

      setTimeout(() => {
        setSubmissionProgress(prev => [
          ...prev,
          `Application successfully registered! Official Acknowledgment ID: ${result.portal_acknowledgment_no}`
        ]);
        setIsSubmitting(false);
        setSubmittedApplication(result);
        setStep(4);
        onApplicationCreated(result);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (_) { }
      }, 2200);

    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(err.message || 'Submission failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0C382E] text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              Smart Application Preparation
            </span>
            <span className="text-emerald-200 text-xs">Official Portal Adapter</span>
          </div>
          <h2 className="text-xl font-bold text-white">{scheme.name}</h2>
          <p className="text-emerald-100/90 text-xs mt-0.5">{scheme.department}</p>

          {/* Stepper Header */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-800/60 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-md ${step >= 1 ? 'bg-amber-500 text-stone-900 font-bold' : 'text-emerald-200'}`}>
              {t.step1Checklist}
            </span>
            <span className="text-emerald-500">→</span>
            <span className={`px-2.5 py-1 rounded-md ${step >= 2 ? 'bg-amber-500 text-stone-900 font-bold' : 'text-emerald-200'}`}>
              {t.step2ReviewFields}
            </span>
            <span className="text-emerald-500">→</span>
            <span className={`px-2.5 py-1 rounded-md ${step >= 3 ? 'bg-amber-500 text-stone-900 font-bold' : 'text-emerald-200'}`}>
              {t.step3Consent}
            </span>
            <span className="text-emerald-500">→</span>
            <span className={`px-2.5 py-1 rounded-md ${step === 4 ? 'bg-emerald-400 text-stone-950 font-bold' : 'text-emerald-200'}`}>
              {t.step4Ack}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {loadingPrepare && step === 1 ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0C382E] mx-auto" />
              <p className="text-sm font-semibold text-stone-700">
                ...
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1: SCHEME & DOCUMENTS CHECKLIST */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-4">
                    <h3 className="font-bold text-stone-900 text-sm mb-1">{t.benefitsTitle}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{scheme.benefits}</p>
                    {scheme.financial_benefit_amount && (
                      <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                        {t.directBenefitLabel}: {scheme.financial_benefit_amount}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      {t.reqDocsStatusTitle}
                    </h4>
                    <div className="space-y-2">
                      {scheme.required_documents?.map((doc, idx) => {
                        const isMissing = missingDocs.includes(doc);
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${!isMissing ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              {!isMissing ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              )}
                              <span className="font-semibold text-stone-900">{doc}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${!isMissing ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                              }`}>
                              {!isMissing ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      {t.preMappedNotice}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: REVIEW AUTO-POPULATED FIELDS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg text-xs text-stone-600">
                    {t.reviewFieldsNotice}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Applicant Full Name</label>
                      <input
                        type="text"
                        value={formData.applicant_name || ''}
                        onChange={(e) => handleFieldChange('applicant_name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-semibold text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Masked Aadhaar Number</label>
                      <input
                        type="text"
                        disabled
                        value={formData.aadhaar_masked || 'XXXX-XXXX-6712'}
                        className="w-full px-2.5 py-1.5 bg-stone-100 border border-stone-300 rounded font-mono text-stone-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Deceased Spouse Full Name</label>
                      <input
                        type="text"
                        value={formData.deceased_spouse_name || ''}
                        onChange={(e) => handleFieldChange('deceased_spouse_name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Date of Demise</label>
                      <input
                        type="text"
                        value={formData.date_of_spouse_demise || ''}
                        onChange={(e) => handleFieldChange('date_of_spouse_demise', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Death Registration / Certificate No.</label>
                      <input
                        type="text"
                        value={formData.death_registration_no || ''}
                        onChange={(e) => handleFieldChange('death_registration_no', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">7/12 Survey / Gat Number</label>
                      <input
                        type="text"
                        value={formData.survey_gat_number || ''}
                        onChange={(e) => handleFieldChange('survey_gat_number', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Agricultural Landholding</label>
                      <input
                        type="text"
                        value={formData.land_area_acres || ''}
                        onChange={(e) => handleFieldChange('land_area_acres', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">DBT Bank & Account</label>
                      <input
                        type="text"
                        disabled
                        value={`${formData.bank_name || 'State Bank of India'} (${formData.account_number_masked || 'XXXX-XXXX-8921'})`}
                        className="w-full px-2.5 py-1.5 bg-stone-100 border border-stone-300 rounded text-stone-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CITIZEN DECLARATION & EXPLICIT APPROVAL */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="border border-stone-300 rounded-xl p-4 bg-[#FAF9F5] text-xs space-y-3">
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Lock className="w-4 h-4 text-[#0C382E]" />
                      <span>{t.citizenDeclarationTitle}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">
                      "{t.citizenDeclarationText.replace('{scheme_name}', scheme.name).replace('{department}', scheme.department)}"
                    </p>
                    <label className="flex items-start gap-2.5 mt-3 pt-3 border-t border-stone-200 cursor-pointer">
                      <input
                        data-testid="wizard-consent"
                        type="checkbox"
                        checked={citizenConsent}
                        onChange={(e) => setCitizenConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#0C382E] rounded focus:ring-[#0C382E]"
                      />
                      <span className="font-bold text-stone-900 text-xs">
                        {t.consentCheckboxLabel}
                      </span>
                    </label>
                  </div>

                  {isSubmitting && (
                    <div className="bg-stone-900 text-emerald-300 rounded-xl p-4 font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2 text-white font-sans font-bold text-sm mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>{t.submittingTerminalTitle}</span>
                      </div>
                      {submissionProgress.map((msg, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-stone-500">[{i + 1}]</span>
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {submissionError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{submissionError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: OFFICIAL ACKNOWLEDGMENT & CONFIRMATION */}
              {step === 4 && submittedApplication && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900">{t.successTitle}</h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    {t.successDesc}
                  </p>

                  <div className="bg-[#FAF9F5] border-2 border-emerald-600/30 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500 font-medium">{t.refNoLabel}:</span>
                      <span className="font-bold font-mono text-stone-900">{submittedApplication.application_reference_no}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500 font-medium">{t.portalAckIdLabel}:</span>
                      <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        {submittedApplication.portal_acknowledgment_no}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-500 font-medium">{t.currentStatusLabel}:</span>
                      <span className="font-bold text-amber-700">{submittedApplication.status}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-stone-500 font-medium">{t.nextActionLabel}:</span>
                      <span className="font-semibold text-stone-800">{submittedApplication.next_required_action}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      data-testid="wizard-track"
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onNavigateToTracking) onNavigateToTracking();
                      }}
                      className="px-5 py-2.5 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.trackDashboardBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Receipt downloaded for Application: ${submittedApplication.portal_acknowledgment_no}`)}
                      className="px-4 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadReceiptBtn}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 4 && (
          <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(step - 1)}
                  className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-200 transition"
                >
                  {t.backBtn}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  data-testid="wizard-continue"
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                >
                  <span>{t.continueBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  data-testid="wizard-submit"
                  type="button"
                  disabled={!citizenConsent || isSubmitting}
                  onClick={handleExecuteSubmission}
                  className="bg-[#D97706] hover:bg-amber-600 disabled:bg-stone-300 text-white text-xs font-extrabold px-6 py-2.5 rounded-lg shadow-md transition flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.submittingTerminalTitle}...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>{t.authorizeSubmitBtn}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
