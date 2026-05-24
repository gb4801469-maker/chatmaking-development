export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  mode: string;
  messages: Message[];
  createdAt: string;
}

export interface AssistantMode {
  id: string;
  roleKey: string;
  iconName: string;
  label: string;
  shortDescription: string;
  accentClass: string;
  bgGradClass: string;
  suggestions: string[];
}
