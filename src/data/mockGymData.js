// Mock Data for Tier-2 / Tier-1 Indian Gym Retention & Management System
// Aligned with Roy Digital Gym App Blueprint

export const DEFAULT_GYM_SETTINGS = {
  gymName: "FitZone Premium Fitness",
  tagline: "Transform Your Body, Elevate Your Mind",
  address: "Shop 12-15, 2nd Floor, Royal Heights, Ring Road, Indore",
  city: "Indore, MP",
  phone: "+91 98260 12345",
  email: "contact@fitzonegym.in",
  upiId: "fitzone@okaxis",
  gstin: "23AABCF1234M1Z5",
  currency: "₹",
  noShowThresholdDays: 10,
  themeColor: "amber", // 'amber' | 'emerald' | 'cyan' | 'rose'
  qrRefreshSeconds: 30,
};

export const MEMBERSHIP_PLANS = [
  {
    id: "plan-1m",
    name: "Monthly Starter",
    durationMonths: 1,
    price: 1500,
    mrp: 1800,
    popular: false,
    description: "Ideal for short-term fitness goals & trial",
    features: ["All Gym Floor Access", "Locker & Shower", "General Fitness Guidance"],
  },
  {
    id: "plan-3m",
    name: "Quarterly Transformation",
    durationMonths: 3,
    price: 3999,
    mrp: 5400,
    popular: true,
    discountBadge: "Save 26%",
    description: "Most popular choice for noticeable physique results",
    features: ["All Gym Floor Access", "Free Diet Consultation", "Body Composition Scan", "1 Free PT Trial"],
  },
  {
    id: "plan-6m",
    name: "Half-Yearly Shred",
    durationMonths: 6,
    price: 7499,
    mrp: 10800,
    popular: false,
    discountBadge: "Save 31%",
    description: "Serious commitment with dedicated coach check-in",
    features: ["All Gym Floor Access", "Monthly Diet Plan Updates", "2 Free PT Sessions", "Priority Support"],
  },
  {
    id: "plan-12m",
    name: "Annual Elite Champion",
    durationMonths: 12,
    price: 12999,
    mrp: 21600,
    popular: false,
    discountBadge: "Save 40%",
    description: "Complete lifestyle transformation at the best price",
    features: ["Full 365 Days Access", "Personal Locker Access", "4 Free PT Sessions", "Free FitZone Gym Jersey", "Freeze Option (up to 30 days)"],
  },
];

export const TRAINERS = [
  { id: "tr-1", name: "Vikram Chauhan", specialty: "Hypertrophy & Strength", phone: "+91 98930 11223", rating: 4.9, activeClients: 14 },
  { id: "tr-2", name: "Priya Sharma", specialty: "Fat Loss, Mobility & HIIT", phone: "+91 98930 44556", rating: 4.8, activeClients: 11 },
  { id: "tr-3", name: "Kabir Khan", specialty: "Functional & Athletic Training", phone: "+91 98930 77889", rating: 4.9, activeClients: 9 },
];

export const PRESET_DIET_PLANS = [
  {
    id: "diet-hypertrophy",
    name: "Lean Muscle Hypertrophy (High Protein)",
    calories: "2,350 kcal",
    protein: "155g",
    carbs: "230g",
    fats: "55g",
    water: "3.5 - 4 Liters",
    preference: "High Protein / Non-Veg & Eggs",
    meals: [
      { name: "Meal 1 — Breakfast (08:00 AM)", items: "3 Whole Eggs + 2 Egg Whites + 60g Rolled Oats with Skimmed Milk, 1 Banana & 8 Almonds", protein: "36g" },
      { name: "Meal 2 — Mid-Morning (11:30 AM)", items: "1 Apple / Orange + 10 Almonds & 5 Walnuts + 1 Cup Green Tea", protein: "6g" },
      { name: "Meal 3 — High-Protein Lunch (01:30 PM)", items: "150g Grilled Chicken Breast / Tofu + 1 Bowl Brown Rice + Dal Tadka + Cucumber Salad", protein: "42g" },
      { name: "Meal 4 — Pre-Workout Fuel (05:00 PM)", items: "1 Cup Black Coffee + 2 Whole Wheat Bread slices with 1 tbsp Peanut Butter & 1 Banana", protein: "12g" },
      { name: "Meal 5 — Post-Workout Recovery (07:30 PM)", items: "1 Scoop FitZone 100% Whey Isolate in 250ml water + 1 Banana", protein: "27g" },
      { name: "Meal 6 — Muscle Repair Dinner (09:30 PM)", items: "100g Paneer / Grilled Fish / Soya Chunks + 2 Multigrain Rotis + Steamed Veggies", protein: "32g" }
    ]
  },
  {
    id: "diet-fatloss",
    name: "Rapid Fat Shred & Calorie Deficit",
    calories: "1,750 kcal",
    protein: "140g",
    carbs: "135g",
    fats: "45g",
    water: "4 Liters",
    preference: "Fat Loss & Cutting",
    meals: [
      { name: "Meal 1 — Breakfast (08:00 AM)", items: "4 Boiled Egg Whites + 1 Whole Egg + Green Salad + Black Coffee", protein: "24g" },
      { name: "Meal 2 — Lunch (01:00 PM)", items: "150g Grilled Chicken / Soya Chunks + Large Green Bowl (Cucumber, Tomato, Spinach) + Half Bowl Brown Rice", protein: "38g" },
      { name: "Meal 3 — Pre-Workout (05:00 PM)", items: "1 Green Apple + Espresso Shot / FitZone Pre-Workout", protein: "2g" },
      { name: "Meal 4 — Post-Workout (07:00 PM)", items: "1 Scoop Whey Isolate in water", protein: "25g" },
      { name: "Meal 5 — Dinner (08:30 PM)", items: "Clear Vegetable Soup + 150g Grilled Tofu or Fish + Boiled Broccoli", protein: "32g" }
    ]
  },
  {
    id: "diet-pureveg",
    name: "Pure Vegetarian Indian Muscle Builder",
    calories: "2,150 kcal",
    protein: "130g",
    carbs: "240g",
    fats: "55g",
    water: "3.5 Liters",
    preference: "100% Pure Vegetarian",
    meals: [
      { name: "Meal 1 — Breakfast (08:00 AM)", items: "100g Paneer Bhurji + 2 Multigrain Toast + 1 Glass Skimmed Milk with Chia seeds", protein: "28g" },
      { name: "Meal 2 — Mid-Morning (11:00 AM)", items: "1 Roasted Chana Bowl (50g) + 1 Glass Spiced Buttermilk (Chaas)", protein: "14g" },
      { name: "Meal 3 — High-Protein Veg Lunch (01:30 PM)", items: "100g Soya Chunks Curry + 1 Bowl Thick Moong Dal + 2 Chapatis + Curd & Salad", protein: "40g" },
      { name: "Meal 4 — Pre-Workout (05:30 PM)", items: "2 Bananas + 1 Spoon Peanut Butter + Warm Water", protein: "8g" },
      { name: "Meal 5 — Post-Workout (07:30 PM)", items: "1 Scoop FitZone Whey Protein (or Plant Protein) in 250ml water", protein: "25g" },
      { name: "Meal 6 — Dinner (09:00 PM)", items: "100g Grilled Paneer Tikka + Mixed Vegetable Khichdi + Cucumber Raita", protein: "25g" }
    ]
  }
];

export const PRESET_WORKOUT_ROUTINES = [
  {
    id: "split-5day-hypertrophy",
    name: "5-Day Hypertrophy & Muscle Growth Split",
    description: "Designed for intermediate to advanced lifters to build muscle mass and symmetry.",
    schedule: [
      {
        day: "Monday",
        muscle: "Chest & Triceps",
        duration: "55 Mins",
        exercises: [
          { name: "Flat Barbell Bench Press", sets: "4 Sets", reps: "8-10 Reps", tip: "Arch upper back slightly, retract scapula, control the downward bar path." },
          { name: "Incline Dumbbell Press", sets: "3 Sets", reps: "10-12 Reps", tip: "Focus on upper chest squeeze at top contraction." },
          { name: "Cable Chest Flyes", sets: "3 Sets", reps: "15 Reps", tip: "Keep slight bend in elbows, feel deep chest stretch." },
          { name: "Triceps Rope Pushdowns", sets: "4 Sets", reps: "12-15 Reps", tip: "Flare rope outward at bottom for peak tricep contraction." }
        ]
      },
      {
        day: "Tuesday",
        muscle: "Back & Biceps",
        duration: "55 Mins",
        exercises: [
          { name: "Wide-Grip Lat Pulldowns", sets: "4 Sets", reps: "10-12 Reps", tip: "Pull with elbows towards ribs, avoid excessive body swing." },
          { name: "Seated Cable Rows", sets: "3 Sets", reps: "10-12 Reps", tip: "Squeeze shoulder blades together firmly for 1 second." },
          { name: "Conventional Barbell Deadlifts", sets: "3 Sets", reps: "6-8 Reps", tip: "Keep spine neutral, lock out with glutes." },
          { name: "Incline Dumbbell Bicep Curls", sets: "4 Sets", reps: "10-12 Reps", tip: "Supinate wrists outward at top for maximum peak." }
        ]
      },
      {
        day: "Wednesday",
        muscle: "Legs & Core Conditioning",
        duration: "60 Mins",
        exercises: [
          { name: "Barbell Back Squats", sets: "4 Sets", reps: "8-10 Reps", tip: "Hit parallel depth, drive feet firmly through floor." },
          { name: "45-Degree Leg Press", sets: "3 Sets", reps: "12-15 Reps", tip: "Never lock out knees fully at the top." },
          { name: "Lying Hamstring Leg Curls", sets: "3 Sets", reps: "12-15 Reps", tip: "Slow 2-second negative for maximum hamstring growth." },
          { name: "Hanging Leg Raises", sets: "3 Sets", reps: "15 Reps", tip: "Curl pelvis upward, avoid swinging legs." }
        ]
      },
      {
        day: "Thursday",
        muscle: "Shoulders, Traps & Rear Delts",
        duration: "50 Mins",
        exercises: [
          { name: "Seated Overhead Dumbbell Press", sets: "4 Sets", reps: "8-10 Reps", tip: "Bring dumbbells to ear level before pressing upward." },
          { name: "Dumbbell Lateral Raises", sets: "4 Sets", reps: "15 Reps", tip: "Lead with elbows, pause briefly at shoulder height." },
          { name: "Cable Facepulls with Rope", sets: "3 Sets", reps: "15-20 Reps", tip: "Pull towards eyes for posture & healthy rotator cuffs." },
          { name: "Dumbbell Shrugs", sets: "3 Sets", reps: "12 Reps", tip: "Hold top contraction for 2 seconds." }
        ]
      },
      {
        day: "Friday",
        muscle: "Arms & Core Hypertrophy",
        duration: "45 Mins",
        exercises: [
          { name: "EZ-Bar Preacher Curls", sets: "3 Sets", reps: "10-12 Reps", tip: "Full stretch at bottom, strictly isolate biceps." },
          { name: "Overhead Dumbbell Triceps Extension", sets: "3 Sets", reps: "12 Reps", tip: "Keep elbows tucked close to head." },
          { name: "Hammer Curls", sets: "3 Sets", reps: "12 Reps", tip: "Targets brachialis for thicker forearm & bicep look." },
          { name: "Weighted Plank", sets: "3 Sets", reps: "60 Secs", tip: "Brace core like expecting a punch." }
        ]
      },
      {
        day: "Saturday & Sunday",
        muscle: "Active Recovery & Mobility",
        duration: "20-30 Mins",
        exercises: [
          { name: "Outdoor Brisk Walk / Light Cardio", sets: "1 Session", reps: "30 Mins", tip: "Promotes blood flow and speeds muscular recovery." },
          { name: "Foam Rolling & Full Body Stretch", sets: "1 Session", reps: "15 Mins", tip: "Target tight hip flexors and back muscles." }
        ]
      }
    ]
  },
  {
    id: "split-ppl",
    name: "Push - Pull - Legs (PPL Split)",
    description: "Classic high-frequency 3-day or 6-day split for balanced athletic aesthetics and power.",
    schedule: [
      {
        day: "Push Day",
        muscle: "Chest, Shoulders & Triceps",
        duration: "55 Mins",
        exercises: [
          { name: "Barbell Bench Press", sets: "4 Sets", reps: "6-8 Reps", tip: "Compound power movement." },
          { name: "Standing Overhead Military Press", sets: "3 Sets", reps: "8-10 Reps", tip: "Strict core bracing." },
          { name: "Incline Dumbbell Flyes", sets: "3 Sets", reps: "12 Reps", tip: "Deep chest stretch." },
          { name: "Dips / Tricep Pushdown", sets: "3 Sets", reps: "12-15 Reps", tip: "Lockout triceps at bottom." }
        ]
      },
      {
        day: "Pull Day",
        muscle: "Back, Rear Delts & Biceps",
        duration: "55 Mins",
        exercises: [
          { name: "Barbell Bent-Over Row", sets: "4 Sets", reps: "8-10 Reps", tip: "Pull to lower stomach, maintain flat back." },
          { name: "Wide-Grip Lat Pulldown", sets: "4 Sets", reps: "10 Reps", tip: "Engage lower lats with slow negative." },
          { name: "Dumbbell Shrugs", sets: "3 Sets", reps: "12 Reps", tip: "Heavy traps overload." },
          { name: "Barbell Bicep Curls", sets: "4 Sets", reps: "10-12 Reps", tip: "Strict form, zero torso swinging." }
        ]
      },
      {
        day: "Legs Day",
        muscle: "Quads, Hamstrings & Calves",
        duration: "60 Mins",
        exercises: [
          { name: "Barbell Back Squats", sets: "4 Sets", reps: "8-10 Reps", tip: "Full range of motion below parallel." },
          { name: "Romanian Deadlifts (RDL)", sets: "3 Sets", reps: "10-12 Reps", tip: "Feel hamstrings stretch, keep back flat." },
          { name: "Walking Lunges with Dumbbells", sets: "3 Sets", reps: "12 Steps/Leg", tip: "Keep chest tall." },
          { name: "Standing Calf Raises", sets: "4 Sets", reps: "15-20 Reps", tip: "Deep stretch at bottom and hold at peak." }
        ]
      }
    ]
  }
];

export const ADD_ONS = [
  {
    id: "addon-pt-12",
    type: "pt",
    name: "1-on-1 Personal Training (12 Sessions)",
    price: 4999,
    mrp: 6500,
    validityDays: 45,
    description: "Dedicated personal trainer for form correction, spotting and diet oversight.",
    trainerId: "tr-1",
    stock: 5, // slots remaining
  },
  {
    id: "addon-pt-24",
    type: "pt",
    name: "Elite Transformation PT (24 Sessions)",
    price: 8999,
    mrp: 12000,
    validityDays: 90,
    description: "Comprehensive 3-month coaching with customized weekly workout splits.",
    trainerId: "tr-2",
    stock: 3,
  },
  {
    id: "addon-diet-plan",
    type: "diet",
    name: "Customized Macro & Calorie Diet Plan",
    price: 999,
    mrp: 1999,
    validityDays: 30,
    description: "Tailored meal plans (Veg/Non-Veg) with Indian home-food alternatives and WhatsApp check-in.",
    trainerId: "tr-2",
    stock: 25,
  },
  {
    id: "addon-whey-1kg",
    type: "product",
    name: "FitZone Gold 100% Whey Protein (1kg, Choco)",
    price: 2699,
    mrp: 3499,
    validityDays: 0,
    description: "25g pure whey isolate per scoop, lab-tested, zero added sugar.",
    stock: 14,
  },
  {
    id: "addon-creatine-250",
    type: "product",
    name: "Micronized Creatine Monohydrate (250g)",
    price: 799,
    mrp: 1199,
    validityDays: 0,
    description: "Boosts strength, ATP replenishment, and lean muscle volume.",
    stock: 18,
  },
  {
    id: "addon-shaker-bottle",
    type: "product",
    name: "Pro Stainless Steel Gym Shaker (750ml)",
    price: 399,
    mrp: 699,
    validityDays: 0,
    description: "Leak-proof, BPA-free metal shaker with mixer ball.",
    stock: 22,
  },
];

// Helper to get formatted dates relative to today
const today = new Date();
const daysAgo = (d) => {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  return date.toISOString().split("T")[0];
};
const daysLater = (d) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
};

export const INITIAL_MEMBERS = [
  // 1. Regular active member with strong streak
  {
    id: "mem-101",
    name: "Aman Sharma",
    phone: "+91 98261 45890",
    email: "aman.sharma@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(45),
    expiryDate: daysLater(45),
    status: "active", // 'active' | 'expiring' | 'expired' | 'paused'
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 5,
    streak: 18, // days
    totalVisits: 42,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "07:15 AM",
    absentDays: 0,
    notes: "Very consistent, focus on bench press progression",
    ptBalance: 6,
    dietPlanId: "diet-hypertrophy",
    workoutSplitId: "split-5day-hypertrophy",
  },
  // 2. Red-List Silent Churn Candidate (Absent 14 days)
  {
    id: "mem-102",
    name: "Pooja Verma",
    phone: "+91 98262 77123",
    email: "pooja.verma@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(60),
    expiryDate: daysLater(30),
    status: "active",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 0,
    totalVisits: 14,
    lastCheckIn: daysAgo(14),
    lastCheckInTime: "06:30 PM",
    absentDays: 14,
    notes: "Joined with friend who quit; needs friendly call",
    followUpOutcome: "No response yet",
    lastFollowUpDate: daysAgo(2),
  },
  // 3. Red-List Candidate (Absent 18 days)
  {
    id: "mem-103",
    name: "Rahul Verma",
    phone: "+91 98263 88456",
    email: "rahul.v@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    planId: "plan-1m",
    startDate: daysAgo(25),
    expiryDate: daysLater(5),
    status: "expiring",
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 4,
    streak: 0,
    totalVisits: 6,
    lastCheckIn: daysAgo(18),
    lastCheckInTime: "08:10 AM",
    absentDays: 18,
    notes: "Complained about wrist pain after week 1",
    followUpOutcome: "Injured",
    lastFollowUpDate: daysAgo(4),
  },
  // 4. Renewal Due in 3 days (High Urgency)
  {
    id: "mem-104",
    name: "Rohan Mehta",
    phone: "+91 98264 99124",
    email: "rohan.mehta@outlook.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(87),
    expiryDate: daysLater(3),
    status: "expiring",
    assignedTrainerId: "tr-3",
    weeklyGoalDays: 5,
    streak: 12,
    totalVisits: 68,
    lastCheckIn: daysAgo(1),
    lastCheckInTime: "07:45 AM",
    absentDays: 1,
    notes: "Active regular member, likely will renew for 6m or 12m",
  },
  // 5. Expiring in 6 days
  {
    id: "mem-105",
    name: "Neha Patel",
    phone: "+91 98265 11987",
    email: "neha.patel@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    planId: "plan-6m",
    startDate: daysAgo(174),
    expiryDate: daysLater(6),
    status: "expiring",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 8,
    totalVisits: 110,
    lastCheckIn: daysAgo(2),
    lastCheckInTime: "05:40 PM",
    absentDays: 2,
    notes: "Inquiring about personal training bundle",
  },
  // 6. Red-List (Absent 21 days - Critical silent churn)
  {
    id: "mem-106",
    name: "Deepak Joshi",
    phone: "+91 98266 22345",
    email: "deepak.j@rediffmail.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    planId: "plan-12m",
    startDate: daysAgo(120),
    expiryDate: daysLater(245),
    status: "active",
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 3,
    streak: 0,
    totalVisits: 31,
    lastCheckIn: daysAgo(21),
    lastCheckInTime: "08:30 PM",
    absentDays: 21,
    notes: "Annual member, business tour busy schedule",
    followUpOutcome: "Travelling",
    lastFollowUpDate: daysAgo(6),
  },
  // 7. Paused/Frozen Membership (Excluded from Red List)
  {
    id: "mem-107",
    name: "Kavita Rao",
    phone: "+91 98267 33456",
    email: "kavita.rao@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    planId: "plan-12m",
    startDate: daysAgo(90),
    expiryDate: daysLater(295), // paused extends expiry
    status: "paused",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 0,
    totalVisits: 45,
    lastCheckIn: daysAgo(16),
    lastCheckInTime: "07:00 AM",
    absentDays: 16,
    notes: "Approved medical pause for 30 days due to ankle sprain",
  },
  // 8. Active regular member
  {
    id: "mem-108",
    name: "Vikram Malhotra",
    phone: "+91 98268 44567",
    email: "vikram.m@gmail.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    planId: "plan-6m",
    startDate: daysAgo(30),
    expiryDate: daysLater(150),
    status: "active",
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 6,
    streak: 26,
    totalVisits: 58,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "06:45 AM",
    absentDays: 0,
    notes: "Powerlifting enthusiast",
  },
  // 9. Red-List (Absent 11 days)
  {
    id: "mem-109",
    name: "Ananya Deshmukh",
    phone: "+91 98269 55678",
    email: "ananya.d@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(40),
    expiryDate: daysLater(50),
    status: "active",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 0,
    totalVisits: 19,
    lastCheckIn: daysAgo(11),
    lastCheckInTime: "06:15 PM",
    absentDays: 11,
    notes: "College exam preparation break",
  },
  // 10. Expired Member
  {
    id: "mem-110",
    name: "Saurabh Yadav",
    phone: "+91 98270 66789",
    email: "saurabh.y@gmail.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    planId: "plan-1m",
    startDate: daysAgo(40),
    expiryDate: daysAgo(10),
    status: "expired",
    assignedTrainerId: "tr-3",
    weeklyGoalDays: 3,
    streak: 0,
    totalVisits: 12,
    lastCheckIn: daysAgo(12),
    lastCheckInTime: "08:00 AM",
    absentDays: 12,
    notes: "Expired 10 days ago, sent 1 reminder",
  },
  // 11-20 More members for realistic scale
  {
    id: "mem-111",
    name: "Simran Kaur",
    phone: "+91 98271 77890",
    email: "simran.k@gmail.com",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(20),
    expiryDate: daysLater(70),
    status: "active",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 9,
    totalVisits: 16,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "05:15 PM",
    absentDays: 0,
    notes: "Enthusiastic beginner",
  },
  {
    id: "mem-112",
    name: "Rajesh Kulkarni",
    phone: "+91 98272 88901",
    email: "rajesh.k@gmail.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    planId: "plan-6m",
    startDate: daysAgo(110),
    expiryDate: daysLater(70),
    status: "active",
    assignedTrainerId: "tr-3",
    weeklyGoalDays: 5,
    streak: 15,
    totalVisits: 84,
    lastCheckIn: daysAgo(1),
    lastCheckInTime: "06:10 AM",
    absentDays: 1,
    notes: "Morning regular",
  },
  {
    id: "mem-113",
    name: "Priyanka Saxena",
    phone: "+91 98273 99012",
    email: "priyanka.s@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    planId: "plan-1m",
    startDate: daysAgo(28),
    expiryDate: daysLater(2),
    status: "expiring",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 3,
    streak: 4,
    totalVisits: 11,
    lastCheckIn: daysAgo(2),
    lastCheckInTime: "07:30 PM",
    absentDays: 2,
    notes: "Interested in upgrading to Quarterly",
  },
  {
    id: "mem-114",
    name: "Karan Johar",
    phone: "+91 98274 10123",
    email: "karan.j@gmail.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(50),
    expiryDate: daysLater(40),
    status: "active",
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 5,
    streak: 0,
    totalVisits: 22,
    lastCheckIn: daysAgo(12),
    lastCheckInTime: "08:45 PM",
    absentDays: 12,
    notes: "Office late shifts causing absence",
  },
  {
    id: "mem-115",
    name: "Tanvi Agarwal",
    phone: "+91 98275 21234",
    email: "tanvi.a@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    planId: "plan-12m",
    startDate: daysAgo(180),
    expiryDate: daysLater(185),
    status: "active",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 22,
    totalVisits: 98,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "06:00 PM",
    absentDays: 0,
    notes: "Very disciplined with diet & attendance",
  },
  {
    id: "mem-116",
    name: "Mohit Bansal",
    phone: "+91 98276 32345",
    email: "mohit.b@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(85),
    expiryDate: daysLater(5),
    status: "expiring",
    assignedTrainerId: "tr-3",
    weeklyGoalDays: 4,
    streak: 7,
    totalVisits: 40,
    lastCheckIn: daysAgo(1),
    lastCheckInTime: "07:15 PM",
    absentDays: 1,
    notes: "Needs reminder for quarterly renewal",
  },
  {
    id: "mem-117",
    name: "Sneha Nair",
    phone: "+91 98277 43456",
    email: "sneha.n@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    planId: "plan-6m",
    startDate: daysAgo(75),
    expiryDate: daysLater(105),
    status: "active",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 4,
    streak: 0,
    totalVisits: 28,
    lastCheckIn: daysAgo(15),
    lastCheckInTime: "07:30 AM",
    absentDays: 15,
    notes: "Red-list member; was unwell last week",
  },
  {
    id: "mem-118",
    name: "Arjun Rampal",
    phone: "+91 98278 54567",
    email: "arjun.r@gmail.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    planId: "plan-12m",
    startDate: daysAgo(200),
    expiryDate: daysLater(165),
    status: "active",
    assignedTrainerId: "tr-1",
    weeklyGoalDays: 6,
    streak: 34,
    totalVisits: 172,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "06:30 AM",
    absentDays: 0,
    notes: "Top performer in gym",
  },
  {
    id: "mem-119",
    name: "Bhavna Bhatt",
    phone: "+91 98279 65678",
    email: "bhavna.b@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    planId: "plan-1m",
    startDate: daysAgo(29),
    expiryDate: daysLater(1),
    status: "expiring",
    assignedTrainerId: "tr-2",
    weeklyGoalDays: 3,
    streak: 5,
    totalVisits: 10,
    lastCheckIn: daysAgo(1),
    lastCheckInTime: "08:15 AM",
    absentDays: 1,
    notes: "Expiry tomorrow! Call today.",
  },
  {
    id: "mem-120",
    name: "Gaurav Tiwari",
    phone: "+91 98280 76789",
    email: "gaurav.t@gmail.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    planId: "plan-3m",
    startDate: daysAgo(45),
    expiryDate: daysLater(45),
    status: "active",
    assignedTrainerId: "tr-3",
    weeklyGoalDays: 5,
    streak: 11,
    totalVisits: 32,
    lastCheckIn: daysAgo(0),
    lastCheckInTime: "07:00 PM",
    absentDays: 0,
    notes: "Interested in supplements",
  },
];

export const INITIAL_CHECKINS = [
  { id: "chk-1", memberId: "mem-101", memberName: "Aman Sharma", time: "07:15 AM", date: daysAgo(0), method: "QR Scan", status: "Success" },
  { id: "chk-2", memberId: "mem-108", memberName: "Vikram Malhotra", time: "07:45 AM", date: daysAgo(0), method: "QR Scan", status: "Success" },
  { id: "chk-3", memberId: "mem-111", memberName: "Simran Kaur", time: "08:20 AM", date: daysAgo(0), method: "QR Scan", status: "Success" },
  { id: "chk-4", memberId: "mem-115", memberName: "Tanvi Agarwal", time: "09:00 AM", date: daysAgo(0), method: "QR Scan", status: "Success" },
  { id: "chk-5", memberId: "mem-118", memberName: "Arjun Rampal", time: "09:30 AM", date: daysAgo(0), method: "QR Scan", status: "Success" },
  { id: "chk-6", memberId: "mem-120", memberName: "Gaurav Tiwari", time: "10:15 AM", date: daysAgo(0), method: "Front-Desk Assisted", status: "Success", reason: "Phone battery dead" },
];

export const INITIAL_PAYMENTS = [
  { id: "pay-801", memberId: "mem-101", amount: 3999, planName: "Quarterly Transformation", date: daysAgo(45), method: "UPI", status: "Verified", receiptNo: "REC-2026-101" },
  { id: "pay-802", memberId: "mem-104", amount: 3999, planName: "Quarterly Transformation", date: daysAgo(87), method: "Google Pay", status: "Verified", receiptNo: "REC-2026-087" },
  { id: "pay-803", memberId: "mem-106", amount: 12999, planName: "Annual Elite Champion", date: daysAgo(120), method: "Card", status: "Verified", receiptNo: "REC-2026-042" },
  { id: "pay-804", memberId: "mem-108", amount: 7499, planName: "Half-Yearly Shred", date: daysAgo(30), method: "PhonePe", status: "Verified", receiptNo: "REC-2026-115" },
  { id: "pay-805", memberId: "mem-118", amount: 12999, planName: "Annual Elite Champion", date: daysAgo(200), method: "UPI", status: "Verified", receiptNo: "REC-2026-011" },
];

