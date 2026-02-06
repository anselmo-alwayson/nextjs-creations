import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  open: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const mockMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Olá! Sou o Maestro, seu assistente de NPS. Como posso ajudar?",
  },
];

const ChatButton = ({ open, onToggle }: ChatButtonProps) => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, content: input },
      {
        role: "assistant" as const,
        content: "Analisando seus dados de NPS... O NPS geral da Claro está em 55.95, com tendência de alta nos últimos 6 meses. A região Sudeste lidera com 58 pontos.",
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[420px] w-[340px] flex-col rounded-2xl border border-border bg-card shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl nps-gradient-header px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">Chat Maestro</span>
            </div>
            <button onClick={onToggle} className="text-primary-foreground/70 hover:text-primary-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pergunte ao Maestro..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" className="h-8 w-8 p-0" onClick={handleSend}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </>
  );
};

export default ChatButton;
