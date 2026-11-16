import React from 'react';
import { 
  Bot, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  ChevronRight,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface LandingPageProps {
  language: LanguageCode;
  onGetStarted: () => void;
  onExploreSchemes: () => void;
  onLaunchWidowDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onGetStarted,
  onExploreSchemes,
  onLaunchWidowDemo,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0C382E] via-[#0E3D32] to-[#0A3027] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-600/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {t.heroHeadlineLine1}<br />
            <span className="text-amber-400 font-black">{t.heroHeadlineLine2}</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#D97706] hover:bg-amber-600 text-stone-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreSchemes}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-100 border border-emerald-600/50 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t.exploreSchemes}</span>
            </button>
          </div>

          {/* INTERACTIVE DEMO CALLOUT: THE FARMER'S WIDOW JOURNEY */}
          <div className="mt-8 pt-8 border-t border-emerald-800/60 max-w-2xl mx-auto">
            <div 
              onClick={onLaunchWidowDemo}
              className="bg-stone-900/80 hover:bg-stone-900 border-2 border-amber-500/60 hover:border-amber-400 rounded-2xl p-4 sm:p-5 text-left cursor-pointer transition shadow-xl group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/40">
                    🌾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                        {t.interactiveWalkthroughBadge}
                      </span>
                      <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.2 rounded">
                        {t.fullScenarioTag}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition">
                      {t.widowDemoTitle}
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {t.widowDemoQuote}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-amber-400 text-xs font-bold group-hover:translate-x-1 transition shrink-0">
                  <span>{t.startNow}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PHILOSOPHY QUOTE */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <blockquote className="bg-white border-l-4 border-[#0C382E] p-6 rounded-r-2xl shadow-xs text-stone-800">
          <p className="text-lg font-bold italic text-[#0C382E]">
            {t.quoteText}
          </p>
          <cite className="block text-xs text-stone-500 mt-2 font-semibold">
            {t.quoteAuthor}
          </cite>
        </blockquote>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold uppercase text-[#D97706] tracking-wider">{t.howItWorksBadge}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">{t.howItWorksTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: t.step1Title, desc: t.step1Desc, icon: Bot },
            { step: "02", title: t.step2Title, desc: t.step2Desc, icon: Cpu },
            { step: "03", title: t.step3Title, desc: t.step3Desc, icon: FileText },
            { step: "04", title: t.step4Title, desc: t.step4Desc, icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition relative group">
                <span className="text-3xl font-extrabold text-stone-200 group-hover:text-amber-500/30 transition absolute top-5 right-5">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0C382E] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUPPORTED SCHEMES HIGHLIGHT */}
      <section className="bg-[#FAF9F5] border-y border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">{t.featuredSchemesBadge}</span>
              <h2 className="text-2xl font-bold text-stone-900">{t.featuredSchemesTitle}</h2>
            </div>
            <button
              onClick={onExploreSchemes}
              className="text-xs font-bold text-[#0C382E] hover:text-[#165646] flex items-center gap-1 border-b border-[#0C382E] pb-0.5"
            >
              <span>{t.viewAllSchemes}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: language === 'mr' ? "संजय गांधी निराधार अनुदान योजना" : language === 'hi' ? "संजय गांधी निराधार अनुदान योजना" : "Sanjay Gandhi Niradhar Anudan Yojana",
                dept: language === 'mr' ? "सामाजिक न्याय व विशेष सहाय्य विभाग, महाराष्ट्र" : "Social Justice Dept, Maharashtra",
                benefit: language === 'mr' ? "₹१,५०० / दरमहा थेट पेन्शन" : "₹1,500 / month direct pension",
                category: t.catPension,
                tag: t.stateSchemeTag
              },
              {
                name: language === 'mr' ? "पी.एम. किसान वारस हक्क नोंद व हस्तांतरण" : language === 'hi' ? "पीएम किसान उत्तराधिकार / वारिस अंतरण" : "PM-KISAN Heirship & Succession Transfer",
                dept: language === 'mr' ? "कृषी व शेतकरी कल्याण मंत्रालय" : "Ministry of Agriculture, Govt of India",
                benefit: language === 'mr' ? "₹६,००० / दरवर्षी थेट सन्मान निधी" : "₹6,000 / year direct benefit",
                category: t.catAgri,
                tag: t.centralSchemeTag
              },
              {
                name: language === 'mr' ? "इंदिरा गांधी राष्ट्रीय विधवा निवृत्तीवेतन योजना" : language === 'hi' ? "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना" : "Indira Gandhi National Widow Pension (IGNWPS)",
                dept: language === 'mr' ? "ग्रामीण विकास मंत्रालय, भारत सरकार" : "Ministry of Rural Development",
                benefit: language === 'mr' ? "₹३०० - ₹१,००० / दरमहा पेन्शन" : "₹300 - ₹1,000 / month pension",
                category: t.catWelfare,
                tag: t.centralSchemeTag
              }
            ].map((sch, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    {sch.tag}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">{sch.category}</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{sch.name}</h4>
                <p className="text-xs text-stone-500">{sch.dept}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700">{sch.benefit}</span>
                  <button 
                    onClick={onExploreSchemes}
                    className="text-xs font-bold text-[#0C382E] hover:underline"
                  >
                    {t.checkEligibility} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY, PRIVACY & DPDP ACT COMPLIANCE */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#0C382E] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {t.securityBadge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            {t.securityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-6">
            {t.securitySubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-900/50 border border-emerald-700/60 p-4 rounded-xl space-y-1">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.sec1Title}
              </h4>
              <p className="text-emerald-100/80">
                {t.sec1Desc}
              </p>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700/60 p-4 rounded-xl space-y-1">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.sec2Title}
              </h4>
              <p className="text-emerald-100/80">
                {t.sec2Desc}
              </p>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700/60 p-4 rounded-xl space-y-1">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.sec3Title}
              </h4>
              <p className="text-emerald-100/80">
                {t.sec3Desc}
              </p>
            </div>

            <div className="bg-emerald-900/50 border border-emerald-700/60 p-4 rounded-xl space-y-1">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.sec4Title}
              </h4>
              <p className="text-emerald-100/80">
                {t.sec4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">{t.faqBadge}</span>
          <h2 className="text-2xl font-bold text-stone-900">{t.faqTitle}</h2>
        </div>

        <div className="space-y-3">
          {[
            { q: t.faq1Q, a: t.faq1A },
            { q: t.faq2Q, a: t.faq2A },
            { q: t.faq3Q, a: t.faq3A },
            { q: t.faq4Q, a: t.faq4A }
          ].map((item, idx) => (
            <details key={idx} className="bg-white border border-stone-200 rounded-xl p-4 text-xs group cursor-pointer">
              <summary className="font-bold text-stone-900 list-none flex items-center justify-between">
                <span>{item.q}</span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-open:rotate-90 transition" />
              </summary>
              <p className="text-stone-600 mt-2 pt-2 border-t border-stone-100 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
