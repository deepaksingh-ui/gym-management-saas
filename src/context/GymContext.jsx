import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_GYM_SETTINGS,
  MEMBERSHIP_PLANS,
  TRAINERS,
  ADD_ONS,
  INITIAL_MEMBERS,
  INITIAL_CHECKINS,
  INITIAL_PAYMENTS,
  PRESET_DIET_PLANS,
  PRESET_WORKOUT_ROUTINES,
} from "../data/mockGymData";

const GymContext = createContext(null);

export function GymProvider({ children }) {
  // LocalStorage helper
  const loadStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [settings, setSettings] = useState(() => loadStored("fitzone_settings", DEFAULT_GYM_SETTINGS));
  const [members, setMembers] = useState(() => loadStored("fitzone_members", INITIAL_MEMBERS));
  const [checkIns, setCheckIns] = useState(() => loadStored("fitzone_checkins", INITIAL_CHECKINS));
  const [payments, setPayments] = useState(() => loadStored("fitzone_payments", INITIAL_PAYMENTS));
  const [addOns, setAddOns] = useState(() => loadStored("fitzone_addons", ADD_ONS));
  const [plans, setPlans] = useState(() => loadStored("fitzone_plans", MEMBERSHIP_PLANS));
  const [trainers, setTrainers] = useState(() => loadStored("fitzone_trainers", TRAINERS));
  const [dietPlans, setDietPlans] = useState(() => loadStored("fitzone_diet_plans", PRESET_DIET_PLANS));
  const [workoutRoutines, setWorkoutRoutines] = useState(() => loadStored("fitzone_workout_routines", PRESET_WORKOUT_ROUTINES));
  
  // App navigation & persona state
  const [authRole, setAuthRole] = useState(() => localStorage.getItem("fitzone_auth_role") || null);
  const [currentView, setCurrentView] = useState("owner"); // 'owner' | 'member' | 'kiosk' | 'sales'
  const [selectedMemberId, setSelectedMemberId] = useState(() => localStorage.getItem("fitzone_auth_member_id") || "mem-101");
  const [currentKioskToken, setCurrentKioskToken] = useState(() => "TOKEN-" + Math.floor(100000 + Math.random() * 900000));
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'newMember' | 'invoice' | 'assistedCheckin' | null
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("fitzone_theme") || "light");

  useEffect(() => {
    localStorage.setItem("fitzone_theme", theme);
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("fitzone_settings", JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem("fitzone_members", JSON.stringify(members));
  }, [members]);
  useEffect(() => {
    localStorage.setItem("fitzone_checkins", JSON.stringify(checkIns));
  }, [checkIns]);
  useEffect(() => {
    localStorage.setItem("fitzone_payments", JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem("fitzone_addons", JSON.stringify(addOns));
  }, [addOns]);
  useEffect(() => {
    localStorage.setItem("fitzone_plans", JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem("fitzone_trainers", JSON.stringify(trainers));
  }, [trainers]);
  useEffect(() => {
    localStorage.setItem("fitzone_diet_plans", JSON.stringify(dietPlans));
  }, [dietPlans]);
  useEffect(() => {
    localStorage.setItem("fitzone_workout_routines", JSON.stringify(workoutRoutines));
  }, [workoutRoutines]);

  // Sync to backend file database (gym-database.json) if server is active
  useEffect(() => {
    const payload = { settings, members, checkIns, payments, addOns, plans, trainers };
    const timer = setTimeout(() => {
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }, 1200);
    return () => clearTimeout(timer);
  }, [settings, members, checkIns, payments, addOns, plans, trainers]);

  // 1-Click Backup Export
  const exportDatabaseBackup = () => {
    const fullDb = { settings, members, checkIns, payments, addOns, plans, trainers, exportedAt: new Date().toISOString() };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDb, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `${(settings.gymName || "gym").replace(/[^a-zA-Z0-9]/g, "_")}_database_backup.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 1-Click Backup Restore
  const restoreDatabaseBackup = (importedDb) => {
    if (importedDb.settings) setSettings(importedDb.settings);
    if (importedDb.members) setMembers(importedDb.members);
    if (importedDb.checkIns) setCheckIns(importedDb.checkIns);
    if (importedDb.payments) setPayments(importedDb.payments);
    if (importedDb.addOns) setAddOns(importedDb.addOns);
    if (importedDb.plans) setPlans(importedDb.plans);
    if (importedDb.trainers) setTrainers(importedDb.trainers);
  };

  const loginAdmin = (pin) => {
    const validPin = settings.adminPin || "1234";
    if (String(pin).trim() === String(validPin).trim()) {
      setAuthRole("admin");
      setCurrentView("owner");
      localStorage.setItem("fitzone_auth_role", "admin");
      return { success: true };
    }
    return { success: false, message: "Galat Security PIN! (Default Owner PIN is 1234)" };
  };

  const loginMember = (phone) => {
    const clean = phone.replace(/[^0-9]/g, "");
    if (!clean || clean.length < 5) {
      return { success: false, message: "Kripya valid mobile number enter karein!" };
    }
    const found = members.find((m) => m.phone.replace(/[^0-9]/g, "").includes(clean));
    if (found) {
      setAuthRole("member");
      setSelectedMemberId(found.id);
      setCurrentView("member");
      localStorage.setItem("fitzone_auth_role", "member");
      localStorage.setItem("fitzone_auth_member_id", found.id);
      return { success: true, member: found };
    }
    return {
      success: false,
      message: `Mobile number ${phone} gym record mein nahi mila! Please gym counter se contact karein.`,
    };
  };

  const logout = () => {
    setAuthRole(null);
    setCurrentView("owner");
    localStorage.removeItem("fitzone_auth_role");
    localStorage.removeItem("fitzone_auth_member_id");
  };

  const addPlan = (newPlan) => {
    const id = "plan-" + Date.now();
    const created = { ...newPlan, id };
    setPlans((prev) => [...prev, created]);
    return created;
  };

  const updatePlan = (id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlan = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const addTrainer = (newTrainer) => {
    const id = "tr-" + Date.now();
    const created = {
      id,
      name: newTrainer.name,
      specialty: newTrainer.specialty || "General Strength & Cardio",
      phone: newTrainer.phone || "+91 98000 00000",
      rating: 5.0,
      activeClients: 0,
    };
    setTrainers((prev) => [...prev, created]);
    return created;
  };

  const updateTrainer = (id, updates) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTrainer = (id) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateMember = (memberId, updates) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return { ...m, ...updates };
        }
        return m;
      })
    );
  };

  const addAddOn = (newAddOn) => {
    const id = "addon-" + Date.now();
    const created = {
      id,
      name: newAddOn.name,
      type: newAddOn.type || "product",
      category: newAddOn.category || "Supplements",
      price: Number(newAddOn.price) || 0,
      mrp: Number(newAddOn.mrp) || Number(newAddOn.price) || 0,
      stock: Number(newAddOn.stock) || 10,
      description: newAddOn.description || "Fitness supplement / protein product",
      validityDays: Number(newAddOn.validityDays) || 0,
    };
    setAddOns((prev) => [created, ...prev]);
    return created;
  };

  const updateAddOn = (id, updates) => {
    setAddOns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteAddOn = (id) => {
    setAddOns((prev) => prev.filter((item) => item.id !== id));
  };

  const restockAddOn = (id, quantity = 5) => {
    setAddOns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: (item.stock || 0) + quantity } : item
      )
    );
  };

  // Periodic refresh for Kiosk QR Token (every 30 seconds for anti-screenshot integrity)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKioskToken("TOKEN-" + Math.floor(100000 + Math.random() * 900000));
    }, (settings.qrRefreshSeconds || 30) * 1000);
    return () => clearInterval(interval);
  }, [settings.qrRefreshSeconds]);

  // Current selected member object
  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0];

  // Recalculate Member Statuses & Absent Days dynamically based on dates
  const todayStr = new Date().toISOString().split("T")[0];

  // ACTIONS

  // 1. Check-in logic (QR Scan or Assisted)
  const processCheckIn = (memberId, method = "QR Scan", reason = "") => {
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      return { success: false, message: "Member not found!" };
    }

    if (member.status === "paused") {
      return { success: false, message: "Membership is currently PAUSED. Unfreeze at front-desk." };
    }

    if (member.status === "expired" || new Date(member.expiryDate) < new Date(todayStr)) {
      return { success: false, message: "Membership has EXPIRED! Please renew at counter or app." };
    }

    // Duplicate Check: Check if already checked in today
    const alreadyCheckedIn = checkIns.some(
      (c) => c.memberId === memberId && c.date === todayStr
    );
    if (alreadyCheckedIn) {
      return {
        success: false,
        isDuplicate: true,
        message: `${member.name} has already checked in today! (Duplicate scan blocked)`,
      };
    }

    // Success check-in
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newCheckIn = {
      id: "chk-" + Date.now(),
      memberId: member.id,
      memberName: member.name,
      time: timeStr,
      date: todayStr,
      method,
      status: "Success",
      reason: reason || undefined,
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);

    // Update Member streak & stats
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            streak: (m.streak || 0) + 1,
            totalVisits: (m.totalVisits || 0) + 1,
            lastCheckIn: todayStr,
            lastCheckInTime: timeStr,
            absentDays: 0,
            followUpOutcome: undefined, // Clears red-list outcome since member returned!
          };
        }
        return m;
      })
    );

    return {
      success: true,
      message: `Welcome to ${settings.gymName}, ${member.name}! Streak: ${member.streak + 1} days 🔥`,
      member,
    };
  };

  // 2. Mark Follow-Up Outcome (No-Show Red List)
  const markFollowUp = (memberId, outcome, notes, nextActionDate) => {
    const dateStr = new Date().toISOString().split("T")[0];
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            followUpOutcome: outcome,
            followUpNotes: notes,
            lastFollowUpDate: dateStr,
            nextActionDate: nextActionDate || undefined,
          };
        }
        return m;
      })
    );
  };

  // 3. Renew Membership
  const renewMembership = (memberId, planId, paymentMethod = "UPI") => {
    const member = members.find((m) => m.id === memberId);
    const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
    if (!member || !plan) return { success: false, message: "Invalid member or plan" };

    // Calculate new expiry date: if already expired, start from today; if still active, add to existing expiry
    const baseDate = new Date(member.expiryDate) > new Date(todayStr)
      ? new Date(member.expiryDate)
      : new Date(todayStr);

    const newExpiry = new Date(baseDate);
    newExpiry.setMonth(newExpiry.getMonth() + plan.durationMonths);
    const newExpiryStr = newExpiry.toISOString().split("T")[0];

    const receiptNo = "REC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const newPayment = {
      id: "pay-" + Date.now(),
      memberId: member.id,
      memberName: member.name,
      amount: plan.price,
      planName: plan.name,
      date: todayStr,
      method: paymentMethod,
      status: "Verified",
      receiptNo,
    };

    setPayments((prev) => [newPayment, ...prev]);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            planId: plan.id,
            expiryDate: newExpiryStr,
            status: "active",
          };
        }
        return m;
      })
    );

    setActiveInvoice(newPayment);
    setActiveModal("invoice");

    return {
      success: true,
      receiptNo,
      newExpiryDate: newExpiryStr,
      payment: newPayment,
    };
  };

  // 4. Order Add-On (PT, Diet, Supplements)
  const orderAddOn = (memberId, addOnId, paymentMethod = "UPI (Counter)") => {
    const member = members.find((m) => m.id === memberId);
    const item = addOns.find((a) => a.id === addOnId);
    if (!member || !item) return { success: false, message: "Invalid order" };

    if (item.stock !== undefined && item.stock <= 0) {
      return { success: false, message: "This item is currently out of stock! Please restock." };
    }

    // Decrement stock
    if (item.stock !== undefined) {
      setAddOns((prev) =>
        prev.map((a) => (a.id === addOnId ? { ...a, stock: Math.max(0, a.stock - 1) } : a))
      );
    }

    // If PT, increase member's ptBalance
    if (item.type === "pt") {
      const sessions = item.id.includes("24") ? 24 : 12;
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, ptBalance: (m.ptBalance || 0) + sessions } : m))
      );
    }

    // If Diet Plan, activate custom diet plan & workout split
    if (item.type === "diet" || item.id === "addon-diet-plan") {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                dietPlanId: m.dietPlanId || "diet-hypertrophy",
                workoutSplitId: m.workoutSplitId || "split-5day-hypertrophy",
                notes: (m.notes ? m.notes + " | " : "") + `Custom Diet Plan Activated on ${todayStr}`,
              }
            : m
        )
      );
    }

    const receiptNo = "REC-SUPP-" + Math.floor(1000 + Math.random() * 9000);
    const newPayment = {
      id: "pay-" + Date.now(),
      memberId: member.id,
      memberName: member.name,
      amount: item.price,
      planName: item.name,
      date: todayStr,
      method: paymentMethod,
      status: "Verified",
      receiptNo,
    };

    setPayments((prev) => [newPayment, ...prev]);
    setActiveInvoice(newPayment);
    setActiveModal("invoice");

    return {
      success: true,
      message: `Order confirmed for ${item.name}! Paid: ${settings.currency}${item.price}`,
      payment: newPayment,
    };
  };

  // 5. Add New Member
  const addMember = (newMemberData) => {
    const id = "mem-" + (100 + members.length + 1);
    const plan = MEMBERSHIP_PLANS.find((p) => p.id === newMemberData.planId) || MEMBERSHIP_PLANS[0];

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);
    const expiryStr = expiry.toISOString().split("T")[0];

    const fullMember = {
      id,
      name: newMemberData.name,
      phone: newMemberData.phone,
      email: newMemberData.email || "",
      avatar: newMemberData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newMemberData.name)}`,
      planId: plan.id,
      startDate: todayStr,
      expiryDate: expiryStr,
      status: "active",
      assignedTrainerId: newMemberData.assignedTrainerId || "tr-1",
      dietPlanId: newMemberData.dietPlanId || "diet-hypertrophy",
      workoutSplitId: newMemberData.workoutSplitId || "split-5day-hypertrophy",
      weeklyGoalDays: Number(newMemberData.weeklyGoalDays) || 4,
      streak: 1,
      totalVisits: 1,
      lastCheckIn: todayStr,
      lastCheckInTime: "Just joined",
      absentDays: 0,
      notes: newMemberData.notes || "New member",
      ptBalance: 0,
    };

    setMembers((prev) => [fullMember, ...prev]);

    // Initial payment record
    const receiptNo = "REC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const newPayment = {
      id: "pay-" + Date.now(),
      memberId: id,
      memberName: fullMember.name,
      amount: plan.price,
      planName: plan.name,
      date: todayStr,
      method: newMemberData.paymentMethod || "UPI",
      status: "Verified",
      receiptNo,
    };
    setPayments((prev) => [newPayment, ...prev]);

    return fullMember;
  };

  // 6. Pause / Unpause Membership
  const togglePauseMember = (memberId, reason = "") => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const isCurrentlyPaused = m.status === "paused";
          return {
            ...m,
            status: isCurrentlyPaused ? "active" : "paused",
            notes: isCurrentlyPaused
              ? m.notes
              : `${m.notes ? m.notes + " | " : ""}Paused on ${todayStr}: ${reason || "User request"}`,
          };
        }
        return m;
      })
    );
  };

  // 7. Bulk Import Members (from CSV/Excel/Text)
  const bulkImportMembers = (newMemberList, replaceExisting = false) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const formatted = newMemberList.map((item, idx) => {
      const plan = MEMBERSHIP_PLANS.find(p => p.id === item.planId) || MEMBERSHIP_PLANS[1];
      const expiry = item.expiryDate || new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split("T")[0];
      const isExpired = new Date(expiry) < new Date(todayStr);
      return {
        id: "mem-" + Date.now() + "-" + idx,
        name: item.name || "Member " + (idx + 1),
        phone: item.phone ? (item.phone.startsWith("+91") ? item.phone : "+91 " + item.phone) : "+91 98000 00000",
        email: item.email || "",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name || "M")}`,
        planId: plan.id,
        startDate: item.startDate || todayStr,
        expiryDate: expiry,
        status: isExpired ? "expired" : item.status || "active",
        assignedTrainerId: item.assignedTrainerId || "tr-1",
        weeklyGoalDays: Number(item.weeklyGoalDays) || 4,
        streak: Number(item.streak) || 0,
        totalVisits: Number(item.totalVisits) || 0,
        lastCheckIn: item.lastCheckIn || todayStr,
        lastCheckInTime: "10:00 AM",
        absentDays: Number(item.absentDays) || 0,
        notes: item.notes || "Imported from client sheet",
        ptBalance: Number(item.ptBalance) || 0,
      };
    });

    if (replaceExisting) {
      setMembers(formatted);
      if (formatted.length > 0) setSelectedMemberId(formatted[0].id);
    } else {
      setMembers((prev) => [...formatted, ...prev]);
    }

    return formatted.length;
  };

  const clearAllMembers = () => {
    setMembers([]);
    setCheckIns([]);
  };

  // 8. Reset to Factory Sample Data
  const resetToFactoryDefaults = () => {
    localStorage.removeItem("fitzone_settings");
    localStorage.removeItem("fitzone_members");
    localStorage.removeItem("fitzone_checkins");
    localStorage.removeItem("fitzone_payments");
    localStorage.removeItem("fitzone_addons");
    setSettings(DEFAULT_GYM_SETTINGS);
    setMembers(INITIAL_MEMBERS);
    setCheckIns(INITIAL_CHECKINS);
    setPayments(INITIAL_PAYMENTS);
    setAddOns(ADD_ONS);
    setSelectedMemberId("mem-101");
  };

  return (
    <GymContext.Provider
      value={{
        settings,
        setSettings,
        members,
        checkIns,
        payments,
        addOns,
        plans,
        setPlans,
        addPlan,
        updatePlan,
        deletePlan,
        trainers,
        setTrainers,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        dietPlans,
        setDietPlans,
        workoutRoutines,
        setWorkoutRoutines,
        updateMember,
        currentView,
        setCurrentView,
        selectedMemberId,
        setSelectedMemberId,
        currentMember,
        currentKioskToken,
        activeModal,
        setActiveModal,
        activeInvoice,
        setActiveInvoice,
        processCheckIn,
        markFollowUp,
        renewMembership,
        orderAddOn,
        addAddOn,
        updateAddOn,
        deleteAddOn,
        restockAddOn,
        addMember,
        togglePauseMember,
        bulkImportMembers,
        clearAllMembers,
        exportDatabaseBackup,
        restoreDatabaseBackup,
        resetToFactoryDefaults,
        authRole,
        setAuthRole,
        loginAdmin,
        loginMember,
        logout,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) throw new Error("useGym must be used within GymProvider");
  return context;
}

