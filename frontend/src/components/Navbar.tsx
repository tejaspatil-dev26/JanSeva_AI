import React, { useState } from 'react';
import { 
  Bot, 
  FileText, 
  FolderCheck, 
  Bell, 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  Building2, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { LanguageCode, User } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentUser: User | null;
  unreadCount: number;
  onOpenOnboarding: () => void;
  onLaunchWidowDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  currentUser,
  unreadCount,
  onOpenOnboarding,
  onLaunchWidowDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  // Dedicated concise navbar items that never wrap or overflow
  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'assistant', label: t.navAssistant, icon: Bot, badge: 'AI' },
    { id: 'schemes', label: t.navSchemes, icon: FileText },
    { id: 'documents', label: t.navDocuments, icon: FolderCheck },
    { id: 'applications', label: t.navApplications, icon: ShieldCheck },
    { id: 'mock-portal', label: t.navPortal, icon: Building2 },
    { id: 'admin', label: t.navAdmin, icon: UserCheck },
  ];

  const languageOptions: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0C382E] text-white border-b border-[#165646] shadow-md">
      {/* Top Banner for Demo Quick Launch */}
      <div className="bg-[#D97706] text-white text-xs h-7 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span className="truncate">{t.topBannerNotice}</span>
        </div>
        <button 
          onClick={onLaunchWidowDemo}
          className="bg-stone-900/60 hover:bg-stone-900 text-amber-200 px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1 font-semibold transition shrink-0 ml-2"
        >
          <span>🎯 {t.quickDemoScenario}</span>
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 mr-2"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] flex items-center justify-center p-1.5 shadow-sm border border-amber-500/40 group-hover:scale-105 transition shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="16" fill="#0C382E" />
                <path d="M50 18 L82 38 L82 72 L50 86 L18 72 L18 38 Z" fill="none" stroke="#D97706" strokeWidth="7" />
                <circle cx="50" cy="52" r="14" fill="#D97706" />
                <circle cx="50" cy="52" r="4" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">{t.appName}</span>
                <span className="text-[9px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-wider">
                  {t.countryBadge}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium hidden sm:block leading-none mt-0.5">
                {t.navSubtagline}
              </p>
            </div>
          </div>

          {/* Center Desktop Nav Items - Perfectly Aligned and Centered */}
          <nav className="hidden md:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`h-9 px-2.5 xl:px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive 
                      ? 'bg-[#165646] text-white font-bold border border-emerald-500/40 shadow-xs' 
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-900/40 border border-transparent'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-500 text-stone-900 font-extrabold px-1.5 py-0.2 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Language Selector, Notification Bell, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-2">
            {/* Language Selector */}
            <div className="h-9 relative flex items-center bg-[#104438] border border-emerald-700/50 rounded-lg px-2 text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.code} value={opt.code} className="bg-[#0C382E] text-white">
                    {opt.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#104438] hover:bg-[#165646] text-emerald-100 transition relative shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Active Persona Pill */}
            <button
              onClick={onOpenOnboarding}
              className="h-9 flex items-center gap-1.5 bg-[#104438] hover:bg-[#165646] border border-emerald-700/60 rounded-lg px-2.5 text-xs text-left transition shrink-0"
              title="Edit Profile or Switch Persona"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] border border-amber-500/40 shrink-0">
                {currentUser?.full_name?.charAt(0) || 'C'}
              </div>
              <div className="hidden xl:block">
                <p className="font-semibold text-white leading-tight truncate max-w-[90px]">
                  {currentUser?.full_name?.includes('Savitribai') && language === 'mr' ? 'सावित्रीबाई' : (currentUser?.full_name ? currentUser.full_name.split(' ')[0] : (language === 'mr' ? 'सावित्रीबाई' : 'Savitribai'))}
                </p>
                <p className="text-[9px] text-amber-300/90 leading-none">
                  {currentUser?.profile?.is_widow ? t.farmerWidowPill : t.citizenPill}
                </p>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg bg-[#104438] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C382E] border-b border-[#165646] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold ${
                  isActive ? 'bg-[#165646] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/30'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
