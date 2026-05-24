import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import AdvancedTools from "./components/AdvancedTools";
import { ChatSession, Message, AssistantMode } from "./types";
import { Sparkles, HelpCircle } from "lucide-react";

// Full profiles for the 10 specialized AI roles requested by the user
const ASSISTANT_MODES: AssistantMode[] = [
  {
    id: "chatbot",
    roleKey: "chatbot",
    iconName: "MessageSquare",
    label: "Chatbot Development",
    shortDescription: "Conversational architectures, prompt engineering, multi-agents & NLP integrations.",
    accentClass: "indigo-500",
    bgGradClass: "from-indigo-650/15 to-purple-650/5",
    suggestions: [
      "Draft a robust conversation flow state-machine in TypeScript",
      "Explain key prompt routing strategies for multi-agent chatbot systems",
      "Design context window retention strategies for an e-commerce helper chatbot"
    ]
  },
  {
    id: "coding",
    roleKey: "coding",
    iconName: "Code2",
    label: "Coding Specialist",
    shortDescription: "Clean optimized programs, inline docs, refactors & explanations.",
    accentClass: "emerald-500",
    bgGradClass: "from-emerald-650/15 to-teal-650/5",
    suggestions: [
      "Explain SQL vs NoSQL systems with clean prose",
      "Write a reusable React custom hook to throttle input values",
      "Draft a secure RESTful API routing outline in TypeScript"
    ]
  },
  {
    id: "study",
    roleKey: "study",
    iconName: "GraduationCap",
    label: "Expert Tutor",
    shortDescription: "Expert step-by-step guides, learning checklists, and end-of-chat quiz questions.",
    accentClass: "amber-500",
    bgGradClass: "from-amber-650/15 to-orange-650/5",
    suggestions: [
      "How does photosynthesis work step-by-step with real-world examples?",
      "Solve 3x + 5 = 20 with an interactive check checkpoint",
      "Explain the fundamental difference between macro and micro economics simply"
    ]
  },
  {
    id: "tech",
    roleKey: "tech",
    iconName: "Cpu",
    label: "AI & Systems Architect",
    shortDescription: "Systems architecture, cloud scales, ML tools & security layouts.",
    accentClass: "blue-500",
    bgGradClass: "from-blue-650/15 to-sky-650/5",
    suggestions: [
      "Provide a comprehensive design schematic for a RAG search engine",
      "Explain transformer models' self-attention mechanism with clean math links",
      "What are the security trade-offs of microservices vs monoliths?"
    ]
  },
  {
    id: "business",
    roleKey: "business",
    iconName: "TrendingUp",
    label: "Business Brainstorming",
    shortDescription: "Startup blueprints, micro-SaaS side hustles, pricing grids & client acquisition.",
    accentClass: "green-500",
    bgGradClass: "from-green-650/15 to-emerald-650/5",
    suggestions: [
      "Brainstorm 3 low-cost automated side hustles for a writer",
      "Draft a 3-tier subscription grid mock-up for developer toolkit packages",
      "Suggest a customer acquisition strategy for a local delivery startup"
    ]
  },
  {
    id: "writing",
    roleKey: "writing",
    iconName: "PenTool",
    label: "Writing & Content",
    shortDescription: "Cinematic speech dialogue, blog outlines, scripts & newsletter hooks.",
    accentClass: "rose-500",
    bgGradClass: "from-rose-650/15 to-pink-650/5",
    suggestions: [
      "Compose a cinematic, atmospheric screenplay introduction for a thriller scene",
      "Draft a complete newsletter opening talking about digital minimalism",
      "Outline an engaging essay on how modern typography shapes web perception"
    ]
  },
  {
    id: "motivation",
    roleKey: "motivation",
    iconName: "Flame",
    label: "Motivation & Habits",
    shortDescription: "Actionable productivity models, focus systems, time-boxes & mental frameshifts.",
    accentClass: "orange-500",
    bgGradClass: "from-orange-650/15 to-amber-650/5",
    suggestions: [
      "Help me design an active focus schedule utilizing the Ivy Lee system",
      "Draft a motivational routine blueprint to conquer persistent procrastination",
      "Provide eye-healthy morning patterns for full-stack developers"
    ]
  },
  {
    id: "marketing",
    roleKey: "marketing",
    iconName: "Sparkles",
    label: "Branding & Socials",
    shortDescription: "Growth marketer playbooks, aesthetic social calendars, taglines & visual descriptors.",
    accentClass: "purple-500",
    bgGradClass: "from-purple-650/15 to-violet-650/5",
    suggestions: [
      "Provide 5 high-engagement visual hooks for a fitness app launch",
      "Draft a 1-week structural post calendar for an independent UI designer",
      "Design an inspiring branding positioning tagline for luxury eco-journals"
    ]
  },
  {
    id: "prompts",
    roleKey: "prompts",
    iconName: "Camera",
    label: "Creative Prompt Crafting",
    shortDescription: "Artistic camera directions, lens specifications & rich lighting descriptors.",
    accentClass: "cyan-500",
    bgGradClass: "from-cyan-650/15 to-teal-650/5",
    suggestions: [
      "Describe a close-up studio shot of a vintage typewriter, soft cinematic desk lamp glows",
      "Draft a detailed pixel-art cyberpunk background canvas prompt with glowing signs",
      "Suggest a camera angle, aperture, and tone grading layout for active hiking scenes"
    ]
  },
  {
    id: "solving",
    roleKey: "solving",
    iconName: "Brain",
    label: "Logic & Problem Solving",
    shortDescription: "Logical riddles, math blueprints, first-principles roots & system logs.",
    accentClass: "violet-500",
    bgGradClass: "from-violet-650/15 to-purple-650/5",
    suggestions: [
      "Solve this riddle: Who owns the zebra? Outline the logical matrix step-by-step",
      "Provide a logical root-cause model to resolve regular API server timeouts",
      "Prove why sum of two odd integer values always yields an even value simply"
    ]
  },
];

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeModeId, setActiveModeId] = useState<string>("chatbot");
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // Load old logged state conversations upon component startup
  useEffect(() => {
    try {
      const cached = localStorage.getItem("gemini_chat_sessions");
      if (cached) {
        const parsed = JSON.parse(cached);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
          setActiveModeId(parsed[0].mode);
        } else {
          // Auto create first chat so it's ready to go
          createSession("chatbot", parsed);
        }
      } else {
        createSession("chatbot", []);
      }
    } catch (err) {
      console.error("Failed to load cached chats:", err);
      createSession("chatbot", []);
    }
  }, []);

  // Update localStorage when sessions change
  const saveSessions = (data: ChatSession[]) => {
    setSessions(data);
    localStorage.setItem("gemini_chat_sessions", JSON.stringify(data));
  };

  // Create new draft session linked to mode
  const createSession = (modeId = "chatbot", currentSessions = sessions) => {
    const activeMode = ASSISTANT_MODES.find((m) => m.id === modeId) || ASSISTANT_MODES[0];
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: `Draft - ${activeMode.label}`,
      mode: modeId,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newSession, ...currentSessions];
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setActiveModeId(modeId);
    setLevelErrorState(null); // Clear errors
  };

  // Helper to set error alerts
  const setLevelErrorState = (msg: string | null) => {
    setConfigError(msg);
  };

  const handleSelectSession = (id: string) => {
    const selected = sessions.find((s) => s.id === id);
    if (selected) {
      setActiveSessionId(id);
      setActiveModeId(selected.mode);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    saveSessions(filtered);
    
    if (activeSessionId === id) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
        setActiveModeId(filtered[0].mode);
      } else {
        createSession("chatbot", []);
      }
    }
  };

  const handleClearAllSessions = () => {
    if (window.confirm("Are you sure you want to dismiss all draft conversation history? This cannot be undone.")) {
      saveSessions([]);
      createSession("chatbot", []);
    }
  };

  // Master send prompt connection to local status and back-end
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let currentSession = sessions.find((s) => s.id === activeSessionId);
    if (!currentSession) {
      // Create session on-the-fly if missing
      const activeMode = ASSISTANT_MODES.find((m) => m.id === activeModeId) || ASSISTANT_MODES[0];
      currentSession = {
        id: `session_${Date.now()}`,
        title: text.length > 28 ? `${text.substring(0, 25).trim()}...` : text,
        mode: activeModeId,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      saveSessions([currentSession, ...sessions]);
      setActiveSessionId(currentSession.id);
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Append user message immediately to the layout state
    const updatedMessages = [...currentSession.messages, userMessage];
    
    // Auto-rename session title if it was a generic Draft title
    const activeMode = ASSISTANT_MODES.find((m) => m.id === activeModeId) || ASSISTANT_MODES[0];
    const isGenericTitle = currentSession.title.startsWith("Draft - ");
    const newTitle = isGenericTitle
      ? (text.length > 30 ? `${text.substring(0, 27).trim()}...` : text)
      : currentSession.title;

    const updatedSession: ChatSession = {
      ...currentSession,
      title: newTitle,
      messages: updatedMessages,
    };

    const targetSessions = sessions.map((s) => (s.id === currentSession!.id ? updatedSession : s));
    saveSessions(targetSessions);
    setIsLoading(true);
    setLevelErrorState(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          mode: activeModeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isConfigError || response.status === 500) {
          setLevelErrorState(data.error || "A secure communication error occurred.");
        }
        throw new Error(data.error || "Failed to retrieve AI analysis.");
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, assistantMessage],
      };

      saveSessions(sessions.map((s) => (s.id === currentSession!.id ? finalSession : s)));

    } catch (err: any) {
      console.error(err);
      
      // Append a helpful system alert to the history of chats so the user is never left hanging
      const errorMsg = err.message || "Something went wrong. Please check your network connection and API keys.";
      const errMessage: Message = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        text: `### ⚠️ Communication Disruption\n\n${errorMsg}\n\n*If you are the developer of this application, please ensure your \`GEMINI_API_KEY\` is accurately placed within the **Settings > Secrets** panel in AI Studio.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, errMessage],
      };
      
      saveSessions(sessions.map((s) => (s.id === currentSession!.id ? finalSession : s)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToChatFromAdvanced = (promptText: string) => {
    // Inject immediately into chat
    handleSendMessage(promptText);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activeMode = ASSISTANT_MODES.find((m) => m.id === activeModeId) || ASSISTANT_MODES[0];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      
      {/* Sidebar navigation component */}
      <Sidebar
        modes={ASSISTANT_MODES}
        activeModeId={activeModeId}
        onSelectMode={(modeId) => {
          setActiveModeId(modeId);
          // If the select session has 0 messages, let's switch its mode in-place
          const sess = sessions.find((s) => s.id === activeSessionId);
          if (sess && sess.messages.length === 0) {
            const updated = sessions.map((s) => {
              if (s.id === activeSessionId) {
                const modeProfile = ASSISTANT_MODES.find((m) => m.id === modeId) || ASSISTANT_MODES[0];
                return { ...s, mode: modeId, title: `Draft - ${modeProfile.label}` };
              }
              return s;
            });
            saveSessions(updated);
          }
        }}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={(modeId) => createSession(modeId || activeModeId)}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        configError={configError}
      />

      {/* Main active work screen */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
        {activeSession ? (
          <ChatWindow
            activeMode={activeMode}
            messages={activeSession.messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            configError={configError}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-900 text-center">
            <Sparkles className="w-12 h-12 text-slate-700 animate-pulse mb-3" />
            <p className="text-sm text-slate-400">Initialize a chat dialogue using the sidebar to begin.</p>
          </div>
        )}

        {/* Cinematic prompt and Business Strategist Advanced Panel */}
        <AdvancedTools
          configError={configError}
          onSendToChat={handleSendToChatFromAdvanced}
        />
      </div>
    </div>
  );
}
