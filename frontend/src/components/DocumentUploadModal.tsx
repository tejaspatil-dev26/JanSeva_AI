import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { api } from '../api';
import { DocumentItem, LanguageCode } from '../types';
import { translations } from '../translations';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: DocumentItem) => void;
  userId?: number;
  language?: LanguageCode;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
  userId = 1,
  language = 'en',
}) => {
  const t = translations[language] || translations.en;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Death Certificate');
  const [loading, setLoading] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<DocumentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const doc = await api.uploadDocument(selectedFile, documentType, userId);
      setExtractedPreview(doc);
      onDocumentAdded(doc);
    } catch (err: any) {
      setError(err.message || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async (sampleKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await api.loadSampleDocument(sampleKey, userId);
      setExtractedPreview(doc);
      onDocumentAdded(doc);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0C382E] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              {t.docsHeaderBadge}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{t.docsHeaderTitle}</h2>
          <p className="text-emerald-100/90 text-xs mt-1">
            {t.docsHeaderSubtitle}
          </p>

          {/* Quick Sample Test Buttons */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60">
            <p className="text-xs text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t.instantSamplesTitle}:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('death_cert')}
                className="bg-[#165646] hover:bg-[#1f735e] text-white text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/50 font-medium transition"
              >
                📜 {t.sampleDeathCertBtn}
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('land_record')}
                className="bg-[#165646] hover:bg-[#1f735e] text-white text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/50 font-medium transition"
              >
                🌾 {t.sampleLandRecordBtn}
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('aadhaar')}
                className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-700/60 font-medium transition"
              >
                🪪 {t.sampleAadhaarBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!extractedPreview ? (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Document Category</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                >
                  <option value="Death Certificate">Death Certificate (मृत्यू दाखला)</option>
                  <option value="7/12 Land Record Extract">7/12 Land Record Extract (सातबारा उतारा)</option>
                  <option value="Aadhaar Card">Aadhaar Card (आधार कार्ड)</option>
                  <option value="Income Certificate">Income Certificate (उत्पन्नाचा दाखला)</option>
                  <option value="Ration Card">Ration Card (रेशन कार्ड)</option>
                  <option value="Bank Passbook">Bank Account Passbook (बँक पासबुक)</option>
                </select>
              </div>

              {/* Drag Drop Area */}
              <div className="border-2 border-dashed border-stone-300 hover:border-[#0C382E] rounded-xl p-6 text-center cursor-pointer bg-stone-50 transition">
                <input
                  type="file"
                  id="doc-file-input"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="doc-file-input" className="cursor-pointer block">
                  <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">
                    {selectedFile ? selectedFile.name : 'Click to select PDF, JPG or PNG file'}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Supported formats: PDF, JPEG, PNG (Max 10 MB)</p>
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aadhaar Privacy Guarantee:</strong> In accordance with UIDAI regulations and Digital Personal Data Protection (DPDP) Act 2023, Aadhaar numbers are automatically masked (`XXXX-XXXX-1234`) upon ingestion.
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || loading}
                className="w-full bg-[#0C382E] hover:bg-[#165646] disabled:bg-stone-300 text-white font-bold text-sm py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Document with OCR...' : 'Upload & Extract Document'}
              </button>
            </form>
          ) : (
            /* Extraction Preview */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-900 text-sm">{extractedPreview.document_type} Extracted</h3>
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    OCR Confidence: <strong>{Math.round(extractedPreview.ocr_confidence * 100)}%</strong> • File: {extractedPreview.original_filename}
                  </p>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Verified</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Extracted Administrative Fields</h4>
                <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 overflow-hidden text-xs">
                  {extractedPreview.extracted_fields.map((f) => (
                    <div key={f.id} className="p-2.5 flex items-center justify-between hover:bg-stone-50">
                      <div>
                        <span className="text-stone-500 font-medium">{f.field_label}</span>
                        <p className="font-semibold text-stone-900 mt-0.5">{f.extracted_value}</p>
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        {Math.round(f.confidence * 100)}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExtractedPreview(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-semibold"
                >
                  Upload Another Document
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#D97706] hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Done & Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
