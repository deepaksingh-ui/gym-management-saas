import React, { useState } from "react";
import { useGym } from "../../context/GymContext";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Copy,
  CheckCircle,
  PhoneCall,
  Target,
  FileText,
  Calculator,
  IndianRupee,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

export default function SalesToolkit() {
  const { settings } = useGym();
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  // ROI Calculator states
  const [gymMembers, setGymMembers] = useState(150);
  const [monthlyFee, setMonthlyFee] = useState(1500);
  const [silentDropoutsPerMonth, setSilentDropoutsPerMonth] = useState(8);

  const annualLoss = silentDropoutsPerMonth * monthlyFee * 12;
  const recoveredMembers = Math.round(silentDropoutsPerMonth * 0.45); // 45% recovery rate with red-list
  const annualSaved = recoveredMembers * monthlyFee * 12;
  const softwareCost = 1499 * 12;
  const netRoi = annualSaved - softwareCost;

  const coldWhatsAppMessage = `Namaste sir! 🙏\n\nMain aapke area mein gym retention aur attendance software provide karta hoon. Ek chhota sa sawal tha: \n\nKya aapke gym mein bhi kuch members 10–15 din bina bataye absent rehte hain, aur renewal ke time silently gym chhod dete hain? 📉\n\nHumne ek aisi "No-Show Red List" app banayi hai jo:\n1. 10 din se absent members ko auto-detect karti hai\n2. 1-click WhatsApp se unhe wapas bulati hai\n3. Front-desk counter par QR attendance lagati hai\n\nSirf 2 members bhi bach gaye to software ki cost nikal aati hai! \n\nKya main kal 5 minute ke liye aapke gym aakar iska FREE LIVE DEMO dikha sakta hoon?`;

  const handleCopyWa = () => {
    navigator.clipboard.writeText(coldWhatsAppMessage);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 3000);
  };

  const handleCopyPitch = () => {
    const text = `Bhaiya, visible problem ye lagti hai ki naye log gym join karein. Lekin sabse bada loss ye hota hai ki jo purane log hain wo quietly disappear ho jaate hain. Member 3 hafte regular aata hai, phir 10-15 din irregular hota hai, staff register check nahi karta, aur fee due hone par pata chalta hai. Tab tak member mentally chhod chuka hota hai. Humara software owner ko daily 'No-Show Red List' deta hai taaki aap unhe pehle hi call/WhatsApp karke retain kar lein.`;
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner for the Seller (You) */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-neutral-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Commercial Sales & Pitch Kit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0">
            Gym Owners ko ye Software kaise Sell karein?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 m-0 leading-relaxed">
            Local gym owners ko kabhi sirf "Software" ya "Attendance app" mat becho — unhe **"Silent Churn aur Chhuta hua Paisa Bachane ka System"** becho! Neeche poora word-to-word pitch, ROI calculator aur pricing models diye gaye hain.
          </p>
        </div>
      </div>

      {/* 1. Pricing Packages to Offer Gyms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white m-0">
              Pricing Packages: Aap Kitna Charge Kar Sakte Hain?
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 m-0">
              Indian gyms ke hisaab se 3 tested pricing structures:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Package 1 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                Monthly SaaS
              </span>
              <h4 className="text-lg font-black text-white mt-3 m-0">
                Starter Retain
              </h4>
              <p className="text-xs text-neutral-400 mt-1 m-0">
                Chhote neighbourhood gyms ke liye (Up to 100 members)
              </p>

              <div className="mt-4">
                <div className="text-3xl font-black text-white flex items-center">
                  <span className="text-lg text-neutral-400">₹</span>
                  <span>1,499</span>
                  <span className="text-xs text-neutral-400 font-normal ml-1">/ month</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">✓ No-Show Red List (Absent alerts)</li>
                <li className="flex items-center gap-2">✓ Dynamic Counter QR Check-in</li>
                <li className="flex items-center gap-2">✓ WhatsApp 1-Click Follow-ups</li>
                <li className="flex items-center gap-2">✓ Renewal Tracking</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-xs font-bold text-emerald-400">
              10 Gyms = ₹15,000/mo Recurring Income
            </div>
          </div>

          {/* Package 2 (Recommended) */}
          <div className="bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-2 border-amber-500 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Most Profitable & Popular
            </span>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                Pro Growth Suite
              </span>
              <h4 className="text-lg font-black text-white mt-3 m-0">
                Full Retention + PT Store
              </h4>
              <p className="text-xs text-neutral-400 mt-1 m-0">
                Medium to Premium Gyms (100–300 members)
              </p>

              <div className="mt-4">
                <div className="text-3xl font-black text-amber-400 flex items-center">
                  <span className="text-lg text-amber-400">₹</span>
                  <span>2,499</span>
                  <span className="text-xs text-neutral-400 font-normal ml-1">/ month</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">✓ Everything in Starter</li>
                <li className="flex items-center gap-2">✓ Personal Training & Add-on Marketplace</li>
                <li className="flex items-center gap-2">✓ Fair Streak & Member Mobile Portal</li>
                <li className="flex items-center gap-2">✓ Daily Owner Summary on WhatsApp</li>
                <li className="flex items-center gap-2">✓ Custom Gym Logo & Branding</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-xs font-bold text-amber-400">
              10 Gyms = ₹25,000/mo Recurring Income
            </div>
          </div>

          {/* Package 3 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                One-Time Buyout
              </span>
              <h4 className="text-lg font-black text-white mt-3 m-0">
                Complete White-Label Setup
              </h4>
              <p className="text-xs text-neutral-400 mt-1 m-0">
                Jo gym owner monthly subscription nahi chahte
              </p>

              <div className="mt-4">
                <div className="text-3xl font-black text-white flex items-center">
                  <span className="text-lg text-neutral-400">₹</span>
                  <span>14,999</span>
                  <span className="text-xs text-neutral-400 font-normal ml-1">one-time</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <li className="flex items-center gap-2">✓ Full System with their Gym Name</li>
                <li className="flex items-center gap-2">✓ Counter Tablet / Screen Setup</li>
                <li className="flex items-center gap-2">✓ 30 Days Free Support & Training</li>
                <li className="flex items-center gap-2">✓ Optional ₹499/mo server maintenance</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-xs font-bold text-cyan-400">
              Instant Cashflow per Gym Deal
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive ROI Calculator for Sales Meetings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white m-0">
              Live ROI Calculator (Gym Owner ke saamne dikhane ke liye)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 m-0">
              Client ke numbers enter karein aur unhe dikhayein ki wo saal ka kitna lakh rupaye bacha sakte hain:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sliders */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Total Gym Members:</span>
              <span className="font-bold text-white">{gymMembers}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={gymMembers}
              onChange={(e) => setGymMembers(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Monthly Membership Fee (₹):</span>
              <span className="font-bold text-white">₹{monthlyFee}</span>
            </div>
            <input
              type="range"
              min="800"
              max="5000"
              step="100"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Members Absent/Quitting per month:</span>
              <span className="font-bold text-red-400">{silentDropoutsPerMonth} members</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={silentDropoutsPerMonth}
              onChange={(e) => setSilentDropoutsPerMonth(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>

        {/* Calculation Summary Result */}
        <div className="bg-gradient-to-r from-red-950/40 via-neutral-950 to-emerald-950/40 p-5 rounded-2xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-[11px] text-red-400 uppercase font-bold tracking-wider">
              Yearly Churn Loss (Register Par)
            </span>
            <div className="text-2xl font-black text-red-400 mt-1">
              ₹{annualLoss.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">Jo log bina bataye gayab ho jaate hain</p>
          </div>

          <div>
            <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">
              Yearly Saved With Red-List App
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              + ₹{annualSaved.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">Sirf {recoveredMembers} members/mo wapas aane par</p>
          </div>

          <div>
            <span className="text-[11px] text-amber-400 uppercase font-bold tracking-wider">
              Gym Owner Net Profit
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              + ₹{netRoi.toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-neutral-400 mt-0.5">Software fees katne ke baad bhi!</p>
          </div>
        </div>
      </div>

      {/* 3. Word-by-Word Pitch Script */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In-Person Pitch */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white m-0">In-Person Meeting Pitch (Word-to-Word)</h3>
            </div>
            <button
              onClick={handleCopyPitch}
              className="flex items-center gap-1 text-xs text-amber-400 font-semibold cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedPitch ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80 text-xs text-neutral-300 space-y-3 leading-relaxed">
            <p className="m-0">
              <strong className="text-white">Step 1 (Question):</strong> "Bhaiya, aapke gym mein lagbhag kitne members honge? Aur mahine mein kitne log bina bataye aana band kar dete hain?"
            </p>
            <p className="m-0">
              <strong className="text-white">Step 2 (Exposing Silent Churn):</strong> "Sach ye hai bhaiya ki member kabhi achanak nahi chhodta. Wo pehle 2-3 hafte regular aata hai, phir 10-15 din irregular hota hai. Register mein kisi ko time nahi rehta dekhne ka. Fee ki date aane par pata chalta hai ki wo 20 din se aaya hi nahi — tab tak wo mentally gym chhod chuka hota hai."
            </p>
            <p className="m-0">
              <strong className="text-white">Step 3 (The Demo):</strong> "Humara ye software daily aapko ek **'No-Show Red List'** deta hai: Aaj kis-kis member ko 10 din se upar ho gaye hain. Aap ek click par unhe WhatsApp message ya call kar sakte hain. Member ko lagta hai gym owner unka dhyaan rakh raha hai, aur wo wapas aa jaata hai."
            </p>
            <p className="m-0">
              <strong className="text-white">Step 4 (Closing):</strong> "Aap sirf 7 din ka free trial run karke dekh lijiye counter par tablet laga kar. Pasand aaye tabhi pay karna!"
            </p>
          </div>
        </div>

        {/* Cold WhatsApp Template */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white m-0">Cold WhatsApp Outreach Template</h3>
            </div>
            <button
              onClick={handleCopyWa}
              className="flex items-center gap-1 text-xs text-emerald-400 font-semibold cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedWa ? "Copied!" : "Copy Message"}</span>
            </button>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80 text-xs text-neutral-300 whitespace-pre-line font-sans leading-relaxed">
            {coldWhatsAppMessage}
          </div>

          <div className="text-[11px] text-neutral-500">
            Tip: Local gym owners ke Instagram DM ya Google Maps par diye mobile number par ye send karein.
          </div>
        </div>
      </div>

      {/* 4. Objection Handling (Common Gym Owner Questions) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white m-0">
            Objection Handling: Gym Owner Ke Sawal Aur Unke Jawab
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1.5 text-xs">
            <span className="font-bold text-amber-400">"Hum to register mein likhte hain, kya zaroorat hai?"</span>
            <p className="text-neutral-300 m-0 leading-relaxed">
              <strong>Jawab:</strong> "Bhaiya register sirf ye batata hai ki aaj kaun aaya. Register ye nahi batata ki 15 din se kaun NAHI aaya aur kab aaya tha. Is software ka kaam attendance likhna nahi, chhuta hua paisa bachana hai."
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1.5 text-xs">
            <span className="font-bold text-amber-400">"Members phone se scan karenge kya daily?"</span>
            <p className="text-neutral-300 m-0 leading-relaxed">
              <strong>Jawab:</strong> "Haan bhaiya! Isme 'Streak' feature hai (jaise Snapchat par hota hai). Members ko apna streak maintain karne ka maza aata hai. Aur agar koi phone bhool gaya to counter se 2 second mein Assisted Entry ho jaati hai."
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1.5 text-xs">
            <span className="font-bold text-amber-400">"Humare trainers ko computer nahi aata"</span>
            <p className="text-neutral-300 m-0 leading-relaxed">
              <strong>Jawab:</strong> "Isme computer ki zaroorat hi nahi hai! Poora system mobile aur counter tablet par chalta hai. Ek click par WhatsApp khulta hai. 5 minute mein kisi ko bhi sikhaya ja sakta hai."
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-1.5 text-xs">
            <span className="font-bold text-amber-400">"Monthly ₹1,500 zyada lag raha hai"</span>
            <p className="text-neutral-300 m-0 leading-relaxed">
              <strong>Jawab:</strong> "Bhaiya aapka 1 member hi ₹1,500 deta hai. Agar ye software mahine mein sirf 1 member ko bhi chhodne se rok le, to aapka software bilkul FREE ho gaya! Aur baaki ke 5 member bach gaye to wo aapka pure profit hai."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

