import React, { useState } from "react";
import { GymProvider, useGym } from "./context/GymContext";
import Navbar from "./components/Navbar";
import OwnerDashboard from "./components/owner/OwnerDashboard";
import MemberPortal from "./components/member/MemberPortal";
import CounterKiosk from "./components/kiosk/CounterKiosk";
import SalesToolkit from "./components/sales/SalesToolkit";
import FollowUpModal from "./components/modals/FollowUpModal";
import NewMemberModal from "./components/modals/NewMemberModal";
import AssistedCheckinModal from "./components/modals/AssistedCheckinModal";
import SettingsModal from "./components/modals/SettingsModal";
import InvoiceModal from "./components/modals/InvoiceModal";
import BulkImportModal from "./components/modals/BulkImportModal";
import ManagePlansModal from "./components/modals/ManagePlansModal";
import ManageTrainersModal from "./components/modals/ManageTrainersModal";
import MobileCheckinPage from "./components/member/MobileCheckinPage";
import LoginPage from "./components/auth/LoginPage";

function MainContent() {
  const {
    currentView,
    activeModal,
    setActiveModal,
    activeInvoice,
    setActiveInvoice,
    authRole,
    logout,
    settings,
  } = useGym();
  const [followUpMember, setFollowUpMember] = useState(null);
  const [isScanMode, setIsScanMode] = useState(() => {
    return typeof window !== "undefined" && window.location.search.includes("action=scan_checkin");
  });

  if (isScanMode) {
    return (
      <MobileCheckinPage
        onContinueToApp={() => {
          if (typeof window !== "undefined") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          setIsScanMode(false);
        }}
      />
    );
  }

  // Counter Kiosk Mode (can run on dedicated tablet without login)
  if (currentView === "kiosk") {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 font-sans">
        <CounterKiosk />
      </div>
    );
  }

  // If not logged in, show secure Dual Login Page (Member Phone vs Owner PIN)
  if (!authRole) {
    return <LoginPage />;
  }

  // If Member role, render strictly Member Portal with secure header and Logout
  if (authRole === "member") {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
        <header className="border-b border-neutral-800 bg-neutral-900/95 sticky top-0 z-40 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-sm shadow-md shadow-amber-500/20">
                🏋️
              </div>
              <div>
                <h1 className="text-sm font-black text-white m-0 leading-tight">
                  {settings.gymName}
                </h1>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Member Digital Pass
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-xs font-bold text-red-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
          <MemberPortal />
        </main>

        {activeModal === "invoice" && activeInvoice && (
          <InvoiceModal
            payment={activeInvoice}
            onClose={() => {
              setActiveModal(null);
              setActiveInvoice(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === "owner" && (
          <OwnerDashboard onOpenFollowUpModal={(member) => setFollowUpMember(member)} />
        )}

        {currentView === "member" && <MemberPortal />}

        {currentView === "kiosk" && <CounterKiosk />}

        {currentView === "sales" && <SalesToolkit />}
      </main>

      {/* Global Modals */}
      {followUpMember && (
        <FollowUpModal
          member={followUpMember}
          onClose={() => setFollowUpMember(null)}
        />
      )}

      {activeModal === "newMember" && (
        <NewMemberModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "managePlans" && (
        <ManagePlansModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "manageTrainers" && (
        <ManageTrainersModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "bulkImport" && (
        <BulkImportModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "assistedCheckin" && (
        <AssistedCheckinModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "settings" && (
        <SettingsModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "invoice" && activeInvoice && (
        <InvoiceModal
          payment={activeInvoice}
          onClose={() => {
            setActiveModal(null);
            setActiveInvoice(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Gym Retention SaaS — Designed for Local Indian Gyms</span>
          <span className="text-neutral-400">Based on Roy Digital Blueprint</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <MainContent />
    </GymProvider>
  );
}
