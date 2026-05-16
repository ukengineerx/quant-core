import { useState, useMemo, useEffect } from "react";

const PHASES = [
  {
    id: 0, label: "Right Now", period: "This Week — May 2026", color: "#D85A30",
    tasks: [
      { id: "ugcnet-reg", label: "Register UGC NET June 2026 at ugcnet.nta.nic.in", urgent: true },
      { id: "bits-papers", label: "Get BITS HD CS previous year papers — study pattern first" },
      { id: "github-setup", label: "GitHub profile created and active" },
      { id: "qiskit-install", label: "Install Qiskit locally + open Nielsen & Chuang Ch.1" },
      { id: "credes-talk", label: "Talk to Credes partner — restructure so ops run without you" },
      { id: "marriage-convo", label: "Give life partner a concrete timeline (not 'someday')" },
    ]
  },
  {
    id: 1, label: "Phase 1", period: "May – Aug 2026", color: "#378ADD",
    tasks: [
      { id: "math-linalg", label: "Linear algebra review complete (3Blue1Brown → MIT OCW Strang)" },
      { id: "math-prob", label: "Probability & statistics review complete" },
      { id: "physics-qm", label: "Quantum mechanics basics — Susskind Theoretical Minimum" },
      { id: "qiskit-textbook", label: "IBM Qiskit textbook complete (learn.qiskit.org)" },
      { id: "nielsen-ch1-4", label: "Nielsen & Chuang chapters 1–4 read" },
      { id: "ibm-access", label: "IBM Quantum Network access registered (quantum.ibm.com)" },
      { id: "qworld-join", label: "QWorld India chapter joined" },
      { id: "bits-exam", label: "BITS HD CS exam given (May 27)" },
      { id: "ugcnet-june-exam", label: "UGC NET June 2026 exam given (Jun 22–30)" },
      { id: "india-prof-email", label: "3 IISc / IIT Madras quantum PhD students cold-emailed" },
    ]
  },
  {
    id: 2, label: "Phase 2", period: "Jul – Oct 2026", color: "#1D9E75",
    tasks: [
      { id: "project-1", label: "Qiskit Project 1 on GitHub — basic quantum circuit (Grover's / teleportation)" },
      { id: "qosf-apply", label: "QOSF Mentorship Program applied (qosf.org/mentorship)" },
      { id: "pennylane-learn", label: "PennyLane basics learned (pennylane.ai)" },
      { id: "nielsen-ch5-10", label: "Nielsen & Chuang chapters 5–10 read" },
      { id: "project-2", label: "Qiskit Project 2 on GitHub — quantum algorithm (VQE, QAOA, QML)" },
      { id: "ibm-challenge", label: "IBM Quantum Challenge participated" },
      { id: "research-q", label: "Specific research question identified and written down (1 paragraph)" },
      { id: "sop-draft", label: "SOP first draft written — problem + why quantum + why this lab" },
      { id: "intl-prof-email", label: "3 international quantum professors emailed with GitHub project link" },
      { id: "gre-prep", label: "GRE prep started (if targeting Waterloo / USA)" },
      { id: "gate-form", label: "GATE 2027 application submitted (Sep–Oct window)" },
      { id: "astar-apply", label: "A*STAR Singapore RA application submitted" },
      { id: "ntu-apply", label: "NTU Singapore MSc application submitted (Aug–Sep)" },
      { id: "nus-apply", label: "NUS MSc application submitted (Aug–Oct)" },
      { id: "ugcnet-dec-reg", label: "UGC NET December 2026 registered" },
      { id: "fulbright-apply", label: "Fulbright-Nehru Fellowship applied (Jul 2026)" },
    ]
  },
  {
    id: 3, label: "Phase 3", period: "Oct – Dec 2026", color: "#BA7517",
    tasks: [
      { id: "project-3", label: "Qiskit Project 3 on GitHub — original problem, not tutorial" },
      { id: "pennylane-project", label: "PennyLane project on GitHub (for Xanadu / QHack)" },
      { id: "gre-exam", label: "GRE exam given (if targeting Waterloo / USA)" },
      { id: "lor-secured", label: "3 letters of recommendation secured" },
      { id: "sop-final", label: "SOP finalized — specific lab + professor + research question named" },
      { id: "waterloo-apply", label: "Waterloo IQC MS application submitted (Nov)" },
      { id: "erasmus-apply", label: "Erasmus Mundus Quantum S&T applied (deadline Jan 2027)" },
      { id: "commonwealth-apply", label: "Commonwealth Scholarship applied (Oct–Nov)" },
      { id: "daad-apply", label: "DAAD research grant applied (Oct)" },
      { id: "ictp-apply", label: "ICTP Diploma Programme applied (Jan 2027)" },
      { id: "psi-apply", label: "PSI Perimeter Institute applied (Feb 2027)" },
      { id: "jest-reg", label: "JEST 2027 registration done (Sep)" },
      { id: "ugcnet-dec-exam", label: "UGC NET December 2026 exam given" },
      { id: "cdl-apply", label: "CDL Quantum application submitted (Oct)" },
    ]
  },
  {
    id: 4, label: "Phase 4", period: "Jan – Feb 2027", color: "#7F77DD",
    tasks: [
      { id: "gate-mocks", label: "GATE mock tests — minimum 1 full test per week (since Nov)" },
      { id: "iquhack", label: "MIT iQuHACK quantum hackathon participated (Jan 2027)" },
      { id: "gate-exam", label: "GATE 2027 exam given (Feb)" },
      { id: "jest-exam", label: "JEST 2027 exam given (Feb)" },
      { id: "iit-jam-exam", label: "IIT JAM 2027 exam given (Feb)" },
      { id: "qhack", label: "QHack Xanadu hackathon participated (Feb)" },
    ]
  },
];

const ALL_TASKS = {};
PHASES.forEach(p => p.tasks.forEach(t => { ALL_TASKS[t.id] = { ...t, phaseId: p.id, phaseColor: p.color, phaseLabel: p.label }; }));

const CHOICES = {
  "chosen":        { label: "✓ My Choice",      color: "#1D9E75", bg: "#001A12", border: "#0F3D25" },
  "smart-move":    { label: "⚡ Smart Move",     color: "#D4A017", bg: "#1A1200", border: "#3D2D00" },
  "starting-prep": { label: "⚙ Starting Prep",  color: "#378ADD", bg: "#00111A", border: "#0A2A40" },
  "gem-pick":      { label: "★ Gem Pick",        color: "#BA7517", bg: "#150F00", border: "#3A2200" },
  "not-confident": { label: "– Not Confident",   color: "#555",    bg: "#111",    border: "#222" },
  "interested":    { label: "→ Interested",      color: "#7F77DD", bg: "#0A0814", border: "#1A1535" },
};

const FUNDS = {
  1: {
    onetime: [
      { label: "GRE exam fee", inr: 17000, note: "Required for Waterloo" },
      { label: "IELTS / TOEFL", inr: 18000, note: "English proficiency" },
      { label: "Application fee", inr: 8000, note: "CAD 110" },
      { label: "Flight to Waterloo", inr: 58000, note: "Via Toronto" },
      { label: "First month setup", inr: 42000, note: "Deposit + sim + essentials" },
    ],
    monthly_cost: 80000,
    monthly_income: 155000,
    covered: ["Tuition (RA funded)", "Health insurance (university)", "Lab access"],
    net_monthly: "+₹75,000 surplus (RA stipend covers comfortably)",
    savings_needed: 150000,
    verdict: "Self-sustaining once RA starts. Main ask: ₹1.5L upfront to get there.",
    risk: "If RA not secured — tuition is CAD 8,000-12,000/year (₹5-7.5L). Confirm RA before accepting.",
  },
  2: {
    onetime: [
      { label: "GATE 2027 form", inr: 1700, note: "Application fee" },
      { label: "IIT Madras application", inr: 1000, note: "After GATE result" },
      { label: "Travel to Chennai", inr: 3500, note: "One-time relocation" },
      { label: "First month setup", inr: 15000, note: "Hostel deposit + essentials" },
    ],
    monthly_cost: 18000,
    monthly_income: 30000,
    covered: ["Tuition (GATE scholarship)", "Subsidised hostel", "Lab access", "Institute facilities"],
    net_monthly: "+₹12,000 surplus minimum. Comfortable on campus.",
    savings_needed: 20000,
    verdict: "Cheapest path by far. ₹20K buffer is all you need. Scholarship covers everything.",
    risk: "No risk if GATE clears. Entire path collapses if GATE fails — single point of failure.",
  },
  3: {
    onetime: [
      { label: "GRE Physics (optional but strong)", inr: 17000, note: "Strengthens application" },
      { label: "Application fee", inr: 0, note: "PSI application is free" },
      { label: "Flight to Waterloo", inr: 58000, note: "Via Toronto" },
      { label: "First month setup", inr: 40000, note: "Accommodation deposit + essentials" },
    ],
    monthly_cost: 82000,
    monthly_income: 120000,
    covered: ["Tuition (fully funded)", "Accommodation (covered)", "Monthly stipend", "Health insurance"],
    net_monthly: "+₹38,000 surplus. Stipend exceeds living costs.",
    savings_needed: 115000,
    verdict: "Fully funded. Best ROI of any international option. Need ₹1.15L just to get there.",
    risk: "Competitive but less so than Waterloo MS. If rejected, Waterloo MS is the natural fallback (same campus).",
  },
  4: {
    onetime: [
      { label: "UGC NET registration (×2 attempts)", inr: 2400, note: "June + December" },
      { label: "IISc PhD application", inr: 2000, note: "After JRF cleared" },
      { label: "Travel to Bangalore", inr: 2500, note: "One-time relocation" },
      { label: "First month setup", inr: 12000, note: "Hostel deposit + essentials" },
    ],
    monthly_cost: 18000,
    monthly_income: 37000,
    covered: ["Tuition (fully free)", "Subsidised hostel", "Lab + equipment access", "Research budget"],
    net_monthly: "+₹19,000 surplus every month. Comfortable researcher life.",
    savings_needed: 10000,
    verdict: "Cheapest international-grade research access. ₹10K is all you need. Stipend is generous for campus life.",
    risk: "JRF cutoff is top 6% of NET takers. High variance. But two attempts (June + December) in the window.",
  },
  7: {
    onetime: [
      { label: "Application fee", inr: 0, note: "ICTP application is free" },
      { label: "Flight to Trieste, Italy", inr: 75000, note: "Via Dubai/Doha typically" },
      { label: "First month setup", inr: 35000, note: "Accommodation deposit + essentials" },
      { label: "Schengen visa fee", inr: 8000, note: "Italian consulate" },
    ],
    monthly_cost: 70000,
    monthly_income: 85000,
    covered: ["Tuition (fully funded)", "Accommodation (ICTP guesthouse)", "Monthly stipend", "Meals (subsidised ICTP canteen)"],
    net_monthly: "+₹15,000 small surplus. Trieste is affordable for Italy.",
    savings_needed: 120000,
    verdict: "Fully funded. Need ₹1.2L to get there. ICTP canteen and guesthouse keep costs very low.",
    risk: "Low. India gets priority. Main risk is physics foundation gap — start Susskind now.",
  },
  8: {
    onetime: [
      { label: "NTU application fee", inr: 4500, note: "SGD 75" },
      { label: "NUS application fee", inr: 6000, note: "SGD 100" },
      { label: "IELTS exam", inr: 18000, note: "English proficiency" },
      { label: "Flight to Singapore", inr: 22000, note: "Direct Chennai/Delhi" },
      { label: "First month setup + deposit", inr: 65000, note: "Hostel deposit + sim + essentials" },
    ],
    monthly_cost: 88000,
    monthly_income: 50000,
    covered: ["Partial: RA funding if secured (SGD 2,000/month)", "Lab access", "Student health insurance"],
    net_monthly: "If RA: -₹38,000 deficit (still need top-up). If self-funded: -₹88,000/month.",
    savings_needed: 1500000,
    verdict: "Most expensive chosen option if not RA funded. Self-funded = ₹15L+/year. Secure RA before committing.",
    risk: "High financial risk without RA. Apply to A*STAR first (rank #9) — gets you inside Singapore for free.",
    warning: true,
  },
  9: {
    onetime: [
      { label: "Application fee", inr: 0, note: "A*STAR application is free" },
      { label: "Flight to Singapore", inr: 22000, note: "Direct from major Indian cities" },
      { label: "First month survival buffer", inr: 75000, note: "Before first paycheck arrives" },
    ],
    monthly_cost: 85000,
    monthly_income: 180000,
    covered: ["Full salary SGD 2,000-3,500/month", "No tuition — it's a job", "Work pass provided"],
    net_monthly: "+₹95,000 surplus minimum. Best cash flow of all options.",
    savings_needed: 100000,
    verdict: "Only option where you make money from day 1. ₹1L to get there, then fully self-sustaining with surplus.",
    risk: "Competitive but portfolio-based. No exam. Apply the moment Project 1 is on GitHub.",
  },
  14: {
    onetime: [
      { label: "MIT iQuHACK registration", inr: 0, note: "Free online" },
      { label: "QHack registration", inr: 0, note: "Free online" },
      { label: "IBM Quantum Challenge", inr: 0, note: "Free online" },
    ],
    monthly_cost: 0,
    monthly_income: 0,
    covered: ["Everything — all three are free and online"],
    net_monthly: "₹0 cost. Cloud credits awarded to winners.",
    savings_needed: 0,
    verdict: "Zero cost. Just time. 3-7 days per event. Do all three — they overlap with GATE prep syllabus.",
    risk: "No financial risk. Only risk is time cost during GATE prep crunch.",
  },
};

const OPPORTUNITIES = [
  { rank: 1, tier: "S", name: "Waterloo IQC MS", sub: "+ CDL Quantum Accelerator", location: "Waterloo, Canada", deadline: "Dec 2026", fs: 10, rs: 10, as: 7, gem: false,
    choice: "chosen", choiceNote: "Primary international target. CDL pipeline is the reason.",
    why: "Only place combining world's largest quantum institute (IQC) with world's top quantum startup accelerator (CDL) in the same city. RA funded. This is a documented pipeline: IQC MS → CDL participant → quantum company founded. No other institution offers this combination.",
    gives: ["CDL Quantum accelerator — direct founder pipeline", "RA funded CAD 2,000–2,500/month", "Global quantum investor network access", "Best quantum founder pipeline on earth"],
    required: ["math-linalg","math-prob","physics-qm","qiskit-textbook","nielsen-ch1-4","project-1","project-2","project-3","ibm-access","research-q","sop-final","intl-prof-email","lor-secured","gre-exam","waterloo-apply"],
    specific: [{ id: "wt-prof-reply", label: "Got reply from at least 1 IQC professor before applying" }, { id: "wt-ra", label: "Applied for Research Assistantship specifically (not just MS)" }, { id: "wt-cdl-check", label: "Reviewed CDL Quantum cohort structure and requirements" }] },

  { rank: 2, tier: "S", name: "IIT Madras M.Tech", sub: "→ IITM Incubator + NQM", location: "Chennai, India", deadline: "GATE Feb 2027", fs: 9, rs: 7, as: 9, gem: false,
    choice: "chosen", choiceNote: "Primary India target. Solves everything — research, family, cost.",
    why: "Best India-based founder pipeline. IITM Incubator is one of India's best. NQM (₹6000cr) grants flow through here. Near-zero cost — GATE scholarship covers living. Solves marriage and family situation. India-native equivalent of the Waterloo path.",
    gives: ["IITM Incubator + Pravartak + NQM access", "₹25–35K/month covered (near zero cost)", "Solves personal obligations — you stay in India", "India quantum founder network"],
    required: ["math-linalg","math-prob","credes-talk","marriage-convo","gate-form","gate-mocks","gate-exam","research-q"],
    specific: [{ id: "iitm-gate-score", label: "GATE CS score 70+ (IIT Madras cutoff)" }, { id: "iitm-qprof", label: "Identified quantum lab professor to work under at IIT Madras" }, { id: "iitm-incubator-check", label: "Reviewed IITM Incubator + Pravartak programs and eligibility" }] },

  { rank: 3, tier: "S", name: "PSI Perimeter Institute", sub: "Gateway into Waterloo ecosystem", location: "Waterloo, Canada", deadline: "Feb 2027", fs: 9, rs: 10, as: 7, gem: true,
    choice: "smart-move", choiceNote: "Fully funded. Same campus as IQC + CDL. Almost zero competition from India. Asymmetric bet.",
    why: "Hidden gem. Fully funded 1-year master's-level programme in theoretical physics. Same campus as IQC and CDL. Almost nobody in India applies. Open to B.Tech grads. Best ROI of any international programme — zero cost, world-class network, Waterloo PhD pathway.",
    gives: ["Fully funded — tuition + stipend + accommodation", "Same campus as IQC + CDL Quantum", "World-class faculty network", "Direct Waterloo PhD pathway"],
    required: ["math-linalg","math-prob","physics-qm","nielsen-ch1-4","project-1","project-2","research-q","sop-draft","lor-secured","psi-apply"],
    specific: [{ id: "psi-prereq", label: "Reviewed PSI prerequisites — quantum mechanics and linear algebra solid" }, { id: "psi-student-contact", label: "Emailed a current or former PSI student for tips" }, { id: "psi-submitted", label: "PSI Perimeter application submitted (Feb 2027)" }] },

  { rank: 4, tier: "A", name: "IISc PhD via UGC NET JRF", sub: "CQIQC — free PhD, ₹37K/month", location: "Bangalore, India", deadline: "Jun / Dec 2026", fs: 7, rs: 9, as: 8, gem: false,
    choice: "starting-prep", choiceNote: "Starting UGC NET prep now. JRF = free IISc PhD. High value if cleared.",
    why: "If JRF clears — free PhD at IISc's Centre for Quantum Information and Quantum Computing. ₹37K/month fellowship. Solves personal situation completely. NQM access. Bangalore startup ecosystem nearby. Deeper research path than M.Tech.",
    gives: ["₹37K/month stipend, zero tuition", "CQIQC — real frontier quantum research", "NQM project eligibility", "Bangalore deep tech ecosystem"],
    required: ["ugcnet-reg","ugcnet-june-exam","math-linalg","math-prob","physics-qm","research-q","india-prof-email"],
    specific: [{ id: "jrf-cleared", label: "UGC NET JRF cleared (top 6% cutoff)" }, { id: "iisc-cqiqc-prof", label: "Identified CQIQC professor whose research matches your direction" }, { id: "iisc-phd-apply", label: "IISc PhD application submitted" }] },

  { rank: 5, tier: "A", name: "Erasmus Mundus — Quantum S&T", sub: "TU Delft / Copenhagen / Grenoble", location: "EU", deadline: "Jan 2027", fs: 7, rs: 9, as: 7, gem: false,
    choice: null, choiceNote: null,
    why: "Fully funded 2-year MSc across top EU quantum universities. TU Delft placement = Microsoft's quantum lab. €1,000/month stipend + tuition. EU deep tech ecosystem growing fast. Strong research depth even without the Waterloo founder pipeline.",
    gives: ["Full scholarship — tuition + €1,000/month", "Microsoft quantum lab (TU Delft placement)", "EU quantum network across 3 universities", "2-year structured depth"],
    required: ["project-1","project-2","project-3","sop-final","lor-secured","research-q","intl-prof-email","erasmus-apply"],
    specific: [{ id: "erasmus-uni", label: "Checked professor research fit at TU Delft + Copenhagen" }, { id: "erasmus-prof", label: "Emailed Erasmus Mundus quantum programme coordinator" }] },

  { rank: 6, tier: "A", name: "TU Delft — QuTech PhD", sub: "Microsoft quantum lab embedded here", location: "Delft, Netherlands", deadline: "Rolling", fs: 8, rs: 10, as: 5, gem: false,
    choice: null, choiceNote: null,
    why: "Microsoft's quantum lab is physically embedded at QuTech. Salaried PhD ~€2,400/month. One of top 3 quantum hardware centres globally. Best option if your quantum interest is hardware, error correction, or quantum cryptography specifically.",
    gives: ["Salaried PhD ~€2,400/month", "Microsoft quantum lab daily access", "Top 3 hardware centre globally", "EU startup ecosystem base"],
    required: ["project-1","project-2","project-3","pennylane-project","research-q","sop-final","intl-prof-email","lor-secured"],
    specific: [{ id: "qutech-opening", label: "Found specific open PhD position at QuTech" }, { id: "qutech-prof-email", label: "Emailed QuTech professor with tailored research proposal" }, { id: "qutech-apply", label: "QuTech PhD application submitted" }] },

  { rank: 7, tier: "A", name: "ICTP Diploma Programme", sub: "Priority for Indian nationals", location: "Trieste, Italy", deadline: "Jan 2027", fs: 6, rs: 8, as: 8, gem: true,
    choice: "gem-pick", choiceNote: "Fully funded. India gets priority. Nobody else is applying from here. Will consider.",
    why: "Fully funded 1-year advanced physics. India is classified as a developing country — priority admission. Less competitive than it should be. Builds the physics foundation quantum computing demands. Gateway to top PhD programs globally.",
    gives: ["Fully funded — tuition + stipend + accommodation", "Priority admission as Indian national", "Physics depth that quantum founders need", "Top PhD programme gateway"],
    required: ["math-linalg","math-prob","physics-qm","nielsen-ch1-4","sop-draft","lor-secured","ictp-apply"],
    specific: [{ id: "ictp-track", label: "Confirmed QIS / condensed matter track availability for 2027" }, { id: "ictp-submitted", label: "ICTP Diploma application submitted (Jan 2027)" }] },

  { rank: 8, tier: "B", name: "NUS CQT / NTU Singapore", sub: "Fastest international MS timeline", location: "Singapore", deadline: "Aug–Oct 2026", fs: 6, rs: 7, as: 9, gem: false,
    choice: "chosen", choiceNote: "Already in the plan. Jan 2027 intake is the fastest international path.",
    why: "Most accessible international MS option. Your 84% GPA clears NTU comfortably. NUS is possible with projects. Jan 2027 intake means you could be doing quantum research in 8 months. English medium, no culture barrier.",
    gives: ["Jan 2027 intake possible — fastest international", "CQT research access at NUS", "English medium, easy transition", "Singapore quantum ecosystem entry"],
    required: ["project-1","project-2","research-q","sop-draft","intl-prof-email","lor-secured","ntu-apply","nus-apply"],
    specific: [{ id: "sg-prof-reply", label: "Got reply from NUS / NTU quantum professor" }, { id: "sg-visa", label: "Singapore student pass requirements reviewed" }] },

  { rank: 9, tier: "B", name: "A*STAR Singapore — Research Assistant", sub: "No exam. Apply now.", location: "Singapore", deadline: "Rolling (apply now)", fs: 5, rs: 6, as: 10, gem: false,
    choice: "chosen", choiceNote: "Already in the plan. Apply with first Qiskit project. Fastest entry.",
    why: "Fastest international quantum access from India. No entrance exam — portfolio-based selection. SGD 2,000–3,500/month paid. Apply the moment Qiskit Project 1 is done. Stepping stone into NUS/NTU PhD from inside Singapore.",
    gives: ["No exam — portfolio-based entry", "SGD 2,000–3,500/month", "Inside Singapore research ecosystem", "NUS/NTU PhD launchpad from inside"],
    required: ["github-setup","project-1","research-q","astar-apply"],
    specific: [{ id: "astar-opening", label: "Found specific A*STAR quantum research opening" }, { id: "astar-submitted", label: "A*STAR application submitted" }, { id: "astar-interview", label: "A*STAR interview prep — research questions ready" }] },

  { rank: 10, tier: "B", name: "Xanadu / IonQ / Quantinuum Internship", sub: "Remote-friendly quantum industry", location: "Canada / USA / UK", deadline: "Rolling", fs: 6, rs: 5, as: 8, gem: false,
    choice: null, choiceNote: null,
    why: "Real quantum company experience — paid, remote-friendly. Strong PhD application signal. Xanadu (PennyLane), IonQ (trapped-ion hardware), Quantinuum (quantum software). GitHub contributions to PennyLane directly noticed by Xanadu.",
    gives: ["Real industry experience, paid", "Remote-friendly — no relocation needed", "Strong PhD application signal", "Quantum company network"],
    required: ["project-1","project-2","pennylane-learn","pennylane-project","ibm-access","github-setup"],
    specific: [{ id: "pl-contrib", label: "PennyLane GitHub contribution made (Xanadu path)" }, { id: "internship-apply", label: "Applied to Xanadu / IonQ / Quantinuum" }] },

  { rank: 11, tier: "B", name: "JEST → TIFR / HRI / IMSc", sub: "Same exam window as GATE", location: "India", deadline: "Feb 2027", fs: 5, rs: 9, as: 7, gem: false,
    choice: "not-confident", choiceNote: "Not confident about this one. Theory-heavy. May skip and focus on GATE fully.",
    why: "TIFR has world-class quantum complexity group. Fully funded PhD. Sit this alongside GATE — overlapping syllabus, same February window. Theory-heavy path — stronger for quantum algorithms and complexity research than hardware.",
    gives: ["World-class quantum complexity research (TIFR)", "Fully funded PhD stipend", "Same exam window as GATE — one prep, two shots", "Global credibility signal"],
    required: ["math-linalg","math-prob","physics-qm","jest-reg","jest-exam"],
    specific: [{ id: "jest-syllabus", label: "JEST 2027 syllabus reviewed and gaps mapped" }, { id: "jest-papers", label: "3 years JEST previous papers solved" }, { id: "tifr-quantum-read", label: "TIFR quantum complexity group research papers read" }] },

  { rank: 12, tier: "B", name: "Fulbright-Nehru Fellowship", sub: "Most prestigious India-USA bilateral", location: "USA", deadline: "Jul 2026", fs: 7, rs: 7, as: 6, gem: false,
    choice: null, choiceNote: null,
    why: "Fully funded access to US quantum ecosystem — MIT, Caltech, University of Maryland. Most prestigious India-US bilateral. Needs a US professor to agree to host you first. Worth pursuing in parallel — high upside, low downside.",
    gives: ["Fully funded USA access", "MIT / Caltech / Maryland quantum proximity", "Top prestige signal for future fundraising", "US quantum investor ecosystem"],
    required: ["project-1","research-q","sop-draft","intl-prof-email","lor-secured","fulbright-apply"],
    specific: [{ id: "fb-us-prof", label: "US professor agreed to host / supervise" }, { id: "fb-submitted", label: "Fulbright-Nehru application submitted (Jul 2026)" }] },

  { rank: 13, tier: "C", name: "DAAD Research Grant", sub: "Max Planck / Munich Quantum Valley", location: "Germany", deadline: "Oct 2026", fs: 4, rs: 6, as: 7, gem: false,
    choice: null, choiceNote: null,
    why: "Funded 1–6 month research stay at Max Planck Institute or Munich Quantum Valley. No degree required. Builds international credibility fast. Stepping stone to TU Delft or ETH PhD applications.",
    gives: ["Funded short research stay", "Germany quantum network", "International credibility builder", "EU PhD application signal"],
    required: ["project-1","research-q","daad-apply"],
    specific: [{ id: "daad-host", label: "German quantum professor agreed to host (required for DAAD)" }, { id: "daad-submitted", label: "DAAD grant application submitted (Oct 2026)" }] },

  { rank: 14, tier: "C", name: "MIT iQuHACK + QHack + IBM Challenge", sub: "Essential community entry points", location: "Remote", deadline: "Jan–May 2027", fs: 3, rs: 3, as: 10, gem: false,
    choice: "interested", choiceNote: "A*STAR researchers recently won QHack — strong signal this is where the community is.",
    why: "Not career-defining alone. But collectively essential — each 3–7 days, free, adds real signal to GitHub and applications. IBM Challenge in May, MIT iQuHACK in January, QHack in February. Overlaps perfectly with GATE prep syllabus.",
    gives: ["Portfolio signal for all applications", "IBM / Xanadu researcher visibility", "Global quantum community entry", "GitHub activity and credibility"],
    required: ["qiskit-textbook","ibm-access","github-setup","pennylane-learn"],
    specific: [{ id: "iquhack-done", label: "MIT iQuHACK participated (Jan 2027)" }, { id: "qhack-done", label: "QHack participated (Feb 2027)" }, { id: "ibm-ch-done", label: "IBM Quantum Challenge participated (May)" }] },
];

const TIER_META = {
  "S": { color: "#D4A017", label: "S — Best possible outcome" },
  "A": { color: "#1D9E75", label: "A — Excellent with some prep" },
  "B": { color: "#378ADD", label: "B — Good, realistic soon" },
  "C": { color: "#555",    label: "C — Useful, lower founder ceiling" },
};

const ScoreBar = ({ value, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <div style={{ flex: 1, height: 3, background: "#1A1A1A", borderRadius: 2 }}>
      <div style={{ width: `${value * 10}%`, height: "100%", background: color, borderRadius: 2 }} />
    </div>
    <span style={{ fontSize: 9, color: "#444", fontFamily: "monospace", minWidth: 12 }}>{value}</span>
  </div>
);

const Checkbox = ({ checked, onChange, label, urgent, color = "#1D9E75" }) => (
  <label style={{ display: "flex", alignItems: "flex-start", gap: 9, cursor: "pointer", padding: "5px 0" }}>
    <div onClick={onChange} style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${checked ? color : "#2A2A2A"}`, background: checked ? color : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <span style={{ fontSize: 11.5, color: checked ? "#444" : urgent ? "#D85A30" : "#999", textDecoration: checked ? "line-through" : "none", lineHeight: 1.4, transition: "all 0.15s" }}>{label}{urgent && !checked && <span style={{ marginLeft: 6, fontSize: 9, background: "#2A0D06", color: "#D85A30", padding: "1px 5px", borderRadius: 3, fontWeight: 500 }}>urgent</span>}</span>
  </label>
);

const ProgressRing = ({ pct, color, size = 48 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1A1A1A" strokeWidth="4"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.4s" }}/>
    </svg>
  );
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("quantum-checked-tasks");
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedOp, setExpandedOp] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [opView, setOpView] = useState({});
  const [tierFilter, setTierFilter] = useState("all");
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverResults, setDiscoverResults] = useState([]);
  const [discoverError, setDiscoverError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [discoverLog, setDiscoverLog] = useState([]);

  useEffect(() => {
    localStorage.setItem("quantum-checked-tasks", JSON.stringify(checked));
  }, [checked]);

  const PROFILE = `User profile for context:
- Name: Ujjwal, 25 years old, Meerut, India
- B.Tech CS, 84% GPA
- Goal: Deep tech founder in quantum computing
- Currently running: Credes (service company, partner manages it)
- Exams upcoming: BITS HD CS (May 27 2026), UGC NET June 2026, GATE 2027 (Feb)
- Already targeting: Waterloo IQC MS, IIT Madras M.Tech, PSI Perimeter Institute, IISc PhD via UGC NET JRF, NUS/NTU Singapore, A*STAR Singapore RA, ICTP Diploma
- Current date: May 2026
- Budget: Limited — prefers funded/free opportunities
- Language: English. Based in India, open to international.`;

  const SYSTEM = `You are a quantum computing opportunity finder for a specific user. Search the web for current, real opportunities. Return ONLY a valid JSON array. No markdown, no preamble, no backticks.

${PROFILE}

For each opportunity found, return this exact format:
[{"name":"...","location":"...","type":"ms|phd|internship|fellowship|school|hackathon|grant","deadline":"...","funding":"...","why_relevant":"1-2 sentences why this fits the user","link":"...","fit":"high|medium|low"}]

Rules:
- Only include opportunities relevant to quantum computing / quantum information / quantum physics
- Prioritize funded opportunities
- Exclude opportunities the user is already targeting
- Find current openings (2026-2027 cycle)
- If deadline is past, exclude it
- Return 4-8 results maximum
- Return ONLY the JSON array, nothing else`;

  const search = async (q) => {
    if (!q.trim()) return;
    setDiscoverLoading(true);
    setDiscoverError("");
    setDiscoverResults([]);
    const query = q.trim();
    setDiscoverLog(prev => [`Searching: "${query}"...`, ...prev.slice(0, 4)]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: SYSTEM,
          messages: [{ role: "user", content: query }]
        })
      });
      const data = await res.json();
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");
      if (start === -1 || end === -1) throw new Error("No results found");
      const parsed = JSON.parse(clean.slice(start, end + 1));
      setDiscoverResults(parsed);
      setDiscoverLog(prev => [`Found ${parsed.length} opportunities`, ...prev.slice(0, 4)]);
    } catch (e) {
      setDiscoverError("Search failed or no results. Try a more specific query.");
      setDiscoverLog(prev => ["Search failed — try rephrasing", ...prev.slice(0, 4)]);
    }
    setDiscoverLoading(false);
  };

  const addToWatchlist = (op) => {
    if (!watchlist.find(w => w.name === op.name)) setWatchlist(p => [...p, op]);
  };

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const phaseProgress = (phase) => {
    const done = phase.tasks.filter(t => checked[t.id]).length;
    return { done, total: phase.tasks.length, pct: Math.round((done / phase.tasks.length) * 100) };
  };

  const opProgress = (op) => {
    const ids = [...op.required, ...op.specific.map(s => s.id)];
    const done = ids.filter(id => checked[id]).length;
    return { done, total: ids.length, pct: Math.round((done / ids.length) * 100) };
  };

  const totalPhaseTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const totalPhaseDone = PHASES.reduce((a, p) => a + p.tasks.filter(t => checked[t.id]).length, 0);
  const overallPct = Math.round((totalPhaseDone / totalPhaseTasks) * 100);

  const nextActions = useMemo(() => {
    const out = [];
    for (const phase of PHASES) {
      for (const task of phase.tasks) {
        if (!checked[task.id]) { out.push({ ...task, phase }); if (out.length >= 6) break; }
      }
      if (out.length >= 6) break;
    }
    return out;
  }, [checked]);

  const readyOps = OPPORTUNITIES.filter(op => opProgress(op).pct >= 75);
  const filteredOps = tierFilter === "all" ? OPPORTUNITIES
    : tierFilter === "my-path" ? OPPORTUNITIES.filter(o => o.choice && o.choice !== "not-confident")
    : OPPORTUNITIES.filter(o => o.tier === tierFilter);

  const s = { bg: "#080808", card: "#0C0C0C", border: "#1A1A1A", p: "#F0F0F0", s: "#888", t: "#444" };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: s.bg, minHeight: "100vh", color: s.p }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'); * { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#222} label{user-select:none}`}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 9.5, letterSpacing: "0.15em", textTransform: "uppercase", color: s.t, fontFamily: "monospace", marginBottom: 4 }}>quantum founder personal guide</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Your Quantum Path</div>
            <div style={{ fontSize: 11, color: s.t, marginTop: 2 }}>B.Tech CS · 84% GPA · 25y · Meerut, India → Deep Tech Founder</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ProgressRing pct={overallPct} color="#1D9E75" size={52} />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1D9E75", lineHeight: 1 }}>{overallPct}%</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{totalPhaseDone}/{totalPhaseTasks}</div>
              <div style={{ fontSize: 10, color: s.t }}>tasks done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "16px 20px 0", borderBottom: `0.5px solid ${s.border}` }}>
        {[["dashboard","Dashboard"],["learn","Learning Pipeline"],["ops","Opportunities"],["discover","✦ Discover"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ border: "none", background: "transparent", color: tab===k ? s.p : s.t, fontSize: 12.5, fontWeight: tab===k ? 500 : 400, padding: "8px 16px", cursor: "pointer", borderBottom: `2px solid ${tab===k?"#1D9E75":"transparent"}`, marginBottom: -1, transition: "all 0.15s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div>
            {/* My Path quick view */}
            <div style={{ background: s.card, border: "0.5px solid #0F3D25", borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1D9E75", fontFamily: "monospace" }}>my path — chosen opportunities</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: s.t, fontFamily: "monospace" }}>min savings needed</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#BA7517" }}>₹20K – ₹1.5L</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: s.t, fontFamily: "monospace" }}>max (NUS self-funded)</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#D85A30" }}>₹15L+</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {OPPORTUNITIES.filter(o => o.choice && o.choice !== "not-confident").map(op => {
                  const p = opProgress(op);
                  const ch = CHOICES[op.choice];
                  return (
                    <div key={op.rank} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 10, alignItems: "center" }}>
                      <div style={{ fontSize: 9, background: ch.bg, color: ch.color, padding: "2px 7px", borderRadius: 3, fontWeight: 500, border: `0.5px solid ${ch.border}`, whiteSpace: "nowrap" }}>{ch.label}</div>
                      <div>
                        <div style={{ fontSize: 12, color: "#CCC" }}>#{op.rank} {op.name}</div>
                        <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{op.deadline}</div>
                      </div>
                      <div style={{ width: 60, height: 2.5, background: "#1A1A1A", borderRadius: 1 }}>
                        <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct >= 75 ? "#1D9E75" : p.pct >= 40 ? "#BA7517" : "#333", borderRadius: 1 }} />
                      </div>
                      <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace", minWidth: 28, textAlign: "right" }}>{p.pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 8, marginBottom: 20 }}>
              {PHASES.map(phase => {
                const p = phaseProgress(phase);
                return (
                  <div key={phase.id} style={{ background: s.card, border: `0.5px solid ${s.border}`, borderRadius: 8, padding: "12px", cursor: "pointer" }} onClick={() => { setTab("learn"); setExpandedPhase(phase.id); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 10, fontWeight: 500, color: phase.color, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "monospace" }}>{phase.label}</div>
                      <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{p.done}/{p.total}</div>
                    </div>
                    <div style={{ fontSize: 10.5, color: s.t, marginBottom: 8 }}>{phase.period}</div>
                    <div style={{ height: 3, background: "#1A1A1A", borderRadius: 2 }}>
                      <div style={{ width: `${p.pct}%`, height: "100%", background: phase.color, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: s.card, border: `0.5px solid ${s.border}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 12, fontFamily: "monospace" }}>next actions</div>
                {nextActions.length === 0 ? <div style={{ fontSize: 12, color: "#1D9E75" }}>All tasks complete ✓</div> :
                  nextActions.map((task, i) => (
                    <div key={task.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: task.phase.color, flexShrink: 0, marginTop: 5 }} />
                      <div>
                        <div style={{ fontSize: 11.5, color: task.urgent ? "#D85A30" : "#999", lineHeight: 1.4 }}>{task.label}</div>
                        <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{task.phase.label} · {task.phase.period}</div>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div style={{ background: s.card, border: `0.5px solid ${s.border}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 12, fontFamily: "monospace" }}>opportunity readiness</div>
                {OPPORTUNITIES.slice(0, 7).map(op => {
                  const p = opProgress(op);
                  const tc = TIER_META[op.tier]?.color;
                  return (
                    <div key={op.rank} style={{ display: "grid", gridTemplateColumns: "14px 1fr 36px", gap: 8, alignItems: "center", marginBottom: 7 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: tc, fontFamily: "monospace" }}>#{op.rank}</div>
                      <div>
                        <div style={{ fontSize: 11, color: "#CCC", marginBottom: 2 }}>{op.name}</div>
                        <div style={{ height: 2.5, background: "#1A1A1A", borderRadius: 1 }}>
                          <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct >= 75 ? "#1D9E75" : p.pct >= 40 ? "#BA7517" : "#333", borderRadius: 1, transition: "width 0.3s" }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: p.pct >= 75 ? "#1D9E75" : s.t, fontFamily: "monospace", textAlign: "right" }}>{p.pct}%</div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 10, fontSize: 11, color: "#1D9E75" }}>
                  {readyOps.length > 0 ? `${readyOps.length} opportunity${readyOps.length > 1 ? "ies" : "y"} ready to apply →` : "Complete more tasks to unlock applications"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEARNING PIPELINE TAB */}
        {tab === "learn" && (
          <div>
            <div style={{ fontSize: 11, color: s.t, marginBottom: 16 }}>Check off tasks as you complete them. Progress updates across the whole guide.</div>
            {PHASES.map(phase => {
              const p = phaseProgress(phase);
              const open = expandedPhase === phase.id;
              return (
                <div key={phase.id} style={{ marginBottom: 8 }}>
                  <div onClick={() => setExpandedPhase(open ? -1 : phase.id)} style={{ display: "flex", alignItems: "center", gap: 12, background: s.card, border: `0.5px solid ${open ? phase.color + "55" : s.border}`, borderRadius: open ? "8px 8px 0 0" : 8, padding: "12px 14px", cursor: "pointer" }}>
                    <div style={{ minWidth: 38, textAlign: "center" }}>
                      <ProgressRing pct={p.pct} color={phase.color} size={38} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: phase.color, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>{phase.label}</span>
                        <span style={{ fontSize: 10.5, color: s.t }}>{phase.period}</span>
                      </div>
                      <div style={{ fontSize: 11, color: s.t, marginTop: 2 }}>{p.done}/{p.total} tasks · {p.pct}% complete</div>
                    </div>
                    <div style={{ fontSize: 16, color: s.t, transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}>›</div>
                  </div>
                  {open && (
                    <div style={{ background: "#0A0A0A", border: `0.5px solid ${phase.color + "33"}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "12px 16px" }}>
                      {phase.tasks.map(task => (
                        <Checkbox key={task.id} checked={!!checked[task.id]} onChange={() => toggle(task.id)} label={task.label} urgent={task.urgent} color={phase.color} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* OPPORTUNITIES TAB */}
        {tab === "ops" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
              {[["all","All"],["my-path","My Path"],["S","Tier S"],["A","Tier A"],["B","Tier B"],["C","Tier C"]].map(([k,l]) => (
                <button key={k} onClick={() => setTierFilter(k)} style={{ border: `0.5px solid ${tierFilter===k ? (k==="my-path"?"#1D9E75": TIER_META[k]?.color || "#E0E0E0") : s.border}`, borderRadius: 100, padding: "4px 12px", fontSize: 11, cursor: "pointer", background: tierFilter===k ? (k==="my-path"?"#001A12": (TIER_META[k]?.color || "#E0E0E0") + "22") : "transparent", color: tierFilter===k ? (k==="my-path"?"#1D9E75": TIER_META[k]?.color || "#E0E0E0") : s.t, transition: "all 0.15s" }}>{l}</button>
              ))}
            </div>

            {["S","A","B","C"].map(tier => {
              const items = filteredOps.filter(o => o.tier === tier);
              if (!items.length) return null;
              const tm = TIER_META[tier];
              return (
                <div key={tier} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: tm.color, fontFamily: "monospace", whiteSpace: "nowrap" }}>{tm.label}</div>
                    <div style={{ flex: 1, height: "0.5px", background: tm.color + "33" }} />
                  </div>
                  {items.map(op => {
                    const p = opProgress(op);
                    const open = expandedOp === op.rank;
                    const view = opView[op.rank] || "checklist";
                    return (
                      <div key={op.rank} style={{ marginBottom: 6 }}>
                        <div onClick={() => setExpandedOp(open ? null : op.rank)} style={{ display: "grid", gridTemplateColumns: "32px 1fr 160px 24px", gap: 10, alignItems: "center", background: s.card, border: `0.5px solid ${open ? tm.color+"66" : op.choice ? CHOICES[op.choice]?.border : s.border}`, borderRadius: open ? "8px 8px 0 0" : 8, padding: "10px 14px", cursor: "pointer" }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: tm.color, fontFamily: "monospace" }}>#{op.rank}</div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13, fontWeight: 500 }}>{op.name}</span>
                              {op.gem && <span style={{ fontSize: 9, background: "#2A1800", color: "#BA7517", padding: "1px 5px", borderRadius: 3, fontWeight: 500 }}>★ gem</span>}
                              {op.choice && <span style={{ fontSize: 9, background: CHOICES[op.choice].bg, color: CHOICES[op.choice].color, padding: "1px 6px", borderRadius: 3, fontWeight: 500, border: `0.5px solid ${CHOICES[op.choice].border}` }}>{CHOICES[op.choice].label}</span>}
                            </div>
                            <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{op.location} · {op.deadline}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <ScoreBar value={op.fs} color="#D4A017" />
                            <ScoreBar value={op.rs} color="#1D9E75" />
                            <ScoreBar value={op.as} color="#378ADD" />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
                              <span style={{ fontSize: 9.5, color: p.pct >= 75 ? "#1D9E75" : p.pct >= 40 ? "#BA7517" : s.t, fontFamily: "monospace" }}>{p.pct}% ready</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 14, color: s.t, textAlign: "center", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}>›</div>
                        </div>

                        {open && (
                          <div style={{ background: "#0A0A0A", border: `0.5px solid ${tm.color+"44"}`, borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                            {/* Readiness bar */}
                            <div style={{ padding: "10px 14px 0" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>readiness</span>
                                <span style={{ fontSize: 10, color: p.pct >= 75 ? "#1D9E75" : "#BA7517", fontFamily: "monospace" }}>{p.done}/{p.total} · {p.pct}%</span>
                              </div>
                              <div style={{ height: 3, background: "#1A1A1A", borderRadius: 2, marginBottom: op.choiceNote ? 10 : 12 }}>
                                <div style={{ width: `${p.pct}%`, height: "100%", background: p.pct >= 75 ? "#1D9E75" : p.pct >= 40 ? "#BA7517" : "#333", borderRadius: 2, transition: "width 0.3s" }} />
                              </div>
                              {op.choice && op.choiceNote && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: CHOICES[op.choice].bg, border: `0.5px solid ${CHOICES[op.choice].border}`, borderRadius: 6, padding: "8px 10px", marginBottom: 12 }}>
                                  <span style={{ fontSize: 9.5, fontWeight: 500, color: CHOICES[op.choice].color, whiteSpace: "nowrap", marginTop: 1 }}>{CHOICES[op.choice].label}</span>
                                  <span style={{ fontSize: 11.5, color: CHOICES[op.choice].color, opacity: 0.8, lineHeight: 1.4 }}>{op.choiceNote}</span>
                                </div>
                              )}
                            </div>

                            {/* Inner tabs */}
                            <div style={{ display: "flex", gap: 0, paddingLeft: 14, borderBottom: `0.5px solid ${s.border}`, overflowX: "auto" }}>
                              {[["checklist","Checklist"],["funds","Funds"],["why","Why this rank"],["gives","What it gives"]].map(([k,l]) => (
                                <button key={k} onClick={(e) => { e.stopPropagation(); setOpView(pv => ({...pv, [op.rank]: k})); }} style={{ border: "none", background: "transparent", color: view===k ? s.p : s.t, fontSize: 11, padding: "7px 12px", cursor: "pointer", borderBottom: `2px solid ${view===k ? tm.color : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap" }}>{l}</button>
                              ))}
                            </div>

                            <div style={{ padding: "12px 16px" }}>
                              {view === "why" && <p style={{ fontSize: 12, color: "#999", lineHeight: 1.7 }}>{op.why}</p>}

                              {view === "gives" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                  {op.gives.map((g, i) => (
                                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: tm.color, flexShrink: 0, marginTop: 5 }} />
                                      <span style={{ fontSize: 12, color: "#999", lineHeight: 1.4 }}>{g}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {view === "funds" && (() => {
                                const f = FUNDS[op.rank];
                                if (!f) return <div style={{ fontSize: 12, color: s.t }}>Fund breakdown only available for your chosen opportunities.</div>;
                                const totalOnetime = f.onetime.reduce((a, x) => a + x.inr, 0);
                                return (
                                  <div>
                                    {f.warning && (
                                      <div style={{ background: "#1A0800", border: "0.5px solid #D85A3033", borderRadius: 6, padding: "9px 12px", marginBottom: 14, fontSize: 11.5, color: "#D85A30", lineHeight: 1.5 }}>
                                        ⚠ {f.risk}
                                      </div>
                                    )}
                                    {/* Savings needed — big number */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                      <div style={{ background: "#0A0A0A", border: "0.5px solid #0F3D25", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                                        <div style={{ fontSize: 9.5, color: "#1D9E75", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>savings needed</div>
                                        <div style={{ fontSize: 20, fontWeight: 600, color: "#1D9E75", letterSpacing: "-0.02em" }}>
                                          {f.savings_needed === 0 ? "₹0" : `₹${(f.savings_needed/100000).toFixed(1)}L`}
                                        </div>
                                        <div style={{ fontSize: 10, color: s.t, marginTop: 3 }}>before you can start</div>
                                      </div>
                                      <div style={{ background: "#0A0A0A", border: `0.5px solid ${f.monthly_income > f.monthly_cost ? "#0F3D25" : "#3A2200"}`, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                                        <div style={{ fontSize: 9.5, color: f.monthly_income > f.monthly_cost ? "#1D9E75" : "#BA7517", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>net monthly</div>
                                        <div style={{ fontSize: 16, fontWeight: 600, color: f.monthly_income > f.monthly_cost ? "#1D9E75" : "#BA7517", letterSpacing: "-0.02em" }}>
                                          {f.monthly_income === 0 && f.monthly_cost === 0 ? "₹0" :
                                           f.monthly_income > f.monthly_cost ? `+₹${((f.monthly_income - f.monthly_cost)/1000).toFixed(0)}K` :
                                           `-₹${((f.monthly_cost - f.monthly_income)/1000).toFixed(0)}K`}
                                        </div>
                                        <div style={{ fontSize: 10, color: s.t, marginTop: 3 }}>{f.monthly_income > f.monthly_cost ? "surplus" : f.monthly_income === 0 ? "free" : "deficit"}</div>
                                      </div>
                                    </div>

                                    {/* One-time costs */}
                                    <div style={{ marginBottom: 14 }}>
                                      <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 8, fontFamily: "monospace" }}>one-time costs</div>
                                      {f.onetime.map((item, i) => (
                                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < f.onetime.length-1 ? `0.5px solid ${s.border}` : "none" }}>
                                          <div>
                                            <div style={{ fontSize: 12, color: "#CCC" }}>{item.label}</div>
                                            <div style={{ fontSize: 10, color: s.t }}>{item.note}</div>
                                          </div>
                                          <div style={{ fontSize: 12.5, fontWeight: 500, color: item.inr === 0 ? "#1D9E75" : "#AAA", textAlign: "right", fontFamily: "monospace" }}>
                                            {item.inr === 0 ? "Free" : `₹${item.inr.toLocaleString()}`}
                                          </div>
                                        </div>
                                      ))}
                                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", marginTop: 4 }}>
                                        <div style={{ fontSize: 11, color: s.t }}>Total one-time</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F0F0", fontFamily: "monospace" }}>₹{totalOnetime.toLocaleString()}</div>
                                      </div>
                                    </div>

                                    {/* What's covered */}
                                    <div style={{ marginBottom: 14 }}>
                                      <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 8, fontFamily: "monospace" }}>what's covered / funded</div>
                                      {f.covered.map((c, i) => (
                                        <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", padding: "3px 0" }}>
                                          <div style={{ fontSize: 12, color: "#1D9E75", flexShrink: 0, marginTop: 1 }}>✓</div>
                                          <div style={{ fontSize: 11.5, color: "#777" }}>{c}</div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Monthly breakdown */}
                                    {(f.monthly_cost > 0 || f.monthly_income > 0) && (
                                      <div style={{ marginBottom: 14 }}>
                                        <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 8, fontFamily: "monospace" }}>monthly breakdown</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                          {f.monthly_income > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                              <span style={{ fontSize: 11.5, color: "#777" }}>Income (stipend/salary)</span>
                                              <span style={{ fontSize: 12, color: "#1D9E75", fontFamily: "monospace" }}>+₹{f.monthly_income.toLocaleString()}</span>
                                            </div>
                                          )}
                                          {f.monthly_cost > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                              <span style={{ fontSize: 11.5, color: "#777" }}>Living costs (rent + food + misc)</span>
                                              <span style={{ fontSize: 12, color: "#BA7517", fontFamily: "monospace" }}>-₹{f.monthly_cost.toLocaleString()}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Verdict */}
                                    <div style={{ background: "#0C0C0C", border: `0.5px solid ${s.border}`, borderRadius: 7, padding: "10px 12px" }}>
                                      <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 5, fontFamily: "monospace" }}>bottom line</div>
                                      <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{f.verdict}</div>
                                      {!f.warning && f.risk && <div style={{ fontSize: 11, color: "#BA7517", marginTop: 6, lineHeight: 1.5 }}>Risk: {f.risk}</div>}
                                    </div>
                                  </div>
                                );
                              })()}

                              {view === "checklist" && (
                                <div>
                                  <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 8, fontFamily: "monospace" }}>foundation tasks required</div>
                                  {op.required.map(id => {
                                    const task = ALL_TASKS[id];
                                    if (!task) return null;
                                    return (
                                      <div key={id} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "4px 0" }}>
                                        <div onClick={() => toggle(id)} style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${checked[id] ? task.phaseColor : "#2A2A2A"}`, background: checked[id] ? task.phaseColor : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
                                          {checked[id] && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                        <div>
                                          <div style={{ fontSize: 11.5, color: checked[id] ? "#333" : "#888", textDecoration: checked[id] ? "line-through" : "none", lineHeight: 1.4 }}>{task.label}</div>
                                          <div style={{ fontSize: 9.5, color: s.t, fontFamily: "monospace" }}>{task.phaseLabel} · {PHASES.find(p=>p.id===task.phaseId)?.period}</div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, margin: "12px 0 8px", fontFamily: "monospace" }}>opportunity-specific steps</div>
                                  {op.specific.map(task => (
                                    <Checkbox key={task.id} checked={!!checked[task.id]} onChange={() => toggle(task.id)} label={task.label} color={tm.color} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Score legend */}
            <div style={{ display: "flex", gap: 16, padding: "10px 0", flexWrap: "wrap" }}>
              {[["Founder pipeline","#D4A017"],["Research depth","#1D9E75"],["Access now","#378ADD"]].map(([l,c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 10, color: s.t }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DISCOVER TAB */}
        {tab === "discover" && (
          <div>
            <div style={{ fontSize: 11, color: s.t, marginBottom: 20, lineHeight: 1.6 }}>
              AI-powered search for new quantum opportunities. Uses live web search. Your profile is sent automatically — results are filtered to fit your situation.
            </div>

            {/* Presets */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 8, fontFamily: "monospace" }}>quick searches</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "New quantum computing scholarships and fellowships 2026-2027",
                  "Quantum computing internships open now 2026",
                  "Funded quantum research positions India 2026",
                  "Quantum hackathons and competitions 2026-2027",
                  "New quantum MS PhD programs accepting applications",
                  "Quantum computing grants for early career researchers India",
                  "Singapore quantum computing opportunities 2026",
                  "National Quantum Mission India positions and grants",
                ].map((q, i) => (
                  <button key={i} onClick={() => { setDiscoverQuery(q); search(q); }} style={{ border: `0.5px solid ${s.border}`, borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer", background: "transparent", color: "#888", textAlign: "left", lineHeight: 1.4, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "#7F77DD"; e.target.style.color = "#CCC"; }}
                    onMouseLeave={e => { e.target.style.borderColor = s.border; e.target.style.color = "#888"; }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom search */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                value={discoverQuery}
                onChange={e => setDiscoverQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search(discoverQuery)}
                placeholder="Search for any quantum opportunity..."
                style={{ flex: 1, background: s.card, border: `0.5px solid ${s.border}`, borderRadius: 7, padding: "10px 14px", fontSize: 12.5, color: s.p, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={() => search(discoverQuery)} disabled={discoverLoading} style={{ background: discoverLoading ? "#111" : "#0F3D25", border: `0.5px solid ${discoverLoading ? s.border : "#1D9E75"}`, borderRadius: 7, padding: "10px 18px", fontSize: 12, cursor: discoverLoading ? "wait" : "pointer", color: discoverLoading ? s.t : "#1D9E75", fontWeight: 500, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                {discoverLoading ? "Searching..." : "Search →"}
              </button>
            </div>

            {/* Loading state */}
            {discoverLoading && (
              <div style={{ background: s.card, border: `0.5px solid #7F77DD33`, borderRadius: 8, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#7F77DD", marginBottom: 8 }}>Searching the web for current opportunities...</div>
                <div style={{ fontSize: 10, color: s.t }}>Filtering results to match your profile</div>
              </div>
            )}

            {/* Error */}
            {discoverError && !discoverLoading && (
              <div style={{ background: "#1A0A0A", border: "0.5px solid #D85A3033", borderRadius: 8, padding: "12px 16px", fontSize: 12, color: "#D85A30" }}>{discoverError}</div>
            )}

            {/* Results */}
            {discoverResults.length > 0 && !discoverLoading && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, fontFamily: "monospace" }}>{discoverResults.length} opportunities found</div>
                  <div style={{ fontSize: 10, color: s.t }}>"{discoverQuery}"</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {discoverResults.map((op, i) => {
                    const inWatchlist = watchlist.find(w => w.name === op.name);
                    const fitColor = op.fit === "high" ? "#1D9E75" : op.fit === "medium" ? "#BA7517" : "#555";
                    const fitBg = op.fit === "high" ? "#001A12" : op.fit === "medium" ? "#150F00" : "#111";
                    return (
                      <div key={i} style={{ background: s.card, border: `0.5px solid ${op.fit === "high" ? "#0F3D25" : s.border}`, borderRadius: 8, padding: "13px 15px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: s.p }}>{op.name}</span>
                              <span style={{ fontSize: 9, background: fitBg, color: fitColor, padding: "1px 6px", borderRadius: 3, fontWeight: 500, border: `0.5px solid ${fitColor}33` }}>{op.fit} fit</span>
                              <span style={{ fontSize: 9, background: "#111", color: "#555", padding: "1px 6px", borderRadius: 3, border: "0.5px solid #222" }}>{op.type}</span>
                            </div>
                            <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{op.location} · Deadline: {op.deadline}</div>
                          </div>
                          <button onClick={() => addToWatchlist(op)} style={{ border: `0.5px solid ${inWatchlist ? "#0F3D25" : s.border}`, borderRadius: 6, padding: "5px 10px", fontSize: 10.5, cursor: inWatchlist ? "default" : "pointer", background: inWatchlist ? "#001A12" : "transparent", color: inWatchlist ? "#1D9E75" : s.t, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {inWatchlist ? "✓ Saved" : "+ Save"}
                          </button>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#777", marginBottom: 6, lineHeight: 1.5 }}><span style={{ color: "#555", fontSize: 10 }}>Funding: </span>{op.funding}</div>
                        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5, marginBottom: op.link ? 8 : 0 }}>{op.why_relevant}</div>
                        {op.link && <a href={op.link} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#378ADD", textDecoration: "none", fontFamily: "monospace" }}>{op.link}</a>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Watchlist */}
            {watchlist.length > 0 && (
              <div style={{ background: s.card, border: "0.5px solid #0A2A40", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#378ADD", fontFamily: "monospace" }}>saved opportunities ({watchlist.length})</div>
                  <button onClick={() => setWatchlist([])} style={{ fontSize: 10, color: s.t, background: "transparent", border: "none", cursor: "pointer" }}>clear all</button>
                </div>
                {watchlist.map((op, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < watchlist.length-1 ? `0.5px solid ${s.border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#CCC" }}>{op.name}</div>
                      <div style={{ fontSize: 10, color: s.t, fontFamily: "monospace" }}>{op.location} · {op.deadline}</div>
                    </div>
                    <span style={{ fontSize: 9, background: op.fit==="high"?"#001A12":"#111", color: op.fit==="high"?"#1D9E75":"#555", padding: "1px 6px", borderRadius: 3 }}>{op.fit} fit</span>
                    <button onClick={() => setWatchlist(p => p.filter(w => w.name !== op.name))} style={{ fontSize: 11, color: s.t, background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Search log */}
            {discoverLog.length > 0 && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "#080808", borderRadius: 6, border: `0.5px solid ${s.border}` }}>
                <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: s.t, marginBottom: 6, fontFamily: "monospace" }}>search log</div>
                {discoverLog.map((l, i) => <div key={i} style={{ fontSize: 10, color: i===0?"#888":"#333", fontFamily: "monospace", padding: "2px 0" }}>› {l}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
