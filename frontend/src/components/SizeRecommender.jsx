import { useMemo, useState } from "react";
import { 
  Ruler, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Footprints,
  Sparkles,
  TrendingUp
} from "lucide-react";

const CM_PER_INCH = 2.54;

// Extended and more accurate size mapping
const SIZE_TABLE = [
  { cm: 22.0, eu: 35, uk: 2.5, us: 4 },
  { cm: 22.5, eu: 36, uk: 3.5, us: 5 },
  { cm: 23.0, eu: 36.5, uk: 4, us: 5.5 },
  { cm: 23.5, eu: 37.5, uk: 4.5, us: 6 },
  { cm: 24.0, eu: 38, uk: 5, us: 6.5 },
  { cm: 24.5, eu: 39, uk: 5.5, us: 7 },
  { cm: 25.0, eu: 40, uk: 6, us: 7.5 },
  { cm: 25.5, eu: 40.5, uk: 6.5, us: 8 },
  { cm: 26.0, eu: 41, uk: 7, us: 8.5 },
  { cm: 26.5, eu: 42, uk: 7.5, us: 9 },
  { cm: 27.0, eu: 42.5, uk: 8, us: 9.5 },
  { cm: 27.5, eu: 43, uk: 8.5, us: 10 },
  { cm: 28.0, eu: 44, uk: 9, us: 10.5 },
  { cm: 28.5, eu: 44.5, uk: 9.5, us: 11 },
  { cm: 29.0, eu: 45, uk: 10, us: 11.5 },
  { cm: 29.5, eu: 46, uk: 10.5, us: 12 },
  { cm: 30.0, eu: 46.5, uk: 11, us: 12.5 },
  { cm: 30.5, eu: 47, uk: 11.5, us: 13 },
];

function nearestSize(cm) {
  let best = SIZE_TABLE[0];
  let bestDiff = Math.abs(cm - best.cm);

  for (const row of SIZE_TABLE) {
    const diff = Math.abs(cm - row.cm);
    if (diff < bestDiff) {
      best = row;
      bestDiff = diff;
    }
  }
  return { ...best, diff: bestDiff };
}

export default function SizeRecommender({ onPickSize }) {
  const [unit, setUnit] = useState("cm");
  const [value, setValue] = useState("");
  const [fit, setFit] = useState("regular");
  const [showGuide, setShowGuide] = useState(false);

  const result = useMemo(() => {
    const num = Number(value);
    if (!num || num <= 0) return null;

    let cm = unit === "cm" ? num : num * CM_PER_INCH;

    // Fit adjustments
    if (fit === "snug") cm -= 0.3;
    if (fit === "roomy") cm += 0.3;

    const rec = nearestSize(cm);
    
    // Enhanced hints based on difference
    let hint = "";
    let confidence = "high";
    
    if (rec.diff < 0.2) {
      hint = "Perfect match! This size should fit you well.";
      confidence = "high";
    } else if (rec.diff < 0.4) {
      hint = "Good match. You might be between sizes—consider going 0.5 size up for extra comfort.";
      confidence = "medium";
    } else {
      hint = "You're between sizes. We recommend trying both this size and 0.5 size up if possible.";
      confidence = "low";
    }

    return { inputCm: cm, ...rec, hint, confidence };
  }, [value, unit, fit]);

  // Get fit description
  const getFitDescription = (fitType) => {
    switch (fitType) {
      case "snug":
        return "Tight fit, minimal room for movement";
      case "regular":
        return "Standard fit with moderate comfort space";
      case "roomy":
        return "Loose fit with extra room for comfort";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-xl border border-purple-500/30">
              <Ruler className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Size Finder</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Measure your foot length and get instant size recommendations across all sizing systems.
          </p>
        </div>

        {/* Unit Toggle - Enhanced */}
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setUnit("cm")}
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              unit === "cm"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {unit === "cm" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
            )}
            <span className="relative">CM</span>
          </button>
          <button
            type="button"
            onClick={() => setUnit("in")}
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              unit === "in"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {unit === "in" && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
            )}
            <span className="relative">INCH</span>
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Foot Length Input */}
        <div className="lg:col-span-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <Footprints className="w-4 h-4 text-sky-400" />
            Foot Length ({unit})
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={unit === "cm" ? "e.g., 26.5" : "e.g., 10.4"}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
              {unit}
            </div>
          </div>
          
          {/* Measurement Guide Button */}
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="mt-3 flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 transition-colors group"
          >
            <Info className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            {showGuide ? "Hide" : "Show"} measurement guide
          </button>
        </div>

        {/* Fit Preference */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            Fit Preference
          </label>
          <select
            value={fit}
            onChange={(e) => setFit(e.target.value)}
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-base text-slate-100 focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(148 163 184)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="snug">Snug Fit</option>
            <option value="regular">Regular Fit</option>
            <option value="roomy">Roomy Fit</option>
          </select>
          <p className="mt-2 text-xs text-slate-500">
            {getFitDescription(fit)}
          </p>
        </div>
      </div>

      {/* Measurement Guide - Collapsible */}
      {showGuide && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-sky-500/10 p-5 animate-fadeIn">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-300 mb-2">How to Measure Your Foot</h3>
              <ol className="space-y-2 text-xs text-blue-200/80">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-400 flex-shrink-0">1.</span>
                  <span>Place a blank sheet of paper on a flat surface against a wall.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-400 flex-shrink-0">2.</span>
                  <span>Stand with your heel against the wall and mark the longest toe on the paper.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-400 flex-shrink-0">3.</span>
                  <span>Measure the distance from the wall to the mark using a ruler.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-400 flex-shrink-0">4.</span>
                  <span>Measure both feet and use the larger measurement.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!result ? (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 text-center">
          <div className="inline-flex p-3 bg-slate-700/30 rounded-full mb-3">
            <Ruler className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">
            Enter your foot length above to see personalized size recommendations
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl border p-6 ${
          result.confidence === "high"
            ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
            : result.confidence === "medium"
            ? "border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10"
            : "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
        }`}>
          {/* Confidence Badge */}
          <div className="flex items-center gap-2 mb-4">
            {result.confidence === "high" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold text-green-300">Perfect Match</span>
              </div>
            ) : result.confidence === "medium" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 border border-sky-500/30 rounded-full">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-300">Good Match</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">Between Sizes</span>
              </div>
            )}
          </div>

          {/* Size Display */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-4">
            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-2">Recommended Size</div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <span className="text-xs text-slate-500 font-medium block mb-0.5">EU</span>
                  <span className="text-xl font-black text-slate-100">{result.eu}</span>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <span className="text-xs text-slate-500 font-medium block mb-0.5">UK</span>
                  <span className="text-xl font-black text-slate-100">{result.uk}</span>
                </div>
                <div className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <span className="text-xs text-slate-500 font-medium block mb-0.5">US</span>
                  <span className="text-xl font-black text-slate-100">{result.us}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">{result.hint}</p>
            </div>

            {/* Use Size Button */}
            {onPickSize && (
              <button
                type="button"
                onClick={() => onPickSize(result)}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/30 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Use This Size
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-700/50">
            <Ruler className="w-3.5 h-3.5" />
            Based on measured foot length: {result.inputCm.toFixed(1)} cm
            {fit !== "regular" && ` • ${fit.charAt(0).toUpperCase() + fit.slice(1)} fit preference applied`}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className="mt-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-purple-500/10 rounded-lg flex-shrink-0">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Pro Tips</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 flex-shrink-0">•</span>
                <span>Measure your feet in the evening when they're slightly larger</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 flex-shrink-0">•</span>
                <span>Wear the socks you plan to use with the sneakers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 flex-shrink-0">•</span>
                <span>If between sizes, consider the shoe's intended use (athletic vs. casual)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add CSS animation for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}