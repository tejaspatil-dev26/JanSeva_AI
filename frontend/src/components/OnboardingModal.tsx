import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, User, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { User as UserType, LanguageCode } from '../types';
import { api } from '../api';
import { translations } from '../translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUserUpdated: (user: UserType) => void;
  language?: LanguageCode;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  language = 'en',
}) => {
  const t = translations[language] || translations.en;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Widow');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli');
  const [village, setVillage] = useState('Ambegaon');
  const [occupation, setOccupation] = useState('Small Agricultural Farmer');
  const [isFarmer, setIsFarmer] = useState(true);
  const [landAcres, setLandAcres] = useState('4.32');
  const [income, setIncome] = useState<number | ''>(48000);
  const [incomeCategory, setIncomeCategory] = useState('BPL');
  const [socialCategory, setSocialCategory] = useState('OBC');

  useEffect(() => {
    if (currentUser?.profile) {
      setFullName(currentUser.full_name || '');
      setAge(currentUser.profile.age || 47);
      setGender(currentUser.profile.gender || 'Female');
      setMaritalStatus(currentUser.profile.marital_status || 'Widow');
      setState(currentUser.profile.state || 'Maharashtra');
      setDistrict(currentUser.profile.district || 'Pune');
      setTaluka(currentUser.profile.taluka_or_subdistrict || 'Haveli');
      setVillage(currentUser.profile.village_or_city || 'Ambegaon');
      setOccupation(currentUser.profile.occupation || 'Farmer');
      setIsFarmer(currentUser.profile.is_farmer ?? true);
      setLandAcres(currentUser.profile.land_holding_acres || '4.32');
      setIncome(currentUser.profile.annual_income || 48000);
      setIncomeCategory(currentUser.profile.income_category || 'BPL');
      setSocialCategory(currentUser.profile.social_category || 'OBC');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSelectPreset = async (presetKey: string) => {
    setLoading(true);
    try {
      const updatedUser = await api.loadDemoPersona(presetKey);
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        age: age ? Number(age) : undefined,
        gender,
        marital_status: maritalStatus,
        is_widow: maritalStatus === 'Widow',
        state,
        district,
        taluka_or_subdistrict: taluka,
        village_or_city: village,
        occupation,
        is_farmer: isFarmer,
        land_holding_acres: landAcres,
        annual_income: income ? Number(income) : undefined,
        income_category: incomeCategory,
        social_category: socialCategory
      };
      await api.updateProfile(payload, currentUser?.id || 1);
      const refreshed = await api.getCurrentUser(currentUser?.id || 1);
      onUserUpdated(refreshed);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0C382E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              {t.onboardingBadge}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">{t.onboardingTitle}</h2>
          <p className="text-emerald-100/90 text-sm mt-1">
            {t.onboardingDesc}
          </p>

          {/* Quick Preset Buttons */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60">
            <p className="text-xs text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t.quickFillTitle}:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('widow')}
                className="bg-[#165646] hover:bg-[#1f735e] text-white text-xs px-3 py-1.5 rounded-lg border border-emerald-500/50 font-medium transition flex items-center gap-1"
              >
                <span>
                  {language === 'mr' ? '🌾 सावित्रीबाई पाटील, पुणे' : language === 'hi' ? '🌾 सावित्रीबाई पाटिल, पुणे' : language === 'gu' ? '🌾 સાવિત્રીબાઈ પાટીલ, પુણે' : language === 'ta' ? '🌾 சாவித்ரிபாய் பாட்டீல், புனே' : language === 'te' ? '🌾 సావిత్రిబాయి పాటిల్, పూణే' : language === 'bn' ? '🌾 সাবিত্রীবাই পাটিল, পুনে' : '🌾 Savitribai Patil (Farmer Widow, Pune)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('farmer')}
                className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 text-xs px-3 py-1.5 rounded-lg border border-emerald-700/60 transition font-medium"
              >
                <span>
                  {language === 'mr' ? '🚜 रामेश्वर, अल्पभूधारक शेतकरी' : language === 'hi' ? '🚜 रामेश्वर, लघु किसान' : language === 'gu' ? '🚜 રામેશ્વર, નાના ખેડૂત' : language === 'ta' ? '🚜 ராமேஸ்வரன், சிறு விவசாயி' : language === 'te' ? '🚜 రామేశ్వర్, చిన్న రైతు' : language === 'bn' ? '🚜 রামেশ্বর, ক্ষুদ্র কৃষক' : '🚜 Rameshwar (Small Farmer, Satara)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Steps Tab Indicators */}
        <div className="flex border-b border-stone-200 bg-[#FAF9F5] px-6 pt-3 text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${step === 1 ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.step1Tab}</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${step === 2 ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.step2Tab}</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${step === 3 ? 'border-[#0C382E] text-[#0C382E]' : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.step3Tab}</span>
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.fullNameLabel}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.ageLabel}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.genderLabel}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                >
                  <option value="Female">{t.genderFemale}</option>
                  <option value="Male">{t.genderMale}</option>
                  <option value="Other">{t.genderOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.maritalStatusLabel}</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                >
                  <option value="Widow">{t.widowOption}</option>
                  <option value="Married">{t.marriedOption}</option>
                  <option value="Single">{t.singleOption}</option>
                  <option value="Divorced">{t.divorcedOption}</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.stateLabel}</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.districtLabel}</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.talukaLabel}</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.villageLabel}</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.occupationLabel}</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.farmerQuestion}</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={isFarmer}
                      onChange={() => setIsFarmer(true)}
                      className="text-[#0C382E] focus:ring-[#0C382E]"
                    />
                    <span>{t.yesFarmer}</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFarmer}
                      onChange={() => setIsFarmer(false)}
                      className="text-[#0C382E] focus:ring-[#0C382E]"
                    />
                    <span>{t.noFarmer}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.landholdingLabel}</label>
                <input
                  type="text"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  placeholder="e.g. 4.32 Acres"
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.incomeLabel} (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.incomeCatLabel}</label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                >
                  <option value="BPL">{t.incomeBPL}</option>
                  <option value="EWS">{t.incomeEWS}</option>
                  <option value="APL">{t.incomeAPL}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.socialCatLabel}</label>
                <select
                  value={socialCategory}
                  onChange={(e) => setSocialCategory(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
                >
                  <option value="OBC">OBC</option>
                  <option value="General">{language === 'mr' ? 'खुला प्रवर्ग (General)' : language === 'hi' ? 'सामान्य वर्ग (General)' : 'General'}</option>
                  <option value="SC">{language === 'mr' ? 'अनुसूचित जाती (SC)' : language === 'hi' ? 'अनुसूचित जाति (SC)' : 'Scheduled Caste (SC)'}</option>
                  <option value="ST">{language === 'mr' ? 'अनुसूचित जमाती (ST)' : language === 'hi' ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribe (ST)'}</option>
                  <option value="NT">{language === 'mr' ? 'विमुक्त जाती व भटक्या जमाती (VJNT)' : language === 'hi' ? 'विमुक्त व घुमंतू जनजाति (NT)' : 'Nomadic Tribe (NT)'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
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
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-[#0C382E] hover:bg-[#165646] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-[#D97706] hover:bg-amber-600 text-white text-xs font-extrabold px-5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? '...' : t.saveProfileBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
