import React from 'react';
import { ShieldCheck, Phone, ExternalLink } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface FooterProps {
  language: LanguageCode;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#0A261F] text-emerald-100 border-t border-emerald-900/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 border border-amber-500/40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" rx="16" fill="#0C382E" />
                  <path d="M50 18 L82 38 L82 72 L50 86 L18 72 L18 38 Z" fill="none" stroke="#D97706" strokeWidth="7" />
                  <circle cx="50" cy="52" r="14" fill="#D97706" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-white">{t.appName}</span>
            </div>
            <p className="text-emerald-200/80 leading-relaxed text-xs">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.dpdpCompliantBadge}</span>
            </div>
          </div>

          {/* Useful Citizen Portals */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">{t.officialPortalsTitle}</h4>
            <ul className="space-y-1.5 text-emerald-200/80">
              <li><a href="https://myscheme.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition flex items-center gap-1">myScheme Portal <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition flex items-center gap-1">PM-KISAN Samman Nidhi <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition flex items-center gap-1">MahaDBT (Maharashtra) <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://nsap.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition flex items-center gap-1">National Social Assistance (NSAP) <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li><a href="https://beneficiary.nha.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition flex items-center gap-1">Ayushman Bharat (PM-JAY) <ExternalLink className="w-2.5 h-2.5" /></a></li>
            </ul>
          </div>

          {/* National Citizen Helplines */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">{t.nationalHelplinesTitle}</h4>
            <ul className="space-y-1.5 text-emerald-200/80 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Kisan Call Center: <strong>1800-180-1551</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Women Helpline: <strong>181</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Senior Citizen Line: <strong>14567</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span>National Pension Line: <strong>14443</strong></span>
              </li>
            </ul>
          </div>

          {/* Privacy & Governance */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">{t.governanceTitle}</h4>
            <p className="text-emerald-200/80 text-[11px] leading-relaxed">
              {t.governanceDesc}
            </p>
            <div className="pt-2 text-[10px] text-stone-400">
              Technology Stack: FastAPI • React 19 • Playwright • SQLite/PostgreSQL
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-emerald-300/70">
          <p>{t.copyrightNotice}</p>
          <p>Tagline: "{t.tagline}"</p>
        </div>
      </div>
    </footer>
  );
};
