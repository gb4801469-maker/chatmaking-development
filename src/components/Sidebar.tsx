import React, { useState } from "react";
import {
  Compass,
  Code2,
  GraduationCap,
  Cpu,
  TrendingUp,
  PenTool,
  Flame,
  Sparkles,
  Camera,
  Brain,
  Plus,
  MessageSquare,
  Trash2,
  HelpCircle,
  Menu,
  X,
  AlertTriangle
} from "lucide-react";
import { ChatSession, AssistantMode } from "../types";

interface SidebarProps {
  modes: AssistantMode[];
  activeModeId: string;
  onSelectMode: (modeId: string) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: (modeId?: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAllSessions: () => void;
  configError: string | null;
}

// Icon mapper helper
export const getModeIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case "Compass": return <Compass className={className} />;
    case "Code2": return <Code2 className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "TrendingUp": return <TrendingUp className={className} />;
    case "PenTool": return <PenTool className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Camera": return <Camera className={className} />;
    case "Brain": return <Brain className={className} />;
    case "MessageSquare": return <MessageSquare className={className} />;
    default: return <Compass className={className} />;
  }
};

export default function Sidebar({
  modes,
  activeModeId,
  onSelectMode,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onClearAllSessions,
  configError,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModeList, setShowModeList] = useState(true);

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-sans font-semibold tracking-tight text-sm">Advanced AI Assistant</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full uppercase font-medium">
            {activeMode.label}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Sidebar Wrapper */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-100 border-r border-slate-900 flex flex-col transform transition-transform duration-300 ease-in-out
          md:relative md:transform-none md:flex
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-bold tracking-tight text-white text-base">Gemini Playground</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">v3.5 FLASH ENGINE</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onCreateSession(activeModeId);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-sans font-medium text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <Plus className="w-4 h-4" />
            New Assistant Chat
          </button>
        </div>

        {/* Inner Scrollable Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 space-y-5 pb-6">
          
          {/* Navigation Toggle Section (Modes vs History) */}
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg">
            <button
              onClick={() => setShowModeList(true)}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                showModeList 
                  ? "bg-slate-800 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Specialized Roles
            </button>
            <button
              onClick={() => setShowModeList(false)}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-all ${
                !showModeList 
                  ? "bg-slate-800 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Saved Conversations ({sessions.length})
            </button>
          </div>

          {showModeList ? (
            /* Assistant Specialized Roles Mode Panel */
            <div>
              <h2 className="px-2 text-[11px] font-mono font-medium tracking-wider text-slate-500 uppercase mb-2">
                ASSISTANT CATEGORIES
              </h2>
              <div className="space-y-1">
                {modes.map((mode) => {
                  const isActive = mode.id === activeModeId;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onSelectMode(mode.id);
                        onCreateSession(mode.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group
                        ${
                          isActive
                            ? "bg-indigo-600/15 text-white border border-indigo-500/20"
                            : "text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent"
                        }
                      `}
                    >
                      <div
                        className={`
                          p-1.5 rounded-lg mt-0.5 transition-colors
                          ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-slate-400"
                          }
                        `}
                      >
                        {getModeIcon(mode.iconName, "w-4 h-4")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold tracking-tight">{mode.label}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                          {mode.shortDescription}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Saved Chat Sessions List Section */
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-[11px] font-mono font-medium tracking-wider text-slate-500 uppercase">
                  CHAT LOG HISTORY
                </h2>
                {sessions.length > 0 && (
                  <button
                    onClick={onClearAllSessions}
                    className="text-[10px] text-red-400 hover:text-red-300 font-sans cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <div className="px-3 py-6 text-center bg-slate-900/20 border border-dashed border-slate-900 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No active saved chats.</p>
                  <button
                    onClick={() => {
                      onCreateSession();
                      setIsOpen(false);
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline mt-2 inline-block cursor-pointer"
                  >
                    Start your first chat
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {sessions.map((sess) => {
                    const sessMode = modes.find((m) => m.id === sess.mode) || modes[0];
                    const isSelected = sess.id === activeSessionId;
                    return (
                      <div
                        key={sess.id}
                        className={`
                          flex items-center justify-between rounded-xl p-2.5 transition-all group border
                          ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-800"
                              : "text-slate-300 hover:bg-slate-900/40 border-transparent hover:text-white"
                          }
                        `}
                      >
                        <button
                          onClick={() => {
                            onSelectSession(sess.id);
                            onSelectMode(sess.mode);
                            setIsOpen(false);
                          }}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="text-xs font-medium truncate flex items-center gap-1.5">
                            <span className="shrink-0">{getModeIcon(sessMode.iconName, "w-3 h-3 text-indigo-400")}</span>
                            <span className="truncate">{sess.title}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1 font-mono flex items-center justify-between">
                            <span>{sessMode.label}</span>
                            <span>{new Date(sess.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                          </div>
                        </button>
                        <button
                          onClick={(e) => onDeleteSession(sess.id, e)}
                          className="p-1 text-slate-500 hover:text-red-400 rounded-md hover:bg-slate-800/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete draft conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Key Config Banner at base of Sidebar */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/60 space-y-3">
          {configError ? (
            <div className="bg-red-950/40 border border-red-900/30 text-red-200 rounded-xl p-3 text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="font-semibold text-red-300">API Key Missing</p>
                <p className="text-[10px] text-red-200/80 mt-1 leading-relaxed">
                  Go to <strong className="text-white">Settings &gt; Secrets</strong> to assign your <code className="bg-red-900/50 px-1 rounded">GEMINI_API_KEY</code>.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-950/30 border border-indigo-900/20 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-300">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span className="font-semibold text-slate-200">Active Environment</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                Your AI agent calls are safely proxied server-side via Node.js to secure all communications.
              </p>
            </div>
          )}

          {/* Quick Informational Guide */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Server State: Active</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Secure
            </span>
          </div>
        </div>
      </div>

      {/* Screen Backdrop for Mobile Toggle drawer overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}
    </>
  );
}
