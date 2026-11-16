import React, { useState, useEffect } from 'react';
import { 
  FolderCheck, 
  Upload, 
  FileText, 
  Edit3, 
  Sparkles,
  Lock,
  Calendar,
} from 'lucide-react';
import { DocumentItem, ExtractedField, LanguageCode } from '../types';
import { translations } from '../translations';
import { api } from '../api';

interface DocumentsPageProps {
  language: LanguageCode;
  userId?: number;
  onOpenUploadModal: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  language,
  userId = 1,
  onOpenUploadModal,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<ExtractedField | null>(null);
  const [correctedValue, setCorrectedValue] = useState('');
  const [savingField, setSavingField] = useState(false);
  const t = translations[language];

  useEffect(() => {
    loadDocs();
  }, [userId]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments(userId);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (field: ExtractedField) => {
    setEditingField(field);
    setCorrectedValue(field.corrected_value || field.extracted_value || '');
  };

  const handleSaveCorrection = async () => {
    if (!editingField) return;
    setSavingField(true);
    try {
      await api.correctField(editingField.id, correctedValue, userId);
      setEditingField(null);
      await loadDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingField(false);
    }
  };

  const handleQuickLoadSample = async (sampleKey: string) => {
    try {
      await api.loadSampleDocument(sampleKey, userId);
      await loadDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const getDocTypeLabel = (docType: string) => {
    if (language === 'mr') {
      if (docType.includes('Death')) return 'मृत्यू दाखला';
      if (docType.includes('7/12') || docType.includes('Land')) return '७/१२ शेतजमीन उतारा';
      if (docType.includes('Aadhaar')) return 'आधार कार्ड';
      if (docType.includes('Income')) return 'उत्पन्नाचा दाखला';
      if (docType.includes('Ration')) return 'रेशन कार्ड';
    } else if (language === 'hi') {
      if (docType.includes('Death')) return 'मृत्यु प्रमाण पत्र';
      if (docType.includes('7/12') || docType.includes('Land')) return '7/12 खतौनी भूमि रिकॉर्ड';
      if (docType.includes('Aadhaar')) return 'आधार कार्ड';
      if (docType.includes('Income')) return 'आय प्रमाण पत्र';
      if (docType.includes('Ration')) return 'राशन कार्ड';
    } else if (language === 'gu') {
      if (docType.includes('Death')) return 'મૃત્યુ પ્રમાણપત્ર';
      if (docType.includes('7/12') || docType.includes('Land')) return '૭/૧૨ જમીન રેકોર્ડ';
      if (docType.includes('Aadhaar')) return 'આધાર કાર્ડ';
    } else if (language === 'ta') {
      if (docType.includes('Death')) return 'இறப்புச் சான்றிதழ்';
      if (docType.includes('7/12') || docType.includes('Land')) return 'நில ஆவணங்கள் (பட்டா)';
      if (docType.includes('Aadhaar')) return 'ஆதார் அட்டை';
    } else if (language === 'te') {
      if (docType.includes('Death')) return 'మరణ ధృవీకరణ పత్రం';
      if (docType.includes('7/12') || docType.includes('Land')) return 'భూమి పట్టాదారు రికార్డు';
      if (docType.includes('Aadhaar')) return 'ఆధార్ కార్డు';
    } else if (language === 'bn') {
      if (docType.includes('Death')) return 'মৃত্যু শংসাপত্র';
      if (docType.includes('7/12') || docType.includes('Land')) return 'জমির খতিয়ান রেকর্ড';
      if (docType.includes('Aadhaar')) return 'আধার কার্ড';
    }
    return docType;
  };

  const getFieldLabel = (label: string) => {
    if (language === 'mr') {
      if (label.includes('Registration')) return 'नोंदणी क्रमांक';
      if (label.includes('Demise') || label.includes('Death')) return 'मृत्यूची तारीख';
      if (label.includes('Deceased') || label.includes('Name')) return 'दिवंगत व्यक्तीचे नाव';
      if (label.includes('District')) return 'जिल्हा';
      if (label.includes('Authority')) return 'दाखला देणारा अधिकारी';
      if (label.includes('Survey') || label.includes('Gat')) return 'गट क्रमांक';
      if (label.includes('Area') || label.includes('Land')) return 'जमीन क्षेत्रफळ (एकर)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'खातेदार शेतकरी';
      if (label.includes('Khata') || label.includes('Account')) return 'खाते क्रमांक';
      if (label.includes('Village') || label.includes('Taluka')) return 'गाव व तालुका';
      if (label.includes('Soil') || label.includes('Classification')) return 'जमीन प्रकार / वर्ग';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'मास्क केलेला आधार क्रमांक';
      if (label.includes('Gender')) return 'लिंग';
      if (label.includes('Birth') || label.includes('DOB')) return 'जन्मतारीख / जन्मवर्ष';
      if (label.includes('Address')) return 'पत्ता / निवास';
    } else if (language === 'hi') {
      if (label.includes('Registration')) return 'पंजीकरण संख्या';
      if (label.includes('Demise') || label.includes('Death')) return 'मृत्यु की तिथि';
      if (label.includes('Deceased') || label.includes('Name')) return 'दिवंगत व्यक्ति का नाम';
      if (label.includes('District')) return 'जिला';
      if (label.includes('Authority')) return 'जारीकर्ता प्राधिकारी';
      if (label.includes('Survey') || label.includes('Gat')) return 'खसरा / गाटा संख्या';
      if (label.includes('Area') || label.includes('Land')) return 'भूमि क्षेत्रफल (एकड़)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'किसान का नाम';
      if (label.includes('Khata') || label.includes('Account')) return 'खाता संख्या';
      if (label.includes('Village') || label.includes('Taluka')) return 'ग्राम एवं तहसील';
      if (label.includes('Soil') || label.includes('Classification')) return 'भूमि का प्रकार';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'सुरक्षित आधार संख्या';
      if (label.includes('Gender')) return 'लिंग';
      if (label.includes('Birth') || label.includes('DOB')) return 'जन्म तिथि / वर्ष';
      if (label.includes('Address')) return 'पता / निवास';
    } else if (language === 'gu') {
      if (label.includes('Registration')) return 'નોંધણી નંબર';
      if (label.includes('Demise') || label.includes('Death')) return 'અવસાનની તારીખ';
      if (label.includes('Deceased') || label.includes('Name')) return 'સ્વર્ગસ્થનું નામ';
      if (label.includes('District')) return 'જિલ્લો';
      if (label.includes('Authority')) return 'સક્ષમ અધિકારી';
      if (label.includes('Survey') || label.includes('Gat')) return 'સર્વે / બ્લોક નંબર';
      if (label.includes('Area') || label.includes('Land')) return 'જમીન ક્ષેત્રફળ (એકર)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'ખાતેદાર ખેડૂત';
      if (label.includes('Khata') || label.includes('Account')) return 'ખાતા નંબર';
      if (label.includes('Village') || label.includes('Taluka')) return 'ગામ અને તાલુકો';
      if (label.includes('Soil') || label.includes('Classification')) return 'જમીનનો પ્રકાર';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'સુરક્ષિત આધાર નંબર';
    } else if (language === 'ta') {
      if (label.includes('Registration')) return 'பதிவு எண்';
      if (label.includes('Demise') || label.includes('Death')) return 'இறந்த தேதி';
      if (label.includes('Deceased') || label.includes('Name')) return 'மறைந்தவர் பெயர்';
      if (label.includes('District')) return 'மாவட்டம்';
      if (label.includes('Authority')) return 'வழங்கிய அதிகாரி';
      if (label.includes('Survey') || label.includes('Gat')) return 'சர்வே / புல எண்';
      if (label.includes('Area') || label.includes('Land')) return 'நில அளவு (ஏக்கர்)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'விவசாயி பெயர்';
      if (label.includes('Khata') || label.includes('Account')) return 'பட்டா / கணக்கு எண்';
      if (label.includes('Village') || label.includes('Taluka')) return 'கிராமம் மற்றும் வட்டம்';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'பாதுகாக்கப்பட்ட ஆதார் எண்';
    } else if (language === 'te') {
      if (label.includes('Registration')) return 'నమోదు సంఖ్య';
      if (label.includes('Demise') || label.includes('Death')) return 'మరణించిన తేదీ';
      if (label.includes('Deceased') || label.includes('Name')) return 'మరణించిన వ్యక్తి పేరు';
      if (label.includes('District')) return 'జిల్లా';
      if (label.includes('Authority')) return 'జారీ చేసిన అధికారి';
      if (label.includes('Survey') || label.includes('Gat')) return 'సర్వే / ఖాతా సంఖ్య';
      if (label.includes('Area') || label.includes('Land')) return 'భూమి విస్తీర్ణం (ఎకరాలు)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'రైతు పేరు';
      if (label.includes('Khata') || label.includes('Account')) return 'ఖాతా సంఖ్య';
      if (label.includes('Village') || label.includes('Taluka')) return 'గ్రామం మరియు మండలం';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'సురక్షిత ఆధార్ నంబర్';
    } else if (language === 'bn') {
      if (label.includes('Registration')) return 'নিবন্ধন নম্বর';
      if (label.includes('Demise') || label.includes('Death')) return 'মৃত্যুর তারিখ';
      if (label.includes('Deceased') || label.includes('Name')) return 'প্রয়াত ব্যক্তির নাম';
      if (label.includes('District')) return 'জেলা';
      if (label.includes('Authority')) return 'প্রদানকারী কর্তৃপক্ষ';
      if (label.includes('Survey') || label.includes('Gat')) return 'দাগ / খতিয়ান নম্বর';
      if (label.includes('Area') || label.includes('Land')) return 'জমির পরিমাণ (একর)';
      if (label.includes('Holder') || label.includes('Farmer')) return 'কৃষকের নাম';
      if (label.includes('Khata') || label.includes('Account')) return 'হিসাব নম্বর';
      if (label.includes('Village') || label.includes('Taluka')) return 'গ্রাম ও ব্লক';
      if (label.includes('Masked Aadhaar') || label.includes('Aadhaar')) return 'মাস্কযুক্ত আধার নম্বর';
    }
    return label;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
              {t.docsHeaderBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {t.docsHeaderTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.docsHeaderSubtitle}
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-5 py-2.5 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>{t.uploadDocBtn}</span>
        </button>
      </div>

      {/* Instant Test Bar */}
      <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs text-stone-800 font-semibold">
            {t.instantSamplesTitle}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            data-testid="sample-death-cert"
            onClick={() => handleQuickLoadSample('death_cert')}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 transition"
          >
            {t.sampleDeathCertBtn}
          </button>
          <button
            data-testid="sample-land-record"
            onClick={() => handleQuickLoadSample('land_record')}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 transition"
          >
            {t.sampleLandRecordBtn}
          </button>
          <button
            data-testid="sample-aadhaar"
            onClick={() => handleQuickLoadSample('aadhaar')}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 transition"
          >
            {t.sampleAadhaarBtn}
          </button>
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          {t.evaluatingNotice}
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center space-y-3">
          <FolderCheck className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">{t.noDocsTitle}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {t.noDocsDesc}
          </p>
          <button
            onClick={onOpenUploadModal}
            className="mt-2 px-5 py-2 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs"
          >
            {t.uploadNowBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0C382E] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                        {getDocTypeLabel(doc.document_type)}
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        {t.ocrVerifiedLabel} ({Math.round(doc.ocr_confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{doc.original_filename}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div>
                <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  {t.extractedFieldsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {doc.extracted_fields.map((field) => (
                    <div
                      key={field.id}
                      className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3 text-xs flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">{getFieldLabel(field.field_label)}</span>
                        {field.is_sensitive && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> {t.maskedBadge}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-stone-900 break-words">
                        {field.corrected_value || field.extracted_value}
                      </p>
                      <div className="pt-1 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-700 font-semibold">
                          {t.confidenceLabel} {Math.round(field.confidence * 100)}%
                        </span>
                        <button
                          onClick={() => handleStartEdit(field)}
                          className="text-[#0C382E] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>{t.editBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {doc.validation_notes && (
                <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <strong>{t.noteLabel}:</strong> {t.verifiedDocFormatNotice}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Field Correction Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">{t.editFieldModalTitle}</h3>
            <p className="text-xs text-stone-500">
              {t.editFieldModalDesc} (<strong>{editingField.field_label}</strong>)
            </p>
            <input
              type="text"
              value={correctedValue}
              onChange={(e) => setCorrectedValue(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold hover:bg-stone-100"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                disabled={savingField}
                className="px-5 py-2 bg-[#0C382E] hover:bg-[#165646] text-white rounded-lg text-xs font-bold"
              >
                {savingField ? '...' : t.saveCorrectionBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
