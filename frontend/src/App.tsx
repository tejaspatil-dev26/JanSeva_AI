import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { ApplicationWizardModal } from './components/ApplicationWizardModal';

import { LandingPage } from './pages/LandingPage';
import { AssistantPage } from './pages/AssistantPage';
import { SchemesPage } from './pages/SchemesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MockPortalPage } from './pages/MockPortalPage';
import { AdminPage } from './pages/AdminPage';

import { LanguageCode, User, Scheme, DocumentItem, Application } from './types';
import { api } from './api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(1);

  // Modals state
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedSchemeForWizard, setSelectedSchemeForWizard] = useState<Scheme | null>(null);

  // Cross-page parameters
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | undefined>(undefined);
  const [portalVerifyAckNo, setPortalVerifyAckNo] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadUser();
    refreshNotificationsCount();
  }, []);

  const loadUser = async () => {
    try {
      const user = await api.getCurrentUser(1);
      setCurrentUser(user);
      if (user.preferred_language) {
        setLanguage(user.preferred_language as LanguageCode);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshNotificationsCount = async () => {
    try {
      const notifs = await api.getNotifications(currentUser?.id || 1);
      const unread = notifs.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLaunchWidowDemo = async () => {
    try {
      const user = await api.loadDemoPersona('widow');
      setCurrentUser(user);
    } catch (e) {
      console.error(e);
    }
    setAssistantInitialPrompt(
      language === 'mr'
        ? "माझे पती शेतकरी होते, त्यांचे नुकतेच निधन झाले. आम्हाला कोणती शासकीय मदत मिळू शकते?"
        : "My husband was a farmer and recently passed away. What government assistance can I receive?"
    );
    setCurrentTab('assistant');
  };

  const handleSelectSchemeForApplication = async (schemeId: number) => {
    try {
      const scheme = await api.getSchemeById(schemeId, currentUser?.id || 1);
      setSelectedSchemeForWizard(scheme);
      setWizardOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateToPortalVerify = (ackNo: string) => {
    setPortalVerifyAckNo(ackNo);
    setCurrentTab('mock-portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={(l) => {
          setLanguage(l);
          if (currentUser?.id) {
            api.updateProfile({ preferred_language: l }, currentUser.id).catch(console.error);
          }
        }}
        currentUser={currentUser}
        unreadCount={unreadCount}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onLaunchWidowDemo={handleLaunchWidowDemo}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            language={language}
            onGetStarted={() => setOnboardingOpen(true)}
            onExploreSchemes={() => setCurrentTab('schemes')}
            onLaunchWidowDemo={handleLaunchWidowDemo}
          />
        )}

        {currentTab === 'assistant' && (
          <AssistantPage
            language={language}
            currentUser={currentUser}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onSelectSchemeForApplication={handleSelectSchemeForApplication}
            initialPrompt={assistantInitialPrompt}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemesPage
            language={language}
            userId={currentUser?.id || 1}
            onSelectSchemeForApplication={handleSelectSchemeForApplication}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentsPage
            language={language}
            userId={currentUser?.id || 1}
            onOpenUploadModal={() => setUploadModalOpen(true)}
          />
        )}

        {currentTab === 'applications' && (
          <ApplicationsPage
            language={language}
            userId={currentUser?.id || 1}
            onNavigateToSchemes={() => setCurrentTab('schemes')}
            onNavigateToPortalVerify={handleNavigateToPortalVerify}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage
            language={language}
            userId={currentUser?.id || 1}
            onRefreshUnreadCount={refreshNotificationsCount}
          />
        )}

        {currentTab === 'mock-portal' && (
          <MockPortalPage
            language={language}
            initialAckNo={portalVerifyAckNo}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            language={language}
          />
        )}
      </main>

      <Footer language={language} />

      {/* MODALS */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        currentUser={currentUser}
        language={language}
        onUserUpdated={(u) => {
          setCurrentUser(u);
          if (u.preferred_language) setLanguage(u.preferred_language as LanguageCode);
        }}
      />

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        userId={currentUser?.id || 1}
        language={language}
        onDocumentAdded={() => {
          refreshNotificationsCount();
        }}
      />

      <ApplicationWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        scheme={selectedSchemeForWizard}
        userId={currentUser?.id || 1}
        language={language}
        onApplicationCreated={() => {
          refreshNotificationsCount();
        }}
        onNavigateToTracking={() => setCurrentTab('applications')}
      />
    </div>
  );
}

export default App;
