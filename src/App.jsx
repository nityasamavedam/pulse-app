import { useState } from "react";

const WEEK = {
  label: "Week of June 9, 2026",
  thisWeek: 14,
  lastWeek: 17,
  delta: -3,
  totalCalls: 8420,
};

const SIGNALS = [
  {
    id: 1,
    category: "objection",
    title: '"I\'ll think about it"',
    shortTitle: "I'll think about it",
    appearances: 2340,
    rate: 6,
    prev: 14,
    delta: -8,
    dir: "down",
    sev: "critical",
    lang: "Hindi, Tamil",
    contrib: 71,
    insight:
      "In 79% of unconverted calls, the customer disengaged within 20 seconds of the AI's response. The AI is validating the exit — \"I understand, this is an important decision\" — rather than re-engaging with a diagnostic question. The one converted English call below succeeded because the AI asked what the customer's actual concern was, turning a soft no into a product conversation.",
    script:
      "\"I understand. This is an important decision. Would it be okay if I scheduled a follow-up call next week?\"",
    snippets: [
      {
        lang: "Hindi",
        outcome: "Lost",
        lines: [
          { s: "AI", t: "Our home loan rate starts at 8.5% with flexible EMI options from ₹8,200/month." },
          { s: "Customer", t: "Haan, let me think about it and get back to you." },
          { s: "AI", t: "I understand. This is an important decision. Shall I call back next week?" },
          { s: "Customer", t: "No, I'll call if I need it." },
        ],
      },
      {
        lang: "English",
        outcome: "Converted",
        lines: [
          { s: "AI", t: "We also have zero processing fee if you apply before month end." },
          { s: "Customer", t: "Let me think about it." },
          { s: "AI", t: "Of course. Is it more the monthly EMI amount, or the documentation process?" },
          { s: "Customer", t: "Mostly the EMI. What happens if I extend the tenure to 20 years?" },
        ],
      },
    ],
    defaultInstruction:
      "When the customer says they need to think about it, acknowledge briefly, then ask what their main concern is — the EMI amount, the loan tenure, or the documentation. Use their answer to redirect, not to reschedule.",
  },
  {
    id: 2,
    category: "language",
    title: "Hindi calls: 17% → 11%",
    shortTitle: "Hindi underperforming",
    appearances: 3240,
    rate: 11,
    prev: 17,
    delta: -6,
    dir: "down",
    sev: "high",
    lang: "Hindi",
    contrib: 18,
    insight:
      "Hindi-language calls dropped 6 points immediately after the Tuesday v2.3 agent update. The update moved fee disclosure to the call opening. Hindi-speaking customers are disengaging at the fee mention at a rate of 34% — up from 12% before the update. The same customers who previously stayed through the pitch are now dropping in the first 45 seconds.",
    script:
      "v2.3 (current): \"Is loan ke liye processing fee 1% hogi, lekin interest rate 8.5% se shuru hoti hai.\" — Fee disclosed in minute 0–1.\n\nv2.2 (previous): Fee disclosed only after the customer expressed interest, typically minute 2–3.",
    snippets: [
      {
        lang: "Hindi",
        outcome: "Lost",
        lines: [
          { s: "AI", t: "Is loan ke liye processing fee 1% hogi, lekin interest 8.5% se shuru hoti hai." },
          { s: "Customer", t: "Processing fee? Nahi chahiye. Theek hai, baad mein dekhte hain." },
          { s: "AI", t: "Main samajhta hoon. Kya main agle hafte call kar sakta hoon?" },
          { s: "Customer", t: "[Disconnects]" },
        ],
      },
    ],
    defaultInstruction:
      "For Hindi-language calls, do not mention the processing fee in the opening. Establish interest and discuss EMI options first. Introduce the processing fee only after the customer has asked about loan details or expressed intent to apply.",
  },
  {
    id: 3,
    category: "prompt",
    title: "Agent v2.3 update: −5pts across all calls",
    shortTitle: "v2.3 prompt change",
    appearances: 4100,
    rate: 12,
    prev: 17,
    delta: -5,
    dir: "down",
    sev: "high",
    lang: "All languages",
    contrib: 8,
    insight:
      "Conversion was 17% in the 48 hours before v2.3 deployed on Tuesday. It dropped to 12% in the 48 hours after. The update moved fee disclosure to the opening across all languages. This change is the likely root cause of the Hindi language drop and a contributing factor to the overall shift. Consider reverting the fee disclosure timing to post-interest.",
    script:
      "Change log — v2.3, June 10:\nProcessing fee disclosure moved from minute 2–3 to minute 0–1 across all language configurations.\nNo other prompt changes in this version.",
    snippets: [],
    defaultInstruction: "",
  },
  {
    id: 4,
    category: "objection",
    title: '"Zero processing fee" pitch: +7pts in Tamil',
    shortTitle: "Zero fee pitch working",
    appearances: 215,
    rate: 21,
    prev: 14,
    delta: 7,
    dir: "up",
    sev: "positive",
    lang: "Tamil",
    contrib: 0,
    insight:
      "When the AI proactively mentions zero processing fee in Tamil calls, conversion hits 21% — 7 points above last week and 5 above the weekly average. This is an emergent AI behavior: the offer appears naturally in minute 2 and is not yet a formal instruction. If a future prompt update changes this behavior, the improvement disappears with no trace. Lock it in now.",
    script:
      "Emergent behavior (not yet a formal instruction):\n\"Intha maathathil apply pannaa processing fee illai.\" (If you apply this month, there is no processing fee.) — Appears organically in Tamil calls where the agent senses hesitation after the rate pitch.",
    snippets: [
      {
        lang: "Tamil",
        outcome: "Converted",
        lines: [
          { s: "AI", t: "Intha maathathil apply pannaa processing fee illai." },
          { s: "Customer", t: "Processing fee illayaa? Documents enna venaam?" },
          { s: "AI", t: "Aadhaar, PAN, last 3 months salary slip. Online submit panna mudiyum." },
          { s: "Customer", t: "Okay, appointment pottu kudunga." },
        ],
      },
    ],
    defaultInstruction:
      "For Tamil-cohort customers, proactively mention the zero processing fee offer in minute 2, immediately after presenting the interest rate. Do not wait for the customer to ask. Phrase it as: \"Intha maathathil apply pannaa processing fee illai\" (no processing fee this month).",
  },
  {
    id: 5,
    category: "objection",
    title: '"Competitor rate is lower" — Hindi cohort',
    shortTitle: "Competitor rate objection",
    appearances: 420,
    rate: 8,
    prev: 11,
    delta: -3,
    dir: "down",
    sev: "medium",
    lang: "Hindi",
    contrib: 3,
    insight:
      "When Hindi-speaking customers mention a competitor's lower rate, the AI currently restates the interest rate without addressing the comparison directly. In 88% of these calls, the customer disengages without booking. Offering the processing fee waiver as a compensating benefit has worked in the handful of calls where it appeared.",
    script:
      "\"Hamari rate competitive hai aur hum flexible EMI options provide karte hain.\" (Our rate is competitive and we offer flexible EMI options.) — Does not address the competitor's specific advantage.",
    snippets: [
      {
        lang: "Hindi",
        outcome: "Lost",
        lines: [
          { s: "Customer", t: "XYZ bank ne 8.2% offer kiya hai. Aapka 8.5% hai." },
          { s: "AI", t: "Hamari rate competitive hai aur hum flexible EMI options provide karte hain." },
          { s: "Customer", t: "Nahi, XYZ better lag raha hai. Baad mein dekhte hain." },
          { s: "AI", t: "Main samajhta hoon. Kya main dobara call kar sakta hoon?" },
          { s: "Customer", t: "[Disconnects]" },
        ],
      },
    ],
    defaultInstruction:
      "When the customer says the competitor's interest rate is lower, immediately offer the 0% processing fee waiver to offset the cost difference. Phrase it as a total-cost comparison, not a rate comparison.",
  },
];

const LANGS = [
  { lang: "Hindi", flag: "🇮🇳", calls: 3240, rate: 11, prev: 17, delta: -6 },
  { lang: "Tamil", flag: "🇮🇳", calls: 2180, rate: 16, prev: 14, delta: 2 },
  { lang: "English", flag: "🇮🇳", calls: 1640, rate: 18, prev: 17, delta: 1 },
  { lang: "Telugu", flag: "🇮🇳", calls: 980, rate: 15, prev: 15, delta: 0 },
  { lang: "Marathi", flag: "🇮🇳", calls: 380, rate: 13, prev: 14, delta: -1 },
];

const CATS = ["all", "objection", "language", "prompt", "segment"];
const CAT_LABELS = { all: "All signals", objection: "Objections", language: "Language", prompt: "Prompt changes", segment: "Segments" };
const CAT_COLORS = {
  objection: "bg-purple-100 text-purple-700",
  language: "bg-blue-100 text-blue-700",
  prompt: "bg-amber-100 text-amber-700",
  segment: "bg-teal-100 text-teal-700",
};
const SEV_COLORS = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  positive: "bg-green-50 text-green-700 border-green-200",
  monitoring: "bg-gray-50 text-gray-500 border-gray-200",
};
const SEV_LABELS = {
  critical: "Fix needed",
  high: "Review",
  medium: "Monitor",
  positive: "Lock in",
  monitoring: "Stable",
};
const DOT_COLORS = {
  critical: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  positive: "bg-green-500",
  monitoring: "bg-gray-300",
};

export default function PulseApp() {
  const [view, setView] = useState("matrix");
  const [catFilter, setCatFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [pbId, setPbId] = useState(null);
  const [fromDetail, setFromDetail] = useState(false);
  const [instructions, setInstructions] = useState({});
  const [deployed, setDeployed] = useState({});
  const [deployPct, setDeployPct] = useState(10);
  const [deployStep, setDeployStep] = useState(null);

  const selectedSignal = SIGNALS.find((s) => s.id === selectedId);
  const pbSignal = SIGNALS.find((s) => s.id === pbId);
  const instruction = instructions[pbId] ?? (pbSignal?.defaultInstruction || "");
  const deployedCount = Object.keys(deployed).length;

  function openDetail(id) {
    setSelectedId(id);
    setView("detail");
    setDeployStep(null);
  }

  function openPlaybook(id, fromDet = false) {
    setPbId(id);
    setFromDetail(fromDet);
    setView("playbook");
    setDeployStep(null);
  }

  function goBack() {
    if (view === "detail") setView("matrix");
    else if (view === "playbook") {
      if (fromDetail && selectedId) setView("detail");
      else setView("matrix");
    }
    setDeployStep(null);
  }

  function handleDeploy() {
    setDeployStep("confirm");
  }

  function confirmDeploy() {
    setDeployed((d) => ({ ...d, [pbId]: { pct: deployPct, instruction } }));
    setDeployStep("done");
  }

  const filteredSignals =
    catFilter === "all" ? SIGNALS : SIGNALS.filter((s) => s.category === catFilter);

  // ─── Header ───────────────────────────────────────────────
  function Header() {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium tracking-widest uppercase">8loop</div>
            <div className="text-lg font-semibold text-gray-900 leading-tight">Pulse</div>
          </div>
        </div>

        <div className="text-sm text-gray-400">{WEEK.label} · {WEEK.totalCalls.toLocaleString()} calls</div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Last week</div>
            <div className="text-xl font-semibold text-gray-400">{WEEK.lastWeek}%</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gray-200" />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">This week</div>
            <div className="text-2xl font-semibold text-red-600">{WEEK.thisWeek}%</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2 text-center">
            <div className="text-lg font-bold text-red-600">↓{Math.abs(WEEK.delta)}pts</div>
            <div className="text-xs text-red-400 font-medium">this week</div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Alert ────────────────────────────────────────────────
  function AlertBanner() {
    if (view !== "matrix") return null;
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed">
          Conversion dropped 3 points this week. Pulse identified{" "}
          <span className="font-semibold">2 critical signals</span> and a{" "}
          <span className="font-semibold">prompt change</span> that account for 97% of the shift.
          <span className="text-amber-600 ml-1">Click any signal to see the evidence and fix it.</span>
        </p>
      </div>
    );
  }

  // ─── Nav ──────────────────────────────────────────────────
  function NavTabs() {
    return (
      <div className="bg-white border-b border-gray-200 px-6 flex gap-0">
        {[
          { key: "matrix", label: "Performance matrix" },
          { key: "playbook", label: deployedCount > 0 ? `Playbook builder (${deployedCount} deployed)` : "Playbook builder" },
        ].map((tab) => {
          const active = view === tab.key || (view === "detail" && tab.key === "matrix");
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === "matrix") { setView("matrix"); setSelectedId(null); }
                else { setPbId(null); setView("playbook"); setDeployStep(null); }
              }}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                active ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ─── Matrix view ──────────────────────────────────────────
  function MatrixView() {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Category filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                catFilter === c ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Language breakdown tab */}
        {catFilter === "language" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div>Language</div>
              <div className="text-center">Calls</div>
              <div className="text-center">This week</div>
              <div className="text-center">Last week</div>
              <div className="text-center">Change</div>
            </div>
            {LANGS.map((l) => (
              <div key={l.lang} className="grid grid-cols-5 px-5 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50">
                <div className="font-medium text-sm text-gray-900">{l.lang}</div>
                <div className="text-center text-sm text-gray-500">{l.calls.toLocaleString()}</div>
                <div className={`text-center text-sm font-semibold ${l.rate < 14 ? "text-red-600" : l.rate > 17 ? "text-green-600" : "text-gray-700"}`}>{l.rate}%</div>
                <div className="text-center text-sm text-gray-400">{l.prev}%</div>
                <div className={`text-center text-sm font-medium ${l.delta < 0 ? "text-red-500" : l.delta > 0 ? "text-green-600" : "text-gray-400"}`}>
                  {l.delta > 0 ? "+" : ""}{l.delta}pts
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Signals table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="col-span-4">Signal</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1 text-right">Calls</div>
            <div className="col-span-2 text-center">Conversion</div>
            <div className="col-span-2 text-center">Change</div>
            <div className="col-span-1 text-center">Status</div>
          </div>
          {filteredSignals.map((s) => (
            <div
              key={s.id}
              onClick={() => openDetail(s.id)}
              className="grid grid-cols-12 px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors items-center group"
            >
              <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLORS[s.sev]}`} />
                <span className="text-sm font-medium text-gray-900 truncate">{s.title}</span>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CAT_COLORS[s.category] || "bg-gray-100 text-gray-500"}`}>
                  {CAT_LABELS[s.category] || s.category}
                </span>
              </div>
              <div className="col-span-1 text-right text-sm text-gray-500">{s.appearances.toLocaleString()}</div>
              <div className={`col-span-2 text-center text-sm font-semibold ${s.rate < 12 ? "text-red-600" : s.rate > 18 ? "text-green-600" : "text-gray-700"}`}>
                {s.rate}%
              </div>
              <div className={`col-span-2 text-center text-sm font-medium ${s.delta < 0 ? "text-red-500" : "text-green-600"}`}>
                {s.delta > 0 ? "+" : ""}{s.delta}pts
              </div>
              <div className="col-span-1 flex justify-center">
                {deployed[s.id] ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Deployed</span>
                ) : (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${SEV_COLORS[s.sev]}`}>
                    {SEV_LABELS[s.sev]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Detail view ──────────────────────────────────────────
  function DetailView() {
    if (!selectedSignal) return null;
    const s = selectedSignal;
    const isDeployed = !!deployed[s.id];

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1 transition-colors">
          ← Back to matrix
        </button>

        {/* Signal header card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CAT_COLORS[s.category] || "bg-gray-100 text-gray-500"}`}>
                  {CAT_LABELS[s.category] || s.category}
                </span>
                <span className="text-xs text-gray-400">{s.lang}</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">{s.title}</div>
              <div className="text-sm text-gray-500 mt-1">{s.appearances.toLocaleString()} calls this week</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Conversion</div>
              <div className={`text-3xl font-bold ${s.dir === "down" ? "text-red-600" : "text-green-600"}`}>{s.rate}%</div>
              <div className={`text-sm mt-0.5 ${s.delta < 0 ? "text-red-400" : "text-green-500"}`}>
                {s.delta > 0 ? "+" : ""}{s.delta}pts from {s.prev}%
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">What Pulse found</div>
            <p className="text-sm text-gray-800 leading-relaxed">{s.insight}</p>
          </div>

          {/* Current behavior */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {s.dir === "down" ? "Current AI behavior — what is going wrong" : "Current AI behavior — what is working"}
            </div>
            <div className={`rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap font-mono ${
              s.dir === "down" ? "bg-red-50 border border-red-100 text-gray-800" : "bg-green-50 border border-green-100 text-gray-800"
            }`}>{s.script}</div>
          </div>
        </div>

        {/* Call snippets */}
        {s.snippets.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Call evidence</div>
            {s.snippets.map((snippet, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{snippet.lang}</span>
                  <span className={`text-xs font-semibold ${snippet.outcome === "Converted" ? "text-green-600" : "text-red-500"}`}>
                    {snippet.outcome === "Converted" ? "✓ Converted" : "✗ Lost"}
                  </span>
                </div>
                <div className="space-y-2">
                  {snippet.lines.map((line, j) => (
                    <div key={j} className={`flex gap-3 ${line.s !== "AI" ? "flex-row-reverse" : ""}`}>
                      <div className={`text-xs font-semibold flex-shrink-0 mt-1.5 w-14 ${line.s === "AI" ? "text-gray-400" : "text-blue-400 text-right"}`}>
                        {line.s}
                      </div>
                      <div className={`text-sm leading-relaxed px-3 py-2 rounded-xl max-w-xs ${
                        line.s === "AI" ? "bg-gray-100 text-gray-800" : "bg-blue-50 text-blue-900"
                      }`}>{line.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {isDeployed ? (
          <div className="w-full py-3 rounded-xl bg-green-50 border border-green-200 text-center text-sm font-semibold text-green-700">
            ✓ Playbook deployed ({deployed[s.id]?.pct}% of calls)
          </div>
        ) : (
          <button
            onClick={() => openPlaybook(s.id, true)}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            {s.dir === "down" ? "Fix this in Playbook Builder →" : "Lock this in Playbook Builder →"}
          </button>
        )}
      </div>
    );
  }

  // ─── Playbook list (no signal selected) ──────────────────
  function PlaybookList() {
    const deployedSignals = SIGNALS.filter((s) => deployed[s.id]);
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Active playbooks</div>
        {deployedSignals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="text-gray-300 text-4xl mb-3">○</div>
            <div className="text-gray-500 text-sm font-medium mb-1">No playbooks deployed yet</div>
            <div className="text-gray-400 text-xs">Go to the Matrix, click a signal, and use the Playbook Builder to fix or lock in AI behavior.</div>
          </div>
        ) : (
          deployedSignals.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-green-200 p-4 mb-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.lang} · {s.appearances.toLocaleString()} calls</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    {deployed[s.id]?.pct}% of calls
                  </span>
                  <button
                    onClick={() => openPlaybook(s.id, false)}
                    className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                  >Edit</button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed italic">
                "{deployed[s.id]?.instruction}"
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // ─── Playbook builder ────────────────────────────────────
  function PlaybookBuilder() {
    if (!pbSignal) return <PlaybookList />;
    const s = pbSignal;

    if (deployStep === "done") {
      return (
        <div className="p-6 max-w-xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="text-xl font-semibold text-green-800 mb-2">Deployed to {deployPct}% of calls</div>
            <p className="text-sm text-green-700 leading-relaxed mb-2">
              Your new instruction for <span className="font-medium">{s.title}</span> is live.
            </p>
            <p className="text-sm text-green-600 mb-6">
              Check the Performance Matrix next Monday to see whether this moved the conversion rate for this signal.
            </p>
            <button
              onClick={() => { setView("matrix"); setDeployStep(null); setPbId(null); }}
              className="px-6 py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
            >Back to Pulse matrix</button>
          </div>
        </div>
      );
    }

    if (deployStep === "confirm") {
      return (
        <div className="p-6 max-w-xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-base font-semibold text-gray-900 mb-1">Confirm deployment</div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Deploying to <span className="font-semibold text-gray-900">{deployPct}% of calls</span> for{" "}
              <span className="font-medium">{s.title}</span>. The remaining {100 - deployPct}% continue with the current instruction as a control group.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">New instruction</div>
              <p className="text-sm text-gray-800 leading-relaxed italic">"{instruction}"</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDeploy}
                className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >Confirm and deploy</button>
              <button
                onClick={() => setDeployStep(null)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >Go back</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button onClick={goBack} className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1 transition-colors">
          ← {fromDetail ? "Back to signal detail" : "Back to matrix"}
        </button>

        {/* Context */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Editing instruction for</div>
            <div className="text-base font-semibold text-gray-900">{s.title}</div>
            <div className="text-sm text-gray-500">{s.appearances.toLocaleString()} calls · {s.lang}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current rate</div>
            <div className={`text-2xl font-bold ${s.dir === "down" ? "text-red-600" : "text-green-600"}`}>{s.rate}%</div>
            <div className={`text-xs ${s.delta < 0 ? "text-red-400" : "text-green-500"}`}>{s.delta > 0 ? "+" : ""}{s.delta}pts this week</div>
          </div>
        </div>

        {/* Current behavior */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {s.dir === "down" ? "Current behavior — what to replace" : "Behavior to formalize"}
          </div>
          <div className={`rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap ${
            s.dir === "down" ? "bg-red-50 border border-red-100 text-gray-700" : "bg-green-50 border border-green-100 text-gray-700"
          }`}>{s.script}</div>
        </div>

        {/* New instruction */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your new instruction</div>
          <div className="text-xs text-gray-400 mb-3">Write in plain English, the same way you would brief a sales rep.</div>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 leading-relaxed resize-none focus:outline-none focus:border-gray-400 transition-colors"
            rows={4}
            value={instruction}
            onChange={(e) => setInstructions((prev) => ({ ...prev, [pbId]: e.target.value }))}
            placeholder={
              s.dir === "down"
                ? "e.g. When the customer says they need to think about it, ask what their main concern is — the EMI amount, the loan tenure, or the documentation. Use their answer to redirect."
                : "e.g. When speaking with Tamil-cohort customers, proactively mention the zero processing fee offer in minute 2, before discussing interest rates."
            }
          />
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Preview</div>
          <div className="space-y-2">
            <div className="flex gap-3 flex-row-reverse">
              <div className="text-xs text-blue-400 font-semibold flex-shrink-0 mt-1.5 w-16 text-left">Customer</div>
              <div className="bg-blue-50 text-blue-900 text-sm px-3 py-2 rounded-xl max-w-xs">
                "{s.shortTitle || s.title.replace(/"/g, "")}"
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-xs text-gray-400 font-semibold flex-shrink-0 mt-1.5 w-16">AI</div>
              <div className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl max-w-xs leading-relaxed">
                {instruction.trim() ? (
                  s.dir === "down"
                    ? "I hear you. Before we wrap up — is your main concern the monthly EMI, the loan tenure, or the documentation process? I can walk you through each."
                    : "Intha maathathil apply pannaa processing fee illai — absolutely no processing fee if you apply this month. Would that change things?"
                ) : (
                  <span className="text-gray-400 italic">Write an instruction above to see a preview.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rollout */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Staged rollout</div>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="range" min={5} max={100} step={5}
              value={deployPct}
              onChange={(e) => setDeployPct(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-gray-900 w-10 text-right">{deployPct}%</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {deployPct <= 20
              ? `Safe test: your new instruction runs on ${deployPct}% of matching calls. The original handles the rest. Review next week's Matrix before expanding.`
              : deployPct === 100
              ? "Full rollout: all matching calls use your new instruction immediately. Consider testing at 10–20% first."
              : `Majority rollout: ${deployPct}% of calls use your new instruction. The rest run the original as a control.`}
          </p>
        </div>

        <button
          onClick={handleDeploy}
          disabled={!instruction.trim()}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Deploy to {deployPct}% of calls
        </button>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AlertBanner />
      <NavTabs />
      {view === "matrix" && <MatrixView />}
      {view === "detail" && <DetailView />}
      {(view === "playbook" || (view !== "matrix" && view !== "detail")) && <PlaybookBuilder />}
    </div>
  );
}
