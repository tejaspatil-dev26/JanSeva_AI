import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  X
} from 'lucide-react';
import { Scheme, LanguageCode } from '../types';
import { translations } from '../translations';
import { api } from '../api';

interface SchemesPageProps {
  language: LanguageCode;
  userId?: number;
  onSelectSchemeForApplication: (schemeId: number) => void;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({
  language,
  userId = 1,
  onSelectSchemeForApplication,
}) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [activeSchemeDetail, setActiveSchemeDetail] = useState<Scheme | null>(null);
  const t = translations[language];

  const categories = [
    { key: 'All', label: t.catAll },
    { key: 'Pension & Social Security', label: t.catPension },
    { key: 'Agriculture', label: t.catAgri },
    { key: 'Social Welfare', label: t.catWelfare },
    { key: 'Healthcare', label: t.catHealth },
    { key: 'Housing', label: t.catHousing },
    { key: 'Women & Child Development', label: t.catWomenChild }
  ];

  const levels = [
    { key: 'All', label: t.allPortals },
    { key: 'Central', label: t.centralGovt },
    { key: 'State', label: t.stateGovt }
  ];

  const getLocalizedDept = (dept: string, lang: LanguageCode) => {
    if (lang === 'mr') {
      if (dept.includes('Social Justice')) return 'सामाजिक न्याय व विशेष सहाय्य विभाग, महाराष्ट्र शासन';
      if (dept.includes('Agriculture')) return 'कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार';
      if (dept.includes('Rural Development')) return 'ग्रामीण विकास मंत्रालय व राज्य समाजकल्याण विभाग';
      if (dept.includes('Housing')) return 'गृहनिर्माण व शहरी व्यवहार मंत्रालय, भारत सरकार';
      if (dept.includes('Health')) return 'राष्ट्रीय आरोग्य प्राधिकरण व कुटुंब कल्याण मंत्रालय';
      if (dept.includes('Women')) return 'महिला व बालविकास मंत्रालय, भारत सरकार';
    } else if (lang === 'hi') {
      if (dept.includes('Social Justice')) return 'सामाजिक न्याय एवं विशेष सहायता विभाग, महाराष्ट्र सरकार';
      if (dept.includes('Agriculture')) return 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार';
      if (dept.includes('Rural Development')) return 'ग्रामीण विकास मंत्रालय एवं राज्य समाज कल्याण विभाग';
      if (dept.includes('Housing')) return 'आवासन एवं शहरी कार्य मंत्रालय, भारत सरकार';
      if (dept.includes('Health')) return 'राष्ट्रीय स्वास्थ्य प्राधिकरण एवं परिवार कल्याण मंत्रालय';
      if (dept.includes('Women')) return 'महिला एवं बाल विकास मंत्रालय, भारत सरकार';
    } else if (lang === 'gu') {
      if (dept.includes('Social Justice')) return 'સામાજિક ન્યાય અને વિશેષ સહાય વિભાગ, મહારાષ્ટ્ર';
      if (dept.includes('Agriculture')) return 'કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય, ભારત સરકાર';
      if (dept.includes('Rural Development')) return 'ગ્રામીણ વિકાસ મંત્રાલય અને રાજ્ય સમાજ કલ્યાણ વિભાગ';
      if (dept.includes('Housing')) return 'શહેરી બાબતો અને આવાસ મંત્રાલય';
      if (dept.includes('Health')) return 'રાષ્ટ્રીય આરોગ્ય સત્તામંડળ';
    } else if (lang === 'ta') {
      if (dept.includes('Social Justice')) return 'சமூக நீதி மற்றும் சிறப்பு உதவித் துறை';
      if (dept.includes('Agriculture')) return 'விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்';
      if (dept.includes('Rural Development')) return 'ஊரக வளர்ச்சி அமைச்சகம் மற்றும் சமூக நலத் துறை';
    } else if (lang === 'te') {
      if (dept.includes('Social Justice')) return 'సామాజిక న్యాయం మరియు ప్రత్యేక సహాయ శాఖ';
      if (dept.includes('Agriculture')) return 'వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ';
      if (dept.includes('Rural Development')) return 'గ్రామీణ అభివృద్ధి మంత్రిత్వ శాఖ';
    } else if (lang === 'bn') {
      if (dept.includes('Social Justice')) return 'সামাজিক ন্যায় ও বিশেষ সহায়তা বিভাগ';
      if (dept.includes('Agriculture')) return 'কৃষি ও কৃষক কল্যাণ মন্ত্রক';
      if (dept.includes('Rural Development')) return 'পল্লী উন্নয়ন মন্ত্রক এবং সমাজকল্যাণ বিভাগ';
    }
    return dept;
  };

  const getLocalizedBenefit = (amount: string, lang: LanguageCode) => {
    if (!amount) return '';
    if (lang === 'mr') {
      return amount.replace('/ month', '/ दरमहा').replace('/ year', '/ दरवर्षी').replace('one-time', 'एकरकमी').replace('grant', 'अनुदान');
    } else if (lang === 'hi') {
      return amount.replace('/ month', '/ माह').replace('/ year', '/ वर्ष').replace('one-time', 'एकमुश्त').replace('grant', 'अनुदान');
    } else if (lang === 'gu') {
      return amount.replace('/ month', '/ મહિને').replace('/ year', '/ વર્ષે').replace('one-time', 'એકવાર').replace('grant', 'અનુદાન');
    } else if (lang === 'ta') {
      return amount.replace('/ month', '/ மாதம்').replace('/ year', '/ ஆண்டுக்கு').replace('one-time', 'ஒருமுறை').replace('grant', 'மானியம்');
    } else if (lang === 'te') {
      return amount.replace('/ month', '/ నెలకు').replace('/ year', '/ సంవత్సరానికి').replace('one-time', 'ఒక్కసారి').replace('grant', 'మంజూరు');
    } else if (lang === 'bn') {
      return amount.replace('/ month', '/ মাসে').replace('/ year', '/ বছরে').replace('one-time', 'এককালীন').replace('grant', 'অনুদান');
    }
    return amount;
  };

  const getLocalizedState = (state: string, lang: LanguageCode) => {
    if (state === 'Maharashtra') {
      if (lang === 'mr' || lang === 'hi') return 'महाराष्ट्र';
      if (lang === 'gu') return 'મહારાષ્ટ્ર';
      if (lang === 'ta') return 'மகாராஷ்டிரா';
      if (lang === 'te') return 'మహారాష్ట్ర';
      if (lang === 'bn') return 'মহারাষ্ট্র';
    }
    return state;
  };

  const getLocalizedDoc = (doc: string, lang: LanguageCode) => {
    if (lang === 'mr') {
      if (doc.includes('Death')) return 'मयत शेतकरी पतीचा मृत्यू दाखला';
      if (doc.includes('7/12') || doc.includes('Land')) return 'वारस नोंदीसह अद्ययावत ७/१२ शेतजमीन उतारा (फेरफार)';
      if (doc.includes('Aadhaar')) return 'वारसदार विधवा पत्नीचे आधार कार्ड';
      if (doc.includes('Bank')) return 'आधार संलग्न बँक खाते पासबुक';
      if (doc.includes('Heirship') || doc.includes('Pedigree')) return 'कुटुंब वंशावळ / वारस प्रमाणपत्र';
      if (doc.includes('Ration') || doc.includes('Income')) return 'उत्पन्नाचा दाखला / बीपीएल रेशन कार्ड';
    } else if (lang === 'hi') {
      if (doc.includes('Death')) return 'दिवंगत किसान का मृत्यु प्रमाण पत्र';
      if (doc.includes('7/12') || doc.includes('Land')) return 'वारिस प्रविष्टि सहित अद्यतन 7/12 भूमि रिकॉर्ड';
      if (doc.includes('Aadhaar')) return 'वारिस / विधवा का आधार कार्ड';
      if (doc.includes('Bank')) return 'आधार से जुड़ा बैंक खाता पासबुक';
      if (doc.includes('Heirship') || doc.includes('Pedigree')) return 'पारिवारिक वंशावली / वारिस प्रमाण पत्र';
      if (doc.includes('Ration') || doc.includes('Income')) return 'आय प्रमाण पत्र / बीपीएल राशन कार्ड';
    }
    return doc;
  };

  useEffect(() => {
    loadSchemes();
  }, [selectedCategory, selectedLevel, userId]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await api.getSchemes({
        category: selectedCategory,
        government_level: selectedLevel,
        search: search || undefined,
        user_id: userId
      });
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSchemes();
  };

  const getStatusBadge = (status?: string, score?: number) => {
    switch (status) {
      case 'Likely Eligible':
        return (
          <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.likelyEligible} ({score || 95}%)</span>
          </span>
        );
      case 'Possibly Eligible':
        return (
          <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>{t.possiblyEligible} ({score || 68}%)</span>
          </span>
        );
      case 'Not Eligible':
        return (
          <span className="text-[11px] font-medium bg-stone-100 text-stone-600 border border-stone-300 px-2 py-0.5 rounded-full">
            {t.notEligible}
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-500" />
            <span>{t.moreInfo}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#D97706] uppercase tracking-wider">
            {t.schemesHeaderBadge}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          {t.schemesHeaderTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {t.schemesHeaderSubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold rounded-xl transition"
          >
            {t.searchBtn}
          </button>
        </form>

        {/* Level and Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          {/* Government Level Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {levels.map((lvl) => (
              <button
                key={lvl.key}
                onClick={() => setSelectedLevel(lvl.key)}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedLevel === lvl.key ? 'bg-[#0C382E] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat.key 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' 
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          {t.evaluatingNotice}
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-xs">
          {t.noAppsTitle}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => {
            const displayName = language === 'mr' && scheme.name_mr ? scheme.name_mr : language === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name;
            const displayDesc = language === 'mr' && scheme.description_mr ? scheme.description_mr : language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description;
            return (
              <div
                key={scheme.id}
                className="bg-white border border-stone-200 hover:border-emerald-600/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      {scheme.government_level === 'Central' ? t.centralSchemeTag : t.stateSchemeTag} {scheme.state ? `(${getLocalizedState(scheme.state, language)})` : ''}
                    </span>
                    {getStatusBadge(scheme.eligibility_status, scheme.match_score)}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm leading-snug line-clamp-2">
                      {displayName}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{getLocalizedDept(scheme.department, language)}</p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {displayDesc}
                  </p>

                  {scheme.financial_benefit_amount && (
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2 text-xs font-bold text-amber-900">
                      {t.benefitLabel}: {getLocalizedBenefit(scheme.financial_benefit_amount, language)}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveSchemeDetail(scheme)}
                    className="text-xs font-bold text-stone-700 hover:text-[#0C382E] transition"
                  >
                    {t.viewDetailsBtn}
                  </button>

                  <button
                    data-testid="btn-apply-scheme"
                    onClick={() => onSelectSchemeForApplication(scheme.id)}
                    className="px-3.5 py-1.5 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1"
                  >
                    <span>{t.applyNow}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {activeSchemeDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-[#0C382E] text-white p-5 relative shrink-0">
              <button 
                onClick={() => setActiveSchemeDetail(null)}
                className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  {activeSchemeDetail.government_level === 'Central' ? t.centralSchemeTag : t.stateSchemeTag}
                </span>
                <span className="text-emerald-200 text-xs">{activeSchemeDetail.category}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {language === 'mr' && activeSchemeDetail.name_mr ? activeSchemeDetail.name_mr : language === 'hi' && activeSchemeDetail.name_hi ? activeSchemeDetail.name_hi : activeSchemeDetail.name}
              </h2>
              <p className="text-emerald-200/80 text-xs mt-0.5">{getLocalizedDept(activeSchemeDetail.department, language)}</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1">{t.schemeDetailsHeading}</h4>
                <p className="text-stone-700 leading-relaxed">
                  {language === 'mr' && activeSchemeDetail.description_mr ? activeSchemeDetail.description_mr : language === 'hi' && activeSchemeDetail.description_hi ? activeSchemeDetail.description_hi : activeSchemeDetail.description}
                </p>
              </div>

              <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1">
                <h4 className="font-bold text-amber-900 uppercase tracking-wider">{t.benefitsTitle}</h4>
                <p className="text-stone-800 font-medium">{getLocalizedBenefit(activeSchemeDetail.benefits, language)}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-1">{t.checkEligibility}</h4>
                <p className="text-stone-700 leading-relaxed">{activeSchemeDetail.eligibility_summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">{t.reqDocsStatusTitle}</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  {activeSchemeDetail.required_documents?.map((d, i) => (
                    <li key={i}>{getLocalizedDoc(d, language)}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-stone-500 text-[11px]">
                <span>{t.lastVerifiedLabel} {activeSchemeDetail.last_verified_date}</span>
                <a 
                  href={activeSchemeDetail.official_portal_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#0C382E] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>{t.officialPortalLink}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSchemeDetail(null)}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-100"
              >
                {t.closeBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = activeSchemeDetail.id;
                  setActiveSchemeDetail(null);
                  onSelectSchemeForApplication(id);
                }}
                className="px-5 py-2 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
              >
                <span>{t.prepareApplication}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
