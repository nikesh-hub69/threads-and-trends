// src/components/ShoeCareTips.jsx
import { useMemo, useState } from "react";
import { 
  Sparkles, 
  PackageOpen, 
  Wrench, 
  AlertCircle, 
  CheckCircle2,
  Droplet,
  Wind,
  Sun,
  ShieldCheck
} from "lucide-react";

function cleanText(t) {
  return (t || "").trim();
}

export default function ShoeCareTips({ cleaning, storage, maintenance, fallbackName = "" }) {
  const [tab, setTab] = useState("cleaning");
  const [isAnimating, setIsAnimating] = useState(false);

  const hasAny = useMemo(() => {
    return !!cleanText(cleaning) || !!cleanText(storage) || !!cleanText(maintenance);
  }, [cleaning, storage, maintenance]);

  // Enhanced fallback with material-specific tips
  const fallback = useMemo(() => {
    const name = (fallbackName || "").toLowerCase();

    const isSuede = name.includes("suede");
    const isLeather = name.includes("leather");
    const isKnit = name.includes("knit") || name.includes("mesh");
    const isCanvas = name.includes("canvas");

    return {
      cleaning: isSuede
        ? "Use a specialized suede brush to remove dry dirt and dust. Avoid water at all costs as it can stain suede. For stubborn stains, use a suede eraser and brush gently in one direction. Consider a suede protector spray for future protection."
        : isLeather
        ? "Wipe down with a soft, slightly damp cloth to remove surface dirt. Apply a quality leather cleaner and conditioner sparingly with a soft cloth in circular motions. Avoid soaking the leather. Let air dry naturally away from direct heat."
        : isKnit
        ? "Use a soft-bristled brush with a mild soap and water solution. Gently dab and brush in circular motions—avoid aggressive scrubbing which can damage knit fibers. Rinse with clean water and air dry only, never use a dryer."
        : isCanvas
        ? "Remove loose dirt with a dry brush. Mix mild detergent with warm water, then scrub gently with a soft brush. Rinse thoroughly and air dry. For white canvas, a magic eraser can help with scuff marks."
        : "Remove dust and loose dirt with a soft brush or cloth. Clean gently using a mild soap and lukewarm water solution. Use a soft brush for textured areas. Rinse well and air dry away from direct heat sources.",
      storage:
        "Store your sneakers in a cool, dry, and well-ventilated area away from direct sunlight to prevent fading and material degradation. Use shoe trees or stuff with acid-free tissue paper to maintain shape and absorb moisture. Keep them in their original box or a breathable storage container. Avoid stacking heavy items on top.",
      maintenance:
        "Rotate between pairs regularly to reduce wear and allow materials to breathe. Keep laces and insoles clean—wash them separately when needed. Apply water-repellent spray periodically for protection. Check outsoles for wear and consider resoling services when needed. Wipe down after each wear to prevent dirt buildup.",
    };
  }, [fallbackName]);

  const text = useMemo(() => {
    const v =
      tab === "cleaning"
        ? cleanText(cleaning)
        : tab === "storage"
        ? cleanText(storage)
        : cleanText(maintenance);

    if (v) return v;

    return tab === "cleaning"
      ? fallback.cleaning
      : tab === "storage"
      ? fallback.storage
      : fallback.maintenance;
  }, [tab, cleaning, storage, maintenance, fallback]);

  // Handle tab change with animation
  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setTab(newTab);
      setIsAnimating(false);
    }, 150);
  };

  // Get icon and color for current tab
  const getTabDetails = (tabName) => {
    switch (tabName) {
      case "cleaning":
        return {
          icon: Sparkles,
          color: "sky",
          gradient: "from-sky-500 to-blue-600",
          bgGradient: "from-sky-500/10 to-blue-500/10",
        };
      case "storage":
        return {
          icon: PackageOpen,
          color: "purple",
          gradient: "from-purple-500 to-fuchsia-600",
          bgGradient: "from-purple-500/10 to-fuchsia-500/10",
        };
      case "maintenance":
        return {
          icon: Wrench,
          color: "emerald",
          gradient: "from-emerald-500 to-green-600",
          bgGradient: "from-emerald-500/10 to-green-500/10",
        };
      default:
        return {
          icon: Sparkles,
          color: "sky",
          gradient: "from-sky-500 to-blue-600",
          bgGradient: "from-sky-500/10 to-blue-500/10",
        };
    }
  };

  const currentTabDetails = getTabDetails(tab);
  const CurrentIcon = currentTabDetails.icon;

  if (!hasAny && !fallbackName) return null;

  return (
    <section className="mt-12 rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-sm p-8 shadow-2xl shadow-slate-950/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 bg-gradient-to-br ${currentTabDetails.bgGradient} rounded-xl border border-${currentTabDetails.color}-500/30`}>
              <ShieldCheck className={`w-6 h-6 text-${currentTabDetails.color}-400`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Shoe Care Guide</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Expert tips for cleaning, storage, and maintenance to keep your sneakers looking fresh longer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Product-specific
          </span>
        </div>
      </div>

      {/* Tab Navigation - Enhanced */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["cleaning", "storage", "maintenance"].map((tabName) => {
          const details = getTabDetails(tabName);
          const Icon = details.icon;
          const isActive = tab === tabName;

          return (
            <button
              key={tabName}
              className={`group relative px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 overflow-hidden ${
                isActive
                  ? `border-${details.color}-500/50 bg-gradient-to-br ${details.bgGradient} text-${details.color}-100 shadow-lg shadow-${details.color}-500/20`
                  : "border-slate-700/50 bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:border-slate-600/50 hover:text-slate-300"
              }`}
              onClick={() => handleTabChange(tabName)}
              type="button"
            >
              {/* Shimmer effect on active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
              
              <span className="relative flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Card - Enhanced */}
      <div className={`rounded-2xl border border-slate-800/50 bg-gradient-to-br ${currentTabDetails.bgGradient} backdrop-blur-sm overflow-hidden shadow-xl transition-all duration-300 ${
        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Content Header with Icon */}
        <div className={`bg-gradient-to-r ${currentTabDetails.gradient} px-6 py-4 border-b border-white/10`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CurrentIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-white">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Guidelines
            </h3>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {text}
            </p>
          </div>

          {/* Additional Tips Section */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="p-1.5 bg-amber-500/20 rounded-lg flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 mb-1 uppercase tracking-wider">
                  Important Reminder
                </h4>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Avoid direct heat sources like hair dryers, radiators, or direct sunlight. Always air-dry your sneakers naturally after cleaning to prevent material damage.
                </p>
              </div>
            </div>

            {/* Quick Tips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="p-1.5 bg-blue-500/10 rounded">
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs text-slate-300">Use mild cleaners</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="p-1.5 bg-purple-500/10 rounded">
                  <Wind className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs text-slate-300">Air dry naturally</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="p-1.5 bg-amber-500/10 rounded">
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs text-slate-300">Avoid direct heat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Material-Specific Badge (if detected) */}
      {fallbackName && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          <span>
            These tips are customized based on your sneaker's materials{" "}
            {fallbackName.toLowerCase().includes("suede") && "(Suede detected)"}
            {fallbackName.toLowerCase().includes("leather") && "(Leather detected)"}
            {fallbackName.toLowerCase().includes("knit") && "(Knit/Mesh detected)"}
            {fallbackName.toLowerCase().includes("canvas") && "(Canvas detected)"}
          </span>
        </div>
      )}
    </section>
  );
}