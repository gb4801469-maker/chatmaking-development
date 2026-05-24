import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Send,
  Loader2,
  Sparkles,
  Copy,
  Check,
  User,
  HelpCircle,
  Code,
  GraduationCap,
  History,
  TrendingUp,
  Brain,
  Zap,
  ArrowRight
} from "lucide-react";
import { Message, AssistantMode } from "../types";
import { getModeIcon } from "./Sidebar";

interface ChatWindowProps {
  activeMode: AssistantMode;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  configError: string | null;
}

// Copy button for blocks
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-95"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400 animate-scale-in" />
          <span className="text-emerald-400 font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default function ChatWindow({
  activeMode,
  messages,
  isLoading,
  onSendMessage,
  configError,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scout view box to match bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle auto-resize text area spacing
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || configError) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Border theme colors dynamically linked to current activeMode id
  const getThemeColors = () => {
    switch (activeMode.id) {
      case "chatbot": return { primary: "indigo", border: "indigo-500/20", glow: "indigo-500/10", tagBg: "bg-indigo-500/10 text-indigo-400" };
      case "coding": return { primary: "emerald", border: "emerald-500/20", glow: "emerald-500/10", tagBg: "bg-emerald-500/10 text-emerald-400" };
      case "study": return { primary: "amber", border: "amber-500/20", glow: "amber-500/10", tagBg: "bg-amber-500/10 text-amber-400" };
      case "tech": return { primary: "blue", border: "blue-500/20", glow: "blue-500/10", tagBg: "bg-blue-500/10 text-blue-400" };
      case "business": return { primary: "green", border: "green-500/20", glow: "green-500/10", tagBg: "bg-green-500/10 text-green-400" };
      case "writing": return { primary: "rose", border: "rose-500/20", glow: "rose-500/10", tagBg: "bg-rose-500/10 text-rose-400" };
      case "motivation": return { primary: "orange", border: "orange-500/20", glow: "orange-500/10", tagBg: "bg-orange-500/10 text-orange-400" };
      case "marketing": return { primary: "purple", border: "purple-500/20", glow: "purple-500/10", tagBg: "bg-purple-500/10 text-purple-400" };
      case "prompts": return { primary: "cyan", border: "cyan-500/20", glow: "cyan-500/10", tagBg: "bg-cyan-500/10 text-cyan-400" };
      case "solving": return { primary: "violet", border: "violet-500/20", glow: "violet-500/10", tagBg: "bg-violet-500/10 text-violet-400" };
      default: return { primary: "indigo", border: "indigo-500/20", glow: "indigo-500/10", tagBg: "bg-indigo-500/10 text-indigo-400" };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className="flex-1 flex flex-col bg-slate-900 border-b border-transparent relative overflow-hidden h-full">
      {/* Background Decor Ambient Gradients */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-700 bg-${themeColors.primary}-500`} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-10 bg-slate-500" />

      {/* Header Active Panel Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-${themeColors.primary}-400 shadow-md`}>
            {getModeIcon(activeMode.iconName, "w-5 h-5")}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              {activeMode.label}
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest ${themeColors.tagBg}`}>
                ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">{activeMode.shortDescription}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Engine: Gemini-3.5-Flash</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"></div>
        </div>
      </div>

      {/* Conversations Stream Screen Box */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 z-10">
        {messages.length === 0 ? (
          /* Landing Starter Onboarding Window */
          <div className="max-w-3xl mx-auto py-10 space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-${themeColors.primary}-600/10 border border-${themeColors.primary}-500/20 text-${themeColors.primary}-400 flex items-center justify-center text-xl shadow-lg`}>
                {getModeIcon(activeMode.iconName, "w-8 h-8")}
              </div>
              <h3 className="text-xl font-sans font-bold text-white tracking-tight">
                Welcome to <span className={`text-${themeColors.primary}-400`}>{activeMode.label}</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Ask a general question, create tailored algorithms, perform deep content drafting, or solve specific math logic.
              </p>
            </div>

            {/* Quick Action Suggested Pill Rows */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold text-center">
                AESTHETIC STARTING PROMPTS FOR {activeMode.label}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeMode.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sug);
                      if (textareaRef.current) textareaRef.current.focus();
                    }}
                    className={`
                      p-3.5 text-left rounded-xl bg-slate-950/40 border border-slate-900 hover:border-${themeColors.primary}-500/30 hover:bg-slate-950 transition-all font-sans text-xs text-slate-300 hover:text-white flex items-start gap-2.5 shadow-sm group
                    `}
                  >
                    <Zap className={`w-3.5 h-3.5 text-${themeColors.primary}-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform`} />
                    <div className="flex-1">
                      <p className="leading-normal">{sug}</p>
                      <span className={`text-[9px] text-${themeColors.primary}-400/80 font-mono mt-1.5 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        Use template <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Mode Information Box */}
            <div className={`p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex gap-3 text-slate-400`}>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 shrink-0 self-start">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed space-y-1">
                <p className="font-semibold text-slate-200">How this specialized model assists you:</p>
                <p className="font-sans text-[11px] text-slate-400">
                  {activeMode.id === "study" && "• Explains concepts simply with analogies, adds summary definitions, and provides interactive checkpoint quizzes at the end."}
                  {activeMode.id === "coding" && "• Generates highly optimized codes with inline doc explanations, edgecases checklist, and best-practice warnings."}
                  {activeMode.id === "business" && "• Drills down into target audience profiling, rough setup costs estimation, and viable monetization funnels."}
                  {activeMode.id === "prompts" && "• Expands words into incredibly detailed Midjourney/Imagen styling parameters (lenses, apertures, color grades)."}
                  {activeMode.id === "solving" && "• Demolishes logic knots, mathematical proofs, and system timeouts using first-principles chains."}
                  {!(["study", "coding", "business", "prompts", "solving"].includes(activeMode.id)) && "• Maximizes answers for accuracy, elegant scannability, bullet summaries, and bulletproof intelligence."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Assistant Icon */}
                  {!isUser && (
                    <div className={`w-8 h-8 shrink-0 rounded-lg bg-slate-950 border border-${themeColors.primary}-500/20 text-${themeColors.primary}-400 flex items-center justify-center shadow-md shadow-${themeColors.primary}-500/5`}>
                      {getModeIcon(activeMode.iconName, "w-4 h-4")}
                    </div>
                  )}

                  {/* Message Container Card */}
                  <div className={`
                    max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm border
                    ${
                      isUser
                        ? "bg-slate-950 border-slate-850 text-slate-100"
                        : `bg-slate-950/70 border-slate-900 text-slate-100`
                    }
                  `}>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[10px] font-mono text-slate-500">
                      <span>{isUser ? "YOU (USER)" : `${activeMode.label.toUpperCase()}`}</span>
                      <span>{message.timestamp}</span>
                    </div>

                    {isUser ? (
                      /* Plain user text display (retaining line breaks) */
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-100 font-sans">
                        {message.text}
                      </p>
                    ) : (
                      /* Render Markdown content beautifully in rich format */
                      <div className="prose prose-invert max-w-none text-slate-200">
                        <Markdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-4 mb-2 tracking-tight" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-md font-semibold text-slate-200 mt-4 mb-2 tracking-tight" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-sm font-medium text-slate-300 mt-3 mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="text-sm text-slate-300 leading-relaxed mb-3 font-sans" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-300 text-sm" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-3 text-slate-300 text-sm" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-0.5 text-slate-300 text-sm" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                            a: ({ node, ...props }) => <a className="text-indigo-400 hover:underline hover:text-indigo-300 font-medium text-sm" target="_blank" rel="noreferrer" {...props} />,
                            code: ({ node, inline, className, children, ...props }: any) => {
                              const match = /language-(\w+)/.exec(className || "");
                              const isInline = !match && !props.style;
                              if (isInline) {
                                return (
                                  <code className="bg-slate-900 border border-slate-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-[11px]" {...props}>
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <div className="my-4 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900 shadow-md">
                                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-850">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                                      {match ? match[1] : "Code Block"}
                                    </span>
                                    <CopyButton text={String(children).replace(/\n$/, "")} />
                                  </div>
                                  <div className="p-3.5 overflow-x-auto text-xs text-indigo-100 font-mono leading-relaxed max-w-full bg-slate-950/40">
                                    <pre><code className={match ? `language-${match[1]}` : ""}>{children}</code></pre>
                                  </div>
                                </div>
                              );
                            }
                          }}
                        >
                          {message.text}
                        </Markdown>

                        {/* Interactive Quiz Checkpoint parser */}
                        {activeMode.id === "study" && message.text?.includes("Interactive Check") && (
                          <div className="mt-4 p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl">
                            <p className="text-[11px] font-mono font-semibold text-amber-300 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              WIDGET: ACTIVE QUIZ CHECKPOINT
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                              To answer, type your choose option directly (e.g. "Select A") in the prompt input field below!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Icon */}
                  {isUser && (
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-650 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/10">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Typing Loading state */}
            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className={`w-8 h-8 rounded-lg bg-slate-950 border border-${themeColors.primary}-500/20 text-${themeColors.primary}-300 flex items-center justify-center animate-pulse`}>
                  <Loader2 className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-slate-950/55 border border-slate-900 rounded-2xl p-4 max-w-[80%] min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 font-mono">
                    <span>{activeMode.label.toUpperCase()}</span>
                    <span className="animate-pulse">is thinking...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-slate-900 rounded-full w-[80%] animate-pulse" />
                    <div className="h-2.5 bg-slate-900 rounded-full w-[95%] animate-pulse delay-75" />
                    <div className="h-2.5 bg-slate-900 rounded-full w-[40%] animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* API Key Missing Floating Alert block if active on window */}
      {configError && (
        <div className="mx-4 mb-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-300 flex items-center justify-between animate-shake z-10">
          <p className="flex items-center gap-2">
            <strong>Critical Alert:</strong> Gemini requires an API key in secrets to trigger responses.
          </p>
          <span className="text-[10px] font-mono bg-red-900/50 text-white px-2 py-0.5 rounded">
            Check Secrets Setup
          </span>
        </div>
      )}

      {/* Input Message Form Panel */}
      <div className="p-4 bg-slate-950 border-t border-slate-900 z-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 relative">
          <div className="flex-1 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all flex items-end">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                configError
                  ? "Please configure your GEMINI_API_KEY first..."
                  : `Message ${activeMode.label}... (Enter to send, Shift+Enter for newline)`
              }
              disabled={!!configError || isLoading}
              className="flex-1 max-h-[180px] bg-transparent border-0 outline-none text-sm text-white px-4 py-3 placeholder-slate-500 font-sans resize-none disabled:cursor-not-allowed leading-relaxed self-center"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || !!configError}
            className={`
              p-3 px-4 rounded-xl flex items-center justify-center font-sans font-medium text-xs text-white transition-all shadow-md self-center
              ${
                !inputText.trim() || isLoading || !!configError
                  ? "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
                  : `bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-600/10`
              }
            `}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-center text-[9px] text-slate-600 font-mono mt-1.5">
          Gemini 3.5 Flash may include inaccuracies. Double-check code files and blueprints before final usage.
        </p>
      </div>
    </div>
  );
}
