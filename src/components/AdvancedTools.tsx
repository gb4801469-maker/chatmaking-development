import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  Sparkles,
  Camera,
  TrendingUp,
  Loader2,
  Copy,
  Check,
  Zap,
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";

interface AdvancedToolsProps {
  configError: string | null;
  onSendToChat: (promptText: string) => void;
}

export default function AdvancedTools({ configError, onSendToChat }: AdvancedToolsProps) {
  const [activeTab, setActiveTab] = useState<"prompt" | "business">("prompt");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for Prompt Craftsman
  const [concept, setConcept] = useState("");
  const [craftedPrompt, setCraftedPrompt] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // States for Business Strategist
  const [bizIdea, setBizIdea] = useState("");
  const [blueprint, setBlueprint] = useState("");
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  const handleCraftPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || loading || configError) return;

    setLoading(true);
    setErrorMsg(null);
    setCraftedPrompt("");

    try {
      const res = await fetch("/api/prompt-craft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawPrompt: concept }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server failed of execution.");

      setCraftedPrompt(data.prompt);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during cinematic rendering.");
    } finally {
      setLoading(false);
    }
  };

  const handleCraftBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizIdea.trim() || loading || configError) return;

    setLoading(true);
    setErrorMsg(null);
    setBlueprint("");

    try {
      const res = await fetch("/api/business-craft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdea: bizIdea }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server failed of execution.");

      setBlueprint(data.blueprint);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during canvas creation.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, setCopiedFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  return (
    <div className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-900 flex flex-col shrink-0 overflow-y-auto">
      {/* Tab Select Header */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 backdrop-blur-md z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] font-mono tracking-widest font-bold uppercase">Advanced Sparks</span>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("prompt");
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
              activeTab === "prompt"
                ? "bg-indigo-650 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Prompt Engine
          </button>
          
          <button
            onClick={() => {
              setActiveTab("business");
              setErrorMsg(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
              activeTab === "business"
                ? "bg-indigo-650 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Biz Strategist
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-6">
        {/* Error Notification banner */}
        {errorMsg && (
          <div className="bg-red-950/30 border border-red-900/30 text-red-300 rounded-xl p-3.5 text-xs">
            <p className="font-semibold text-red-200">Execution Blocked</p>
            <p className="text-[10px] text-red-300/80 mt-1 leading-normal">{errorMsg}</p>
          </div>
        )}

        {/* PROMPT MAKER TAB VIEW */}
        {activeTab === "prompt" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                Cinematic Prompt Architect
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Expedites core summaries ("a dark forest") into stunning photorealistic settings including apertures, exposures, and artistic lighting details.
              </p>
            </div>

            <form onSubmit={handleCraftPrompt} className="space-y-3">
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., A vintage explorer's desk covered in maps and compasses, warm gaslight..."
                className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 placeholder-slate-600 outline-none resize-none leading-relaxed"
                disabled={loading || !!configError}
              />

              <button
                type="submit"
                disabled={!concept.trim() || loading || !!configError || activeTab !== "prompt"}
                className={`
                  w-full py-2 px-4 rounded-lg font-sans font-medium text-xs text-white transition-all flex items-center justify-center gap-2 shadow-sm
                  ${
                    !concept.trim() || loading || !!configError
                      ? "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
                      : "bg-indigo-650 hover:bg-indigo-500 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Expanding scene descriptors...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Engineer Prompt Masterpiece
                  </>
                )}
              </button>
            </form>

            {craftedPrompt && (
              <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-3.5 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-cyan-400" />
                    GENERATED BLUEPRINT
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(craftedPrompt, setCopiedPrompt)}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      title="Copy Prompt Descriptor"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="prose prose-invert prose-xs text-slate-300 font-sans leading-relaxed text-[11px] overflow-hidden">
                  <Markdown>{craftedPrompt}</Markdown>
                </div>

                <button
                  onClick={() => onSendToChat(`Craft an image generator prompt and write an explanatory story based on: ${concept}`)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg border border-indigo-500/20 hover:border-indigo-500/55 text-indigo-400 hover:text-white hover:bg-indigo-600/15 transition text-[10px] font-mono font-bold flex items-center justify-center gap-1"
                >
                  Ask chat assistant about this idea
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* BUSINESS PLANNER TAB VIEW */}
        {activeTab === "business" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Business Canvas Developer
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Instantly builds complete corporate/side-hustle canvas layouts outlining capital assets, value propositions, and initial client pathways.
              </p>
            </div>

            <form onSubmit={handleCraftBusiness} className="space-y-3">
              <textarea
                rows={3}
                value={bizIdea}
                onChange={(e) => setBizIdea(e.target.value)}
                placeholder="e.g., A mobile pet grooming service using green energy vans..."
                className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2.5 placeholder-slate-600 outline-none resize-none leading-relaxed"
                disabled={loading || !!configError}
              />

              <button
                type="submit"
                disabled={!bizIdea.trim() || loading || !!configError || activeTab !== "business"}
                className={`
                  w-full py-2 px-4 rounded-lg font-sans font-medium text-xs text-white transition-all flex items-center justify-center gap-2 shadow-sm
                  ${
                    !bizIdea.trim() || loading || !!configError
                      ? "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
                      : "bg-indigo-650 hover:bg-indigo-500 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mapping venture blueprints...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Formulate Business Blueprint
                  </>
                )}
              </button>
            </form>

            {blueprint && (
              <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-3.5 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-400" />
                    VENTURE MODEL OUTLINE
                  </span>
                  <button
                    onClick={() => copyToClipboard(blueprint, setCopiedBlueprint)}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    title="Copy Blueprint text"
                  >
                    {copiedBlueprint ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="prose prose-invert prose-xs text-slate-300 font-sans leading-relaxed text-[11px] overflow-hidden">
                  <Markdown>{blueprint}</Markdown>
                </div>

                <button
                  onClick={() => onSendToChat(`Flesh out a full-length business model pitch and user study program based on: ${bizIdea}`)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg border border-indigo-500/20 hover:border-indigo-500/55 text-indigo-400 hover:text-white hover:bg-indigo-600/15 transition text-[10px] font-mono font-bold flex items-center justify-center gap-1"
                >
                  Create heavy pitch deck in chat
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helpful Spark Hint footnote */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40 text-[10px] text-slate-500 font-mono flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        <span>Sparks are micro-reasoned by Flash v3.5 to maximize conceptual output.</span>
      </div>
    </div>
  );
}
